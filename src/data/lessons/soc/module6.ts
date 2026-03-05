import { LessonContent } from "../../lessonContent";

export const module6: LessonContent[] = [  {
    id: "6.1",
    courseId: "soc-fundamentals",
    title: "Introduction to Threat Intelligence",
    content: `
# Introduction to Threat Intelligence

**Threat Intelligence (TI)** is evidence-based knowledge about threats that helps organizations make informed security decisions. For SOC analysts, threat intelligence transforms raw data into actionable insights.

## What is Threat Intelligence?

Threat intelligence goes beyond simple data collection. It involves:

- **Collection** - Gathering data from various sources
- **Processing** - Normalizing and structuring the data
- **Analysis** - Finding patterns and meaning
- **Dissemination** - Sharing insights with stakeholders

> "Data becomes information, information becomes intelligence, and intelligence drives action."

## Types of Threat Intelligence

### 1. Strategic Intelligence
- High-level trends and patterns
- Business risk assessments
- Consumed by executives and management
- Example: "Ransomware attacks increased 150% in healthcare"

### 2. Tactical Intelligence
- TTPs (Tactics, Techniques, Procedures)
- How adversaries operate
- Consumed by security architects and defenders
- Example: "APT29 uses spear-phishing with COVID-themed lures"

### 3. Operational Intelligence
- Details about specific attacks
- Campaign information and timelines
- Consumed by IR teams and threat hunters
- Example: "Upcoming DDoS attack planned for Black Friday"

### 4. Technical Intelligence
- Specific indicators of compromise (IOCs)
- Machine-readable data
- Consumed by SOC analysts and automated tools
- Example: "Malicious IP: 192.168.1.100, Hash: abc123..."

| Intelligence Type | Consumer | Refresh Rate | Format |
|-------------------|----------|--------------|--------|
| Strategic | Executives | Monthly/Quarterly | Reports |
| Tactical | Security Teams | Weekly | TTPs, Playbooks |
| Operational | IR/Hunters | Daily | Advisories |
| Technical | SOC/Tools | Real-time | IOCs, Feeds |

## How SOC Analysts Use Threat Intelligence

### During Alert Triage
1. Check if source/destination IPs are known malicious
2. Compare file hashes against threat intel databases
3. Look for known C2 domains in network traffic
4. Match behavior patterns to known TTPs

### For Enrichment
\`\`\`
Alert: Suspicious PowerShell execution
     ↓
Threat Intel Enrichment:
- Command pattern matches APT28 technique
- Similar commands seen in recent campaign
- Associated with ransomware delivery
     ↓
Elevated Priority: High
\`\`\`

### Proactive Defense
- Block known malicious indicators
- Hunt for IOCs in your environment
- Update detection rules based on new TTPs

## The Intelligence Lifecycle

\`\`\`
     ┌─────────────────────────────────────────────────────┐
     │                                                     │
     ↓                                                     │
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐│
│Direction│ → │Collection│ → │Processing│ → │ Analysis ││
└─────────┘    └──────────┘    └─────────┘    └──────────┘│
                                                   │      │
                                                   ↓      │
                                            ┌───────────┐ │
                                            │Disseminate│─┘
                                            └───────────┘
                                                   │
                                                   ↓
                                             ┌─────────┐
                                             │Feedback │
                                             └─────────┘
\`\`\`

## Building Your TI Mindset

As a SOC analyst, develop these habits:

1. **Question everything** - Don't blindly trust intel feeds
2. **Verify sources** - Check credibility and freshness
3. **Context matters** - Intel must be relevant to your environment
4. **Share back** - Contribute to the community
5. **Stay current** - Threats evolve rapidly
    `,
    keyTakeaways: [
      "Threat intelligence transforms data into actionable security insights",
      "Four types: Strategic, Tactical, Operational, and Technical",
      "SOC analysts primarily use technical intelligence (IOCs) for enrichment",
      "The intelligence lifecycle ensures continuous improvement",
      "Always verify sources and consider relevance to your environment"
    ],
    additionalResources: [
      { title: "MITRE ATT&CK Framework", type: "documentation", url: "https://attack.mitre.org" },
      { title: "Threat Intelligence 101", type: "article", url: "https://www.sans.org" }
    ]
  },
  {
    id: "6.2",
    courseId: "soc-fundamentals",
    title: "IOC Types & Usage",
    content: `
# Indicators of Compromise (IOCs)

**Indicators of Compromise** are forensic artifacts that identify potentially malicious activity. They're the "fingerprints" that attackers leave behind.

## Common IOC Types

### 1. File-Based Indicators

**Hash Values**
- **MD5** - 32 characters (legacy, collision-prone)
- **SHA1** - 40 characters (being phased out)
- **SHA256** - 64 characters (current standard)

\`\`\`
Example SHA256:
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
\`\`\`

**File Metadata**
- File names (e.g., "invoice.pdf.exe")
- File sizes
- Compilation timestamps
- Digital signature status

### 2. Network Indicators

**IP Addresses**
\`\`\`
- C2 Server: 185.234.218.45
- Malware Distribution: 91.109.190.68
- Spam Source: 45.89.127.34
\`\`\`

**Domain Names**
- C2 domains: evil-domain.xyz
- DGA patterns: aj3k2hf9.com
- Typosquatting: micr0soft.com

**URLs**
\`\`\`
http://malicious.site/download/payload.exe
https://legit-looking.com/api/exfil?data=base64...
\`\`\`

### 3. Host-Based Indicators

**Registry Keys**
\`\`\`
HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\MalwareName
HKCU\\Software\\MaliciousApp\\Config
\`\`\`

**File Paths**
\`\`\`
C:\\Users\\Public\\malware.exe
C:\\Windows\\Temp\\suspicious.dll
%APPDATA%\\Roaming\\backdoor.exe
\`\`\`

**Mutex Names**
- Used by malware to prevent multiple instances
- Often unique to malware families

### 4. Behavioral Indicators

| Behavior | Detection Method |
|----------|------------------|
| Unusual process spawning | Process monitoring |
| Registry persistence | Registry auditing |
| Network beaconing | Traffic analysis |
| Credential access | Authentication logs |

## The Pyramid of Pain

David Bianco's Pyramid of Pain illustrates how difficult it is for attackers to change different IOC types:

\`\`\`
                    △
                   /│\\
                  / │ \\  TTPs (Hardest to change)
                 /  │  \\
                /───┼───\\
               /    │    \\  Tools
              /     │     \\
             /──────┼──────\\
            /       │       \\  Network/Host Artifacts
           /        │        \\
          /─────────┼─────────\\
         /          │          \\  Domain Names
        /           │           \\
       /────────────┼────────────\\
      /             │             \\  IP Addresses
     /              │              \\
    /───────────────┼───────────────\\
   /                │                \\  Hash Values (Easiest to change)
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
\`\`\`

## Using IOCs in the SOC

### Practical Workflow
1. **Receive IOC** - From threat feed or intel report
2. **Validate** - Check source reliability and freshness
3. **Search** - Query SIEM/EDR for matches
4. **Contextualize** - Understand what a match means
5. **Act** - Block, alert, or investigate further

### IOC Matching Example
\`\`\`
SIEM Query:
index=network sourcetype=firewall dest_ip IN (
  "185.234.218.45",
  "91.109.190.68",
  "45.89.127.34"
)

Results: 3 connections from HOST-PC-42 to 185.234.218.45
         First seen: 2024-01-15 03:22:45 UTC
         Last seen: 2024-01-15 03:45:12 UTC
\`\`\`

## IOC Quality Considerations

**Good IOCs:**
- Recent and timely
- Contextual information provided
- Verified by multiple sources
- Low false positive rate

**Poor IOCs:**
- Stale or outdated
- No context or attribution
- Single unverified source
- High false positive rate (common IPs, generic hashes)
    `,
    keyTakeaways: [
      "IOCs are forensic artifacts indicating potential malicious activity",
      "Main types: hashes, IPs, domains, URLs, and behavioral patterns",
      "The Pyramid of Pain shows that TTPs are hardest for attackers to change",
      "Always validate IOC quality and freshness before acting",
      "Context is crucial - an IOC without context has limited value"
    ],
    practicalExercise: {
      title: "IOC Research Challenge",
      description: "Practice researching and validating indicators of compromise.",
      steps: [
        "Take a provided suspicious hash value",
        "Research it on VirusTotal and other platforms",
        "Document what malware family it belongs to",
        "Find related IOCs (C2 IPs, domains, additional hashes)",
        "Assess the IOC's quality and relevance"
      ]
    }
  },
  {
    id: "6.3",
    courseId: "soc-fundamentals",
    title: "OSINT for SOC Analysts",
    content: `
# OSINT for SOC Analysts

**Open Source Intelligence (OSINT)** refers to intelligence collected from publicly available sources. For SOC analysts, OSINT is a powerful tool for enriching alerts and investigating threats.

## What is OSINT?

OSINT includes any publicly accessible information:

- Public websites and databases
- Social media platforms
- Government publications
- News and media reports
- Technical repositories (GitHub, etc.)
- DNS and WHOIS records
- Certificate transparency logs

## Essential OSINT Techniques for SOC

### 1. IP Address Research

**Key Information to Gather:**
- Geographic location
- ASN and ISP
- Reputation scores
- Historical activity
- Associated domains

**Example Workflow:**
\`\`\`
Suspicious IP: 185.234.218.45

Step 1: GeoIP Lookup → Russia, Moscow
Step 2: ASN Lookup → AS12345 - Suspicious Hosting Provider
Step 3: Reputation Check → Listed on 5 blocklists
Step 4: VirusTotal → 12/90 engines flag as malicious
Step 5: Shodan → Running nginx, multiple open ports

Conclusion: High-risk IP, likely malicious infrastructure
\`\`\`

### 2. Domain Investigation

**DNS Analysis:**
\`\`\`bash
# WHOIS lookup
whois suspicious-domain.com

# DNS records
dig suspicious-domain.com ANY

# Historical DNS
# Use SecurityTrails, PassiveTotal, etc.
\`\`\`

**Red Flags in Domains:**
- Recently registered (< 30 days)
- Privacy-protected WHOIS
- Cheap TLDs (.xyz, .top, .info)
- Similar to known brands (typosquatting)
- Random character strings (DGA)

### 3. File and Hash Analysis

**VirusTotal Workflow:**
1. Submit hash (don't upload sensitive files!)
2. Review detection ratio
3. Check behavior analysis
4. Look at relations (IPs, domains, other files)
5. Read community comments

### 4. Email Header Analysis

\`\`\`
From: CEO <ceo@company.com>
Received: from suspicious-smtp.evil.com (91.109.190.68)

Analysis:
- Display name doesn't match sender domain
- Originating IP is from suspicious provider
- SPF/DKIM likely failing
\`\`\`

## Free OSINT Tools for SOC Analysts

| Tool | Purpose | URL |
|------|---------|-----|
| VirusTotal | File/URL/IP analysis | virustotal.com |
| AbuseIPDB | IP reputation | abuseipdb.com |
| Shodan | Internet-connected devices | shodan.io |
| urlscan.io | URL analysis | urlscan.io |
| MXToolbox | Email/DNS tools | mxtoolbox.com |
| Have I Been Pwned | Breach lookup | haveibeenpwned.com |
| GreyNoise | Mass scanning intel | greynoise.io |
| Pulsedive | Threat intelligence | pulsedive.com |
| ThreatFox | IOC database | threatfox.abuse.ch |
| Malware Bazaar | Malware samples | bazaar.abuse.ch |

## OSINT Investigation Mindset

### The Analysis Process

\`\`\`
    Start with Known IOC
            │
            ↓
    ┌───────────────┐
    │  Pivot Point  │ ←─── What do we know?
    └───────┬───────┘
            │
     ┌──────┼──────┐
     ↓      ↓      ↓
   IPs  Domains  Hashes ←── Related indicators
     │      │      │
     └──────┼──────┘
            ↓
    ┌───────────────┐
    │  Connections  │ ←─── How are they related?
    └───────┬───────┘
            ↓
    Build the Picture
\`\`\`

### Best Practices

1. **Document everything** - Keep notes of your research path
2. **Verify claims** - Don't trust single sources
3. **Consider context** - Is this relevant to YOUR environment?
4. **Maintain OPSEC** - Don't tip off attackers
5. **Time-box research** - Set limits to avoid rabbit holes
    `,
    keyTakeaways: [
      "OSINT provides valuable context from publicly available sources",
      "Key techniques include IP research, domain analysis, and hash investigation",
      "Free tools like VirusTotal and AbuseIPDB are essential for SOC work",
      "Always document your research and verify information from multiple sources",
      "Pivot from known indicators to discover related infrastructure"
    ],
    additionalResources: [
      { title: "VirusTotal", type: "tool", url: "https://www.virustotal.com" },
      { title: "AbuseIPDB", type: "tool", url: "https://www.abuseipdb.com" },
      { title: "Shodan", type: "tool", url: "https://www.shodan.io" }
    ]
  },
  {
    id: "6.4",
    courseId: "soc-fundamentals",
    title: "Threat Intel Platforms",
    content: `
# Threat Intelligence Platforms

**Threat Intelligence Platforms (TIPs)** aggregate, correlate, and operationalize threat data from multiple sources. Understanding these platforms is essential for modern SOC operations.

## What is a TIP?

A TIP helps organizations:

- **Aggregate** - Collect intel from multiple feeds
- **Normalize** - Standardize different formats
- **Enrich** - Add context to indicators
- **Analyze** - Find patterns and connections
- **Disseminate** - Share with security tools
- **Collaborate** - Enable team workflows

## Essential Platforms for SOC Analysts

### VirusTotal

The Swiss Army knife of threat analysis.

**Key Features:**
- File, URL, IP, and domain scanning
- 70+ antivirus engines
- Behavioral analysis (sandboxing)
- Graph relationships between IOCs
- Community contributions

**Pro Tips:**
\`\`\`
1. Use VT Graph to visualize connections
2. Check the "Relations" tab for pivoting
3. Review "Community" for analyst insights
4. Use search modifiers:
   - content:"powershell"
   - type:peexe positives:5+
   - engines:kaspersky
\`\`\`

### AlienVault OTX (Open Threat Exchange)

**Features:**
- Free community-driven platform
- Pulses (threat reports with IOCs)
- Integration with security tools
- API access for automation

**Using OTX:**
1. Search for IOCs in your alerts
2. Find related pulses and campaigns
3. Subscribe to relevant pulse feeds
4. Export IOCs to your SIEM

### MISP (Malware Information Sharing Platform)

Open-source threat intelligence platform.

**Capabilities:**
- IOC management and sharing
- Event correlation
- Integration with SIEMs and ticketing
- Community sharing groups

### Commercial TIP Options

| Platform | Strengths |
|----------|-----------|
| Recorded Future | NLP-powered intel analysis |
| ThreatConnect | Workflow automation |
| Anomali | Feed aggregation |
| Mandiant Advantage | Incident intel |

## Free Resources Every SOC Analyst Should Know

### Abuse.ch Projects

\`\`\`
URLhaus     → Malicious URLs
ThreatFox   → IOC database  
Malware Bazaar → Malware samples
SSL Blacklist  → Malicious SSL certs
Feodo Tracker  → Botnet C2 servers
\`\`\`

### Other Valuable Resources

**Reputation Services:**
- GreyNoise - Identifies mass scanners
- Pulsedive - Free IOC enrichment
- IPQualityScore - Fraud detection

**Sandbox Services:**
- Any.run - Interactive malware analysis
- Hybrid Analysis - Automated sandboxing
- Joe Sandbox - Deep analysis

**Search Engines:**
- Shodan - Internet device search
- Censys - Internet-wide scanning
- BinaryEdge - Attack surface discovery

## Integrating TI Into Your Workflow

### Automated Enrichment

\`\`\`
Alert Triggered
      │
      ↓
┌─────────────────────────────────────────────┐
│           Automated Enrichment              │
├─────────────────────────────────────────────┤
│  • Query VirusTotal for hashes              │
│  • Check AbuseIPDB for IP reputation        │
│  • Lookup domain age and WHOIS              │
│  • Search OTX for related pulses            │
│  • Check GreyNoise for scanner status       │
└─────────────────────────────────────────────┘
      │
      ↓
Enriched Alert to Analyst
\`\`\`

### Building Your Personal Toolkit

1. **Create accounts** on key platforms (free tiers)
2. **Bookmark** frequently used tools
3. **Learn API basics** for automation
4. **Build browser workflows** for quick lookups
5. **Document** your research processes
    `,
    keyTakeaways: [
      "TIPs aggregate and operationalize threat data from multiple sources",
      "VirusTotal is essential for file, URL, IP, and domain analysis",
      "Free resources like OTX, ThreatFox, and abuse.ch are valuable",
      "Integrate threat intel into your workflow for automated enrichment",
      "Build your personal toolkit of bookmarked platforms and workflows"
    ],
    practicalExercise: {
      title: "Platform Exploration",
      description: "Familiarize yourself with key threat intelligence platforms.",
      steps: [
        "Create a free VirusTotal account and explore the interface",
        "Sign up for AlienVault OTX and browse popular pulses",
        "Research a recent malware sample on ThreatFox",
        "Use Shodan to search for exposed services",
        "Document 5 tools you'll add to your daily workflow"
      ]
    }
  },
  {
    id: "6.5",
    courseId: "soc-fundamentals",
    title: "Threat Intelligence Quiz",
    content: `
# Threat Intelligence Quiz

Test your understanding of threat intelligence lifecycle and IOC analysis.

## Quiz Overview

This quiz covers the threat intelligence concepts from Module 6:
- Threat intelligence lifecycle
- IOC creation and analysis
- OSINT techniques and tools
- Threat intelligence platforms
- Information sharing frameworks

## Instructions

1. **Duration**: 25 minutes
2. **Questions**: 5 multiple-choice questions
3. **Passing Score**: 70% (4 out of 5 questions)
4. **Attempts**: Unlimited - retake if needed

## Key Topics to Review

Before taking the quiz, make sure you understand:
- Threat intelligence lifecycle phases
- IOC types and identification
- OSINT tools and techniques
- Threat intelligence platforms
- Information sharing communities
- Strategic vs tactical intelligence

## Taking the Quiz

Click the "Start Quiz" button below when you're ready. The quiz will cover:
- Threat intelligence processes
- IOC analysis and creation
- OSINT methodologies
- Platform utilization
- Sharing best practices

Good luck! Threat intelligence enhances proactive defense capabilities.
    `,
    keyTakeaways: [
      "Threat intelligence provides context for security events and alerts",
      "IOCs are technical indicators that help identify potential threats",
      "OSINT enables gathering threat information from public sources",
      "Threat intelligence platforms automate collection and analysis",
      "Information sharing strengthens collective defense capabilities"
    ],
    practicalExercise: {
      title: "Quiz Preparation",
      description: "Review threat intelligence concepts before taking the quiz.",
      steps: [
        "Study the threat intelligence lifecycle",
        "Learn IOC types and examples",
        "Review OSINT tools and techniques",
        "Understand sharing frameworks",
        "Take the quiz when ready"
      ]
    }
  }
];
