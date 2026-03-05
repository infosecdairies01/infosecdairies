import { LessonContent } from "../../lessonContent";

export const quiz1: LessonContent[] = [
  {
    id: "1.5",
    courseId: "log-analysis",
    title: "Log Fundamentals Quiz",
    content: `
# Log Fundamentals Quiz

Test your understanding of log basics, formats, and importance in security.

## Quiz Overview

This quiz covers the fundamental concepts of log analysis:
- Log types and sources
- Common log formats
- Log collection and centralization
- Security importance of logs

## Instructions

1. **Duration**: 15 minutes
2. **Questions**: 15 multiple-choice questions
3. **Passing Score**: 70% (11 out of 15 questions)
4. **Attempts**: Unlimited - retake if needed

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will test:
- Understanding of log fundamentals
- Knowledge of different log formats
- Log collection concepts
- Security analysis basics

Good luck! 📊
    `,
    keyTakeaways: [
      "Logs are essential for security monitoring and incident response",
      "Different log formats serve different purposes and have unique advantages",
      "Centralized log management enables effective correlation and analysis",
      "Understanding log fundamentals is critical for any security analyst"
    ],
    quiz: "la-q1"
  }
];
