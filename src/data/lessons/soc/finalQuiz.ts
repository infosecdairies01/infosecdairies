import { LessonContent } from "../../lessonContent";

// Final Quiz: Comprehensive Assessment
export const finalQuiz: LessonContent[] = [
  {
    id: "10.3.5",
    courseId: "soc-fundamentals",
    title: "Final Quiz: SOC Fundamentals Comprehensive Assessment",
    content: `
# Final Quiz: SOC Fundamentals Comprehensive Assessment

This comprehensive quiz tests your understanding of all SOC fundamentals covered throughout the course.

## Quiz Instructions

- **Duration:** 45 minutes
- **Questions:** 25 multiple choice questions
- **Passing Score:** 80% (20 out of 25 correct)
- **Attempts:** Unlimited (but must pass to complete the course)

## Course Comprehensive Assessment

### SOC Operations & Fundamentals (5 Questions)

**Question 1**
What is the primary mission of a Security Operations Center (SOC)?
A) To develop security policies
B) To detect, analyze, and respond to cybersecurity incidents
C) To manage physical security
D) To conduct penetration testing

**Question 2**
Which SOC metric measures the average time to detect threats?
A) MTTR
B) MTTD
C) MTTC
D) MTBF

**Question 3**
What is the role of Tier 1 SOC Analyst?
A) Deep-dive forensics and malware analysis
B) Initial alert triage and monitoring
C) Security architecture design
D) Executive reporting

**Question 4**
What is the purpose of shift handover documentation?
A) To assign blame for incidents
B) To ensure continuity and prevent dropped incidents
C) To reduce staff workload
D) To delete old alerts

**Question 5**
Which tool is considered the heart of the SOC?
A) Antivirus software
B) SIEM (Security Information and Event Management)
C) Firewall
D) Intrusion Prevention System

### Threat Landscape & Attack Vectors (5 Questions)

**Question 6**
Which type of threat actor is typically state-sponsored?
A) Script Kiddies
B) Hacktivists
C) Nation-State Actors (APT)
D) Insider Threats

**Question 7**
What is the most common initial access vector?
A) Physical attacks
B) Phishing (over 90% of attacks start with phishing)
C) Zero-day exploits
D) Supply chain attacks

**Question 8**
What does MITRE ATT&CK provide?
A) Security software tools
B) A framework for describing adversary tactics, techniques, and procedures
C) Compliance regulations
D) Network security protocols

**Question 9**
Which malware type encrypts files and demands payment?
A) Trojan
B) Worm
C) Ransomware
D) Rootkit

**Question 10**
What is 'living off the land'?
A) Using legitimate system tools for malicious purposes
B) Physical theft of equipment
C) Social engineering attacks
D) Denial of service attacks

### Log Analysis & SIEM (5 Questions)

**Question 11**
Which Windows Event ID indicates a successful logon?
A) 4624
B) 4625
C) 4648
D) 4672

**Question 12**
What is the primary benefit of log normalization?
A) Reducing log file sizes
B) Converting different formats to a standard schema for analysis
C) Encrypting log data
D) Deleting duplicate logs

**Question 13**
What is a SIEM correlation rule?
A) A rule for password complexity
B) Logic that identifies patterns across multiple events
C) Network configuration rule
D) Data backup procedure

**Question 14**
Which SIEM query language uses pipes (|) to chain commands?
A) SPL (Splunk Processing Language)
B) SQL
C) Python
D) PowerShell

**Question 15**
What is 'alert fatigue'?
A) When alerts stop working
B) Decreased vigilance due to overwhelming volume of alerts
C) When alerts are too quiet
D) When only managers receive alerts

### Incident Response & Triage (5 Questions)

**Question 16**
What is the first step in alert triage?
A) Immediately escalate to management
B) Understand what triggered the alert
C) Delete the alert
D) Reset user passwords

**Question 17**
When should you immediately escalate an alert?
A) For every alert received
B) When you detect active malware, ransomware, or data exfiltration
C) Only on Fridays
D) Never - handle everything yourself

**Question 18**
What is the primary goal of incident response?
A) To blame someone
B) To contain, eradicate, and recover from security incidents
C) To write detailed reports only
D) To fire responsible employees

**Question 19**
What is 'containment' in incident response?
A) Ignoring the incident
B) Stopping the incident from spreading further
C) Deleting all logs
D) Punishing the attacker

**Question 20**
What is evidence preservation?
A) Restarting affected systems
B) Taking memory dumps and disk images before analysis
C) Installing new software
D) Deleting temporary files

### Threat Intelligence & Proactive Defense (5 Questions)

**Question 21**
What does IOC stand for?
A) Internal Operations Center
B) Indicator of Compromise
C) Internet of Computers
D) Intrusion of Command

**Question 22**
According to the Pyramid of Pain, which is hardest for attackers to change?
A) IP addresses
B) Domain names
C) Hash values
D) TTPs (Tactics, Techniques, Procedures)

**Question 23**
What is OSINT?
A) Operating System Intelligence
B) Open Source Intelligence - publicly available information
C) Offensive Security Integration
D) Online System Integration

**Question 24**
What is threat hunting?
A) Waiting for alerts to trigger
B) Proactively searching for threats that bypassed automated defenses
C) Only reviewing logs after incidents
D) Writing detection rules only

**Question 25**
What is 'assumed breach' mentality?
A) Assuming the network is completely secure
B) Operating as if attackers are already in your network
C) Trusting all security tools blindly
D) Ignoring security alerts

## Answer Key

1. B - To detect, analyze, and respond to cybersecurity incidents
2. B - MTTD (Mean Time To Detect)
3. B - Initial alert triage and monitoring
4. B - To ensure continuity and prevent dropped incidents
5. B - SIEM (Security Information and Event Management)
6. C - Nation-State Actors (APT)
7. B - Phishing (over 90% of attacks start with phishing)
8. B - A framework for describing adversary tactics, techniques, and procedures
9. C - Ransomware
10. A - Using legitimate system tools for malicious purposes
11. A - 4624
12. B - Converting different formats to a standard schema for analysis
13. B - Logic that identifies patterns across multiple events
14. A - SPL (Splunk Processing Language)
15. B - Decreased vigilance due to overwhelming volume of alerts
16. B - Understand what triggered the alert
17. B - When you detect active malware, ransomware, or data exfiltration
18. B - To contain, eradicate, and recover from security incidents
19. B - Stopping the incident from spreading further
20. B - Taking memory dumps and disk images before analysis
21. B - Indicator of Compromise
22. D - TTPs (Tactics, Techniques, Procedures)
23. B - Open Source Intelligence - publicly available information
24. B - Proactively searching for threats that bypassed automated defenses
25. B - Operating as if attackers are already in your network

## Course Completion

Congratulations! You must score 80% or higher to complete the SOC Fundamentals course and unlock the final module.

Upon successful completion, you will have demonstrated mastery of:
- SOC operations and workflows
- Threat landscape understanding
- Log analysis and SIEM operations
- Incident response procedures
- Threat intelligence and proactive defense

You are now ready to proceed to Module 10.4: Course Wrap-up and Next Steps.
    `,
    keyTakeaways: [
      "SOC operations require systematic approaches to monitoring and response",
      "Understanding threat actors and attack vectors is essential for effective defense",
      "Log analysis and SIEM skills are fundamental for modern security operations",
      "Incident response follows established phases for effective threat mitigation",
      "Threat intelligence and proactive hunting complement reactive security measures"
    ]
  }
];
