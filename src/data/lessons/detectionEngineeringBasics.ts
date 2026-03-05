import { LessonContent } from "../lessonContent";

export const detectionEngineeringBasics: LessonContent[] = [
  {
    id: "1.5",
    courseId: "detection-engineering",
    title: "Module 1 Quiz: Detection Fundamentals",
    content: `# Module 1 Quiz: Detection Fundamentals

Test your understanding of detection philosophy, coverage models, alert quality management, and the detection engineering lifecycle.

## What You'll Be Assessed On

- **Detection Philosophy**: The art and science of building effective detections
- **Coverage Models**: Mapping and measuring your detection surface
- **Alert Quality**: Building high-fidelity alerts analysts trust
- **False Positive Management**: Strategies to reduce analyst fatigue
- **Detection Lifecycle**: From idea to production detection

## Quiz Details

- **10 questions** covering detection engineering fundamentals
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with practical scenarios

## Before You Start

Review these key concepts:
- The "assume breach" principle in detection engineering
- The Pyramid of Pain and why behavior-based detections are preferred
- False positive costs and the 5-day rule for noisy detections
- MITRE ATT&CK framework for coverage mapping
- Detection lifecycle from requirements to retirement

Ready to test your detection fundamentals knowledge? Begin the quiz below.`,
    keyTakeaways: [
      "Detection engineering requires both technical skill and strategic thinking",
      "High-fidelity alerts are essential for maintaining analyst trust and effectiveness",
      "Behavior-based detections are more durable than IOC-based approaches",
      "Systematic lifecycle management ensures detection program sustainability"
    ],
    quiz: "de-q1"
  },
  {
    id: "2.5",
    courseId: "detection-engineering",
    title: "Module 2 Quiz: SIGMA Rules",
    content: `# Module 2 Quiz: SIGMA Rules

Assess your knowledge of SIGMA syntax, modifiers, rule conversion, and writing effective generic detection rules.

## What You'll Be Assessed On

- **SIGMA Syntax**: YAML format, logsource specification, and rule structure
- **Rule Writing**: Crafting rules from threat intelligence and hunt findings
- **Modifiers & Conditions**: Advanced logic, aggregation, and near-time correlation
- **Rule Conversion**: Converting SIGMA to Splunk SPL, Elastic KQL, and Sentinel
- **SigmaHQ**: Using the community rule repository effectively

## Quiz Details

- **10 questions** covering SIGMA rule development
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with syntax and conversion scenarios

## Before You Start

Ensure you're comfortable with:
- YAML syntax and SIGMA rule structure
- Logsource abstraction and field mapping
- SIGMA modifiers (startswith, endswith, contains, etc.)
- Aggregation functions and timeframes
- Processing pipelines for field translation

Ready to validate your SIGMA expertise? Take the quiz now.`,
    keyTakeaways: [
      "SIGMA provides vendor-neutral detection rules that can be converted to multiple SIEM platforms",
      "Understanding logsource abstraction is key to writing portable detection rules",
      "SIGMA modifiers enable sophisticated pattern matching without complex regex",
      "The SigmaHQ repository offers thousands of community-maintained detection rules"
    ],
    quiz: "de-q2"
  },
  {
    id: "3.5",
    courseId: "detection-engineering",
    title: "Module 3 Quiz: YARA Signatures",
    content: `# Module 3 Quiz: YARA Signatures

Test your knowledge of YARA rule structure, pattern matching techniques, advanced conditions, and production deployment considerations.

## What You'll Be Assessed On

- **YARA Structure**: Meta, strings, and condition blocks
- **Pattern Matching**: Text, hex, regex, and wildcard patterns
- **Advanced Conditions**: Modules, file size, entropy, and PE features
- **Production Use**: Performance optimization and integration strategies
- **Obfuscation Detection**: Using modifiers to identify encoded patterns

## Quiz Details

- **10 questions** covering YARA rule development and deployment
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with pattern matching scenarios

## Before You Start

Review these essential areas:
- YARA rule syntax and the three main sections
- String modifiers (wide, xor, nocase, etc.)
- PE module usage for executable analysis
- Performance optimization techniques
- Entropy analysis for packed content detection

Ready to test your YARA signature skills? Begin the quiz below.`,
    keyTakeaways: [
      "YARA provides powerful pattern matching for malware detection and threat hunting",
      "Understanding PE structure and modules enables sophisticated malware analysis",
      "Performance optimization is crucial for production YARA deployments",
      "String modifiers help detect common obfuscation techniques automatically"
    ],
    quiz: "de-q3"
  },
  {
    id: "4.5",
    courseId: "detection-engineering",
    title: "Module 4 Quiz: Log Source Mastery",
    content: `# Module 4 Quiz: Log Source Mastery

Test your knowledge of Windows, Linux, network, and cloud log sources, along with normalization and enrichment techniques.

## What You'll Be Assessed On

- **Windows Logs**: Event IDs, Sysmon, and audit policies
- **Linux & Network Logs**: Auditd, syslog, Zeek, and firewall logs
- **Cloud & Identity Logs**: CloudTrail, Azure AD, Okta, and SaaS logs
- **Normalization**: CIM, ECS, and field mapping strategies
- **Enrichment**: Adding context, threat intel, and asset information

## Quiz Details

- **10 questions** covering diverse log sources and processing
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with log analysis scenarios

## Before You Start

Ensure you understand:
- Critical Windows Event IDs for security monitoring
- Sysmon events and their significance
- Cloud logging mechanisms and API call tracking
- Log normalization schemas (CIM, ECS)
- Enrichment sources and techniques

Ready to demonstrate your log source expertise? Take the quiz below.`,
    keyTakeaways: [
      "Diverse log sources provide comprehensive visibility across the attack surface",
      "Sysmon fills critical gaps in Windows native logging capabilities",
      "Cloud logs require different approaches than traditional on-premises sources",
      "Normalization enables consistent querying across heterogeneous log sources"
    ],
    quiz: "de-q4"
  },
  {
    id: "5.5",
    courseId: "detection-engineering",
    title: "Module 5 Quiz: Detection as Code",
    content: `# Module 5 Quiz: Detection as Code

Assess your understanding of version control, CI/CD pipelines, testing frameworks, and infrastructure as code for detection engineering.

## What You'll Be Assessed On

- **Version Control**: Git workflows, branching, and review processes
- **CI/CD Pipelines**: Automated testing, validation, and deployment
- **Testing Frameworks**: Unit testing, Atomic Red Team, and validation
- **Infrastructure as Code**: Terraform, Ansible, and repeatable deployments
- **Detection Quality**: Automated validation and coverage analysis

## Quiz Details

- **10 questions** covering detection-as-code practices and tools
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with DevOps scenarios for detections

## Before You Start

Review these key concepts:
- Git workflows for detection rule management
- CI/CD pipeline components for automated testing
- Atomic Red Team for detection validation
- Infrastructure as code principles for SIEM management
- Testing strategies for detection quality assurance

Ready to validate your detection-as-code knowledge? Begin the quiz now.`,
    keyTakeaways: [
      "Detection as Code applies software engineering best practices to detection development",
      "Automated testing ensures detection quality and prevents regressions",
      "Infrastructure as Code enables reproducible and scalable SIEM deployments",
      "Version control provides audit trails and collaboration capabilities for detection teams"
    ],
    quiz: "de-q5"
  },
  {
    id: "6.5",
    courseId: "detection-engineering",
    title: "Module 6 Quiz: Detection Operations",
    content: `# Module 6 Quiz: Detection Operations

Evaluate your understanding of detection tuning, metrics measurement, ATT&CK coverage mapping, and lifecycle management for mature detection programs.

## What You'll Be Assessed On

- **Detection Tuning**: Reducing noise while maintaining coverage
- **Metrics & KPIs**: Measuring detection program effectiveness
- **ATT&CK Coverage**: Visualizing and tracking detection coverage
- **Lifecycle Management**: Retirement, review cadence, and improvement
- **Operational Excellence**: Scaling detection programs sustainably

## Quiz Details

- **10 questions** covering detection operations and program management
- **Passing score**: 70% or higher
- **Time limit**: 15 minutes
- **Format**: Multiple choice with operational scenario questions

## Before You Start

Ensure mastery of:
- Detection tuning methodologies and techniques
- Key metrics for measuring detection effectiveness
- ATT&CK coverage mapping and gap analysis
- Detection lifecycle management processes
- Operational scaling considerations and best practices

This final assessment validates your detection operations expertise. Good luck!`,
    keyTakeaways: [
      "Continuous tuning is essential for maintaining detection effectiveness over time",
      "Metrics-driven management enables data-driven detection program improvements",
      "ATT&CK coverage mapping provides strategic visibility into detection gaps",
      "Lifecycle management ensures detections remain relevant and effective"
    ],
    quiz: "de-q6"
  }
];
