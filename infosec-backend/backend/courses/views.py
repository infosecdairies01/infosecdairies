import re as _re
from datetime import timedelta

from django.core.cache import cache as _cache
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from django.shortcuts import get_object_or_404
from .models import Course, Enrollment, LessonProgress, QuizScore
from .serializers import CourseSerializer, LessonProgressSerializer


FREE_COURSE_SLUG = "network-fundamentals"


def _ensure_enrolled_and_paid(user, course: Course):
    enrollment = Enrollment.objects.filter(user=user, course=course).first()
    if not enrollment:
        return None, Response({"detail": "Not enrolled in this course."}, status=403)
    if course.slug != FREE_COURSE_SLUG and not enrollment.is_paid:
        return enrollment, Response({"detail": "Payment required for this course."}, status=403)
    return enrollment, None


@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "ok",
        "message": "Backend is connected successfully 🚀"
    })


@api_view(["GET"])
def course_list(request):
    courses = Course.objects.filter(is_published=True)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def course_detail(request, slug):
    course = get_object_or_404(Course, slug=slug, is_published=True)
    serializer = CourseSerializer(course)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll(request, slug):
    course = get_object_or_404(Course, slug=slug, is_published=True)

    if course.slug != FREE_COURSE_SLUG:
        return Response(
            {
                "detail": "Payment required for this course.",
                "course_slug": course.slug,
            },
            status=403,
        )

    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user,
        course=course,
        defaults={"is_paid": False},
    )
    return Response(
        {
            "status": "enrolled",
            "is_paid": enrollment.is_paid,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def enrollment_status(request, slug):
    """Legacy plain-text status — kept for backwards compat but no longer used for access gating."""
    course = get_object_or_404(Course, slug=slug, is_published=True)
    exists = Enrollment.objects.filter(user=request.user, course=course).exists()
    if not exists:
        return Response({"status": "not_enrolled"})
    enrollment = Enrollment.objects.get(user=request.user, course=course)
    return Response({"status": "enrolled", "is_paid": enrollment.is_paid})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_access_token(request, slug):
    """Issue a short-lived RS256-signed token proving paid enrollment for a course."""
    course = get_object_or_404(Course, slug=slug, is_published=True)

    # Staff / superusers can access any course for testing without an enrollment record.
    if request.user.is_staff or request.user.is_superuser:
        token = AccessToken.for_user(request.user)
        token["course_slug"] = slug
        token["enrolled"] = True
        token["is_paid"] = True
        token["email"] = request.user.email
        token["token_type"] = "course_access"
        token.set_exp(lifetime=timedelta(hours=2))
        return Response({"access_token": str(token)}, status=status.HTTP_200_OK)

    # Free course: auto-create enrollment so users don't need a separate enroll step.
    if slug == FREE_COURSE_SLUG:
        enrollment, _ = Enrollment.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={"is_paid": False},
        )
        token = AccessToken.for_user(request.user)
        token["course_slug"] = slug
        token["enrolled"] = True
        token["is_paid"] = True
        token["email"] = request.user.email
        token["token_type"] = "course_access"
        token.set_exp(lifetime=timedelta(hours=2))
        return Response({"access_token": str(token)}, status=status.HTTP_200_OK)

    enrollment, denied = _ensure_enrolled_and_paid(request.user, course)
    if denied:
        return denied

    token = AccessToken.for_user(request.user)
    token["course_slug"] = slug
    token["enrolled"] = True
    token["is_paid"] = bool(enrollment.is_paid)
    token["email"] = request.user.email
    token["token_type"] = "course_access"
    token.set_exp(lifetime=timedelta(hours=2))

    return Response({"access_token": str(token)}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_progress(request, slug):
    """Return list of completed lesson IDs for this user and course."""

    course = get_object_or_404(Course, slug=slug, is_published=True)

    _, denied = _ensure_enrolled_and_paid(request.user, course)
    if denied:
        return denied

    progress_qs = LessonProgress.objects.filter(user=request.user, course=course)
    serializer = LessonProgressSerializer(progress_qs, many=True)
    return Response(serializer.data)


_LESSON_ID_RE = _re.compile(r"^[\d]+\.[\d]+$|^[a-z0-9_-]{1,60}$")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_lesson_complete(request, slug, lesson_id):
    """Mark a specific lesson as completed for the authenticated user."""

    # Reject garbage IDs — must be "N.N" or a short alphanumeric slug
    if not lesson_id or not _LESSON_ID_RE.match(lesson_id):
        return Response({"detail": "Invalid lesson_id format."}, status=400)

    course = get_object_or_404(Course, slug=slug, is_published=True)

    _, denied = _ensure_enrolled_and_paid(request.user, course)
    if denied:
        return denied

    LessonProgress.objects.get_or_create(
        user=request.user,
        course=course,
        lesson_id=lesson_id,
    )

    return Response({"status": "lesson_marked_complete", "lesson_id": lesson_id})


# ──────────────────────────────────────────────────────────────────────────────
# Slug → courseId mapping (frontend quiz data uses courseId, URLs use slug)
# ──────────────────────────────────────────────────────────────────────────────
_SLUG_TO_COURSE_ID: dict[str, str] = {
    "blue-team-soc-fundamentals": "soc-fundamentals",
    "log-analysis-for-beginners": "log-analysis",
    "incident-response-fundamentals": "incident-response",
    "threat-hunting-fundamentals": "threat-hunting",
    "detection-engineering-basics": "detection-engineering",
    "malware-analysis-fundamentals": "malware-analysis",
    "soc-analyst-path": "soc-analyst-path",
    "network-security-monitoring": "network-security-monitoring",
    "network-fundamentals": "network-fundamentals",
}


def _rate_limit_key(key: str, limit: int, period: int) -> bool:
    """Return True if caller exceeded the rate limit."""
    count = _cache.get(key, 0)
    if count >= limit:
        return True
    _cache.set(key, count + 1, period)
    return False


def _upsert_quiz_score(user, course_slug: str, quiz_id: str, score: int, passed: bool) -> None:
    """Insert or update — keeps the BEST score ever achieved."""
    existing = QuizScore.objects.filter(user=user, course_slug=course_slug, quiz_id=quiz_id).first()
    if existing:
        if score > existing.score:
            existing.score = score
            existing.passed = passed
            existing.save(update_fields=["score", "passed"])
    else:
        QuizScore.objects.create(
            user=user,
            course_slug=course_slug,
            quiz_id=quiz_id,
            score=score,
            passed=passed,
        )


def _get_passing_score(quiz_id: str) -> int:
    """Return the passing threshold for a quiz. Final/cert exams require 80%."""
    if quiz_id.endswith("-q10") or "final" in quiz_id or "cert" in quiz_id:
        return 80
    return 70


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_quiz(request, slug, quiz_id):
    """
    Accept quiz answers, validate server-side, record best score.

    Body:  {"answers": {"question-id-1": 2, "question-id-2": 0, ...}}
    Response: {
        "score": 80, "passed": true, "correct_count": 8, "total": 10,
        "results": [{"question_id": "q1-1", "correct": true,
                     "correct_answer_index": 2, "user_answer_index": 2}, ...]
    }
    """
    course = get_object_or_404(Course, slug=slug, is_published=True)
    _, denied = _ensure_enrolled_and_paid(request.user, course)
    if denied:
        return denied

    # Rate-limit: 30 submissions per user per quiz per hour
    rl_key = f"quiz_submit:{request.user.id}:{slug}:{quiz_id}"
    if _rate_limit_key(rl_key, 30, 3600):
        return Response({"detail": "Too many quiz attempts. Please wait before retrying."}, status=429)

    submitted = request.data.get("answers")
    if not isinstance(submitted, dict):
        return Response({"detail": "answers must be a dict of {question_id: answer_index}"}, status=400)

    # Load server-side answer key
    try:
        from .quiz_answers import QUIZ_CORRECT_ANSWERS
    except ImportError:
        return Response({"detail": "Quiz answer key not available."}, status=503)

    # Try slug directly, then mapped courseId
    course_id = _SLUG_TO_COURSE_ID.get(slug, slug)
    answer_key = (
        QUIZ_CORRECT_ANSWERS.get((slug, quiz_id))
        or QUIZ_CORRECT_ANSWERS.get((course_id, quiz_id))
        or {}
    )

    if not answer_key:
        # Unknown quiz — record what the frontend reports (graceful fallback for new quizzes)
        score = max(0, min(100, int(request.data.get("score", 0))))
        passed = bool(request.data.get("passed", False))
        _upsert_quiz_score(request.user, slug, quiz_id, score, passed)
        return Response({"score": score, "passed": passed, "correct_count": 0, "total": 0, "results": []})

    results = []
    correct_count = 0
    total = len(answer_key)

    for question_id, correct_idx in answer_key.items():
        user_answer = submitted.get(question_id)
        is_correct = isinstance(user_answer, int) and user_answer == correct_idx
        if is_correct:
            correct_count += 1
        results.append({
            "question_id": question_id,
            "correct": is_correct,
            "correct_answer_index": correct_idx,
            "user_answer_index": user_answer,
        })

    score = round((correct_count / total) * 100) if total > 0 else 0
    passing_score = _get_passing_score(quiz_id)
    passed = score >= passing_score

    _upsert_quiz_score(request.user, slug, quiz_id, score, passed)

    return Response({
        "score": score,
        "passed": passed,
        "correct_count": correct_count,
        "total": total,
        "results": results,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_completion(request, slug):
    """
    Server-authoritative completion status.
    Completed = user has at least one passing QuizScore recorded for this course.
    """
    course = get_object_or_404(Course, slug=slug, is_published=True)
    _, denied = _ensure_enrolled_and_paid(request.user, course)
    if denied:
        # For free courses, skip payment check
        if slug != FREE_COURSE_SLUG:
            return denied

    quiz_ids_passed = list(
        QuizScore.objects.filter(user=request.user, course_slug=slug, passed=True)
        .values_list("quiz_id", flat=True)
    )

    return Response({
        "completed": len(quiz_ids_passed) > 0,
        "quiz_ids_passed": quiz_ids_passed,
        "course_slug": slug,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_quiz_scores(request, slug):
    """Return all quiz scores for the authenticated user for a given course."""
    get_object_or_404(Course, slug=slug, is_published=True)
    scores = QuizScore.objects.filter(user=request.user, course_slug=slug)
    return Response([
        {"quiz_id": s.quiz_id, "score": s.score, "passed": s.passed}
        for s in scores
    ])

