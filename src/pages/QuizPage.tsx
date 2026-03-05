import { useState, useEffect, useMemo } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { 
  ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, 
  AlertTriangle, Trophy, RotateCcw, Home, BookOpen
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getCourseById } from "@/data/courses";
import { getQuizById, QuizData, QuizQuestion } from "@/data/quizData";
import { Button } from "@/components/ui/button";

type QuizState = "intro" | "active" | "review" | "results";

const QuizPage = () => {
  const { slug, quizId } = useParams<{ slug: string; quizId: string }>();
  const navigate = useNavigate();
  
  const normalizedCourseId = useMemo(() => {
    if (!slug) return "";

    switch (slug) {
      case "blue-team-soc-fundamentals":
        return "soc-fundamentals";
      case "log-analysis-for-beginners":
        return "log-analysis";
      case "network-fundamentals":
        return "network-fundamentals";
      case "incident-response-fundamentals":
        return "incident-response";
      case "soc-analyst-path":
        return "soc-analyst-path";
      case "network-security-monitoring":
        return "network-security-monitoring";
      case "detection-engineering-basics":
        return "detection-engineering";
      case "malware-analysis-fundamentals":
        return "malware-analysis";
      case "threat-hunting-fundamentals":
        return "threat-hunting";
      default:
        return slug;
    }
  }, [slug]);

  const course = getCourseById(normalizedCourseId || "");

  const resolvedQuizId = useMemo(() => {
    if (!quizId) return "";

    // Map lesson-style IDs to quizIds for specific courses
    if (slug === "blue-team-soc-fundamentals") {
      const socQuizMap: Record<string, string> = {
        "1.5": "q1",
        "2.5": "q2",
        "3.5": "q3",
        "4.5": "q4",
        "5.5": "q5",
        "6.5": "q6",
        "7.5": "q7",
        "8.5": "q8",
        "9.5": "q9",
        "10.4": "q10",
      };

      return socQuizMap[quizId] ?? quizId;
    }

    if (slug === "soc-analyst-path") {
      const sapQuizMap: Record<string, string> = {
        "1.5": "sap-q1",
        "2.5": "sap-q2",
        "3.5": "sap-q3",
        "4.5": "sap-q4",
        "5.5": "sap-q5",
        "6.5": "sap-q6",
      };

      return sapQuizMap[quizId] ?? quizId;
    }

    if (slug === "network-security-monitoring") {
      const nsmQuizMap: Record<string, string> = {
        "1.5": "nsm-q1",
        "2.6": "nsm-q2",
        "3.5": "nsm-q3",
        "4.5": "nsm-q4",
        "5.5": "nsm-q5",
        "6.5": "nsm-q6",
      };

      return nsmQuizMap[quizId] ?? quizId;
    }

    if (slug === "detection-engineering-basics") {
      const deQuizMap: Record<string, string> = {
        "1.5": "de-q1",
        "2.5": "de-q2",
        "3.5": "de-q3",
        "4.5": "de-q4",
        "5.5": "de-q5",
        "6.5": "de-q6",
      };

      return deQuizMap[quizId] ?? quizId;
    }

    if (slug === "malware-analysis-fundamentals") {
      const maQuizMap: Record<string, string> = {
        "1.5": "ma-q1",
        "2.5": "ma-q2",
        "3.5": "ma-q3",
        "4.5": "ma-q4",
        "5.5": "ma-q5",
        "6.5": "ma-q6",
      };

      return maQuizMap[quizId] ?? quizId;
    }

    if (slug === "log-analysis-for-beginners") {
      const laQuizMap: Record<string, string> = {
        "1.5": "la-q1",
        "2.7": "la-q2",
        "3.6": "la-q3",
        "4.5": "la-q4",
        "5.5": "la-q5",
        "6.5": "la-q5",
      };

      return laQuizMap[quizId] ?? quizId;
    }

    if (slug === "threat-hunting-fundamentals") {
      const thQuizMap: Record<string, string> = {
        "1.5": "th-q1",
        "2.5": "th-q2",
        "3.5": "th-q3",
        "4.5": "th-q4",
        "5.5": "th-q5",
        "6.5": "th-q6",
      };

      return thQuizMap[quizId] ?? quizId;
    }

    // Default: treat quizId from route as the actual quizId
    return quizId;
  }, [quizId, slug]);

  const quiz = resolvedQuizId
    ? getQuizById(normalizedCourseId || "", resolvedQuizId) || getQuizById(normalizedCourseId || "", "q1")
    : null;
  
  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (quizState === "active" && quiz?.timeLimit && timeRemaining === null) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
    
    if (quizState === "active" && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            setQuizState("results");
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeRemaining, quiz?.timeLimit]);

  // Calculate score
  const score = useMemo(() => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };
    
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100)
    };
  }, [quiz, selectedAnswers]);

  const passed = score.percentage >= (quiz?.passingScore || 70);

  // Redirect if not found
  if (!course || !quiz) {
    return <Navigate to={`/courses/${slug || ""}`} replace />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasAnswered = selectedAnswers[currentQuestion?.id] !== undefined;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (quizState !== "active" || showExplanation) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      setQuizState("results");
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    setShowExplanation(false);
    setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleStartQuiz = () => {
    setQuizState("active");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  };

  const handleRetry = () => {
    setQuizState("intro");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTimeRemaining(null);
  };

  const handleReviewAnswers = () => {
    setQuizState("review");
    setCurrentQuestionIndex(0);
    setShowExplanation(true);
  };

  // Save quiz score and unlock next lesson
  useEffect(() => {
    if (quizState === "results") {
      // Save quiz score to localStorage (always save, regardless of pass/fail)
      const quizKey = `quiz_${slug}_${quizId}`;
      localStorage.setItem(quizKey, score.percentage.toString());

      // Mark lesson as completed ONLY if passed
      if (passed) {
        const completedKey = `completed_lessons_${slug}`;
        const completedLessons = JSON.parse(localStorage.getItem(completedKey) || "[]");
        if (!completedLessons.includes(quizId)) {
          completedLessons.push(quizId);
          localStorage.setItem(completedKey, JSON.stringify(completedLessons));
        }
      }
      
      // Always save to database (both passed and failed)
      saveQuizScoreToDatabase(quizId, score.percentage);
      
      // Trigger a custom event to notify course detail of progress update
      window.dispatchEvent(new CustomEvent('quizCompleted', { 
        detail: { quizId, score: score.percentage, courseId: slug, passed } 
      }));
    }
  }, [quizState, passed, score.percentage, slug, quizId]);

  // Save quiz score to database
  const saveQuizScoreToDatabase = async (quizId: string, score: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz-scores/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: slug,
          quiz_id: quizId,
          score: score,
          passed: score >= 70,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save quiz score to database');
      }
    } catch (error) {
      console.error('Error saving quiz score:', error);
    }
  };

  // Get next lesson after quiz
  const getNextLessonAfterQuiz = (storageQuizId: string): string | null => {
    if (!course) return null;

    const moduleIndex = course.modules.findIndex((m) => m.quizId === storageQuizId);
    if (moduleIndex < 0) return null;

    const nextModule = course.modules[moduleIndex + 1];
    const nextLesson = nextModule?.lessons?.[0];
    return nextLesson?.id ?? null;
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to={`/courses/${slug}`} 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Course
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
                <p className="text-muted-foreground text-sm">{course.title}</p>
              </div>
            </div>
          </div>

          {/* Quiz Intro */}
          {quizState === "intro" && (
            <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-8 shadow-lg">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-secondary opacity-50" />
              
              <div className="pl-4">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quiz Overview</h2>
                <p className="text-muted-foreground mb-6">{quiz.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-lg bg-card/30 border border-white/[0.06] text-center">
                    <div className="text-2xl font-bold text-primary">{quiz.questions.length}</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/30 border border-white/[0.06] text-center">
                    <div className="text-2xl font-bold text-primary">{quiz.passingScore}%</div>
                    <div className="text-xs text-muted-foreground">Passing Score</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/30 border border-white/[0.06] text-center">
                    <div className="text-2xl font-bold text-primary">{quiz.timeLimit || "∞"}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-orange-400 mb-1">Before You Begin</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Read each question carefully before answering</li>
                        <li>• You can review explanations after each answer</li>
                        <li>• Timer will start when you click "Start Quiz"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleStartQuiz}
                  className="w-full bg-primary hover:bg-primary/90 text-background font-semibold py-6"
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          )}

          {/* Active Quiz / Review Mode */}
          {(quizState === "active" || quizState === "review") && currentQuestion && (
            <div className="space-y-6">
              {/* Progress & Timer */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Progress
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((Object.keys(selectedAnswers).length / quiz.questions.length) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(Object.keys(selectedAnswers).length / quiz.questions.length) * 100} 
                    className="h-2"
                  />
                </div>
                
                {timeRemaining !== null && quizState === "active" && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    timeRemaining < 60 ? 'bg-red-500/20 text-red-400' : 'bg-card/30 text-foreground'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                )}

                {quizState === "review" && (
                  <div className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400">
                    Review Mode
                  </div>
                )}
              </div>

              {/* Question Card */}
              <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-8 shadow-lg">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-secondary opacity-50" />
                
                <div className="pl-4">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    {currentQuestion.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === idx;
                      const isCorrect = idx === currentQuestion.correctAnswer;
                      const showResult = showExplanation || quizState === "review";
                      
                      let optionStyles = "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]";
                      if (isSelected && !showResult) {
                        optionStyles = "border-primary bg-primary/10";
                      }
                      if (showResult) {
                        if (isCorrect) {
                          optionStyles = "border-green-500 bg-green-500/10";
                        } else if (isSelected && !isCorrect) {
                          optionStyles = "border-red-500 bg-red-500/10";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyles} ${
                            showResult ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected && !showResult 
                                ? 'border-primary bg-primary text-background' 
                                : showResult && isCorrect
                                ? 'border-green-500 bg-green-500 text-background'
                                : showResult && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-500 text-background'
                                : 'border-muted-foreground/30'
                            }`}>
                              {showResult && isCorrect ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : showResult && isSelected && !isCorrect ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-medium">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                              )}
                            </div>
                            <span className={`${
                              showResult && isCorrect ? 'text-green-400' : 
                              showResult && isSelected && !isCorrect ? 'text-red-400' :
                              'text-foreground'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showExplanation && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-orange-500/10 border border-orange-500/20'
                    }`}>
                      <div className="flex items-start gap-3">
                        {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h4 className={`text-sm font-medium mb-1 ${
                            selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                              ? 'text-green-400'
                              : 'text-orange-400'
                          }`}>
                            {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                              ? 'Correct!'
                              : 'Not quite right'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={handlePrevQuestion}
                      disabled={isFirstQuestion}
                      className="text-muted-foreground"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-3">
                      {quizState === "active" && !showExplanation && hasAnswered && (
                        <Button
                          variant="outline"
                          onClick={handleCheckAnswer}
                        >
                          Check Answer
                        </Button>
                      )}
                      
                      {(showExplanation || quizState === "review") && (
                        <Button
                          onClick={handleNextQuestion}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isLastQuestion ? (quizState === "review" ? "Back to Results" : "Finish Quiz") : "Next Question"}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Navigator */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quiz.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;
                  const isCorrectInReview = quizState === "review" && selectedAnswers[q.id] === q.correctAnswer;
                  const isWrongInReview = quizState === "review" && selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== q.correctAnswer;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setShowExplanation(quizState === "review");
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? 'bg-primary text-background'
                          : isCorrectInReview
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : isWrongInReview
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isAnswered
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-card/30 text-muted-foreground border border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results */}
          {quizState === "results" && (
            <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-8 shadow-lg">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Score Display - Like your images */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Quiz Completed!
                </h2>
                
                {/* Main Score Display */}
                <div className="mb-6">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {score.percentage}%
                  </div>
                  <p className="text-lg text-muted-foreground">
                    You got {score.correct} out of {score.total} questions correct
                  </p>
                </div>

                {/* Pass/Fail Status */}
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium ${
                  passed 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {passed ? (
                    <>
                      <Trophy className="w-6 h-6" />
                      <span>Passed!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6" />
                      <span>Not Passed - Need 70%</span>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Your Score</span>
                  <span className={passed ? 'text-green-400' : 'text-red-400'}>
                    {score.percentage}%
                  </span>
                </div>
                <div className="relative h-4 bg-card/50 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                      passed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score.percentage}%` }}
                  />
                  {/* Passing threshold marker */}
                  <div 
                    className="absolute top-0 w-1 h-full bg-foreground/50"
                    style={{ left: `${quiz.passingScore}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  Required: {quiz.passingScore}%
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={handleReviewAnswers}
                  className="gap-2 px-6 py-3"
                >
                  <CheckCircle className="w-4 h-4" />
                  Review Answers
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="gap-2 px-6 py-3"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </Button>
                
                {passed && (
                  <Button
                    onClick={() => {
                      const nextLessonId = getNextLessonAfterQuiz(resolvedQuizId);
                      if (nextLessonId) {
                        navigate(`/courses/${slug}/lesson/${nextLessonId}`);
                      } else {
                        navigate(`/courses/${slug}`);
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white gap-2 px-6 py-3"
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  onClick={() => navigate(`/courses/${slug}`)}
                  className="bg-primary hover:bg-primary/90 gap-2 px-6 py-3"
                >
                  <Home className="w-4 h-4" />
                  Back to Course
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default QuizPage;
