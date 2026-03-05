import { LessonContent } from "../../lessonContent";

export const module7: LessonContent[] = [
      {
    id: "7.1",
    courseId: "soc-fundamentals",
    title: "Incident Response Lifecycle",
    content: `
# The Incident Response Lifecycle

**Incident Response (IR)** is the organized approach to addressing and managing security breaches. Understanding the IR lifecycle is fundamental for every SOC analyst.

## What is an Incident?

A **security incident** is an event that:
- Violates security policies
- Threatens the confidentiality, integrity, or availability of systems
- May require a coordinated response

**Examples:**
- Malware infection on a workstation
- Successful phishing attack
- Data exfiltration detected
- Ransomware encryption
- Unauthorized access to sensitive data

## The NIST Incident Response Framework

The NIST framework defines four primary phases:

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    INCIDENT RESPONSE LIFECYCLE                   │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│              │              │              │                   │
│  Preparation │  Detection & │ Containment, │ Post-Incident     │
│              │  Analysis    │ Eradication, │ Activity          │
│              │              │ & Recovery   │                   │
│              │              │              │                   │
└──────────────┴──────────────┴──────────────┴───────────────────┘
       │              ↓              ↓                │
       │         INCIDENT        INCIDENT            │
       │         DETECTED        HANDLED             │
       └──────────────────────────────────────────────┘
                      CONTINUOUS IMPROVEMENT
\`\`\`

### Phase 1: Preparation

**Goal:** Build capability to respond effectively

**Activities:**
- Develop incident response plan
- Build and train the IR team
- Deploy detection and monitoring tools
- Create communication plans
- Conduct tabletop exercises

**SOC Analyst Role:**
- Know your tools and procedures
- Understand escalation paths
- Practice with simulated scenarios

### Phase 2: Detection & Analysis

**Goal:** Identify and understand the incident

**Activities:**
- Monitor alerts and reports
- Correlate events across sources
- Determine scope and impact
- Document initial findings
- Classify the incident

**Key Questions:**
\`\`\`
□ What happened?
□ When did it start?
□ What systems are affected?
□ What data is at risk?
□ How did the attacker get in?
□ Is the attack ongoing?
\`\`\`

### Phase 3: Containment, Eradication, & Recovery

**Containment Strategies:**

| Strategy | Description | Example |
|----------|-------------|---------|
| Short-term | Immediate action to stop spread | Isolate infected host |
| Long-term | Temporary fix while preparing cleanup | Block malicious IP at firewall |

**Eradication:**
- Remove malware and artifacts
- Patch vulnerabilities
- Reset compromised credentials
- Clean or reimage systems

**Recovery:**
- Restore from clean backups
- Validate system integrity
- Return to normal operations
- Monitor for reinfection

### Phase 4: Post-Incident Activity

**Goal:** Learn and improve

**Activities:**
- Conduct lessons learned meeting
- Update detection rules
- Improve procedures
- Document the incident fully
- Share intelligence (as appropriate)

**Lessons Learned Questions:**
1. What happened and when?
2. How well did we perform?
3. What could we do better?
4. What improvements are needed?
5. How do we prevent recurrence?

## IR Playbooks

Playbooks standardize response to common incident types:

\`\`\`
PHISHING PLAYBOOK

1. IDENTIFY
   □ Analyze reported email
   □ Extract IOCs (sender, links, attachments)
   □ Check if clicked/opened

2. CONTAIN
   □ Block sender/domain
   □ Remove email from mailboxes
   □ If clicked: isolate endpoint

3. ERADICATE
   □ Scan affected endpoints
   □ Remove any downloaded payloads
   □ Reset credentials if needed

4. RECOVER
   □ Clear user to resume work
   □ Confirm no persistence

5. LESSONS LEARNED
   □ Update email filters
   □ Conduct user awareness
   □ Document in incident log
\`\`\`

## SOC Analyst's IR Responsibilities

As an L1 analyst, you primarily handle:
- **Detection** - Identifying potential incidents
- **Initial Analysis** - First-level triage
- **Documentation** - Recording findings
- **Escalation** - Passing to IR team when needed
- **Support** - Assisting during active response
    `,
    keyTakeaways: [
      "The NIST IR lifecycle has four phases: Preparation, Detection & Analysis, Containment/Eradication/Recovery, and Post-Incident",
      "Preparation before incidents occur is crucial for effective response",
      "Containment prevents spread while you work on eradication",
      "Post-incident lessons learned drive continuous improvement",
      "Playbooks standardize response to common incident types"
    ],
    additionalResources: [
      { title: "NIST SP 800-61", type: "documentation", url: "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf" },
      { title: "SANS Incident Handler's Handbook", type: "article", url: "https://www.sans.org" }
    ]
  },
  {
    id: "7.2",
    courseId: "soc-fundamentals",
    title: "Incident Classification & Severity",
    content: `
# Incident Classification & Severity

Properly classifying incidents ensures appropriate resource allocation and response speed. Not every security event deserves the same level of attention.

## Incident vs. Event vs. Alert

Understanding the hierarchy:

\`\`\`
     Events (Millions daily)
           │
           ↓ [Detection Rules]
           │
        Alerts (Thousands daily)
           │
           ↓ [Analyst Triage]
           │
       Incidents (Few per day/week)
\`\`\`

**Event:** Any observable occurrence
**Alert:** Event that triggers a detection rule
**Incident:** Validated security breach requiring response

## Incident Classification Categories

### By Attack Vector

| Category | Description | Examples |
|----------|-------------|----------|
| Malware | Malicious software infection | Ransomware, trojan, worm |
| Phishing | Deceptive communications | Email phishing, vishing |
| Unauthorized Access | Illegitimate system access | Brute force, credential stuffing |
| Data Breach | Unauthorized data exposure | Exfiltration, data leak |
| DoS/DDoS | Availability attacks | Service disruption |
| Insider Threat | Malicious employee activity | Data theft, sabotage |
| Web Attack | Application-layer attacks | SQLi, XSS, RCE |

### By Impact Type

- **Confidentiality** - Data exposure or theft
- **Integrity** - Data modification or corruption
- **Availability** - Service or system disruption

## Severity Levels

Most organizations use 4-5 severity levels:

### Severity Level Framework

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│ SEVERITY 1 - CRITICAL                                        │
├──────────────────────────────────────────────────────────────┤
│ • Active ransomware encryption                               │
│ • Confirmed data breach of PII/PHI                           │
│ • Production systems completely down                         │
│ • Nation-state attack confirmed                              │
│                                                              │
│ Response: Immediate, all-hands, executive notification       │
│ SLA: 15 minutes initial response                             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SEVERITY 2 - HIGH                                            │
├──────────────────────────────────────────────────────────────┤
│ • Active malware on multiple endpoints                       │
│ • Compromised admin credentials                              │
│ • Successful phishing with credential theft                  │
│ • C2 communication detected                                  │
│                                                              │
│ Response: Urgent, IR team engaged                            │
│ SLA: 1 hour initial response                                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SEVERITY 3 - MEDIUM                                          │
├──────────────────────────────────────────────────────────────┤
│ • Malware contained on single endpoint                       │
│ • Phishing email clicked, no credential entry                │
│ • Policy violations detected                                 │
│ • Suspicious but unconfirmed activity                        │
│                                                              │
│ Response: Same-day investigation                             │
│ SLA: 4 hours initial response                                │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SEVERITY 4 - LOW                                             │
├──────────────────────────────────────────────────────────────┤
│ • Blocked malware attempt                                    │
│ • Reported phishing (not clicked)                            │
│ • Minor policy violation                                     │
│ • False positive after investigation                         │
│                                                              │
│ Response: Next business day                                  │
│ SLA: 24 hours initial response                               │
└──────────────────────────────────────────────────────────────┘
\`\`\`

## Factors Affecting Severity

### Asset Criticality

\`\`\`
Question: What system is affected?

├── Domain Controller     → Increase severity
├── Database server       → Increase severity
├── Executive workstation → Increase severity
├── Standard workstation  → Normal severity
└── Test/Dev server       → Decrease severity
\`\`\`

### Data Sensitivity

\`\`\`
Question: What data is at risk?

├── PII/PHI/PCI data     → Increase severity
├── Trade secrets        → Increase severity
├── Financial data       → Increase severity
├── Internal documents   → Normal severity
└── Public information   → Decrease severity
\`\`\`

### Scope and Spread

\`\`\`
Question: How widespread?

├── Multiple departments → Increase severity
├── Multiple systems     → Increase severity
├── Single system        → Normal severity
└── Contained quickly    → Decrease severity
\`\`\`

## Classification Decision Tree

\`\`\`
                    Security Event Detected
                            │
                            ↓
              ┌─────────────────────────┐
              │ Is this a real threat? │
              └───────────┬─────────────┘
                    │           │
                   Yes          No → Document & Close
                    │
                    ↓
              ┌─────────────────────────┐
              │ What category of attack?│
              └───────────┬─────────────┘
                          │
                          ↓
              ┌─────────────────────────┐
              │ What assets affected?   │
              └───────────┬─────────────┘
                          │
                          ↓
              ┌─────────────────────────┐
              │ What is the impact?     │
              └───────────┬─────────────┘
                          │
                          ↓
                  Assign Severity
                          │
                          ↓
                Follow Response SLA
\`\`\`
    `,
    keyTakeaways: [
      "Distinguish between events, alerts, and confirmed incidents",
      "Classify incidents by attack type and impact (CIA triad)",
      "Severity levels determine response urgency and resource allocation",
      "Asset criticality and data sensitivity affect severity assignment",
      "Use a consistent decision tree for objective classification"
    ],
    practicalExercise: {
      title: "Incident Classification Exercise",
      description: "Practice classifying sample incidents by type and severity.",
      steps: [
        "Review 5 sample incident scenarios",
        "Classify each by attack category",
        "Assign severity level (1-4)",
        "Document your reasoning for each classification",
        "Compare with the provided answer key"
      ]
    }
  },
  {
    id: "7.3",
    courseId: "soc-fundamentals",
    title: "Initial Containment Actions",
    content: `
# Initial Containment Actions

**Containment** is the critical phase where you stop the bleeding. Quick, decisive containment can mean the difference between a minor incident and a major breach.

## Containment Philosophy

> "Contain first, investigate second - but don't destroy evidence"

**Key Principles:**
1. Stop the spread of the attack
2. Preserve evidence for investigation
3. Minimize business disruption
4. Document all actions taken

## Common Containment Strategies

### Network Isolation

**Full Network Isolation:**
\`\`\`
Action: Disconnect host from network
When: Active ransomware, confirmed C2, lateral movement

Methods:
• Disable switch port
• Block at firewall
• EDR network isolation feature
• Disable network adapter (if physical access)
\`\`\`

**Selective Blocking:**
\`\`\`
Action: Block specific traffic
When: Known malicious IPs/domains, C2 beaconing

Methods:
• Firewall rules
• DNS sinkhole
• Proxy blocks
• WAF rules
\`\`\`

### Account Actions

\`\`\`
COMPROMISED ACCOUNT CONTAINMENT

1. Disable the account
   └─ AD: Disable in Users & Computers
   └─ Cloud: Suspend in admin console

2. Terminate active sessions
   └─ Force logout from all devices
   └─ Revoke OAuth tokens

3. Reset credentials
   └─ Password reset (force at next login)
   └─ Revoke/regenerate API keys

4. Review recent activity
   └─ Check login history
   └─ Review permission changes
\`\`\`

### Endpoint Containment

**EDR Containment:**
\`\`\`
Most EDR tools offer:
• Network isolation (blocks all except EDR traffic)
• Process termination
• File quarantine
• Remediation actions
\`\`\`

**Manual Containment:**
\`\`\`
If no EDR available:
• Power off (last resort - loses volatile data)
• Unplug network cable
• Login and disable network adapter
• Move to quarantine VLAN
\`\`\`

## Containment by Incident Type

### Malware Infection

\`\`\`
IMMEDIATE ACTIONS:
□ Isolate affected host(s) from network
□ Identify malware family if possible
□ Check for lateral movement indicators
□ Block C2 communications at firewall
□ Preserve memory for analysis (if possible)

DON'T:
✗ Immediately reboot/wipe (destroys evidence)
✗ Run antivirus before collecting artifacts
✗ Alert the attacker you've detected them
\`\`\`

### Phishing with Credential Compromise

\`\`\`
IMMEDIATE ACTIONS:
□ Reset user's password
□ Terminate all active sessions
□ Review account activity since compromise
□ Check for mail forwarding rules
□ Alert user and manager
□ Block sender domain/IP

ADDITIONAL STEPS:
□ Search for similar emails to other users
□ Check if MFA was bypassed
□ Review VPN/remote access logs
\`\`\`

### Ransomware

\`\`\`
CRITICAL - EVERY SECOND COUNTS!

□ IMMEDIATELY isolate affected systems
□ DO NOT power off (may trigger encryption)
□ Identify patient zero if possible
□ Block lateral movement paths
□ Disable network shares
□ Contact IR team/management ASAP

PRESERVE:
□ Ransom notes (file and screenshot)
□ Encrypted file samples
□ Running processes and memory
□ Network connections at time of detection
\`\`\`

### Unauthorized Access

\`\`\`
IMMEDIATE ACTIONS:
□ Lock out the suspicious account
□ Terminate active connections
□ Block source IP address
□ Review what was accessed
□ Check for new accounts created
□ Look for persistence mechanisms
\`\`\`

## Containment Decision Matrix

| Factor | Aggressive Containment | Conservative Containment |
|--------|------------------------|--------------------------|
| Impact | High/Critical severity | Low/Medium severity |
| Spread | Active lateral movement | Isolated to one system |
| Data | Sensitive data at risk | No sensitive data |
| Business | Non-critical system | Business-critical system |
| Evidence | Evidence preserved | More evidence needed |

## Documentation During Containment

**Record Everything:**
\`\`\`
Containment Log Template:

Timestamp: [YYYY-MM-DD HH:MM:SS UTC]
Action: [What you did]
Target: [System/Account affected]
Method: [How you did it]
Reason: [Why this action]
Result: [Outcome observed]
Analyst: [Your name]

Example:
Timestamp: 2024-01-15 14:32:15 UTC
Action: Network isolation via EDR
Target: WORKSTATION-042 (10.0.1.42)
Method: CrowdStrike network contain
Reason: Confirmed Cobalt Strike beacon
Result: Beaconing stopped, host isolated
Analyst: J. Smith
\`\`\`
    `,
    keyTakeaways: [
      "Containment stops the attack spread while preserving evidence",
      "Network isolation is often the fastest containment method",
      "Account compromise requires password reset and session termination",
      "Ransomware demands immediate isolation - every second counts",
      "Document every containment action with timestamps"
    ],
    practicalExercise: {
      title: "Containment Scenario Practice",
      description: "Work through containment decisions for different incident types.",
      steps: [
        "Review the phishing scenario and list containment steps",
        "Review the ransomware scenario and prioritize actions",
        "For each scenario, document what you would NOT do and why",
        "Create a containment log for one scenario",
        "Identify potential business impact of your containment choices"
      ]
    }
  },
  {
    id: "7.4",
    courseId: "soc-fundamentals",
    title: "Incident Documentation",
    content: `
# Incident Documentation

**Excellent documentation** is the backbone of effective incident response. Good notes enable continuity, legal defensibility, and organizational learning.

## Why Documentation Matters

- **Continuity** - Others can pick up where you left off
- **Legal/Compliance** - May be needed for legal proceedings
- **Metrics** - Enable measurement and improvement
- **Learning** - Support post-incident reviews
- **Communication** - Keep stakeholders informed

## The Incident Ticket

Every incident needs a ticket. Key fields:

\`\`\`
INCIDENT TICKET STRUCTURE

┌─────────────────────────────────────────────────────────────┐
│ TICKET HEADER                                               │
├─────────────────────────────────────────────────────────────┤
│ Ticket ID: INC-2024-0142                                    │
│ Title: Emotet Malware - Marketing Department                │
│ Severity: HIGH (2)                                          │
│ Status: Containment                                         │
│ Assigned: SOC Team                                          │
│ Created: 2024-01-15 14:22 UTC                               │
│ Last Updated: 2024-01-15 16:45 UTC                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INCIDENT DETAILS                                            │
├─────────────────────────────────────────────────────────────┤
│ Category: Malware                                           │
│ Subcategory: Emotet/Banking Trojan                          │
│ Attack Vector: Email Attachment (Word macro)                │
│ Affected Systems: MKTG-PC-012, MKTG-PC-017                  │
│ Affected Users: jsmith@company.com, mwilson@company.com     │
│ Data Impacted: TBD - under investigation                    │
│ Business Impact: Marketing team offline                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Timeline Documentation

Record every action with timestamps:

\`\`\`
INCIDENT TIMELINE

[2024-01-15 13:45 UTC] - Initial Alert
EDR alert: Suspicious PowerShell execution on MKTG-PC-012
Alert ID: CRW-4521, Severity: High

[2024-01-15 13:52 UTC] - Triage Initiated
Analyst J. Chen began investigation
Initial finding: PowerShell downloading payload from external URL

[2024-01-15 14:05 UTC] - Malware Identified
VirusTotal analysis: Emotet variant
Hash: abc123def456...
First seen: 2024-01-10

[2024-01-15 14:15 UTC] - Second System Identified
Review shows MKTG-PC-017 also compromised
Same malware, same timeframe

[2024-01-15 14:22 UTC] - Incident Declared
Escalated to Severity 2 Incident
IR Lead notified, ticket created

[2024-01-15 14:30 UTC] - Containment Initiated
Both systems isolated via EDR
Network connection blocked at firewall

[2024-01-15 15:00 UTC] - Email Analysis
Phishing email identified
Subject: "Invoice Q4-2024"
Sent to 23 users, 2 clicked
\`\`\`

## Evidence Collection Notes

Document what you collected and where:

\`\`\`
EVIDENCE LOG

┌────────┬──────────────────────────────────────────────────────┐
│ ID     │ E001                                                 │
├────────┼──────────────────────────────────────────────────────┤
│ Type   │ Memory Dump                                          │
│ Source │ MKTG-PC-012                                          │
│ Hash   │ SHA256: f4d2a9c8...                                  │
│ Time   │ 2024-01-15 14:35 UTC                                 │
│ Method │ FTK Imager                                           │
│ Chain  │ Collected by J. Chen, stored at \\forensics\\INC142   │
└────────┴──────────────────────────────────────────────────────┘

┌────────┬──────────────────────────────────────────────────────┐
│ ID     │ E002                                                 │
├────────┼──────────────────────────────────────────────────────┤
│ Type   │ Malicious Email                                      │
│ Source │ Exchange Server                                      │
│ Hash   │ SHA256: a8b7c6d5...                                  │
│ Time   │ 2024-01-15 15:12 UTC                                 │
│ Method │ Email export (EML format)                            │
│ Chain  │ Collected by SOC, stored at \\forensics\\INC142       │
└────────┴──────────────────────────────────────────────────────┘
\`\`\`

## Communication Templates

### Initial Notification

\`\`\`
SUBJECT: [Severity 2] Security Incident - Marketing Department

Status: ACTIVE
Ticket: INC-2024-0142

Summary:
Malware infection detected on two Marketing workstations. 
Initial analysis indicates Emotet banking trojan delivered via 
phishing email.

Current Actions:
• Affected systems isolated from network
• Investigation ongoing
• Email team blocking malicious sender

Impact:
• Two Marketing users offline
• No confirmed data loss at this time

Next Update: Within 2 hours
Contact: SOC Team - soc@company.com
\`\`\`

### Status Update

\`\`\`
SUBJECT: [UPDATE] INC-2024-0142 - Containment Complete

Status: ERADICATION IN PROGRESS
Last Update: 2 hours ago

Progress:
✓ All affected systems isolated (2 workstations)
✓ Malware identified and analyzed
✓ Phishing email removed from all mailboxes
✓ C2 domains blocked at firewall
→ Currently reimaging affected systems
→ User credential reset in progress

Remaining Work:
• Complete system reimaging (~2 hours)
• User awareness communication
• Update detection rules

Estimated Resolution: 4 hours

Next Update: Upon resolution or significant change
\`\`\`

## Best Practices

### The 5 W's + H

For every entry, capture:
- **Who** - Actor/analyst involved
- **What** - Action taken or observed
- **When** - Timestamp (UTC)
- **Where** - System/location
- **Why** - Reasoning for action
- **How** - Method/tools used

### Documentation Don'ts

\`\`\`
✗ Don't use vague language ("I saw something weird")
✗ Don't forget timestamps
✗ Don't editorialize or speculate without marking it
✗ Don't document passwords or sensitive data in clear text
✗ Don't wait until the end to document
\`\`\`
    `,
    keyTakeaways: [
      "Documentation enables continuity, legal defense, and learning",
      "Every incident needs a ticket with consistent fields",
      "Maintain detailed timelines with UTC timestamps",
      "Log all evidence with chain of custody information",
      "Use the 5 W's + H for comprehensive entries"
    ],
    practicalExercise: {
      title: "Incident Documentation Practice",
      description: "Create complete documentation for a sample incident.",
      steps: [
        "Fill out an incident ticket template",
        "Build a timeline with at least 10 entries",
        "Create an evidence log entry",
        "Draft an initial notification email",
        "Write a status update for stakeholders"
      ]
    }
  },
  {
    id: "7.6",
    courseId: "soc-fundamentals",
    title: "Hands-On: Phishing Incident Response",
    content: `
# Hands-On: Phishing Incident Response

Let's walk through a complete phishing incident from detection to resolution. This exercise simulates real SOC work.

## Scenario

\`\`\`
ALERT RECEIVED

Source: Email Security Gateway
Time: 2024-01-15 09:22:15 UTC
Alert: User clicked malicious URL in email
Details:
- User: sarah.jones@company.com
- Subject: "Urgent: Password Expiry Notice"
- Sender: it-support@c0mpany.com (note the zero)
- Link Clicked: https://c0mpany-auth.evil.site/reset
\`\`\`

## Phase 1: Detection & Initial Analysis

### Email Analysis

\`\`\`
FROM: it-support@c0mpany.com
TO: sarah.jones@company.com
DATE: 2024-01-15 09:15:22 UTC
SUBJECT: Urgent: Password Expiry Notice

--- BEGIN EMAIL BODY ---
Dear Employee,

Your password will expire in 24 hours. Click below to reset:

[Reset Password Now]
https://c0mpany-auth.evil.site/reset?id=a8b7c6...

IT Support Team

--- END EMAIL BODY ---
\`\`\`

**Red Flags Identified:**
\`\`\`
□ Sender domain uses "0" instead of "o" (c0mpany vs company)
□ Urgency tactics ("will expire in 24 hours")
□ Generic greeting ("Dear Employee")
□ External link disguised as internal
□ No SPF/DKIM authentication
\`\`\`

### User Contact

\`\`\`
PHONE CALL TO USER (9:35 AM)

Analyst: "Hi Sarah, this is the Security team. We noticed 
         you clicked a link in an email about password reset.
         Did you enter any credentials?"

Sarah: "Yes, it asked for my password and I typed it in.
        It said there was an error and to try again later."

Analyst: "Thank you for being honest. I'll need to secure 
         your account and ask you some questions. Please don't
         access any sensitive systems until we're done."
\`\`\`

**Critical Finding:** User entered credentials on phishing page!

## Phase 2: Containment

### Immediate Actions Taken

\`\`\`
[09:38 UTC] - Password Reset
Action: Reset Sarah's password in Active Directory
Result: Previous password invalidated

[09:40 UTC] - Session Termination
Action: Terminated all active sessions for sarah.jones
- O365 sessions cleared
- VPN sessions terminated
- SSO tokens revoked

[09:42 UTC] - Block Malicious Infrastructure
Action: Added to firewall blocklist
- Domain: c0mpany-auth.evil.site
- IP: 185.234.218.45

[09:45 UTC] - Email Removal
Action: Searched and removed email from all mailboxes
Result: Found in 47 mailboxes, removed from all
Clicked by: 3 users total
\`\`\`

### Scope Assessment

\`\`\`
AFFECTED USERS ANALYSIS

User 1: sarah.jones@company.com
- Clicked link: YES
- Entered credentials: YES
- Status: COMPROMISED → Reset complete

User 2: mike.wilson@company.com  
- Clicked link: YES
- Entered credentials: NO (closed page)
- Status: No action needed

User 3: lisa.chen@company.com
- Clicked link: YES
- Entered credentials: Unknown
- Status: INVESTIGATING → Calling now
\`\`\`

## Phase 3: Investigation

### Account Activity Review

\`\`\`
SARAH.JONES ACCOUNT ACTIVITY (Last 24 hours)

Normal Activity (Before 9:22 UTC):
- 08:00 - Logged into workstation
- 08:05 - Accessed O365, normal email use
- 08:30 - Joined Teams meeting

Suspicious Activity (After credential entry):
- 09:25 - Login from unusual IP (91.109.190.68) → ATTACKER
- 09:26 - Email forwarding rule created
- 09:27 - Accessed SharePoint finance folder
- 09:28 - Downloaded 3 Excel files

Post-Containment:
- 09:38 - Password changed (by SOC)
- 09:40 - Sessions terminated
- No further access attempts
\`\`\`

### Malicious Actions Detected

\`\`\`
1. EMAIL FORWARDING RULE
   Rule: "Auto-Forward"
   Condition: All emails
   Forward to: external@attacker.com
   Action: DELETED

2. FILE ACCESS
   Files accessed from attacker IP:
   - Q4-Financial-Report.xlsx
   - Budget-2024.xlsx
   - Employee-Salary-Data.xlsx
   
   Status: POTENTIAL DATA BREACH
   Escalation: Required - sensitive data accessed
\`\`\`

## Phase 4: Eradication & Recovery

### Cleanup Actions

\`\`\`
□ Malicious forwarding rule removed
□ Password reset completed
□ MFA enforced on account
□ User briefed on incident
□ Workstation scanned (clean)
\`\`\`

### Recovery

\`\`\`
□ User provided new temporary password
□ MFA enrollment completed
□ User returned to normal duties at 11:30 UTC
□ Monitoring period: 30 days
\`\`\`

## Phase 5: Post-Incident

### Incident Summary

\`\`\`
INCIDENT REPORT: INC-2024-0087

Duration: 9:22 - 11:30 UTC (2 hours, 8 minutes)
Severity: HIGH (2)
Category: Phishing → Credential Theft → Data Access

Impact:
- 1 user account compromised
- 3 financial files accessed by attacker
- Email forwarding rule created

Root Cause:
- Convincing phishing email bypassed email security
- User did not recognize typosquatted domain
- No MFA on affected account

Actions Taken:
- Credentials reset
- Sessions terminated  
- Malicious infrastructure blocked
- Attacker's email forward rule removed
- MFA enforced

Recommendations:
1. Enable MFA for all users (not just some)
2. Improve email filtering for typosquatting
3. Conduct phishing awareness training
4. Review accessed files for data classification
5. Consider data breach notification requirements
\`\`\`

### Lessons Learned

**What Went Well:**
- Fast detection from email gateway
- Quick containment actions
- Good user cooperation

**What Could Improve:**
- MFA should have been enabled already
- User training on recognizing phishing
- Faster escalation on data access

**Action Items:**
| Action | Owner | Due Date |
|--------|-------|----------|
| MFA rollout | IT | 2 weeks |
| Phishing training | HR/Sec | 1 week |
| Email filter tuning | Email Team | 3 days |
| Data breach assessment | Legal | 1 day |
    `,
    keyTakeaways: [
      "Phishing response requires quick credential reset and session termination",
      "Always check for mail forwarding rules set by attackers",
      "Document attacker activity timeline for scope assessment",
      "Data access by attackers may trigger breach notification requirements",
      "Post-incident improvements prevent similar attacks"
    ],
    practicalExercise: {
      title: "Complete Phishing IR Exercise",
      description: "Work through a phishing incident using the provided scenario.",
      steps: [
        "Analyze the phishing email and list all indicators",
        "Create a containment action checklist",
        "Document a timeline of the incident",
        "Draft a user notification message",
        "Write three recommendations for prevention"
      ]
    }
  },
  {
    id: "7.5",
    courseId: "soc-fundamentals",
    title: "Incident Response Procedures Quiz",
    content: `
# Incident Response Procedures Quiz

Test your knowledge of IR frameworks and response procedures.

## Quiz Overview

This quiz covers the incident response concepts from Module 7:
- Incident response lifecycle
- Containment strategies
- Evidence preservation
- Communication and reporting
- Post-incident activities

## Instructions

1. **Duration**: 30 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 75% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- NIST incident response framework
- Containment strategies and timing
- Evidence collection and preservation
- Communication protocols
- Post-incident analysis
- Legal and regulatory requirements

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will cover:
- IR lifecycle phases
- Containment procedures
- Evidence handling
- Communication strategies
- Post-incident activities

Good luck! Effective incident response minimizes damage and improves recovery.
    `,
    keyTakeaways: [
      "Preparation is the foundation of effective incident response",
      "Containment prevents further damage while preserving evidence",
      "Proper evidence preservation is crucial for investigation and prosecution",
      "Clear communication reduces confusion and coordinates response efforts",
      "Post-incident analysis drives improvement and prevention"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review incident response concepts before taking the quiz.",
      steps: [
        "Study the NIST incident response framework",
        "Review containment strategies",
        "Learn evidence preservation techniques",
        "Understand communication protocols",
        "Take the quiz when ready"
      ]
    }
  }
];
