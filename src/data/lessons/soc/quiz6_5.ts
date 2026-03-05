import { LessonContent } from "../../lessonContent";

// Quiz 6.5: Modules 5-6 Assessment
export const quiz6_5: LessonContent[] = [
  {
    id: "6.5",
    courseId: "soc-fundamentals",
    title: "Quiz: Alert Triage & Incident Response",
    content: `
# Quiz: Modules 5-6 Assessment

This quiz tests your understanding of alert triage processes and incident response fundamentals.

## Quiz Instructions

- **Duration:** 30 minutes
- **Questions:** 15 multiple choice questions
- **Passing Score:** 80% (12 out of 15 correct)
- **Attempts:** Unlimited (but must pass to proceed)

## Module 5: Alert Triage & Analysis (8 Questions)

### Question 1
What is the first step in the alert triage process?

A) Immediately escalate to management
B) Delete the alert
C) Understand what triggered the alert
D) Reset user passwords

### Question 2
What does a 'false positive' mean in alert triage?

A) A missed attack
B) An alert triggered by benign activity
C) A confirmed security incident
D) A system malfunction

### Question 3
When should you immediately escalate an alert?

A) For every alert received
B) Only on Mondays
C) When you detect active malware, ransomware, or data exfiltration
D) Never - handle everything yourself

### Question 4
What is 'enrichment' in the context of alert triage?

A) Deleting unnecessary data
B) Adding context and intelligence to alerts for better decision-making
C) Compressing log files
D) Creating backup copies

### Question 5
What information should be included in alert documentation?

A) Only the alert title
B) Analyst's personal opinions only
C) Timeline, findings, evidence, verdict, and actions taken
D) Just the date and time

### Question 6
What is alert fatigue?

A) Physical tiredness from work
B) Decreased vigilance due to overwhelming volume of alerts
C) A type of malware
D) Network congestion

### Question 7
Which of the following is a quick win check during triage?

A) Known false positive?
B) Scheduled maintenance window?
C) Expected activity (scan, pentest)?
D) All of the above

### Question 8
What should you do after determining an alert is a true positive?

A) Close the ticket immediately
B) Document findings and initiate response/escalation
C) Delete the logs
D) Ignore it until the next shift

## Module 6: Incident Response Fundamentals (7 Questions)

### Question 9
What is the primary goal of incident response?

A) To blame someone for the incident
B) To contain, eradicate, and recover from security incidents
C) To write detailed reports only
D) To fire employees who make mistakes

### Question 10
Which incident response phase involves determining the scope and impact?

A) Preparation
B) Detection
C) Containment
D) Analysis

### Question 11
What is the first priority during a major security incident?

A) Preserving evidence
B) Protecting people and critical business functions
C) Notifying management
D) Updating antivirus signatures

### Question 12
What is 'containment' in incident response?

A) Ignoring the incident
B) Stopping the incident from spreading further
C) Deleting all logs
D) Firing the responsible party

### Question 13
Which of the following is evidence preservation technique?

A) Restarting affected systems
B) Taking memory dumps and disk images
C) Deleting temporary files
D) Installing new software

### Question 14
What is the 'eradication' phase?

A) Accepting that the incident will continue
B) Removing the root cause and all traces of the incident
C) Documenting the incident
D) Blaming the attacker

### Question 15
What is 'lessons learned' in incident response?

A) Punishing team members
B) Reviewing the incident to improve future response
C) Forgetting about the incident
D) Writing only technical details

## Answer Key

1. C - Understand what triggered the alert
2. B - An alert triggered by benign activity
3. C - When you detect active malware, ransomware, or data exfiltration
4. B - Adding context and intelligence to alerts for better decision-making
5. C - Timeline, findings, evidence, verdict, and actions taken
6. B - Decreased vigilance due to overwhelming volume of alerts
7. D - All of the above
8. B - Document findings and initiate response/escalation
9. B - To contain, eradicate, and recover from security incidents
10. D - Analysis
11. B - Protecting people and critical business functions
12. B - Stopping the incident from spreading further
13. B - Taking memory dumps and disk images
14. B - Removing the root cause and all traces of the incident
15. B - Reviewing the incident to improve future response

## Preparation for Next Module

Before proceeding to Module 7, ensure you understand:
- Systematic approach to alert triage and investigation
- Incident response lifecycle and phases
- Evidence preservation and documentation best practices
- When and how to escalate incidents

You must score 80% or higher to unlock Module 7: Threat Intelligence.
    `,
    keyTakeaways: [
      "Alert triage follows a systematic process from initial assessment to decision",
      "Incident response has defined phases: preparation, detection, analysis, containment, eradication, recovery",
      "Evidence preservation is critical for forensics and legal proceedings",
      "Documentation throughout the incident is essential for lessons learned"
    ]
  }
];
