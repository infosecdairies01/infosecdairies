import { LessonContent } from "../../lessonContent";

// Quiz 3: Modules 5-6 Assessment
export const quiz3: LessonContent[] = [
  {
    id: "Q3.1",
    courseId: "soc-fundamentals",
    title: "Quiz: Alert Triage & Threat Intelligence",
    content: `
# Quiz: Modules 5-6 Assessment

This quiz tests your understanding of Alert Triage processes and Threat Intelligence fundamentals.

## Quiz Instructions

- **Duration:** 30 minutes
- **Questions:** 15 multiple choice questions
- **Passing Score:** 80% (12 out of 15 correct)
- **Attempts:** Unlimited (but must pass to proceed)

## Module 5: Alert Triage & Analysis (8 Questions)

### Question 1
What is the first step in the alert triage process?

A) Contain the affected system
B) Acknowledge and prioritize the alert
C) Call the incident response team
D) Delete the alert

### Question 2
Which factor is most important when prioritizing alerts?

A) The time of day
B) The alert severity and potential impact
C) The analyst's workload
D) The tool that generated the alert

### Question 3
What is a "false positive"?

A) A legitimate security event that was missed
B) An alert that triggered but represents benign activity
C) A malware infection
D) A system failure

### Question 4
What does "mean time to respond" (MTTR) measure?

A) Time from alert creation to resolution
B) Time from system deployment to first alert
C) Time from hire to first day of work
D) Time from detection to containment

### Question 5
Which information should be documented during alert investigation?

A) Only the final conclusion
B) All findings, actions taken, and rationale
C) Just the alert ID
D) Only if it was a true positive

### Question 6
When should you escalate an alert?

A) Never, handle everything yourself
B) When it exceeds your authority or expertise
C) Only during business hours
D) Only for malware alerts

### Question 7
What is "enrichment" in alert analysis?

A) Making the alert more important
B) Adding context from additional sources
C) Deleting duplicate alerts
E) Forwarding to another team

### Question 8
Which of these is a key indicator of a true positive malware alert?

A) Alert fired at 3 AM
B) User is CEO
C) Suspicious process execution and network connections
D) Alert from new tool

## Module 6: Threat Intelligence Basics (7 Questions)

### Question 9
What is an IOC (Indicator of Compromise)?

A) A security policy
B) A piece of evidence that indicates a potential breach
C) A security tool
D) An employee training document

### Question 10
Which of these is NOT an IOC type?

A) IP address
B) Domain name
C) File hash
D) Employee name

### Question 11
What does OSINT stand for?

A) Open Source Intelligence
B) Offensive Security Intelligence
C) Operational Security Intelligence
D) Organizational Security Intelligence

### Question 12
Which tool is commonly used to check IP reputation?

A) Microsoft Word
B) VirusTotal
C) Calculator
D) Notepad

### Question 13
What is "strategic threat intelligence"?

A) Real-time alerts about active attacks
B) Broad trends, actor motivations, and campaign patterns
C) Technical details of malware
D) Network configuration data

### Question 14
Which of these is a reliable source for threat intelligence?

A) Random websites
B) Social media rumors
C) Vendor security blogs and government alerts
D) Personal opinions

### Question 15
What is a "threat intelligence platform"?

A) A tool for collecting, analyzing, and sharing threat data
B) A social media platform
C) A development environment
D) A physical server room

## Answer Key

1. B - Acknowledge and prioritize the alert
2. B - The alert severity and potential impact
3. B - An alert that triggered but represents benign activity
4. A - Time from alert creation to resolution
5. B - All findings, actions taken, and rationale
6. B - When it exceeds your authority or expertise
7. B - Adding context from additional sources
8. C - Suspicious process execution and network connections
9. B - A piece of evidence that indicates a potential breach
10. D - Employee name
11. A - Open Source Intelligence
12. B - VirusTotal
13. B - Broad trends, actor motivations, and campaign patterns
14. C - Vendor security blogs and government alerts
15. A - A tool for collecting, analyzing, and sharing threat data

## Preparation for Next Module

Before proceeding to Module 7, ensure you understand:
- The alert triage workflow and prioritization
- How to distinguish true positives from false positives
- Common IOC types and their significance
- Basic OSINT techniques for threat research

You must score 80% or higher to unlock Module 7: Incident Response Introduction.
    `,
    keyTakeaways: [
      "Alert triage follows a structured process of prioritization and investigation",
      "Documentation is critical for continuity and learning",
      "IOCs are artifacts that indicate potential compromise",
      "Threat intelligence provides context for better decision making"
    ]
  }
];
