import { LessonContent } from "../../lessonContent";

export const quiz4: LessonContent[] = [
  {
    id: "4.5",
    courseId: "log-analysis",
    title: "Network Log Analysis Quiz",
    content: `
# Network Log Analysis Quiz

Test your skills on firewall, proxy, and DNS log analysis.

## Quiz Overview

This quiz covers network log analysis concepts:
- Firewall log analysis
- Proxy and web gateway logs
- DNS log analysis
- Network traffic patterns
- Common network attacks in logs

## Instructions

1. **Duration**: 20 minutes
2. **Questions**: 15 multiple-choice questions
3. **Passing Score**: 70% (11 out of 15 questions)
4. **Attempts**: Unlimited - retake if needed

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will test:
- Firewall log interpretation
- Proxy traffic analysis
- DNS query analysis
- Network attack detection
- Traffic pattern recognition

Good luck! 🌐
    `,
    keyTakeaways: [
      "Network logs provide visibility into traffic patterns and potential threats",
      "Firewall logs reveal allowed/denied connections and policy effectiveness",
      "Proxy logs help detect web-based attacks and data exfiltration",
      "DNS logs are crucial for detecting C2 communication and malware"
    ],
    quiz: "la-q4"
  }
];
