import { LessonContent } from "../lessonContent";

export const networkSecurityMonitoring: LessonContent[] = [
  {
    id: "1.5",
    courseId: "network-security-monitoring",
    title: "Module 1 Quiz: NSM Foundations",
    content: `# Module 1 Quiz: NSM Foundations

Test your knowledge of Network Security Monitoring philosophy, network protocols, OSI model security perspectives, and sensor deployment strategies.

## What You'll Be Assessed On

- **NSM Philosophy**: Understanding the goals and principles of network security monitoring
- **Network Protocols**: TCP/IP, UDP, DNS, HTTP/S from a security perspective
- **OSI Model for Defenders**: How each layer exposes different attack surfaces
- **Sensor Placement**: Network tap points, SPAN ports, and deployment strategies
- **NSM Architecture**: Designing effective monitoring infrastructure

## Quiz Details

- **10 questions** covering NSM fundamentals
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with practical scenarios

## Before You Start

Review these key concepts:
- NSM vs. endpoint detection approaches
- Protocol-level security implications
- Strategic sensor placement for visibility
- Network tap vs. SPAN port considerations

Ready to test your NSM foundation knowledge? Begin the quiz below.`,
    keyTakeaways: [
      "NSM provides visibility into network-level threats that endpoint solutions might miss",
      "Understanding protocol behavior is essential for effective network monitoring",
      "Strategic sensor placement maximizes threat detection coverage",
      "The OSI model provides a framework for comprehensive network defense"
    ],
    quiz: "nsm-q1"
  },
  {
    id: "2.6",
    courseId: "network-security-monitoring",
    title: "Module 2 Quiz: Packet Capture & Analysis",
    content: `# Module 2 Quiz: Packet Capture & Analysis

Assess your Wireshark skills, TCP stream analysis capabilities, and expertise in DNS and HTTP traffic inspection for threat detection.

## What You'll Be Assessed On

- **Wireshark Proficiency**: Interface navigation, capture and display filters
- **TCP Stream Analysis**: Following conversations, identifying retransmissions
- **DNS Traffic Analysis**: Detecting tunneling, DGA domains, suspicious patterns
- **HTTP/HTTPS Inspection**: Analyzing web traffic and extracting malicious payloads
- **PCAP Analysis**: Practical investigation of real-world attack scenarios

## Quiz Details

- **10 questions** covering packet analysis techniques
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with scenario-based questions

## Before You Start

Ensure you're comfortable with:
- Wireshark display filters and conversation analysis
- DNS query patterns and threat indicators
- HTTP traffic analysis and file extraction
- Common attack patterns in packet captures

Ready to demonstrate your packet analysis expertise? Take the quiz now.`,
    keyTakeaways: [
      "Wireshark is essential for deep packet inspection and threat analysis",
      "TCP stream reconstruction reveals the full context of network conversations",
      "DNS analysis often uncovers command and control infrastructure",
      "HTTP inspection can reveal malicious payloads and data exfiltration attempts"
    ],
    quiz: "nsm-q2"
  },
  {
    id: "3.5",
    courseId: "network-security-monitoring",
    title: "Module 3 Quiz: Intrusion Detection with Suricata",
    content: `# Module 3 Quiz: Intrusion Detection with Suricata

Evaluate your understanding of Suricata architecture, rule writing capabilities, and alert management for effective intrusion detection.

## What You'll Be Assessed On

- **Suricata Architecture**: IDS/IPS engine setup and configuration
- **Rule Writing**: Syntax, content matching, flow keywords, protocol options
- **Alert Management**: Output handling, false positive suppression, thresholds
- **Rule Testing**: Validation and tuning of detection rules
- **Performance Considerations**: Optimizing Suricata for production environments

## Quiz Details

- **10 questions** covering Suricata operations and rule development
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with practical rule-writing scenarios

## Before You Start

Review these essential areas:
- Suricata rule syntax and keywords
- Alert tuning and threshold configuration
- Protocol-specific detection techniques
- Rule testing and validation procedures

Ready to validate your Suricata expertise? Begin the quiz below.`,
    keyTakeaways: [
      "Suricata provides powerful network intrusion detection capabilities",
      "Effective rule writing requires understanding of protocol behavior",
      "Alert tuning is crucial for reducing false positives and analyst fatigue",
      "Regular rule updates ensure detection of emerging threats"
    ],
    quiz: "nsm-q3"
  },
  {
    id: "4.5",
    courseId: "network-security-monitoring",
    title: "Module 4 Quiz: Network Metadata with Zeek",
    content: `# Module 4 Quiz: Network Metadata with Zeek

Test your knowledge of Zeek logs, threat hunting with network metadata, and basic Zeek scripting for custom detections and log enrichment.

## What You'll Be Assessed On

- **Zeek Fundamentals**: Log-based approach to network analysis
- **Log Types**: Understanding conn.log, dns.log, http.log, ssl.log, files.log
- **Threat Hunting**: Using metadata to detect C2, lateral movement, exfiltration
- **Zeek Scripting**: Writing custom detections and log enrichments
- **Log Analysis**: Interpreting Zeek output for security investigations

## Quiz Details

- **10 questions** covering Zeek operations and analysis
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with metadata analysis scenarios

## Before You Start

Ensure you understand:
- Zeek's log-based monitoring approach
- Key log fields and their security implications
- Metadata correlation for threat detection
- Basic Zeek scripting syntax and concepts

Ready to test your Zeek expertise? Take the quiz below.`,
    keyTakeaways: [
      "Zeek provides rich network metadata for comprehensive security monitoring",
      "Understanding log types is essential for effective threat hunting",
      "Metadata correlation reveals attack patterns across multiple protocols",
      "Zeek scripting enables custom detections tailored to your environment"
    ],
    quiz: "nsm-q4"
  },
  {
    id: "5.5",
    courseId: "network-security-monitoring",
    title: "Module 5 Quiz: Network Attack Detection",
    content: `# Module 5 Quiz: Network Attack Detection

Assess your ability to detect various network attack patterns including reconnaissance activities, command and control communications, lateral movement, and data exfiltration.

## What You'll Be Assessed On

- **Reconnaissance Detection**: Port scans, service enumeration, network mapping
- **C2 Detection**: Beaconing patterns, encrypted channels, covert communications
- **Lateral Movement**: SMB abuse, RDP pivoting, PsExec, pass-the-hash
- **Data Exfiltration**: Large transfers, DNS exfil, steganography, protocol tunneling
- **Attack Correlation**: Connecting individual events to larger attack campaigns

## Quiz Details

- **10 questions** covering network attack detection techniques
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with attack scenario analysis

## Before You Start

Review these detection techniques:
- Network reconnaissance indicators and patterns
- Command and control beaconing characteristics
- Lateral movement protocols and behaviors
- Data exfiltration methods and detection strategies

Ready to demonstrate your attack detection skills? Begin the quiz now.`,
    keyTakeaways: [
      "Network reconnaissance often precedes attacks and provides early warning",
      "C2 detection requires understanding of various communication protocols",
      "Lateral movement leaves distinctive network footprints",
      "Data exfiltration can occur through multiple channels requiring comprehensive monitoring"
    ],
    quiz: "nsm-q5"
  },
  {
    id: "6.5",
    courseId: "network-security-monitoring",
    title: "Module 6 Quiz: Practical NSM Operations",
    content: `# Module 6 Quiz: Practical NSM Operations

Evaluate your understanding of building complete NSM workflows, network forensics fundamentals, and operational best practices for effective security monitoring.

## What You'll Be Assessed On

- **NSM Workflows**: Integrating Zeek, Suricata, and SIEM for complete monitoring
- **Network Forensics**: Evidence preservation, timeline construction, reporting
- **Best Practices**: Sensor maintenance, rule updates, operational efficiency
- **Tool Integration**: Creating effective monitoring pipelines
- **Operational Challenges**: Scaling NSM operations and handling alert volumes

## Quiz Details

- **10 questions** covering NSM operations and management
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with operational scenario questions

## Before You Start

Ensure mastery of:
- Multi-tool integration strategies for comprehensive monitoring
- Network forensics methodologies and evidence handling
- Operational procedures for maintaining NSM effectiveness
- Workflow optimization and automation techniques

This final assessment validates your NSM operational expertise. Good luck!`,
    keyTakeaways: [
      "Effective NSM requires integration of multiple monitoring tools",
      "Network forensics provides crucial evidence for incident response",
      "Operational excellence ensures sustainable security monitoring",
      "Continuous improvement is essential for adapting to evolving threats"
    ],
    quiz: "nsm-q6"
  }
];
