import { LessonContent } from "../../lessonContent";

export const quiz2: LessonContent[] = [
  {
    id: "2.7",
    courseId: "log-analysis",
    title: "Windows Event Log Mastery Quiz",
    content: `
# Windows Event Log Mastery Quiz

Test your knowledge of Windows Event IDs, log analysis techniques, and security event detection.

## Quiz Overview

This quiz covers Windows Event Log analysis from Module 2:
- Windows Event Log architecture and channels
- Critical security Event IDs (4624, 4625, 4688, 4720, etc.)
- Logon types and authentication patterns
- Process tracking and command-line logging
- PowerShell logging and script block analysis
- Detecting suspicious Windows activity

## Instructions

1. **Duration**: 25 minutes
2. **Questions**: 12 multiple-choice questions
3. **Passing Score**: 75% (9 out of 12 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Event ID 4624 vs 4625 (success vs failed logons)
- Different logon types (Type 2, 3, 10)
- Event ID 4688 for process creation tracking
- Event ID 4720 for account creation
- PowerShell logging (Module, Script Block, Transcription)
- Detecting brute force and lateral movement in Windows logs

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will test:
- Windows Event ID recognition
- Log analysis scenarios
- Attack pattern identification
- Security best practices

Good luck! 🎯
    `,
    keyTakeaways: [
      "Windows Event IDs are essential for security analysis",
      "Logon Type indicates how access was gained (interactive, network, RDP)",
      "Process creation events reveal what programs executed",
      "Failed logon patterns indicate brute force attacks",
      "PowerShell logging catches malicious script execution"
    ],
    quiz: "la-q2"
  }
];
