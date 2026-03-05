import { LessonContent } from "../../lessonContent";

export const module2: LessonContent[] = [
  // Module 2: Cyber Threat Landscape
  {
    id: "2.1",
    courseId: "soc-fundamentals",
    title: "Understanding Threat Actors",
    content: `
# Understanding Threat Actors

To defend effectively, you must understand who you're defending against. Threat actors vary widely in their motivations, capabilities, and methods.

## What is a Threat Actor?

A **threat actor** is any individual, group, or organization that attempts to exploit vulnerabilities in systems, networks, or people to achieve malicious objectives.

## Categories of Threat Actors

### 1. Nation-State Actors (APT)

**Also known as:** Advanced Persistent Threats (APTs)

**Characteristics:**
- State-sponsored or state-affiliated
- Extremely well-resourced
- Highly sophisticated techniques
- Long-term, persistent operations
- Specific geopolitical objectives

**Motivations:**
- Espionage (political, military, economic)
- Critical infrastructure disruption
- Influence operations

**Examples:**
| APT Group | Nation | Known Targets |
|-----------|--------|---------------|
| APT29 (Cozy Bear) | Russia | Government, Think Tanks |
| APT41 | China | Technology, Healthcare |
| Lazarus Group | North Korea | Financial, Crypto |
| APT33 | Iran | Energy, Aviation |

**TTPs (Tactics, Techniques, Procedures):**
- Custom malware
- Zero-day exploits
- Supply chain attacks
- Living off the land

### 2. Cybercriminals

**Characteristics:**
- Financially motivated
- Range from individuals to organized groups
- Use commodity malware and toolkits
- Opportunistic or targeted

**Common Activities:**
- Ransomware attacks
- Business Email Compromise (BEC)
- Credential theft and sale
- Banking trojans
- Cryptomining

**Notable Groups:**
- REvil (Ransomware)
- FIN7 (Financial Crime)
- Conti (Ransomware-as-a-Service)

### 3. Hacktivists

**Characteristics:**
- Ideologically motivated
- Seek publicity for causes
- Variable skill levels
- Often decentralized

**Motivations:**
- Political protest
- Social causes
- Anti-corporate sentiment
- Environmental activism

**Common Tactics:**
- Website defacement
- DDoS attacks
- Data leaks (doxxing)
- Social media hijacking

**Notable Groups:**
- Anonymous
- LulzSec (historical)

### 4. Insider Threats

**Types:**
- **Malicious Insiders**: Intentional harm
- **Negligent Insiders**: Accidental exposure
- **Compromised Insiders**: Account taken over

**Warning Signs:**
- Unusual access patterns
- Large data downloads
- After-hours activity
- Accessing unneeded resources
- Disgruntled behavior

**Why Dangerous:**
- Legitimate access
- Knowledge of systems
- Trusted by security controls

### 5. Script Kiddies

**Characteristics:**
- Low skill level
- Use pre-built tools
- Opportunistic targets
- Seek recognition

**Common Activities:**
- Running exploit scripts
- Website defacement
- DDoS using botnets
- Social media hacking

## Threat Actor Comparison

| Attribute | Nation-State | Cybercriminal | Hacktivist | Insider |
|-----------|--------------|---------------|------------|---------|
| Motivation | Espionage | Financial | Ideological | Varies |
| Skill Level | High | Medium-High | Low-Medium | Varies |
| Resources | Extensive | Moderate | Limited | Varies |
| Persistence | Very High | Medium | Low | Medium |
| Stealth | Very High | Medium | Low | High |

## Understanding Motivations: The Diamond Model

The Diamond Model helps analyze threats:

\`\`\`
                 Adversary
                    ↑
                    │
    Capability ←────┼────→ Infrastructure
                    │
                    ↓
                  Victim
\`\`\`

- **Adversary**: Who is attacking?
- **Capability**: What tools/techniques?
- **Infrastructure**: What systems are used?
- **Victim**: Who is targeted?

## Why This Matters for SOC Analysts

Understanding threat actors helps you:

1. **Prioritize alerts** based on likely adversary
2. **Recognize patterns** in attack behavior
3. **Anticipate next steps** in an attack
4. **Apply appropriate response** measures
5. **Communicate effectively** about threats
    `,
    keyTakeaways: [
      "Nation-state actors are highly sophisticated with geopolitical motivations",
      "Cybercriminals are financially motivated and use ransomware, BEC, and malware",
      "Hacktivists are ideologically driven and seek publicity",
      "Insider threats are dangerous due to legitimate access and system knowledge",
      "Understanding motivations helps prioritize and respond to threats"
    ]
  },
  {
    id: "2.2",
    courseId: "soc-fundamentals",
    title: "Common Attack Vectors",
    content: `
# Common Attack Vectors

An **attack vector** is the path or method an attacker uses to gain access to a target system. Understanding these vectors helps you recognize attacks in progress.

## The Attack Surface

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                      YOUR ORGANIZATION                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Email   │  │   Web    │  │ Network  │  │  People  │        │
│  │ Gateway  │  │  Apps    │  │  Edge    │  │          │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                           ↑                                     │
│                    ATTACK SURFACE                               │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## 1. Phishing & Social Engineering

**The most common initial access vector.** Over 90% of successful attacks start with phishing.

### Types of Phishing

| Type | Description | Example |
|------|-------------|---------|
| **Spear Phishing** | Targeted at specific individuals | CFO receives fake invoice |
| **Whaling** | Targets executives | CEO impersonation |
| **Smishing** | SMS-based phishing | Fake delivery notification |
| **Vishing** | Voice/phone phishing | IT support scam call |
| **Business Email Compromise** | Compromised/spoofed business email | Wire transfer fraud |

### Phishing Indicators

**Email Headers:**
- Sender domain doesn't match company
- Reply-to differs from sender
- Unusual routing

**Content:**
- Urgency or threats
- Grammar/spelling errors
- Generic greetings
- Suspicious links
- Unexpected attachments

**Technical:**
- URL doesn't match display text
- Attachment with macros
- Password-protected archives

### Example Phishing Analysis
\`\`\`
From: support@micros0ft.com ← Typosquatting
Reply-To: claims@gmail.com ← External reply-to
Subject: Urgent: Your account will be suspended!

Dear Customer, ← Generic greeting

Your Microsoft account has been compromised. Click here 
to verify your identity immediately or your account 
will be permanently deleted within 24 hours.

[Verify Now] ← Links to: http://microsoft-verify.suspicious.com/login

Thank you,
Microsoft Support Team
\`\`\`

## 2. Malware Delivery

### Delivery Methods

**Email Attachments:**
- Office documents with macros
- PDF with embedded scripts
- ZIP files (often password-protected)
- HTML attachments

**Web-Based:**
- Drive-by downloads
- Watering hole attacks
- Malvertising
- Compromised legitimate sites

**Removable Media:**
- USB drops
- Infected software on CDs

### Common Malware Types

| Type | Purpose | Example |
|------|---------|---------|
| Dropper | Delivers other malware | Emotet |
| RAT | Remote access | Cobalt Strike |
| Ransomware | Encrypt and extort | LockBit |
| Infostealer | Steal credentials | RedLine |
| Cryptominer | Mine cryptocurrency | XMRig |

## 3. Exploitation

### Vulnerability Types

**Remote Code Execution (RCE):**
- Most dangerous vulnerability type
- Allows running code on remote system
- Examples: Log4Shell, EternalBlue

**Privilege Escalation:**
- Elevate from user to admin
- Critical for lateral movement

**SQL Injection:**
- Inject SQL commands
- Access/modify databases

**Cross-Site Scripting (XSS):**
- Inject malicious scripts
- Steal session cookies

### Exploitation Lifecycle
\`\`\`
1. Reconnaissance → Find vulnerable systems
2. Weaponization → Create exploit
3. Delivery → Send exploit to target
4. Exploitation → Trigger vulnerability
5. Installation → Drop payload
6. Command & Control → Establish C2
7. Actions on Objectives → Achieve goals
\`\`\`

## 4. Credential Attacks

### Password Attacks

**Brute Force:**
- Try all possible combinations
- Slow but thorough

**Dictionary Attack:**
- Try common passwords
- Faster than brute force

**Password Spraying:**
- Try few passwords against many accounts
- Avoids account lockouts

**Credential Stuffing:**
- Use leaked credentials
- Exploit password reuse

### Detection Indicators

- Multiple failed login attempts
- Logins from unusual locations
- After-hours authentication
- Impossible travel (logins from distant locations)

## 5. Supply Chain Attacks

Attack the vendor to reach the target.

### Examples:
- **SolarWinds (2020)**: Malicious update to Orion
- **Kaseya (2021)**: MSP software compromise
- **3CX (2023)**: VoIP software supply chain

### Indicators:
- Unusual behavior from trusted software
- Unexpected network connections
- Signed but malicious code
    `,
    keyTakeaways: [
      "Phishing is the most common initial access vector (90%+ of attacks)",
      "Look for typosquatting, urgency, mismatched links in phishing emails",
      "Malware is delivered via email attachments, web downloads, and removable media",
      "Credential attacks include brute force, password spraying, and credential stuffing",
      "Supply chain attacks target trusted vendors to reach the ultimate target"
    ],
    practicalExercise: {
      title: "Phishing Email Analysis",
      description: "Analyze sample phishing emails and identify all suspicious indicators.",
      steps: [
        "Review the provided email samples",
        "Identify sender, header, and content red flags",
        "Extract any IOCs (domains, URLs, attachment hashes)",
        "Classify the type of phishing attack",
        "Recommend user awareness improvements"
      ]
    }
  },
  {
    id: "2.3",
    courseId: "soc-fundamentals",
    title: "Malware Categories & Behavior",
    content: `
# Malware Categories & Behavior

Understanding malware categories and their behaviors is crucial for effective detection and response. Each type exhibits distinct characteristics that help analysts identify and contain threats.

## What is Malware?

**Malware** (malicious software) is any program designed to harm, exploit, or compromise computer systems, networks, or users. It ranges from simple scripts to sophisticated nation-state tools.

## Malware Classification Framework

\`\`\`
┌────────────────────────────────────────────────────────────┐
│                    MALWARE TAXONOMY                        │
├────────────────┬───────────────────┬───────────────────────┤
│   BY VECTOR    │   BY BEHAVIOR     │    BY PURPOSE         │
├────────────────┼───────────────────┼───────────────────────┤
│ • Virus        │ • Self-replicating│ • Financial gain      │
│ • Worm         │ • Persistent      │ • Espionage           │
│ • Trojan       │ • Stealthy        │ • Destruction         │
│ • Dropper      │ • Polymorphic     │ • Access maintenance  │
└────────────────┴───────────────────┴───────────────────────┘
\`\`\`

## Major Malware Categories

### 1. Viruses

**Characteristics:**
- Requires host file to spread
- Activates when host program runs
- Self-replicates by infecting other files
- Legacy threat, less common today

**Types:**
| Virus Type | Target | Behavior |
|------------|--------|----------|
| File Infector | Executables | Attaches to .exe/.dll files |
| Boot Sector | MBR/VBR | Infects boot process |
| Macro Virus | Documents | Embeds in Office macros |
| Polymorphic | Various | Changes code signature |

### 2. Worms

**Characteristics:**
- Self-replicating without host file
- Spreads across networks autonomously
- Exploits vulnerabilities for propagation
- Can cause network congestion

**Famous Examples:**
- **WannaCry (2017)**: Exploited EternalBlue, encrypted files
- **Conficker (2008)**: Infected millions of systems
- **Slammer (2003)**: Spread in 10 minutes globally

**Detection Indicators:**
- Unusual network scanning
- High bandwidth consumption
- Multiple systems showing same behavior
- Exploitation attempts on same vulnerability

### 3. Trojans

**Characteristics:**
- Disguises as legitimate software
- Doesn't self-replicate
- Requires user action to install
- Creates backdoor for attackers

**Trojan Types:**
| Type | Function |
|------|----------|
| RAT (Remote Access Trojan) | Full remote control |
| Banking Trojan | Steals financial credentials |
| Downloader | Fetches additional malware |
| Infostealer | Harvests sensitive data |
| Backdoor | Maintains persistent access |

### 4. Ransomware

**Characteristics:**
- Encrypts files or locks systems
- Demands payment for decryption
- Often includes data exfiltration
- Uses strong encryption (AES-256, RSA)

**Ransomware Evolution:**
\`\`\`
Generation 1: Encrypt files → Demand ransom
Generation 2: Encrypt + Exfiltrate → Double extortion
Generation 3: Encrypt + Exfiltrate + DDoS → Triple extortion
\`\`\`

**Notable Families:**
- **LockBit**: Most active RaaS operation
- **BlackCat/ALPHV**: Rust-based, sophisticated
- **Cl0p**: Known for MOVEit exploitation
- **Royal**: Targets critical infrastructure

**Ransomware Indicators:**
- Mass file modifications
- Ransom notes appearing
- File extension changes (.encrypted, .locked)
- Shadow copy deletion
- Encryption key generation

### 5. Rootkits

**Characteristics:**
- Hides deep in the system
- Modifies OS components
- Extremely difficult to detect
- Survives reboots

**Types:**
| Level | Location | Detection Difficulty |
|-------|----------|---------------------|
| User-mode | Applications | Moderate |
| Kernel-mode | OS kernel | High |
| Bootkit | Boot process | Very High |
| Firmware | BIOS/UEFI | Extreme |

### 6. Spyware & Infostealers

**Targeted Data:**
- Browser credentials
- Cryptocurrency wallets
- Session cookies
- Keystrokes
- Screenshots
- Clipboard contents

**Popular Infostealers:**
- **RedLine**: Most widespread, sold as MaaS
- **Raccoon**: Steals browser data
- **Vidar**: Targets crypto wallets
- **FormBook**: Keylogger and form grabber

### 7. Botnets

**Characteristics:**
- Network of compromised systems
- Centralized or P2P control
- Used for DDoS, spam, mining
- Difficult to completely eliminate

**Botnet Architecture:**
\`\`\`
           ┌──────────────┐
           │   C2 Server  │
           └──────┬───────┘
                  │
    ┌─────────────┼─────────────┐
    ↓             ↓             ↓
┌───────┐    ┌───────┐    ┌───────┐
│ Bot 1 │    │ Bot 2 │    │ Bot N │
└───────┘    └───────┘    └───────┘
\`\`\`

## Malware Behavior Patterns

### Persistence Mechanisms
- Registry Run keys
- Scheduled tasks
- Services
- Startup folders
- WMI subscriptions
- DLL hijacking

### Evasion Techniques
- Process injection
- Code obfuscation
- Anti-debugging
- Sandbox detection
- Fileless execution
- Living off the land

### Command & Control (C2)
- HTTP/HTTPS beaconing
- DNS tunneling
- Social media channels
- Cloud services
- Domain fronting
    `,
    keyTakeaways: [
      "Viruses require host files while worms spread autonomously across networks",
      "Trojans disguise as legitimate software and often create backdoors",
      "Ransomware has evolved to include data theft and multiple extortion tactics",
      "Rootkits hide deep in systems and are extremely difficult to detect",
      "Understanding persistence and evasion techniques helps identify infections"
    ],
    additionalResources: [
      { title: "MITRE ATT&CK Malware", type: "documentation" },
      { title: "Any.Run Malware Sandbox", type: "tool" }
    ]
  },
  {
    id: "2.4",
    courseId: "soc-fundamentals",
    title: "Introduction to MITRE ATT&CK",
    content: `
# Introduction to MITRE ATT&CK

The MITRE ATT&CK framework is the industry standard for understanding adversary behavior. As a SOC analyst, this framework will be your guide for understanding and categorizing attacks.

## What is MITRE ATT&CK?

**ATT&CK** stands for **A**dversarial **T**actics, **T**echniques, and **C**ommon **K**nowledge. It's a globally-accessible knowledge base of adversary behavior based on real-world observations.

> "ATT&CK is a curated knowledge base and model for cyber adversary behavior."

## Why ATT&CK Matters

### For SOC Analysts:
- **Common Language**: Standardized terminology for attacks
- **Detection Mapping**: Link alerts to specific techniques
- **Gap Analysis**: Identify coverage weaknesses
- **Investigation Guide**: Understand attack progression

### For Organizations:
- Threat modeling
- Red team planning
- Security assessment
- Vendor evaluation

## ATT&CK Matrix Structure

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                         ATT&CK MATRIX                                │
├─────────────┬──────────────┬────────────────┬──────────────────────┤
│ Tactic      │ Tactic       │ Tactic         │ Tactic               │
│ (WHY)       │ (WHY)        │ (WHY)          │ (WHY)                │
├─────────────┼──────────────┼────────────────┼──────────────────────┤
│ Technique   │ Technique    │ Technique      │ Technique            │
│ (HOW)       │ (HOW)        │ (HOW)          │ (HOW)                │
├─────────────┼──────────────┼────────────────┼──────────────────────┤
│ Technique   │ Technique    │ Technique      │ Technique            │
├─────────────┼──────────────┼────────────────┼──────────────────────┤
│ Sub-tech    │ Sub-tech     │ Sub-tech       │ Sub-tech             │
└─────────────┴──────────────┴────────────────┴──────────────────────┘
\`\`\`

## The 14 Tactics

Tactics represent the **"why"** - the adversary's goal at each stage:

| # | Tactic | Description |
|---|--------|-------------|
| 1 | **Reconnaissance** | Gathering information about target |
| 2 | **Resource Development** | Building attack infrastructure |
| 3 | **Initial Access** | Getting into the network |
| 4 | **Execution** | Running malicious code |
| 5 | **Persistence** | Maintaining foothold |
| 6 | **Privilege Escalation** | Getting higher permissions |
| 7 | **Defense Evasion** | Avoiding detection |
| 8 | **Credential Access** | Stealing passwords/tokens |
| 9 | **Discovery** | Learning about the environment |
| 10 | **Lateral Movement** | Moving through network |
| 11 | **Collection** | Gathering target data |
| 12 | **Command & Control** | Communicating with implants |
| 13 | **Exfiltration** | Stealing data out |
| 14 | **Impact** | Disrupting or destroying |

## Techniques and Sub-Techniques

### Technique Example: T1566 - Phishing

\`\`\`
T1566 - Phishing (Technique)
    │
    ├── T1566.001 - Spearphishing Attachment
    │
    ├── T1566.002 - Spearphishing Link
    │
    └── T1566.003 - Spearphishing via Service
\`\`\`

### Technique Deep Dive: T1059 - Command and Scripting Interpreter

| Sub-Technique | ID | Detection Focus |
|---------------|-----|-----------------|
| PowerShell | T1059.001 | Script block logging |
| Windows Command Shell | T1059.003 | cmd.exe child processes |
| Python | T1059.006 | python.exe execution |
| JavaScript | T1059.007 | wscript.exe, cscript.exe |

## Using ATT&CK in the SOC

### 1. Alert Mapping

Map your detection rules to ATT&CK:

\`\`\`
Alert: "Suspicious PowerShell Execution"
├── Tactic: Execution
├── Technique: T1059.001 (PowerShell)
└── Detection: Script block with encoded commands
\`\`\`

### 2. Investigation Context

When investigating an alert:

\`\`\`
1. Identify the technique observed
2. Check what tactics it falls under
3. Look for related techniques (same tactic)
4. Anticipate next likely techniques
5. Search for those behaviors
\`\`\`

### 3. Attack Chain Analysis

\`\`\`
Initial Access → Execution → Persistence → Discovery → Lateral Movement
     ↓              ↓            ↓            ↓              ↓
  T1566.001     T1059.001    T1547.001    T1083        T1021.002
  Phishing      PowerShell   Registry     File         SMB/Admin
  Attachment                 Run Keys     Discovery     Shares
\`\`\`

## ATT&CK Navigator

The ATT&CK Navigator is a web-based tool for visualizing coverage:

**Use Cases:**
- Highlight techniques your tools detect
- Map an incident across the matrix
- Compare coverage across security tools
- Visualize threat actor TTPs

### Creating a Layer

1. Go to ATT&CK Navigator
2. Create new layer
3. Select techniques to highlight
4. Add colors for different meanings
5. Export for reporting

## Data Sources

ATT&CK maps techniques to data sources needed for detection:

| Data Source | Example |
|-------------|---------|
| Process | Process creation, command line |
| File | File creation, modification |
| Network Traffic | Connection, DNS queries |
| Windows Registry | Registry modification |
| Authentication | Logon events |

## Practice: Mapping an Attack

**Scenario: Emotet Infection Chain**

\`\`\`
1. User receives phishing email (T1566.001)
2. Opens Word doc with macro (T1204.002)
3. Macro executes PowerShell (T1059.001)
4. Downloads Emotet payload (T1105)
5. Creates scheduled task (T1053.005)
6. Beacons to C2 (T1071.001)
7. Drops Cobalt Strike (T1105)
8. Credential dumping (T1003.001)
\`\`\`
    `,
    keyTakeaways: [
      "ATT&CK provides a common language for describing adversary behavior",
      "Tactics are the 'why' (goals), techniques are the 'how' (methods)",
      "14 tactics cover the full attack lifecycle from reconnaissance to impact",
      "Map your detections to ATT&CK to identify coverage gaps",
      "Use ATT&CK Navigator to visualize and analyze attack chains"
    ],
    additionalResources: [
      { title: "MITRE ATT&CK Website", type: "documentation", url: "https://attack.mitre.org/" },
      { title: "ATT&CK Navigator", type: "tool", url: "https://mitre-attack.github.io/attack-navigator/" }
    ]
  },
  {
    id: "2.5",
    courseId: "soc-fundamentals",
    title: "Quiz: SOC Fundamentals & Threat Landscape",
    content: `
# Quiz: Modules 1-2 Assessment

Test your understanding of SOC operations and the cyber threat landscape.

## Quiz Instructions

- **Duration:** 20 minutes
- **Questions:** 15 multiple choice questions
- **Passing Score:** 70%
- **Attempts:** Unlimited attempts allowed

## Quiz Content

This quiz covers:
- SOC operations and team roles
- Essential SOC tools and technologies
- Threat actors and motivations
- Common attack vectors
- MITRE ATT&CK framework basics

## Quiz Data Reference

This quiz is based on the quiz data structure defined in \`quizData.ts\` with quizId "q1" for SOC Fundamentals.

### Sample Questions Format:

Each question follows this structure:
- Question text
- Multiple choice options (A, B, C, D)
- Correct answer index
- Explanation for the answer

## Taking the Quiz

1. Read each question carefully
2. Select the best answer from the options provided
3. Submit your answers when complete
4. Review your results and explanations

## Preparation

Review the following topics before taking the quiz:
- SOC mission and core functions
- Team roles and responsibilities (Tier 1, 2, 3)
- Key SOC tools (SIEM, EDR, SOAR)
- Types of threat actors
- Common attack vectors
- MITRE ATT&CK framework basics

## Start Quiz

🔗 **Quiz Link:** [Click here to start the quiz](/courses/blue-team-soc-fundamentals/quiz/2.5)

⚠️ **Important:** You must complete this quiz with at least 70% to unlock Module 3: Log Analysis Fundamentals.

**Note:** Your quiz score will appear in the quiz button section below after you complete the quiz. The score display updates automatically when you finish the quiz.

Good luck! You need 70% to pass and proceed to Module 3.
    `,
    keyTakeaways: [
      "SOC operations require understanding of tools, processes, and team dynamics",
      "The cyber threat landscape includes various threat actors with different motivations",
      "MITRE ATT&CK provides a framework for understanding adversary behavior",
      "Continuous learning is essential in the ever-evolving field of cybersecurity"
    ]
  },
  {
    id: "2.5",
    courseId: "soc-fundamentals",
    title: "Threat Landscape Assessment Quiz",
    content: `
# Threat Landscape Assessment Quiz

Test your knowledge of threat actors, attack vectors, and malware types.

## Quiz Overview

This quiz covers the threat landscape concepts from Module 2:
- Threat actors and their motivations
- Common attack vectors and techniques
- Malware categories and characteristics
- MITRE ATT&CK framework
- Threat intelligence basics

## Instructions

1. **Duration**: 25 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 70% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Different types of threat actors (APT, cybercriminals, hacktivists)
- Primary motivations behind cyber attacks
- Common attack vectors (phishing, malware, social engineering)
- Malware types (ransomware, trojans, spyware)
- MITRE ATT&CK framework structure
- Basic threat intelligence concepts

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will cover:
- Threat actor classifications and motivations
- Attack methodologies and vectors
- Malware identification and characteristics
- Framework applications
- Threat intelligence fundamentals

Good luck! Understanding the threat landscape is crucial for effective defense.
    `,
    keyTakeaways: [
      "Financial gain is the primary motivation behind most cyber attacks",
      "Threat actors range from nation-states to individual hackers",
      "Malware continues to evolve in sophistication and impact",
      "MITRE ATT&CK provides a standardized language for discussing threats",
      "Threat intelligence helps organizations prepare for and defend against attacks"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review threat landscape concepts before taking the quiz.",
      steps: [
        "Study different threat actor types and motivations",
        "Review common attack vectors and techniques",
        "Learn malware classifications and behaviors",
        "Understand MITRE ATT&CK framework basics",
        "Take the quiz when ready"
      ]
    }
  }
];


