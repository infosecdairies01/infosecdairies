import { LessonContent } from "../../lessonContent";

export const quiz5: LessonContent[] = [
  {
    id: "6.5",
    courseId: "log-analysis",
    title: "Final Certification Exam",
    content: `
# Log Analysis Final Certification Exam

Comprehensive exam covering all log analysis modules. Required for certification.

## Exam Overview

This final certification exam covers all concepts from Modules 1-6:
- Log fundamentals and formats
- Windows Event Log analysis
- Linux system logs
- Network device logs
- Log analysis tools and techniques
- Practical investigation skills

## Instructions

1. **Duration**: 45 minutes
2. **Questions**: 40 comprehensive multiple-choice questions
3. **Passing Score**: 80% (32 out of 40 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the final exam, review all previous modules:
- Log sources and collection methods
- Windows Event IDs and security events
- Linux authentication and system logs
- Firewall, proxy, and DNS analysis
- CLI tools for log parsing
- Attack patterns in logs
- Investigation methodologies

## Taking the Final Exam

Click the "Start Quiz" button below when you're ready. The final exam will test:
- Comprehensive log analysis knowledge
- Practical application of concepts
- Problem-solving abilities
- Real-world scenario analysis

This certification demonstrates your expertise in log analysis and readiness for professional security roles.

Good luck! 🎓
    `,
    keyTakeaways: [
      "Log analysis requires understanding of multiple platforms and log types",
      "Practical investigation skills are essential for security analysts",
      "Certification validates your expertise to employers and clients",
      "Continuous learning is key to staying current with log analysis techniques"
    ],
    quiz: "la-q5"
  }
];
