import { LessonContent } from "../lessonContent";

export const threatHuntingFundamentals: LessonContent[] = [
  {
    id: "1.5",
    courseId: "threat-hunting",
    title: "Module 1 Quiz: Hunting Methodology & Mindset",
    content: `# Module 1 Quiz: Hunting Methodology & Mindset

Test your understanding of proactive threat hunting philosophy, maturity models, and hypothesis development approaches.

## What You'll Be Assessed On

- **Proactive vs Reactive Security**: The threat hunting mindset and limitations of reactive detection
- **Hunting Maturity Model**: HMM levels 0-4 and assessing organizational hunting capabilities
- **Hypothesis-Driven Hunting**: Formulating testable hypotheses from threat intelligence and TTPs
- **Data Sources**: Identifying and prioritizing telemetry across endpoint, network, cloud, and identity
- **Hunting Methodology**: Structured approaches to systematic threat discovery

## Quiz Details

- **10 questions** covering hunting fundamentals and methodology
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with practical hunting scenarios

## Before You Start

Review these key concepts:
- The fundamental difference between hunting and traditional alert-based detection
- Hunting Maturity Model levels and their characteristics
- Components of a strong, testable hunting hypothesis
- Essential data sources for comprehensive threat hunting
- Structured hunting methodologies and workflows

Ready to test your threat hunting methodology knowledge? Begin the quiz below.`,
    keyTakeaways: [
      "Threat hunting is proactive and hypothesis-driven, unlike reactive alert-based security",
      "The Hunting Maturity Model provides a framework for assessing and improving hunting capabilities",
      "Strong hypotheses are specific, testable, and grounded in threat intelligence",
      "Comprehensive data sources across multiple domains are essential for effective hunting",
      "Structured methodologies ensure systematic and repeatable threat discovery"
    ],
    quiz: "th-q1"
  },
  {
    id: "2.5",
    courseId: "threat-hunting",
    title: "Module 2 Quiz: Threat Intelligence Integration",
    content: `# Module 2 Quiz: Threat Intelligence Integration

Assess your knowledge of threat intelligence platforms, IOC analysis, ATT&CK mapping, and adversary profiling techniques.

## What You'll Be Assessed On

- **TI Platforms**: MISP, OpenCTI, ThreatConnect, and operationalizing intelligence feeds
- **IOC Types & Pyramid of Pain**: Understanding indicator value and persistence
- **MITRE ATT&CK**: Mapping hunts to techniques, sub-techniques, and required data sources
- **Threat Profiles**: Creating adversary profiles and predicting attack paths
- **Intelligence Enrichment**: Adding context and relationships to raw indicators

## Quiz Details

- **10 questions** covering threat intelligence integration for hunting
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with intelligence analysis scenarios

## Before You Start

Ensure you're comfortable with:
- Major threat intelligence platforms and their capabilities
- The Pyramid of Pain and indicator durability concepts
- MITRE ATT&CK framework structure and hunting applications
- Building comprehensive adversary threat profiles
- Intelligence enrichment and context analysis techniques

Ready to validate your threat intelligence integration skills? Take the quiz now.`,
    keyTakeaways: [
      "Threat intelligence platforms provide structured feeds and analysis capabilities",
      "The Pyramid of Pain helps prioritize indicators by their value and persistence",
      "MITRE ATT&CK provides a common language for mapping adversary behaviors",
      "Threat profiles enable predictive hunting based on adversary capabilities",
      "Intelligence enrichment transforms raw indicators into actionable hunting leads"
    ],
    quiz: "th-q2"
  },
  {
    id: "3.5",
    courseId: "threat-hunting",
    title: "Module 3 Quiz: Hunting Techniques & Tradecraft",
    content: `# Module 3 Quiz: Hunting Techniques & Tradecraft

Test your skills in behavioral analysis, anomaly detection, LOLBin hunting, and detection content deployment.

## What You'll Be Assessed On

- **Behavioral Analysis**: Identifying anomalous patterns that evade signature-based detection
- **Statistical Methods**: Frequency analysis, stacking, and outlier detection techniques
- **LOLBin Detection**: Hunting for Living Off the Land binaries and dual-use tool abuse
- **Detection Content**: Writing and deploying YARA rules and SIGMA rules during hunts
- **Advanced Techniques**: Process hollowing, injection, and fileless malware detection

## Quiz Details

- **10 questions** covering hunting techniques and tradecraft
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with technical hunting scenarios

## Before You Start

Review these essential areas:
- Behavioral analysis methodologies and pattern recognition
- Statistical hunting techniques and data analysis approaches
- Common LOLBins and their legitimate vs. malicious usage patterns
- YARA and SIGMA rule writing for hunting scenarios
- Advanced attack techniques and their detection signatures

Ready to test your hunting tradecraft expertise? Begin the quiz below.`,
    keyTakeaways: [
      "Behavioral analysis uncovers threats that evade traditional signature-based detection",
      "Statistical methods reveal anomalies through frequency and pattern analysis",
      "LOLBin detection requires understanding legitimate vs. malicious usage patterns",
      "Detection content creation enables systematic and repeatable hunting",
      "Advanced techniques like process hollowing require specialized detection approaches"
    ],
    quiz: "th-q3"
  },
  {
    id: "4.5",
    courseId: "threat-hunting",
    title: "Module 4 Quiz: Endpoint Threat Hunting",
    content: `# Module 4 Quiz: Endpoint Threat Hunting

Evaluate your knowledge of process analysis, persistence mechanisms, fileless threats, and credential attack detection.

## What You'll Be Assessed On

- **Process Tree Analysis**: Parent-child relationships and malicious execution chains
- **Persistence Hunting**: Registry keys, scheduled tasks, services, and WMI subscriptions
- **Fileless Threats**: Process injection, reflective DLL loading, and in-memory payloads
- **Credential Attacks**: LSASS dumps, Kerberoasting, AS-REP roasting, and token manipulation
- **Memory Forensics**: Volatility and memory-based threat detection techniques

## Quiz Details

- **10 questions** covering endpoint hunting methodologies
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with endpoint analysis scenarios

## Before You Start

Ensure you understand:
- Process tree analysis and anomalous parent-child relationships
- Common persistence mechanisms and their detection signatures
- Fileless malware techniques and memory-based detection methods
- Credential theft techniques and their forensic indicators
- Memory forensics tools and analysis methodologies

Ready to demonstrate your endpoint hunting expertise? Take the quiz below.`,
    keyTakeaways: [
      "Process tree analysis reveals malicious execution chains and parent-child anomalies",
      "Persistence mechanisms leave forensic traces across multiple system locations",
      "Fileless threats require memory-based detection and behavioral analysis",
      "Credential attacks generate distinctive forensic artifacts and behavioral patterns",
      "Memory forensics uncovers threats invisible to traditional disk-based analysis"
    ],
    quiz: "th-q4"
  },
  {
    id: "5.5",
    courseId: "threat-hunting",
    title: "Module 5 Quiz: Network & Cloud Hunting",
    content: `# Module 5 Quiz: Network & Cloud Hunting

Assess your ability to hunt in network metadata, encrypted traffic, cloud environments, and identity systems.

## What You'll Be Assessed On

- **Network Hunting**: Zeek logs, NetFlow, DNS analysis for lateral movement and C2
- **Encrypted Traffic**: JA3/JA3S fingerprinting and TLS metadata analysis
- **Cloud Environments**: AWS CloudTrail, Azure Activity Logs, and GCP Audit Logs
- **Identity-Based Hunting**: Impossible travel, MFA fatigue, and OAuth token abuse
- **Cross-Platform Correlation**: Connecting network, endpoint, and cloud events

## Quiz Details

- **10 questions** covering network and cloud hunting techniques
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with multi-domain hunting scenarios

## Before You Start

Review these key concepts:
- Network metadata analysis and C2 detection techniques
- Encrypted traffic fingerprinting and behavioral analysis
- Cloud logging platforms and their security event types
- Identity-based attack patterns and detection methods
- Cross-platform correlation and investigation methodologies

Ready to validate your network and cloud hunting skills? Begin the quiz now.`,
    keyTakeaways: [
      "Network metadata provides visibility into lateral movement and C2 communications",
      "Encrypted traffic analysis reveals behavioral patterns despite encryption",
      "Cloud environments generate unique logging requiring specialized hunting techniques",
      "Identity-based attacks leave distinctive patterns across authentication systems",
      "Cross-platform correlation connects disparate events into coherent attack narratives"
    ],
    quiz: "th-q5"
  },
  {
    id: "6.5",
    courseId: "threat-hunting",
    title: "Module 6 Quiz: Hunt Operations & Reporting",
    content: `# Module 6 Quiz: Hunt Operations & Reporting

Evaluate your understanding of hunt planning, automation, reporting, and converting successful hunts into detections.

## What You'll Be Assessed On

- **Hunt Planning**: Defining objectives, timelines, data requirements, and success criteria
- **Automation & Notebooks**: Jupyter notebooks, KQL, and SPL for repeatable workflows
- **Documentation**: Writing actionable hunt reports and driving detection improvements
- **Hunt-to-Detection**: Converting findings into automated detection rules
- **Operational Excellence**: Scaling hunting programs and measuring effectiveness

## Quiz Details

- **10 questions** covering hunt operations and management
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with operational scenario questions

## Before You Start

Ensure mastery of:
- Hunt planning methodologies and objective definition
- Automation tools and repeatable hunting workflows
- Report writing for technical and executive audiences
- Converting hunting findings into automated detections
- Measuring and scaling hunting program effectiveness

This final assessment validates your threat hunting operations expertise. Good luck!`,
    keyTakeaways: [
      "Structured planning ensures focused and effective threat hunting operations",
      "Automation enables scalable and repeatable hunting workflows",
      "Clear reporting drives detection improvements and demonstrates value",
      "Converting hunts to detections creates lasting security improvements",
      "Operational excellence ensures sustainable and measurable hunting programs"
    ],
    quiz: "th-q6"
  }
];
