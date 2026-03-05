import { LessonContent } from "../../lessonContent";

// Final Exam: Complete Course Assessment
export const finalExam: LessonContent[] = [
  {
    id: "FE.1",
    courseId: "soc-fundamentals",
    title: "Final Exam: Blue Team & SOC Fundamentals",
    content: `
# Final Exam: Blue Team & SOC Fundamentals

This comprehensive exam tests your knowledge across all modules of the SOC Fundamentals course.

## Exam Instructions

- **Duration:** 90 minutes
- **Questions:** 50 multiple choice questions
- **Passing Score:** 85% (43 out of 50 correct)
- **Attempts:** 3 attempts maximum
- **Requirement:** Must pass to receive course completion certificate

## Course Overview Questions (10 Questions)

### Question 1
What is the primary mission of a Security Operations Center?

A) To develop security software and tools
B) To monitor, detect, analyze, and respond to cybersecurity incidents
C) To conduct penetration testing and vulnerability assessments
D) To manage physical access to facilities

### Question 2
Which SOC role is typically responsible for initial alert triage and ticket creation?

A) SOC Manager
B) Threat Hunter
C) Tier 1 Analyst
D) Incident Response Lead

### Question 3
What does "defense in depth" refer to in security operations?

A) Having a single strong security control
B) Multiple layers of security controls providing redundancy
C) Focusing only on prevention mechanisms
D) Relying solely on detection capabilities

### Question 4
Which metric measures the average time from when an incident occurs to when it's detected?

A) Mean Time to Respond (MTTR)
B) Mean Time to Detect (MTTD)
C) Mean Time to Contain (MTTC)
D) Mean Time to Recover (MTTR)

### Question 5
What is the purpose of a SOC playbook?

A) To define employee compensation
B) To provide step-by-step procedures for handling security events
C) To schedule team meetings
D) To manage software licenses

### Question 6
Which shift pattern is most common in a 24/7 SOC operation?

A) 12-hour shifts with 2 teams
B) 8-hour shifts with 3 teams covering 24 hours
C) 24-hour shifts with 1 team
D) 4-hour shifts with 6 teams

### Question 7
What is the primary benefit of centralizing logs in a SIEM?

A) It replaces all other security tools
B) It enables correlation and analysis across multiple data sources
C) It automatically fixes security issues
D) It reduces the need for security analysts

### Question 8
Which of these is a characteristic of Advanced Persistent Threats (APTs)?

A) Quick, noisy attacks that are easily detected
B) Short duration campaigns targeting random victims
C) Sophisticated, stealthy operations with long-term presence
D) Attacks that only affect small organizations

### Question 9
What is "alert fatigue"?

A) When security tools stop generating alerts
B) When analysts become desensitized to alerts due to high volume
C) When alerts are only sent during business hours
D) When alerts are automatically escalated

### Question 10
Which framework provides a comprehensive knowledge base of adversary tactics and techniques?

A) NIST Cybersecurity Framework
B) ISO 27001
C) MITRE ATT&CK
D) CIS Controls

## Log Analysis & SIEM (10 Questions)

### Question 11
Which Windows Event ID indicates a successful user logon?

A) 4624
B) 4625
C) 4648
D) 4740

### Question 12
What does Event ID 4625 indicate in Windows Security logs?

A) Account lockout
B) Failed logon attempt
C) Successful logon
D) Password change

### Question 13
Which file contains authentication logs on Ubuntu Linux systems?

A) /var/log/syslog
B) /var/log/auth.log
C) /var/log/messages
D) /var/log/secure

### Question 14
What is the standard port number for syslog traffic?

A) 22
B) 80
C) 443
D) 514

### Question 15
Which log format uses key-value pairs separated by equals signs and is commonly used by IBM QRadar?

A) CEF (Common Event Format)
B) LEEF (Log Event Extended Format)
C) JSON
D) CSV

### Question 16
What is the purpose of log rotation?

A) Encrypting log files for security
B) Archiving old logs and creating new log files to manage disk space
C) Sending logs to multiple destinations
D) Compressing logs in real-time

### Question 17
Which Windows log contains security-related events like logons and object access?

A) Application Log
B) System Log
C) Security Log
D) Setup Log

### Question 18
What is a common indicator of SSH brute force attacks in Linux logs?

A) Multiple "Accepted publickey" entries
B) Repeated "Failed password" entries from the same IP address
C) No SSH entries in the log
D) Only root user login attempts

### Question 19
What does SIEM stand for?

A) Security Incident and Event Management
B) System Information and Event Monitoring
C) Security Information and Event Management
D) Software Investigation and Evidence Management

### Question 20
What is a "correlation rule" in a SIEM?

A) A rule that automatically deletes old logs
B) Logic that identifies patterns across multiple events from different sources
C) A password complexity requirement
D) A network access control rule

## Alert Triage & Threat Intelligence (10 Questions)

### Question 21
What is the first step in the alert triage process?

A) Contain the affected system
B) Acknowledge the alert and assess priority
C) Call the incident response team
D) Delete the alert if it looks false

### Question 22
Which factor is most important when prioritizing security alerts?

A) The time of day the alert occurred
B) The alert severity and potential business impact
C) The analyst's current workload
D) The security tool that generated the alert

### Question 23
What is a "false positive" in security monitoring?

A) A legitimate security event that was missed by detection systems
B) An alert that triggered but represents benign or normal activity
C) A confirmed malware infection
D) A system failure or outage

### Question 24
What does "mean time to respond" (MTTR) measure?

A) Time from alert creation to final resolution
B) Time from system deployment to first alert
C) Time from employee hire to first day of work
D) Time from detection to initial containment

### Question 25
What is an IOC (Indicator of Compromise)?

A) A security policy document
B) A piece of forensic evidence indicating a potential breach
C) A security monitoring tool
D) An employee training manual

### Question 26
Which of these is NOT a common IOC type?

A) IP address
B) Domain name
C) File hash
D) Employee's home address

### Question 27
What does OSINT stand for?

A) Open Source Intelligence
B) Offensive Security Intelligence
C) Operational Security Intelligence
D) Organizational Security Intelligence

### Question 28
Which tool is commonly used to check the reputation of IP addresses and file hashes?

A) Microsoft Excel
B) VirusTotal
C) Calculator
D) Notepad

### Question 29
What is "strategic threat intelligence"?

A) Real-time alerts about active attacks
B) Broad trends, threat actor motivations, and campaign patterns
C) Technical details of specific malware samples
D) Network device configuration data

### Question 30
What is the primary purpose of threat intelligence platforms?

A) To replace SIEM systems
B) To collect, analyze, and share threat data
C) To manage user accounts
D) To schedule security training

## Incident Response & EDR (10 Questions)

### Question 31
Which NIST Incident Response framework phase involves stopping the spread of an incident?

A) Detection and Analysis
B) Containment, Eradication, and Recovery
C) Post-Incident Activity
D) Preparation

### Question 32
What is the first phase of the NIST Incident Response lifecycle?

A) Containment
B) Preparation
C) Detection and Analysis
D) Recovery

### Question 33
Which incident severity level typically indicates significant business impact and requires immediate response?

A) Low
B) Medium
C) High
D) Critical

### Question 34
What is the primary goal of incident containment?

A) To delete all data on affected systems
B) To prevent further damage and stop the spread
C) To catch and prosecute the attackers
D) To shut down the entire network

### Question 35
Which of these is a common containment strategy?

A) Ignoring the incident and hoping it stops
B) Isolating affected systems from the network
C) Emailing all employees about the incident
D) Waiting for automated systems to handle it

### Question 36
What does EDR stand for?

A) Event Detection and Response
B) Endpoint Detection and Response
C) Emergency Detection and Recovery
D) Enhanced Detection and Reporting

### Question 37
What is the primary focus of Endpoint Detection and Response (EDR) solutions?

A) Network traffic analysis and monitoring
B) Physical security and access control
C) Endpoint activity monitoring and response capabilities
D) Cloud security and configuration

### Question 38
What is a "process tree" in EDR analysis?

A) A diagram showing parent-child process relationships
B) A type of malware classification
C) A network topology map
D) A file system hierarchy

### Question 39
What is "telemetry" in the context of EDR?

A) Data collected from endpoints about their activities
B) A type of encryption algorithm
C) A network communication protocol
D) A remote management tool

### Question 40
Which EDR capability is most useful for identifying the execution flow of malware?

A) Network mapping
B) Process tree analysis
C) Log aggregation
D) Alert prioritization

## Network Security & Best Practices (10 Questions)

### Question 41
Which protocol is commonly used for secure remote administration?

A) Telnet
B) SSH
C) FTP
D) HTTP

### Question 42
What is the primary purpose of a firewall?

A) To encrypt all network traffic
B) To filter and control network traffic based on rules
C) To generate security alerts
D) To manage user passwords

### Question 43
Which type of attack involves flooding a network with traffic to overwhelm resources?

A) Phishing
B) Malware infection
C) Denial of Service (DoS)
D) Social engineering

### Question 44
What is "port scanning" typically used for?

A) Encrypting network communications
B) Discovering open ports and services on a target system
C) Managing network bandwidth
D) Updating firewall rules

### Question 45
Which network device operates at Layer 2 of the OSI model?

A) Router
B) Switch
C) Firewall
D) Load balancer

### Question 46
What is the primary cause of analyst burnout in SOC environments?

A) High salaries and good benefits
B) Alert fatigue, shift work, and high stress
C) Too much vacation time
D) Lack of challenging work

### Question 47
Which practice is most effective for preventing burnout?

A) Working longer hours
B) Taking regular breaks and maintaining work-life balance
C) Ignoring stress and pushing through
D) Avoiding all social interaction

### Question 48
What is the importance of continuous learning in cybersecurity?

A) It's optional once you have a job
B) Threats and technologies constantly evolve
C) Only managers need to keep learning
D) Learning stops after certification

### Question 49
Which entry-level certification is most recommended for SOC analysts?

A) CISSP
B) OSCP
C) CompTIA Security+ or Blue Team Level 1
D) None, certifications aren't necessary

### Question 50
What is the most valuable skill for a SOC analyst?

A) Programming expertise
B) Curiosity and critical thinking
C) Physical fitness
D) Public speaking ability

## Answer Key

1. B - To monitor, detect, analyze, and respond to cybersecurity incidents
2. C - Tier 1 Analyst
3. B - Multiple layers of security controls providing redundancy
4. B - Mean Time to Detect (MTTD)
5. B - To provide step-by-step procedures for handling security events
6. B - 8-hour shifts with 3 teams covering 24 hours
7. B - It enables correlation and analysis across multiple data sources
8. C - Sophisticated, stealthy operations with long-term presence
9. B - When analysts become desensitized to alerts due to high volume
10. C - MITRE ATT&CK
11. A - 4624
12. B - Failed logon attempt
13. B - /var/log/auth.log
14. D - 514
15. B - LEEF (Log Event Extended Format)
16. B - Archiving old logs and creating new log files to manage disk space
17. C - Security Log
18. B - Repeated "Failed password" entries from the same IP address
19. C - Security Information and Event Management
20. B - Logic that identifies patterns across multiple events from different sources
21. B - Acknowledge the alert and assess priority
22. B - The alert severity and potential business impact
23. B - An alert that triggered but represents benign or normal activity
24. A - Time from alert creation to final resolution
25. B - A piece of forensic evidence indicating a potential breach
26. D - Employee's home address
27. A - Open Source Intelligence
28. B - VirusTotal
29. B - Broad trends, threat actor motivations, and campaign patterns
30. B - To collect, analyze, and share threat data
31. B - Containment, Eradication, and Recovery
32. B - Preparation
33. D - Critical
34. B - To prevent further damage and stop the spread
35. B - Isolating affected systems from the network
36. B - Endpoint Detection and Response
37. C - Endpoint activity monitoring and response capabilities
38. A - A diagram showing parent-child process relationships
39. A - Data collected from endpoints about their activities
40. B - Process tree analysis
41. B - SSH
42. B - To filter and control network traffic based on rules
43. C - Denial of Service (DoS)
44. B - Discovering open ports and services on a target system
45. B - Switch
46. B - Alert fatigue, shift work, and high stress
47. B - Taking regular breaks and maintaining work-life balance
48. B - Threats and technologies constantly evolve
49. C - CompTIA Security+ or Blue Team Level 1
50. B - Curiosity and critical thinking

## Next Steps

Upon successful completion (85% or higher):
- You will unlock the final course completion module
- You'll be eligible for the course completion certificate
- You can proceed to Module 10.4: Course Summary & Next Steps

If you don't pass:
- Review the modules covering questions you missed
- Take advantage of the 2 additional attempts
- Use the course materials and hands-on exercises to reinforce your knowledge

Good luck! This exam validates your readiness for an entry-level SOC analyst position.
    `,
    keyTakeaways: [
      "SOC operations require knowledge across multiple domains including tools, processes, and threats",
      "Log analysis and SIEM skills are fundamental for detection and investigation",
      "Incident response provides structure for handling security events",
      "Continuous learning is essential in the ever-evolving cybersecurity field"
    ]
  }
];
