import { LessonContent } from "../../lessonContent";

// Module 1: Introduction to Security Logs
export const module1: LessonContent[] = [
  {
    id: "1.1",
    courseId: "log-analysis",
    title: "What are Security Logs?",
    content: `
# What are Security Logs?

**Security logs** are records of events that occur within your IT environment. They are the digital footprints left by every action, connection, and transaction in your systems.

## Why Logs Matter in Security

Logs are the **foundation of security monitoring and incident response**. Without logs, we're essentially blind to what's happening in our environment.

> "Logs are like the black box recorder of an airplane—they tell us what happened, when, and often why."

### Key Uses of Security Logs

| Use Case | Description |
|----------|-------------|
| **Threat Detection** | Identify malicious activity through patterns and anomalies |
| **Incident Investigation** | Reconstruct what happened during a security incident |
| **Compliance** | Meet regulatory requirements (PCI-DSS, HIPAA, SOX) |
| **Forensics** | Provide evidence for legal proceedings |
| **Troubleshooting** | Debug application and system issues |

## What Gets Logged?

Almost everything in IT can generate logs:

### Endpoint Logs
- User logins and logoffs
- Process execution
- File access and modifications
- Registry changes (Windows)
- Privilege escalation

### Network Logs
- Firewall allow/deny decisions
- DNS queries
- HTTP/HTTPS requests
- VPN connections
- NetFlow data

### Application Logs
- Database queries
- API calls
- Authentication attempts
- Error messages
- Transaction records

### Cloud Logs
- Resource access
- Configuration changes
- IAM activities
- API calls

## The 5 W's of Log Analysis

Every log entry should help answer:

1. **Who** - Which user or service account?
2. **What** - What action was performed?
3. **When** - Timestamp of the event
4. **Where** - Source and destination (IP, hostname)
5. **Why** - Context and outcome

## Log Levels / Severity

Most logging systems use severity levels:

\`\`\`
┌─────────────┬────────────────────────────────────┐
│ Level       │ Description                        │
├─────────────┼────────────────────────────────────┤
│ EMERGENCY   │ System is unusable                 │
│ ALERT       │ Immediate action required          │
│ CRITICAL    │ Critical conditions                │
│ ERROR       │ Error conditions                   │
│ WARNING     │ Warning conditions                 │
│ NOTICE      │ Normal but significant             │
│ INFO        │ Informational messages             │
│ DEBUG       │ Debug-level messages               │
└─────────────┴────────────────────────────────────┘
\`\`\`

## Challenges in Log Analysis

### Volume
Modern environments generate **millions of events per day**. A single busy server can produce gigabytes of logs daily.

### Variety
Different systems use different formats, making correlation challenging.

### Velocity
Real-time threat detection requires processing logs as they're generated.

### Veracity
Not all logs are equally reliable or complete.

## The Security Analyst's Perspective

As a security analyst, you'll approach logs with specific questions:

- Is this activity expected or suspicious?
- Does this pattern indicate an attack?
- What's the timeline of events?
- Who or what is responsible?
- What's the impact?

Mastering log analysis is one of the most valuable skills for any security professional!
    `,
    keyTakeaways: [
      "Logs are records of events that provide visibility into IT environments",
      "Security logs are essential for detection, investigation, and compliance",
      "The 5 W's (Who, What, When, Where, Why) guide log analysis",
      "Log severity levels help prioritize events",
      "Volume, variety, and velocity are key challenges in log analysis"
    ],
    additionalResources: [
      { title: "NIST Guide to Computer Security Log Management", type: "documentation" },
      { title: "SANS Log Management Best Practices", type: "article" }
    ]
  },
  {
    id: "1.2",
    courseId: "log-analysis",
    title: "Common Log Formats",
    content: `
# Common Log Formats

Understanding log formats is essential for parsing and analyzing security events. Different systems and vendors use different formats, but several standards have emerged.

## Syslog Format

**Syslog** is the most widely used logging standard, especially in Unix/Linux environments and network devices.

### Traditional Syslog (RFC 3164)

\`\`\`
<priority>timestamp hostname process[pid]: message
\`\`\`

**Example:**
\`\`\`
<34>Oct 11 22:14:15 mymachine su: 'su root' failed for lonvick on /dev/pts/8
\`\`\`

### Modern Syslog (RFC 5424)

\`\`\`
<priority>version timestamp hostname app-name procid msgid structured-data msg
\`\`\`

**Example:**
\`\`\`
<165>1 2023-10-11T22:14:15.003Z mymachine.example.com evntslog - ID47 [exampleSDID@32473 iut="3"] BOMAn application event log entry...
\`\`\`

### Priority Calculation
Priority = (Facility × 8) + Severity

| Facility | Value | Description |
|----------|-------|-------------|
| kern | 0 | Kernel messages |
| user | 1 | User-level messages |
| auth | 4 | Security/auth messages |
| authpriv | 10 | Security/auth (private) |
| local0-7 | 16-23 | Custom use |

## CEF (Common Event Format)

**CEF** is a standardized format developed by ArcSight, widely used in SIEM integrations.

\`\`\`
CEF:Version|Device Vendor|Device Product|Device Version|Signature ID|Name|Severity|Extension
\`\`\`

**Example:**
\`\`\`
CEF:0|Security|Firewall|1.0|100|Connection Blocked|7|src=192.168.1.100 dst=10.0.0.1 spt=12345 dpt=443 proto=TCP
\`\`\`

### CEF Extension Fields
- **src/dst** - Source/Destination IP
- **spt/dpt** - Source/Destination Port
- **act** - Action taken
- **msg** - Human-readable message
- **cs1-cs6** - Custom strings

## JSON Format

**JSON** is increasingly popular for logs due to its flexibility and machine readability.

\`\`\`json
{
  "timestamp": "2023-10-11T22:14:15.003Z",
  "level": "warning",
  "source": "firewall",
  "action": "blocked",
  "src_ip": "192.168.1.100",
  "dst_ip": "10.0.0.1",
  "dst_port": 443,
  "protocol": "TCP",
  "message": "Suspicious outbound connection blocked"
}
\`\`\`

### Advantages of JSON
- Self-describing (field names included)
- Nested structures supported
- Easy to parse programmatically
- Human-readable

## Windows Event Log Format (EVTX)

Windows uses a structured XML-based format internally.

\`\`\`xml
<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4624</EventID>
    <TimeCreated SystemTime="2023-10-11T22:14:15.003Z"/>
    <Computer>WORKSTATION01</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">john.doe</Data>
    <Data Name="LogonType">10</Data>
    <Data Name="IpAddress">192.168.1.50</Data>
  </EventData>
</Event>
\`\`\`

## Apache/NCSA Combined Log Format

Common for web server access logs:

\`\`\`
%h %l %u %t "%r" %>s %b "%{Referer}i" "%{User-Agent}i"
\`\`\`

**Example:**
\`\`\`
192.168.1.100 - john [11/Oct/2023:22:14:15 +0000] "GET /admin/login.php HTTP/1.1" 200 1234 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
\`\`\`

## LEEF (Log Event Extended Format)

IBM's format similar to CEF:

\`\`\`
LEEF:Version|Vendor|Product|Version|EventID|
\`\`\`

## Parsing Tips

1. **Identify the format first** - Look for patterns, delimiters, and structure
2. **Use the right tools** - Regex, parsers, or SIEM built-in parsing
3. **Normalize fields** - Map vendor-specific fields to common names
4. **Handle timestamps** - Convert to UTC, parse correctly
5. **Extract key fields** - Focus on security-relevant data
    `,
    keyTakeaways: [
      "Syslog is the most common format for Unix/Linux and network devices",
      "CEF provides a standardized format for SIEM integration",
      "JSON is increasingly popular for its flexibility and readability",
      "Windows uses XML-based EVTX format with Event IDs",
      "Understanding log formats is essential for effective parsing and analysis"
    ]
  },
  {
    id: "1.3",
    courseId: "log-analysis",
    title: "Log Sources Overview",
    content: `
# Log Sources Overview

Security analysts work with logs from many different sources. Understanding what each source provides helps you know where to look during investigations.

## Endpoint Log Sources

### Windows Systems

| Log Type | Location | Security Value |
|----------|----------|----------------|
| Security | Event Viewer | Authentication, privilege use |
| System | Event Viewer | Service changes, errors |
| Application | Event Viewer | App crashes, errors |
| PowerShell | Event Viewer | Script execution |
| Sysmon | Event Viewer | Process, network, file events |

### Linux Systems

| Log File | Location | Security Value |
|----------|----------|----------------|
| auth.log/secure | /var/log | Authentication events |
| syslog | /var/log | System messages |
| kern.log | /var/log | Kernel messages |
| audit.log | /var/log/audit | SELinux/auditd events |
| lastlog | /var/log | Last login info |

### macOS Systems
- Unified Log (Console.app)
- /var/log/system.log
- /var/log/install.log

## Network Device Logs

### Firewalls
- **What they log:** Traffic allow/deny, NAT translations, VPN connections
- **Key fields:** src_ip, dst_ip, port, action, rule_id
- **Popular vendors:** Palo Alto, Fortinet, Cisco ASA, Check Point

### Proxies / Web Gateways
- **What they log:** HTTP requests, URLs, user agents, response codes
- **Key fields:** url, user, category, action, bytes
- **Popular vendors:** Zscaler, Bluecoat, Squid

### DNS Servers
- **What they log:** DNS queries and responses
- **Key fields:** query_name, query_type, response, client_ip
- **Use cases:** Detecting C2, DGA, data exfiltration

### IDS/IPS
- **What they log:** Signature matches, anomaly detections
- **Key fields:** signature_id, severity, src_ip, dst_ip
- **Popular vendors:** Snort, Suricata, Cisco Firepower

## Application Logs

### Web Servers
- Apache access/error logs
- Nginx access/error logs
- IIS logs (W3C format)

### Databases
- Query logs
- Authentication logs
- Error logs
- Audit logs

### Email Systems
- Message tracking logs
- Authentication logs
- Spam/phishing detection logs

## Cloud Service Logs

### AWS
| Service | Log Type |
|---------|----------|
| CloudTrail | API activity |
| VPC Flow Logs | Network traffic |
| GuardDuty | Threat detection |
| S3 Access Logs | Bucket access |

### Azure
| Service | Log Type |
|---------|----------|
| Activity Log | Management operations |
| Azure AD Sign-ins | Authentication |
| NSG Flow Logs | Network traffic |
| Defender for Cloud | Security alerts |

### Google Cloud
- Cloud Audit Logs
- VPC Flow Logs
- Cloud Armor logs

## Identity & Access Logs

### Active Directory
- Domain Controller Security logs
- LDAP query logs
- Group Policy logs

### Identity Providers (IdP)
- Okta, Azure AD, Ping
- SSO authentication logs
- MFA events

## EDR/XDR Telemetry

Modern endpoint detection tools provide rich telemetry:
- Process creation with command lines
- Network connections
- File system activity
- Registry modifications
- Memory operations

## Prioritizing Log Sources

For security monitoring, prioritize:

1. **Authentication logs** - Who accessed what
2. **Firewall/Network logs** - What traffic occurred
3. **Endpoint detection** - What executed on systems
4. **DNS logs** - Domain communication
5. **Email logs** - Phishing detection

\`\`\`
┌────────────────────────────────────────────────┐
│              SOC Log Priority                  │
├────────────────────────────────────────────────┤
│ 1. Auth (AD, VPN, Cloud)      ████████████ HIGH│
│ 2. Network (FW, Proxy, DNS)   ██████████ HIGH  │
│ 3. Endpoint (EDR, Sysmon)     ████████ HIGH    │
│ 4. Email (O365, Exchange)     ██████ MEDIUM    │
│ 5. Application (Web, DB)      ████ MEDIUM      │
│ 6. Cloud (AWS, Azure, GCP)    ██████ MEDIUM    │
└────────────────────────────────────────────────┘
\`\`\`
    `,
    keyTakeaways: [
      "Endpoints provide authentication, process, and file activity logs",
      "Network devices log traffic flows, DNS queries, and security decisions",
      "Cloud services have their own logging systems (CloudTrail, Azure Activity)",
      "Authentication logs are the highest priority for security monitoring",
      "EDR provides rich telemetry beyond traditional OS logs"
    ]
  },
  {
    id: "1.4",
    courseId: "log-analysis",
    title: "Log Collection & Centralization",
    content: `
# Log Collection & Centralization

Collecting logs from across your environment and centralizing them is critical for effective security monitoring.

## Why Centralize Logs?

### Without Centralization
\`\`\`
[Server 1] ─── Local logs only
[Server 2] ─── Local logs only
[Firewall] ─── Local logs only
[Workstations] ─── Local logs only

❌ Analyst must access each system
❌ No correlation possible
❌ Logs may be deleted by attackers
❌ No long-term retention
\`\`\`

### With Centralization
\`\`\`
[Server 1] ──────┐
[Server 2] ──────┼──→ [SIEM] ──→ [Analyst]
[Firewall] ──────┤        │
[Workstations] ──┘        ↓
                    [Storage/Archive]

✅ Single pane of glass
✅ Cross-source correlation
✅ Protected from tampering
✅ Long-term retention
\`\`\`

## Log Collection Methods

### Agent-Based Collection

Agents installed on endpoints forward logs.

**Pros:**
- Rich data collection
- Works across networks
- Can filter at source

**Cons:**
- Agent deployment needed
- Resource overhead
- Agent management

**Common Agents:**
- Elastic Agent / Beats
- Splunk Universal Forwarder
- Microsoft MMA/AMA
- Sysmon + WEF

### Agentless Collection

Logs pulled from systems or sent via syslog.

**Syslog (UDP/TCP/TLS):**
\`\`\`
[Device] ──UDP/514──→ [Syslog Server] ──→ [SIEM]
\`\`\`

**Windows Event Forwarding (WEF):**
\`\`\`
[Windows Clients] ──WinRM──→ [Collector] ──→ [SIEM]
\`\`\`

**API Polling:**
\`\`\`
[Cloud Service] ←──API──→ [SIEM] (pulls logs)
\`\`\`

### Protocol Comparison

| Method | Reliability | Security | Use Case |
|--------|-------------|----------|----------|
| Syslog UDP | Low (no ack) | Low | Legacy devices |
| Syslog TCP | Medium | Low | Network devices |
| Syslog TLS | Medium | High | Secure forwarding |
| HTTPS/API | High | High | Cloud, modern apps |
| Agent | High | High | Endpoints |

## Log Pipeline Architecture

A typical enterprise log pipeline:

\`\`\`
┌──────────────┐
│ Log Sources  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Collectors  │  (rsyslog, Logstash, Fluentd)
└──────┬───────┘
       ↓
┌──────────────┐
│   Parsing    │  (Extract fields, normalize)
│   & Enrich   │
└──────┬───────┘
       ↓
┌──────────────┐
│    SIEM      │  (Index, correlate, alert)
└──────┬───────┘
       ↓
┌──────────────┐
│   Storage    │  (Hot/Warm/Cold tiers)
└──────────────┘
\`\`\`

## Key Considerations

### Timestamp Handling
- Ensure all sources use NTP
- Normalize to UTC
- Handle timezone conversions
- Log ingestion time vs event time

### Data Normalization
Map vendor-specific fields to common schema:
\`\`\`
Vendor A: src_addr → Common: source_ip
Vendor B: srcip → Common: source_ip
Vendor C: SourceIP → Common: source_ip
\`\`\`

### Log Retention
| Log Type | Typical Retention |
|----------|------------------|
| Security events | 1-2 years |
| Network traffic | 90 days - 1 year |
| Debug/verbose | 7-30 days |
| Compliance (PCI) | 1 year minimum |

### Volume Planning
Estimate daily log volume:
- Windows DC: 500MB - 2GB/day
- Firewall: 1-10GB/day
- Web proxy: 2-20GB/day
- EDR: 1-5GB/endpoint/day

## Common Collection Tools

| Tool | Type | Use Case |
|------|------|----------|
| rsyslog | Open source | Linux syslog collection |
| Logstash | Open source | ETL pipeline |
| Fluentd | Open source | Lightweight collection |
| NXLog | Commercial/Free | Cross-platform |
| Cribl | Commercial | Log routing/reduction |
    `,
    keyTakeaways: [
      "Centralized logging enables correlation and protects logs from tampering",
      "Agent-based collection provides rich data; agentless is simpler to deploy",
      "Syslog, WEF, and APIs are common collection methods",
      "Timestamp normalization and field mapping are critical",
      "Plan for log volume and retention requirements"
    ]
  },
];
