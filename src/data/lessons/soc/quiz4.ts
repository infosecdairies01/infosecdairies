import { LessonContent } from "../../lessonContent";

// Quiz 4: Modules 7-8 Assessment
export const quiz4: LessonContent[] = [
  {
    id: "Q4.1",
    courseId: "soc-fundamentals",
    title: "Quiz: Incident Response & EDR",
    content: `
# Quiz: Modules 7-8 Assessment

This quiz tests your understanding of Incident Response processes and Endpoint Detection and Response.

## Quiz Instructions

- **Duration:** 30 minutes
- **Questions:** 15 multiple choice questions
- **Passing Score:** 80% (12 out of 15 correct)
- **Attempts:** Unlimited (but must pass to proceed)

## Module 7: Incident Response Introduction (8 Questions)

### Question 1
Which NIST framework phase involves stopping the spread of an incident?

A) Detection
B) Analysis
C) Containment
D) Recovery

### Question 2
What is the first phase of the NIST Incident Response lifecycle?

A) Containment
B) Preparation
C) Detection
D) Recovery

### Question 3
Which incident severity level indicates business impact and requires immediate response?

A) Low
B) Medium
C) High
D) Critical

### Question 4
What is "post-incident activity" primarily focused on?

A) Celebrating the team's success
B) Learning and improving processes
C) Punishing responsible parties
D) Deleting all evidence

### Question 5
Which document defines communication procedures during incidents?

A) Playbook
B) Communication Plan
C) Security Policy
D) Risk Assessment

### Question 6
What is the goal of incident containment?

A) To delete all data
B) To prevent further damage and spread
C) To catch the attacker
D) To shut down the entire network

### Question 7
Which of these is a containment strategy?

A) Isolating affected systems from the network
B) Ignoring the incident
C) Waiting for it to stop
D) Emailing all employees

### Question 8
What should be preserved during incident response?

A) Only important files
B) All relevant evidence and logs
C) Nothing, focus on recovery
D) Only financial records

## Module 8: Endpoint Detection & Response (7 Questions)

### Question 9
What does EDR stand for?

A) Event Detection and Response
B) Endpoint Detection and Response
C) Emergency Detection and Recovery
D) Enhanced Detection and Reporting

### Question 10
What is the primary focus of EDR?

A) Network traffic analysis
B) Physical security
C) Endpoint activity monitoring and response
D) Cloud security

### Question 11
What is a "process tree" in EDR context?

A) A diagram showing process relationships
B) A type of malware
C) A network topology
D) A file system structure

### Question 12
Which EDR capability shows parent-child process relationships?

A) Network mapping
B) Process tree analysis
C) Log aggregation
D) Alert prioritization

### Question 13
What is "telemetry" in EDR?

A) Data collected from endpoints about activity
B) A type of encryption
C) A communication protocol
D) A management tool

### Question 14
Which of these is a common EDR alert type?

A) Suspicious process execution
B) Password expiration
C) Software updates
D) Email delivery

### Question 15
What is "isolation" in EDR context?

A) Disconnecting an endpoint from the network
B) Turning off the computer
C) Moving files to quarantine
D) Changing passwords

## Answer Key

1. C - Containment
2. B - Preparation
3. D - Critical
4. B - Learning and improving processes
5. B - Communication Plan
6. B - To prevent further damage and spread
7. A - Isolating affected systems from the network
8. B - All relevant evidence and logs
9. B - Endpoint Detection and Response
10. C - Endpoint activity monitoring and response
11. A - A diagram showing process relationships
12. B - Process tree analysis
13. A - Data collected from endpoints about activity
14. A - Suspicious process execution
15. A - Disconnecting an endpoint from the network

## Preparation for Next Module

Before proceeding to Module 9, ensure you understand:
- The NIST Incident Response framework phases
- Containment strategies and their purposes
- EDR capabilities and telemetry
- How to analyze process trees for suspicious activity

You must score 80% or higher to unlock Module 9: Network Security Monitoring.
    `,
    keyTakeaways: [
      "Incident response follows a structured lifecycle from preparation to lessons learned",
      "Containment prevents incident spread while preserving evidence",
      "EDR provides deep visibility into endpoint activities",
      "Process trees reveal the execution flow of potential malware"
    ]
  }
];
