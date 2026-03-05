import { LessonContent } from "../../lessonContent";

export const module5: LessonContent[] = [

      {
    id: "5.1",
    courseId: "soc-fundamentals",
    title: "Understanding Security Alerts",
    content: `
# Understanding Security Alerts

Security alerts are the lifeblood of SOC operations. Understanding their anatomy, sources, and significance is crucial for effective triage and response.

## What is a Security Alert?

A **security alert** is a notification generated when a detection rule identifies potentially malicious or suspicious activity. It's a signal that requires human analysis.

## Alert Anatomy

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY ALERT                              │
├─────────────────────────────────────────────────────────────────┤
│ ID: ALT-2024-001234                                              │
│ Time: 2024-01-15 10:30:00 UTC                                   │
│ Severity: HIGH                                                   │
├─────────────────────────────────────────────────────────────────┤
│ Rule: Suspicious PowerShell Execution                           │
│ MITRE: T1059.001 - PowerShell                                   │
├─────────────────────────────────────────────────────────────────┤
│ Source:                                                          │
│   Host: WKS-FIN01                                               │
│   IP: 192.168.10.101                                            │
│   User: jsmith                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Details:                                                         │
│   Command: powershell -enc SQBFAFgA...                          │
│   Parent: WINWORD.EXE                                           │
├─────────────────────────────────────────────────────────────────┤
│ Raw Event: [Expandable log data]                                │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Alert Sources

| Source Type | Examples | Alert Types |
|-------------|----------|-------------|
| **SIEM** | Splunk, Sentinel | Correlation rules |
| **EDR** | CrowdStrike, Defender | Endpoint threats |
| **NDR** | Darktrace, Vectra | Network anomalies |
| **Email Security** | Proofpoint, Mimecast | Phishing, malware |
| **Cloud Security** | AWS GuardDuty | Cloud threats |
| **WAF** | Cloudflare, Akamai | Web attacks |

## Severity Levels

### Critical
- Active ransomware
- Confirmed data breach
- C2 communication
- Privileged account compromise

### High
- Successful exploitation
- Malware execution
- Lateral movement detected
- Credential theft

### Medium
- Suspicious behavior
- Policy violations
- Reconnaissance activity
- Failed attacks

### Low
- Informational events
- Minor anomalies
- Configuration issues
- Compliance alerts

## Alert Context

### Essential Context for Triage:

**Asset Information:**
- Is this a critical system?
- What business function does it support?
- Who uses this system?
- What data does it contain?

**User Information:**
- Is this a privileged user?
- Normal behavior patterns?
- Current location/time zone?
- Recent activity?

**Historical Context:**
- Previous alerts on this asset?
- Known issues or false positives?
- Related ongoing incidents?

## Alert Fatigue

**The Problem:**
- Too many alerts = missed threats
- Average SOC sees 10,000+ alerts/day
- Only ~1-5% are true positives

**Contributing Factors:**
- Poor rule tuning
- Duplicate alerts
- Low-fidelity detections
- Lack of context

**Solutions:**
- Aggressive tuning
- Alert prioritization
- Automation for low-risk alerts
- Consolidation of related alerts
    `,
    keyTakeaways: [
      "Alerts contain severity, source, detection rule, and event details",
      "Severity levels range from Critical (active breach) to Low (informational)",
      "Context about assets and users is crucial for accurate triage",
      "Alert fatigue from too many false positives leads to missed threats",
      "Effective tuning and prioritization combat alert fatigue"
    ]
  },
  {
    id: "5.2",
    courseId: "soc-fundamentals",
    title: "The Triage Process",
    content: `
# The Triage Process

Triage is the process of quickly assessing alerts to determine their validity and priority. An efficient triage process is essential for managing alert volume effectively.

## Triage Goals

1. **Validate** - Is this alert legitimate?
2. **Prioritize** - How urgent is this?
3. **Enrich** - What context do we need?
4. **Decide** - Close, investigate, or escalate?

## The 5-Minute Triage Framework

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                   5-MINUTE TRIAGE                                │
├─────────────────────────────────────────────────────────────────┤
│ Minute 1: READ the alert                                        │
│           • What triggered it?                                  │
│           • What's the severity?                                │
│           • What's the source?                                  │
├─────────────────────────────────────────────────────────────────┤
│ Minute 2: CHECK quick wins                                      │
│           • Known false positive?                               │
│           • Scheduled activity?                                 │
│           • Duplicate ticket?                                   │
├─────────────────────────────────────────────────────────────────┤
│ Minute 3: ENRICH the data                                       │
│           • Lookup IOCs                                         │
│           • Check reputation                                    │
│           • Gather asset context                                │
├─────────────────────────────────────────────────────────────────┤
│ Minute 4: CORRELATE events                                      │
│           • Related alerts?                                     │
│           • Other affected systems?                             │
│           • Timeline of events?                                 │
├─────────────────────────────────────────────────────────────────┤
│ Minute 5: DECIDE and ACT                                        │
│           • False Positive → Document & Close                   │
│           • True Positive → Escalate & Document                 │
│           • Uncertain → Continue Investigation                  │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Step-by-Step Triage

### Step 1: Initial Assessment

**Questions to Answer:**
- What detection rule triggered this?
- What severity was assigned?
- When did this occur?
- What asset is affected?

**Quick Check:**
\`\`\`
□ Alert is recent (not stale)
□ Alert is not a duplicate
□ Source system is valid
□ Data appears complete
\`\`\`

### Step 2: Quick Wins Check

Before deep-diving, check for easy closures:

\`\`\`
□ Is this a known false positive pattern?
□ Is there planned maintenance/testing?
□ Is this an authorized security scan?
□ Is this expected business activity?
□ Is this a duplicate of an open ticket?
\`\`\`

**If YES to any:** Document and close with appropriate reason.

### Step 3: IOC Enrichment

Gather intelligence on indicators:

**For IP Addresses:**
- Reputation (VirusTotal, AbuseIPDB)
- Geolocation
- Owner (WHOIS)
- Previous activity in environment

**For Domains:**
- Registration date
- Category
- Associated IPs
- DNS history

**For File Hashes:**
- Antivirus detection rate
- Sandbox results
- First seen date
- Associated campaigns

### Step 4: Context Gathering

**Asset Context:**
- What type of system?
- Business criticality?
- Normal activity patterns?
- Recent changes?

**User Context:**
- Role and department?
- Normal working hours?
- Current location?
- Account privileges?

### Step 5: Decision and Action

**Decision Matrix:**

| Finding | Action |
|---------|--------|
| Confirmed False Positive | Document pattern, close, consider tuning |
| Likely False Positive | Document reasoning, close |
| Uncertain | Continue investigation or escalate |
| Likely True Positive | Escalate immediately, begin documentation |
| Confirmed True Positive | Escalate immediately, initiate response |

## Triage Documentation

Always document your triage:

\`\`\`markdown
## Triage Summary
- Alert ID: ALT-2024-001234
- Triage Time: 2024-01-15 10:35:00
- Analyst: jdoe

## Findings
[What you observed]

## Investigation Steps
1. Checked IOC reputation - clean
2. Reviewed user activity - normal pattern
3. Verified scheduled maintenance window

## Conclusion
FALSE POSITIVE - Scheduled vulnerability scan

## Recommendation
Add scanner IPs to allowlist for this rule
\`\`\`
    `,
    keyTakeaways: [
      "Use the 5-minute triage framework: Read, Check, Enrich, Correlate, Decide",
      "Always check for quick wins before deep investigation",
      "Enrich IOCs with threat intelligence and reputation data",
      "Gather context about affected assets and users",
      "Document every triage decision with reasoning"
    ]
  },
  {
    id: "5.3",
    courseId: "soc-fundamentals",
    title: "True Positive vs False Positive",
    content: `
# True Positive vs False Positive

Distinguishing between real threats and false alarms is the core skill of alert triage. This lesson covers techniques to make accurate determinations.

## Classification Definitions

| Classification | Definition |
|----------------|------------|
| **True Positive (TP)** | Alert correctly identifies malicious activity |
| **False Positive (FP)** | Alert incorrectly flags benign activity |
| **True Negative (TN)** | No alert for benign activity (correct) |
| **False Negative (FN)** | No alert for malicious activity (missed threat) |

## The Decision Challenge

\`\`\`
                    ACTUAL STATE
                  Malicious    Benign
              ┌─────────────┬─────────────┐
    Alert     │    TRUE     │    FALSE    │
   Triggered  │  POSITIVE   │  POSITIVE   │
              ├─────────────┼─────────────┤
    No Alert  │    FALSE    │    TRUE     │
              │  NEGATIVE   │  NEGATIVE   │
              └─────────────┴─────────────┘
\`\`\`

## True Positive Indicators

Signs that an alert is likely a real threat:

### Strong TP Indicators

**Technical Evidence:**
- Known malicious IOCs (confirmed by multiple sources)
- Behavior matches known attack patterns
- Multiple correlated alerts
- Unusual activity for the asset/user
- Connections to known bad infrastructure

**Contextual Evidence:**
- Activity outside normal hours
- Unusual geographic location
- Privileged actions by non-privileged user
- No business justification
- Attempts to evade detection

### Example True Positive

\`\`\`
Alert: PowerShell Encoded Command
Host: WKS-ACCT01
User: jsmith
Time: 03:00 AM (user normally works 9-5)
Parent Process: WINWORD.EXE
Destination: IP flagged in 3 threat feeds

Analysis:
✓ Unusual time for this user
✓ Word spawning PowerShell is suspicious
✓ Encoded command (evasion)
✓ Connection to known malicious IP

Verdict: TRUE POSITIVE
\`\`\`

## False Positive Indicators

Signs that an alert is likely benign:

### Common FP Scenarios

**Legitimate Tools:**
- Security scanners
- IT management tools
- Developer activity
- Backup software

**Business Activity:**
- Scheduled tasks
- Approved testing
- Normal user behavior
- Expected integrations

**Rule Issues:**
- Overly broad detection logic
- Missing exclusions
- Threshold too low
- Outdated signatures

### Example False Positive

\`\`\`
Alert: Port Scan Detected
Source: 192.168.100.50
Target: Multiple internal hosts
Ports: 22, 80, 443, 3389

Analysis:
✓ Source is known vulnerability scanner
✓ Scan matches scheduled assessment window
✓ Security team confirmed authorized activity
✓ Same pattern every Tuesday

Verdict: FALSE POSITIVE
Recommendation: Add scanner to allowlist
\`\`\`

## Investigation Techniques

### 1. IOC Verification

\`\`\`
Check IP/Domain/Hash against:
├── VirusTotal
├── AbuseIPDB
├── URLhaus
├── AlienVault OTX
├── Internal threat intel
└── Historical data

Scoring:
• Flagged by multiple sources = Higher confidence malicious
• Clean everywhere = Likely benign
• Mixed results = Needs more investigation
\`\`\`

### 2. Behavioral Analysis

Compare to baseline:
- Is this normal for this user?
- Is this normal for this system?
- Is this normal for this time?
- Is this normal for this network?

### 3. Process Chain Analysis

Examine parent-child relationships:

**Suspicious Chain:**
\`\`\`
outlook.exe → powershell.exe → cmd.exe → whoami.exe
(Email client spawning scripting interpreter = BAD)
\`\`\`

**Normal Chain:**
\`\`\`
explorer.exe → powershell.exe (user opened)
services.exe → svchost.exe (system process)
\`\`\`

### 4. Timeline Correlation

Look for related events:
- What happened before?
- What happened after?
- Are there similar events on other systems?

## When You're Unsure

If you can't determine TP vs FP:

1. **Document your analysis** - What you checked, what you found
2. **Escalate to L2** - Don't guess on high-severity alerts
3. **Err on the side of caution** - Better to escalate than miss
4. **Request additional context** - Contact asset owner if needed
5. **Set follow-up reminder** - Monitor for additional activity
    `,
    keyTakeaways: [
      "True positives show malicious IOCs, unusual behavior, and attack patterns",
      "False positives often involve security tools, scheduled tasks, or overly broad rules",
      "Use multiple verification sources for IOC analysis",
      "Analyze process chains and behavioral baselines",
      "When uncertain, document thoroughly and escalate"
    ]
  },
  {
    id: "5.4",
    courseId: "soc-fundamentals",
    title: "Enrichment & Context Gathering",
    content: `
# Enrichment & Context Gathering

Enrichment adds valuable context to alerts, transforming raw data into actionable intelligence. This lesson covers the tools and techniques for effective enrichment.

## What is Enrichment?

**Enrichment** is the process of adding context and intelligence to security data to aid investigation and decision-making.

\`\`\`
Raw Alert:                    Enriched Alert:
IP: 203.0.113.50      →      IP: 203.0.113.50
                              • Location: Russia
                              • Reputation: Malicious (95%)
                              • Associated: Cobalt Strike C2
                              • First seen: 2024-01-10
                              • Our exposure: 3 connections
\`\`\`

## Types of Enrichment

### 1. Threat Intelligence

**IOC Reputation:**
- IP address reputation
- Domain categorization
- File hash detection
- URL analysis

**Contextual Intel:**
- Associated malware families
- Threat actor attribution
- Campaign information
- TTPs used

### 2. Asset Context

**System Information:**
- Hostname and IP
- Operating system
- Installed software
- Business function
- Owner/custodian

**Criticality:**
- Business importance
- Data sensitivity
- Internet exposure
- Compliance scope

### 3. User Context

**Identity Information:**
- Full name and title
- Department
- Manager
- Account type

**Behavioral Baseline:**
- Normal working hours
- Typical locations
- Common activities
- Privilege level

### 4. Historical Context

**Previous Activity:**
- Past alerts on same asset
- Past alerts for same user
- Similar patterns in environment
- Known false positive patterns

## Enrichment Tools

### Free OSINT Tools

| Tool | Purpose | URL |
|------|---------|-----|
| VirusTotal | File/IP/URL analysis | virustotal.com |
| AbuseIPDB | IP reputation | abuseipdb.com |
| Shodan | Internet device search | shodan.io |
| URLhaus | Malicious URL database | urlhaus.abuse.ch |
| MalwareBazaar | Malware samples | bazaar.abuse.ch |
| AlienVault OTX | Threat intel sharing | otx.alienvault.com |

### Commercial Platforms

- Recorded Future
- ThreatConnect
- Anomali
- Mandiant Advantage

### Internal Sources

\`\`\`
Asset Database (CMDB)
├── System inventory
├── Business owners
├── Criticality ratings
└── Network location

Identity System (AD/IAM)
├── User attributes
├── Group memberships
├── Account status
└── Privilege level

SIEM Historical Data
├── Previous alerts
├── User activity logs
└── Connection history
\`\`\`

## Enrichment Workflow

### Step 1: Extract IOCs

From the alert, identify:
\`\`\`
□ IP addresses (source and destination)
□ Domain names
□ File hashes (MD5, SHA1, SHA256)
□ URLs
□ Email addresses
□ File names
\`\`\`

### Step 2: Query Reputation

For each IOC:
\`\`\`
1. Check VirusTotal
   - Detection ratio
   - Behavioral analysis
   - Community comments

2. Check AbuseIPDB (for IPs)
   - Abuse reports
   - Categories
   - Confidence score

3. Check internal TIP
   - Previous sightings
   - Associated incidents
\`\`\`

### Step 3: Gather Asset Context

\`\`\`
Query CMDB/Asset Database:
├── What type of system?
├── What does it do?
├── Who owns it?
├── How critical is it?
└── What network zone?
\`\`\`

### Step 4: Gather User Context

\`\`\`
Query Identity System:
├── Who is this user?
├── What's their role?
├── What access do they have?
├── Is this normal behavior?
└── Are they currently active?
\`\`\`

### Step 5: Check Historical Data

\`\`\`
Query SIEM:
├── Previous alerts for this asset?
├── Previous alerts for this user?
├── Previous connections to this destination?
├── Similar activity across environment?
└── Known false positive pattern?
\`\`\`

## Automation Opportunities

### Auto-Enrichment

Many SOCs automate enrichment:

\`\`\`yaml
on_alert:
  - extract_iocs
  - lookup_virustotal(iocs.ips, iocs.hashes, iocs.domains)
  - lookup_abuseipdb(iocs.ips)
  - query_cmdb(alert.host)
  - query_identity(alert.user)
  - attach_results_to_alert
\`\`\`

### Benefits of Automation:
- Faster triage
- Consistent enrichment
- Reduced analyst workload
- Better decision support
    `,
    keyTakeaways: [
      "Enrichment adds threat intel, asset, user, and historical context to alerts",
      "Use free OSINT tools like VirusTotal, AbuseIPDB, and Shodan",
      "Query internal systems (CMDB, IAM) for asset and user context",
      "Check historical data for previous alerts and known patterns",
      "Automate enrichment to speed up triage and ensure consistency"
    ]
  },
  {
    id: "5.5",
    courseId: "soc-fundamentals",
    title: "Documentation & Escalation",
    content: `
# Documentation & Escalation

Proper documentation and timely escalation are critical for effective incident response and organizational learning. This lesson covers best practices for both.

## Why Documentation Matters

**For the Current Incident:**
- Enables continuity across shifts
- Supports escalation to L2/L3
- Provides evidence for response

**For the Organization:**
- Enables pattern recognition
- Supports metrics and reporting
- Facilitates post-incident review
- Meets compliance requirements

## Documentation Standards

### Ticket/Alert Documentation

Every ticket should contain:

\`\`\`markdown
## Alert Information
- Alert ID: [ID]
- Detection Rule: [Rule Name]
- Severity: [Level]
- Time Detected: [Timestamp]

## Affected Assets
- Hostname: [Name]
- IP Address: [IP]
- User: [Username]
- Department: [Dept]

## Investigation Summary
[Brief description of what was found]

## Investigation Steps
1. [Step taken and result]
2. [Step taken and result]
3. [Step taken and result]

## IOCs Identified
- [Type]: [Value] - [Status]

## Conclusion
[True Positive / False Positive / Needs Escalation]

## Actions Taken
- [Action 1]
- [Action 2]

## Recommendations
[Future improvements or follow-up needed]

## Analyst
- Name: [Your name]
- Time: [Completion time]
\`\`\`

### Documentation Best Practices

**Be Specific:**
\`\`\`
❌ "Checked the logs, looked suspicious"
✓ "Reviewed Windows Security logs, found 47 failed logins 
   (Event ID 4625) from IP 192.168.1.100 between 14:00-14:15"
\`\`\`

**Include Evidence:**
\`\`\`
❌ "User ran a bad command"
✓ "Process: powershell.exe
   Command: IEX (New-Object Net.WebClient).DownloadString('http://...')
   Parent: WINWORD.EXE
   Time: 2024-01-15 14:30:00"
\`\`\`

**Be Objective:**
\`\`\`
❌ "This is definitely malware"
✓ "Hash matches known Emotet sample per VirusTotal (58/71 detections)"
\`\`\`

## Escalation Guidelines

### When to Escalate Immediately

**Critical Situations:**
- Active ransomware
- Confirmed data exfiltration
- Compromised privileged account
- Business-critical system affected
- C2 communication detected

### When to Escalate After Triage

**High-Priority Situations:**
- Confirmed malware requiring containment
- Complex investigation beyond L1 scope
- Multiple systems affected
- Insider threat indicators
- Unknown or novel attack

### Escalation Checklist

Before escalating:

\`\`\`
□ Document all findings so far
□ Preserve relevant evidence (screenshots, logs)
□ List affected systems and users
□ Note any containment actions taken
□ Provide timeline of events
□ Include all IOCs discovered
□ State your assessment and confidence level
\`\`\`

### Escalation Template

\`\`\`markdown
## ESCALATION - [Severity] - [Brief Title]

### Summary
[2-3 sentence description of the situation]

### Why Escalating
[Reason this needs L2/L3 attention]

### Timeline
| Time | Event |
|------|-------|
| 14:00 | Initial alert triggered |
| 14:05 | Began triage |
| 14:15 | Found additional indicators |

### Affected Assets
- [List all affected systems/users]

### IOCs
- IP: 192.168.1.100 - Flagged malicious
- Hash: abc123... - Known Emotet

### Investigation So Far
1. [What you checked]
2. [What you found]
3. [What you couldn't determine]

### Recommended Next Steps
- [Suggested actions for L2]

### Analyst
[Your name] | [Time] | [Contact]
\`\`\`

## Escalation Paths

\`\`\`
                    ┌─────────────────┐
                    │  Critical/      │
                    │  Active Breach  │
                    └────────┬────────┘
                             │
                             ↓
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  L1 Analyst │ → │  L2 Analyst     │ → │  L3 / IR Lead   │
└─────────────┘    └─────────────────┘    └─────────────────┘
       │                    │                      │
       ↓                    ↓                      ↓
  Standard           Deep                    Major
  Triage           Investigation            Incident

                             │
                             ↓
                    ┌─────────────────┐
                    │  SOC Manager    │
                    │  (Major Events) │
                    └─────────────────┘
\`\`\`

## Communication During Escalation

**What L2 Needs to Know:**
- What triggered your investigation
- What you found (with evidence)
- What you couldn't determine
- Current status of affected assets
- Any time-sensitive factors

**How to Communicate:**
- Use designated escalation channels
- Be concise but complete
- Provide ticket/case reference
- Remain available for questions
    `,
    keyTakeaways: [
      "Document every investigation with specific details and evidence",
      "Use structured templates for consistent documentation",
      "Escalate immediately for active breaches and critical situations",
      "Complete the escalation checklist before handing off",
      "Provide clear context so L2 can continue without re-investigating"
    ],
    practicalExercise: {
      title: "Create Escalation Documentation",
      description: "Practice documenting an alert and preparing an escalation.",
      steps: [
        "Review the provided alert scenario",
        "Document your triage steps and findings",
        "Determine if escalation is needed",
        "Complete an escalation template",
        "Identify any missing information for the handoff"
      ]
    }
  },
  {
    id: "5.5",
    courseId: "soc-fundamentals",
    title: "Alert Triage & Analysis Quiz",
    content: `
# Alert Triage & Analysis Quiz

Test your systematic approach to alert investigation and false positive identification.

## Quiz Overview

This quiz covers the alert triage concepts from Module 5:
- Systematic alert triage process
- False positive identification
- Evidence collection and documentation
- Escalation procedures and timing
- Risk-based prioritization

## Instructions

1. **Duration**: 25 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 70% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Alert triage methodology
- False positive indicators
- Evidence collection techniques
- Escalation criteria and procedures
- Risk assessment frameworks
- Documentation requirements

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will cover:
- Alert triage processes
- False positive detection
- Evidence gathering
- Escalation decision-making
- Risk prioritization

Good luck! Effective alert triage is a critical SOC analyst skill.
    `,
    keyTakeaways: [
      "Systematic triage ensures consistent and thorough alert investigation",
      "False positive identification prevents alert fatigue and resource waste",
      "Proper evidence collection is essential for incident investigation",
      "Timely escalation prevents incident escalation and damage",
      "Risk-based prioritization focuses resources on critical threats"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review alert triage concepts before taking the quiz.",
      steps: [
        "Study the systematic triage process",
        "Learn false positive indicators",
        "Review evidence collection procedures",
        "Understand escalation criteria",
        "Take the quiz when ready"
      ]
    }
  }
];
