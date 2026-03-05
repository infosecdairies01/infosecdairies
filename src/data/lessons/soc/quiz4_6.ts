import { LessonContent } from "../../lessonContent";

// Quiz 4.6: Modules 3-4 Assessment
export const quiz4_6: LessonContent[] = [
  {
    id: "4.6",
    courseId: "soc-fundamentals",
    title: "Quiz: Log Analysis & SIEM Operations",
    content: `
# Quiz: Modules 3-4 Assessment

This quiz tests your understanding of Log Analysis fundamentals and SIEM operations.

## Quiz Instructions

- **Duration:** 30 minutes
- **Questions:** 15 multiple choice questions
- **Passing Score:** 80% (12 out of 15 correct)
- **Attempts:** Unlimited (but must pass to proceed)

## Module 3: Log Analysis Fundamentals (8 Questions)

### Question 1
Which Windows Event ID indicates a successful logon?

A) 4624
B) 4625
C) 4648
D) 4672

### Question 2
What does Event ID 4625 indicate in Windows logs?

A) Account lockout
B) Failed logon attempt
C) Successful logon
D) Password change

### Question 3
Which file contains authentication logs on most Linux systems?

A) /var/log/messages
B) /var/log/auth.log or /var/log/secure
C) /var/log/syslog
D) /var/log/kern.log

### Question 4
What is the standard port for syslog?

A) 514
B) 443
C) 80
D) 22

### Question 5
Which log format uses key-value pairs separated by equals signs?

A) CEF (Common Event Format)
B) LEEF (Log Event Extended Format)
C) JSON
D) Syslog

### Question 6
What does "log rotation" refer to?

A) Manually reviewing logs
B) Archiving old logs and creating new log files
C) Encrypting log files
D) Sending logs to multiple destinations

### Question 7
Which Windows log tracks process creation and command line arguments?

A) Application Log
B) System Log
C) Security Log
D) Setup Log

### Question 8
What is a common indicator of SSH brute force attacks in Linux logs?

A) Many "Accepted publickey" entries
B) Many "Failed password" entries from same IP
C) No SSH entries at all
D) Only root logons

## Module 4: SIEM Fundamentals (7 Questions)

### Question 9
What does SIEM stand for?

A) Security Incident and Event Management
B) System Information and Event Monitoring
C) Security Information and Event Management
D) Software Investigation and Evidence Management

### Question 10
What is the primary benefit of a SIEM?

A) Replacing all security tools
B) Aggregating and correlating logs from multiple sources
C) Writing security policies
D) Physical security monitoring

### Question 11
What is a "correlation rule" in a SIEM?

A) A rule that automatically deletes logs
B) Logic that identifies patterns across multiple events
C) A password policy
D) A network configuration rule

### Question 12
Which SIEM query language uses pipes (|) to chain commands?

A) SPL (Splunk Processing Language)
B) KQL (Kusto Query Language)
C) SQL (Structured Query Language)
D) NoSQL

### Question 13
What is "normalization" in SIEM context?

A) Making all logs look the same
B) Converting different log formats to a standard schema
C) Deleting duplicate logs
D) Encrypting all logs

### Question 14
What does a SIEM dashboard typically display?

A) Only raw log data
B) Key metrics, charts, and recent alerts
C) Employee personal information
D) Software license information

### Question 15
What is "alert fatigue"?

A) When analysts stop paying attention to alerts due to volume
B) When alerts stop working
C) When alerts are too quiet
D) When alerts are only sent to managers

## Answer Key

1. A - 4624
2. B - Failed logon attempt
3. B - /var/log/auth.log or /var/log/secure
4. A - 514
5. B - LEEF (Log Event Extended Format)
6. B - Archiving old logs and creating new log files
7. C - Security Log
8. B - Many "Failed password" entries from same IP
9. C - Security Information and Event Management
10. B - Aggregating and correlating logs from multiple sources
11. B - Logic that identifies patterns across multiple events
12. A - SPL (Splunk Processing Language)
13. B - Converting different log formats to a standard schema
14. B - Key metrics, charts, and recent alerts
15. A - When analysts stop paying attention to alerts due to volume

## Preparation for Next Module

Before proceeding to Module 5, ensure you understand:
- Windows and Linux log formats and key events
- How to identify suspicious patterns in logs
- SIEM architecture and capabilities
- Basic SIEM query construction

You must score 80% or higher to unlock Module 5: Alert Triage & Analysis.
    `,
    keyTakeaways: [
      "Windows Event IDs and Linux auth logs provide visibility into security events",
      "SIEMs aggregate and correlate logs to detect threats",
      "Normalization enables consistent analysis across different log sources",
      "Query languages like SPL help extract insights from log data"
    ]
  }
];
