import { LessonContent } from "../../lessonContent";

// Quiz 8.5: Modules 7-8 Assessment
export const quiz8_5: LessonContent[] = [
  {
    id: "8.5",
    courseId: "soc-fundamentals",
    title: "Quiz: Threat Intelligence & Proactive Defense",
    content: `
# Quiz: Modules 7-8 Assessment

This quiz tests your understanding of threat intelligence fundamentals and proactive defense strategies.

## Quiz Instructions

- **Duration:** 30 minutes
- **Questions:** 15 multiple choice questions
- **Passing Score:** 80% (12 out of 15 correct)
- **Attempts:** Unlimited (but must pass to proceed)

## Module 7: Threat Intelligence (8 Questions)

### Question 1
What are the four types of threat intelligence?

A) Red, Blue, Green, Yellow
B) Strategic, Tactical, Operational, Technical
C) Primary, Secondary, Tertiary, Quaternary
D) Internal, External, Public, Private

### Question 2
What does IOC stand for?

A) Internal Operations Center
B) Indicator of Compromise
C) Internet of Computers
D) Intrusion of Command

### Question 3
According to the Pyramid of Pain, which IOC type is hardest for attackers to change?

A) Hash values
B) IP addresses
C) TTPs (Tactics, Techniques, Procedures)
D) Domain names

### Question 4
What is OSINT?

A) Operating System Intelligence
B) Open Source Intelligence - publicly available information
C) Offensive Security Integration
D) Online System Integration

### Question 5
Which platform is commonly used for file hash and URL analysis?

A) Microsoft Word
B) VirusTotal
C) Photoshop
D) Excel

### Question 6
What is a TIP (Threat Intelligence Platform)?

A) A gratuity calculator
B) A platform that aggregates and operationalizes threat data
C) A typing improvement program
D) A network scanner

### Question 7
What is a red flag when analyzing a domain?

A) It's been registered for 10 years
B) It was recently registered and uses privacy protection
C) It has valid SSL certificates
D) It's hosted by a major cloud provider

### Question 8
Which of these is considered a high-fidelity IOC?

A) Public IP address
B) Domain name
C) File hash of custom malware
D) User agent string

## Module 8: Proactive Defense & Threat Hunting (7 Questions)

### Question 9
What is threat hunting?

A) Waiting for alerts to trigger
B) Proactively searching for threats that have bypassed automated defenses
C) Only reviewing logs after an incident
D) Writing detection rules

### Question 10
What is the primary goal of threat hunting?

A) To find known threats
B) To discover unknown threats and attacker activity
C) To monitor user activity
D) To configure firewalls

### Question 11
Which is a common threat hunting hypothesis?

A) "All systems are secure"
B) "An attacker is using Living Off the Land techniques"
C) "Users never make mistakes"
D) "All alerts are false positives"

### Question 12
What is 'assumed breach' mentality?

A) Assuming the network is completely secure
B) Operating as if attackers are already in your network
C) Trusting all security tools
D) Ignoring security alerts

### Question 13
Which technique is commonly used in threat hunting?

A) Only using automated tools
B) Baseline deviation analysis
C) Ignoring historical data
D) Focusing only on critical servers

### Question 14
What is 'attack surface analysis'?

A) Reviewing only external IP addresses
B) Identifying and mapping all potential entry points for attackers
C) Counting the number of security tools
D) Measuring network bandwidth

### Question 15
What is the purpose of a purple team exercise?

A) To test only detection capabilities
B) To validate and improve both detection and response capabilities
C) To blame the security team
D) To replace automated monitoring

## Answer Key

1. B - Strategic, Tactical, Operational, Technical
2. B - Indicator of Compromise
3. C - TTPs (Tactics, Techniques, Procedures)
4. B - Open Source Intelligence - publicly available information
5. B - VirusTotal
6. B - A platform that aggregates and operationalizes threat data
7. B - It was recently registered and uses privacy protection
8. C - File hash of custom malware
9. B - Proactively searching for threats that have bypassed automated defenses
10. B - To discover unknown threats and attacker activity
11. B - "An attacker is using Living Off the Land techniques"
12. B - Operating as if attackers are already in your network
13. B - Baseline deviation analysis
14. B - Identifying and mapping all potential entry points for attackers
15. B - To validate and improve both detection and response capabilities

## Preparation for Next Module

Before proceeding to Module 9, ensure you understand:
- Threat intelligence lifecycle and types
- How to create and analyze IOCs
- Threat hunting methodologies and frameworks
- Proactive defense strategies and techniques

You must score 80% or higher to unlock Module 9: Security Tools & Automation.
    `,
    keyTakeaways: [
      "Threat intelligence provides context for detecting and preventing attacks",
      "IOCs range from simple indicators like IPs to complex TTPs",
      "Threat hunting assumes breach and proactively searches for threats",
      "Purple team exercises improve both detection and response capabilities"
    ]
  }
];
