import { LessonContent } from "../lessonContent";

export const socAnalystLearningPath: LessonContent[] = [
  {
    id: "1.5",
    courseId: "soc-analyst-path",
    title: "Module 1 Quiz: SOC Analyst Role & Environment",
    content: `# Module 1 Quiz: SOC Analyst Role & Environment

Test your understanding of SOC operations, maturity models, compliance frameworks, and the day-to-day responsibilities of a SOC analyst.

## What You'll Be Assessed On

- **SOC Operations**: Daily workflows, shift handovers, and escalation procedures
- **Maturity Models**: SOC-CMM levels and capability assessment
- **Compliance Frameworks**: PCI-DSS, HIPAA, GDPR, and SOX requirements
- **Toolkits**: Essential investigation tools for SOC analysts
- **Alert Triage**: Prioritization and escalation best practices

## Quiz Details

- **15 questions** covering all Module 1 topics
- **Passing score**: 70% or higher
- **Time limit**: 20 minutes
- **Format**: Multiple choice with detailed explanations

## Before You Start

Review these key concepts:
- SOC maturity levels and their characteristics
- Regulatory requirements for different industries
- Essential tools for threat analysis and investigation
- Proper alert triage and escalation procedures

Ready to test your knowledge? Click the button below to begin the quiz.`,
    keyTakeaways: [
      "SOC maturity models help assess and improve operational capabilities",
      "Compliance requirements vary by industry but share common security principles",
      "A well-equipped analyst toolkit is essential for effective investigations",
      "Proper alert triage ensures critical threats are prioritized and escalated"
    ],
    quiz: "sap-q1"
  },
  {
    id: "2.5",
    courseId: "soc-analyst-path",
    title: "Module 2 Quiz: Network Traffic Analysis",
    content: `# Module 2 Quiz: Network Traffic Analysis

Evaluate your skills in TCP/IP analysis, DNS threat detection, and packet inspection using Wireshark and other analysis tools.

## What You'll Be Assessed On

- **TCP/IP Analysis**: Protocol behavior, flags, handshakes, and anomalies
- **DNS Threats**: Tunneling, DGA domains, fast-flux networks
- **HTTP/HTTPS Investigation**: Malicious payloads and beaconing patterns
- **Wireshark Skills**: Packet capture, filters, and stream analysis
- **Threat Detection**: Identifying C2 communication and lateral movement

## Quiz Details

- **15 questions** covering network analysis techniques
- **Passing score**: 75% or higher
- **Time limit**: 20 minutes
- **Format**: Multiple choice with practical scenarios

## Before You Start

Ensure you're comfortable with:
- TCP flag combinations and their implications
- DNS query patterns and threat indicators
- Wireshark display filters and conversation analysis
- Common C2 beaconing characteristics

Ready to demonstrate your network analysis expertise? Begin the quiz below.`,
    keyTakeaways: [
      "Network traffic analysis reveals attacker TTPs and C2 infrastructure",
      "DNS is often abused for command and control and data exfiltration",
      "Wireshark is an essential tool for deep packet inspection",
      "Understanding normal network behavior helps detect anomalies"
    ],
    quiz: "sap-q2"
  },
  {
    id: "3.5",
    courseId: "soc-analyst-path",
    title: "Module 3 Quiz: SIEM Mastery",
    content: `# Module 3 Quiz: SIEM Mastery

Test your SIEM query writing, correlation rule development, and dashboard creation skills for effective security monitoring.

## What You'll Be Assessed On

- **Advanced Queries**: Complex searches using regex, subsearches, and statistical functions
- **Correlation Rules**: Multi-event detection and false positive reduction
- **Dashboard Creation**: Actionable visualizations and drill-down capabilities
- **Log Source Onboarding**: Integration, normalization, and validation
- **Performance Tuning**: Query optimization and resource management

## Quiz Details

- **15 questions** covering SIEM operations and best practices
- **Passing score**: 75% or higher
- **Time limit**: 25 minutes
- **Format**: Multiple choice with scenario-based questions

## Before You Start

Review these key areas:
- Statistical functions and aggregation techniques
- Threat-informed correlation rule design
- Dashboard design principles for SOC operations
- Log source integration and field normalization

Ready to validate your SIEM expertise? Take the quiz now.`,
    keyTakeaways: [
      "Effective SIEM queries require understanding of data structures and search optimization",
      "Multi-event correlation significantly reduces false positives",
      "Actionable dashboards enable rapid threat assessment and response",
      "Proper log source onboarding ensures complete visibility"
    ],
    quiz: "sap-q3"
  },
  {
    id: "4.5",
    courseId: "soc-analyst-path",
    title: "Module 4 Quiz: Endpoint Investigation",
    content: `# Module 4 Quiz: Endpoint Investigation

Assess your endpoint forensics knowledge covering Windows and Linux systems, including process analysis, persistence mechanisms, and memory forensics.

## What You'll Be Assessed On

- **Process Forensics**: Parent-child relationships, injection, and LOLBins
- **Persistence Analysis**: Registry, scheduled tasks, services, and WMI
- **Linux Forensics**: Processes, connections, cron jobs, and shell history
- **Memory Analysis**: Volatility plugins and in-memory artifacts
- **Threat Detection**: Identifying common attacker techniques on endpoints

## Quiz Details

- **15 questions** covering endpoint investigation techniques
- **Passing score**: 70% or higher
- **Time limit**: 20 minutes
- **Format**: Multiple choice with practical scenarios

## Before You Start

Ensure you understand:
- Windows process trees and legitimate parent-child relationships
- Common persistence mechanisms across operating systems
- Linux commands for endpoint investigation
- Memory analysis techniques and artifact identification

Ready to test your endpoint forensics skills? Begin the quiz.`,
    keyTakeaways: [
      "Understanding normal process behavior helps detect malicious activity",
      "Attackers use multiple persistence mechanisms to maintain access",
      "Linux endpoints require different investigation techniques than Windows",
      "Memory analysis captures artifacts not visible in disk forensics"
    ],
    quiz: "sap-q4"
  },
  {
    id: "5.5",
    courseId: "soc-analyst-path",
    title: "Module 5 Quiz: Phishing & Email Analysis",
    content: `# Module 5 Quiz: Phishing & Email Analysis

Validate your email header analysis skills and phishing response capabilities through practical scenarios and investigation techniques.

## What You'll Be Assessed On

- **Email Headers**: Tracing message origin and identifying spoofing
- **Authentication**: SPF, DKIM, and DMARC verification
- **Attachment Analysis**: Office macros, PDFs, and archive payloads
- **URL Investigation**: Domain analysis and threat intelligence
- **Response Procedures**: End-to-end phishing incident handling

## Quiz Details

- **15 questions** covering email security and investigation
- **Passing score**: 75% or higher
- **Time limit**: 20 minutes
- **Format**: Multiple choice with real-world scenarios

## Before You Start

Review these essential skills:
- Email header field interpretation and analysis
- Authentication mechanism failures and their implications
- Safe attachment analysis techniques
- Domain investigation tools and methodologies

Ready to prove your email analysis expertise? Take the quiz below.`,
    keyTakeaways: [
      "Email headers reveal the true origin and path of messages",
      "Authentication failures indicate potential spoofing or tampering",
      "Malicious attachments use various techniques to evade detection",
      "Effective phishing response requires coordination across multiple teams"
    ],
    quiz: "sap-q5"
  },
  {
    id: "6.5",
    courseId: "soc-analyst-path",
    title: "Module 6 Quiz: Incident Handling & Reporting",
    content: `# Module 6 Quiz: Incident Handling & Reporting

Comprehensive final exam covering incident handling procedures, evidence management, reporting standards, and post-incident activities.

## What You'll Be Assessed On

- **Severity Classification**: Consistent scoring and prioritization frameworks
- **Evidence Collection**: Chain of custody and legal admissibility
- **Report Writing**: Executive summaries and technical documentation
- **Post-Incident Review**: Lessons learned and improvement processes
- **Communication**: Stakeholder management and escalation procedures

## Quiz Details

- **25 questions** comprehensive coverage of incident handling
- **Passing score**: 80% or higher
- **Time limit**: 35 minutes
- **Format**: Multiple choice with complex scenarios

## Before You Start

Ensure mastery of:
- Incident severity frameworks and business impact assessment
- Digital evidence handling and documentation requirements
- Report structure for different audiences (technical vs. executive)
- Root cause analysis and improvement identification

This is your final assessment for the SOC Analyst Learning Path. Good luck!`,
    keyTakeaways: [
      "Consistent severity classification ensures appropriate resource allocation",
      "Proper evidence collection is critical for legal and forensic purposes",
      "Effective reporting communicates findings to technical and executive audiences",
      "Post-incident reviews drive continuous improvement in security capabilities"
    ],
    quiz: "sap-q6"
  }
];
