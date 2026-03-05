import { LessonContent } from "../../lessonContent";

export const quiz3: LessonContent[] = [
  {
    id: "3.6",
    courseId: "log-analysis",
    title: "Linux & Network Log Analysis Quiz",
    content: `
# Linux & Network Log Analysis Quiz

Test your skills in analyzing Linux system logs, authentication events, and network device logs.

## Quiz Overview

This quiz covers Linux and network log analysis from Module 3:
- Linux logging architecture (syslog, rsyslog, journald)
- Authentication logs (auth.log, secure)
- System and application logs
- Web server logs (Apache/Nginx)
- Network device log analysis
- Command-line log analysis techniques

## Instructions

1. **Duration**: 20 minutes
2. **Questions**: 12 multiple-choice questions
3. **Passing Score**: 70% (9 out of 12 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Location of auth logs (/var/log/auth.log vs /var/log/secure)
- SSH login monitoring and analysis
- syslog facilities and priorities
- Apache/Nginx log formats and fields
- Common Linux commands (grep, tail, awk, sed)
- Firewall log interpretation (ACCEPT vs DENY)
- DNS query analysis for detecting anomalies

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will test:
- Linux log file locations and formats
- Authentication pattern recognition
- Web server log analysis
- Network security event detection
- CLI tool usage for log parsing

Good luck! 🐧
    `,
    keyTakeaways: [
      "Linux auth logs track SSH and sudo activity",
      "Web server logs reveal attack patterns and suspicious requests",
      "Firewall logs show allowed and blocked traffic",
      "DNS logs can reveal C2 communication",
      "CLI tools are essential for efficient log analysis"
    ],
    quiz: "la-q3"
  }
];
