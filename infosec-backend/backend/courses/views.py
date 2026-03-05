from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Course, Enrollment, LessonProgress
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
    course = get_object_or_404(Course, slug=slug, is_published=True)
    exists = Enrollment.objects.filter(user=request.user, course=course).exists()
    if not exists:
        return Response({"status": "not_enrolled"})
    enrollment = Enrollment.objects.get(user=request.user, course=course)
    return Response({"status": "enrolled", "is_paid": enrollment.is_paid})


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_lesson_complete(request, slug, lesson_id):
    """Mark a specific lesson as completed for the authenticated user."""

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

