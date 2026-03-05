import { LessonContent } from "../lessonContent";

// Network Fundamentals - Module 1: Introduction to Computer Networks
export const lessonContents: LessonContent[] = [
  {
    id: "nf-1.1",
    courseId: "network-fundamentals",
    title: "What is a Computer Network?",
    content: `# What is a Computer Network?\n\nA **computer network** is a collection of interconnected devices that can communicate and share resources with each other. These devices, called **nodes**, can include computers, servers, smartphones, printers, and other network-enabled equipment.\n\n## Why Networks Matter\n\nNetworks have become the backbone of modern society:\n\n- **Communication** - Email, messaging, video calls\n- **Resource Sharing** - Printers, files, applications\n- **Internet Access** - Web browsing, cloud services, streaming\n- **Business Operations** - E-commerce, remote work, collaboration\n- **Security Monitoring** - Centralized logging, threat detection\n\n## Basic Components\n\nEvery network consists of three fundamental components:\n\n1. **Devices (Hosts)** - Endpoints that send and receive data\n2. **Media** - The physical or wireless path for data transmission\n3. **Protocols** - Rules governing how devices communicate\n\n## Types of Network Connections\n\n### Wired Networks\n- **Ethernet** - Most common wired technology\n- **Fiber Optic** - High-speed, long-distance connections\n- **Coaxial Cable** - Older technology, still used for cable internet\n\n### Wireless Networks\n- **Wi-Fi (802.11)** - Local wireless networking\n- **Bluetooth** - Short-range device connections\n- **Cellular (4G/5G)** - Wide-area wireless coverage\n\n## The Internet: A Network of Networks\n\nThe Internet is the largest computer network in the world, connecting billions of devices globally. It uses standardized protocols (primarily TCP/IP) to enable communication between diverse networks run by different organizations.\n\n## SOC Analyst Perspective\n\nAs a security analyst, understanding networks is essential because:\n- Most attacks traverse network connections\n- Network traffic analysis reveals threats\n- Security devices (firewalls, IDS/IPS) monitor network flows\n- Incident response requires network forensics skills`,
    keyTakeaways: [
      "A computer network enables communication and resource sharing between devices",
      "Networks consist of devices, media, and protocols",
      "Both wired (Ethernet, fiber) and wireless (Wi-Fi, cellular) technologies exist",
      "The Internet is a global network connecting billions of devices",
      "Network knowledge is fundamental for cybersecurity professionals"
    ],
    quiz: "nf-q1"
  },
  {
    id: "nf-1.2",
    courseId: "network-fundamentals",
    title: "Types of Networks: LAN, WAN, MAN & More",
    content: `# Types of Networks: LAN, WAN, MAN & More\n\nNetworks are categorized by their geographic scope and the technologies they use. Understanding these categories helps security analysts assess risk and apply appropriate controls.\n\n## Local Area Network (LAN)\n\n**Scope:** Single building or campus (up to ~2 km)\n\n**Characteristics:**\n- High-speed connections (1 Gbps to 10 Gbps+)\n- Owned and managed by the organization\n- Uses Ethernet and Wi-Fi technologies\n- Full control over security policies\n\n**Common Uses:**\n- Office buildings\n- School campuses\n- Home networks\n- Data centers\n\n## Wide Area Network (WAN)\n\n**Scope:** Cities, countries, or global (unlimited distance)\n\n**Characteristics:**\n- Connects multiple LANs across long distances\n- Uses leased lines, MPLS, or internet VPNs\n- Lower bandwidth and higher latency than LANs\n- Often managed by service providers\n\n**Examples:**\n- Corporate networks linking branch offices\n- The Internet itself\n- 4G/5G cellular networks\n\n## Metropolitan Area Network (MAN)\n\n**Scope:** City or metropolitan area (~5-50 km)\n\n**Characteristics:**\n- Larger than LAN, smaller than WAN\n- Often uses fiber optic infrastructure\n- Can be public (city Wi-Fi) or private\n\n**Examples:**\n- City-wide municipal networks\n- Cable television networks\n- University campus interconnects\n\n## Personal Area Network (PAN)\n\n**Scope:** Personal workspace (~10 meters)\n\n**Characteristics:**\n- Very short-range communication\n- Typically wireless (Bluetooth, Zigbee)\n- Connects personal devices\n\n**Examples:**\n- Smartphone to wireless earbuds\n- Laptop to Bluetooth mouse\n- Fitness tracker to phone\n\n## Security Implications\n\nDifferent network types have different security considerations:\n\n| Network Type | Primary Risks | Key Controls |\n|-------------|---------------|--------------|\n| LAN | Insider threats, lateral movement | Segmentation, NAC, monitoring |\n| WAN | Eavesdropping, interception | VPN encryption, MPLS |\n| Wi-Fi | Rogue APs, unauthorized access | WPA3, 802.1X, wireless IDS |\n| PAN | Device compromise, proximity attacks | Pairing authentication |`,
    keyTakeaways: [
      "LANs cover small areas with high speed; WANs connect distant locations",
      "MANs serve metropolitan areas, PANs connect personal devices",
      "Network topology affects reliability, performance, and security",
      "Each network type has unique security risks and controls",
      "Understanding network scope helps determine appropriate security measures"
    ],
    quiz: "nf-q1"
  },
  {
    id: "nf-1.3",
    courseId: "network-fundamentals",
    title: "Network Topologies",
    content: `# Network Topologies\n\n**Network topology** refers to the physical or logical layout of how devices are connected in a network. The choice of topology affects performance, reliability, cost, and security.\n\n## Star Topology\n\n**Layout:** All devices connect to a central device (switch or hub)\n\n**Advantages:**\n- Easy to install and manage\n- Single cable failure does not affect other devices\n- Simple to add new devices\n- Centralized management point\n\n**Disadvantages:**\n- Central device failure brings down entire network\n- More cable required than bus topology\n- Central device can be a bottleneck\n\n**Security Note:** The central switch is a critical security point - compromise it, and you control all traffic.\n\n## Bus Topology\n\n**Layout:** All devices connect to a single backbone cable\n\n**Advantages:**\n- Simple and inexpensive\n- Requires less cable than star\n- Easy to understand\n\n**Disadvantages:**\n- Backbone failure kills entire network\n- Difficult to troubleshoot\n- Limited scalability\n- Collisions reduce performance\n\n**Status:** Mostly obsolete; rarely used in modern networks\n\n## Mesh Topology\n\n**Layout:** Every device connects to every other device (full mesh) or multiple devices (partial mesh)\n\n**Advantages:**\n- Maximum redundancy and reliability\n- Multiple paths available\n- No single point of failure\n\n**Disadvantages:**\n- Expensive - requires many connections\n- Complex to configure and manage\n\n**Use Cases:**\n- Internet backbone routers (partial mesh)\n- Critical infrastructure networks\n\n## Hybrid Topology\n\nMost real-world networks combine multiple topologies:\n- **Star-Bus:** Multiple star networks connected by a backbone\n- **Hierarchical (Tree):** Stars nested within stars\n\n## Security Implications\n\n| Topology | Security Risk Level | Primary Concerns |\n|----------|--------------------|------------------|\n| Star | Medium | Central switch compromise |\n| Bus | High | Easy sniffing, no isolation |\n| Mesh | Low | Hard to intercept; but complex to secure |\n| Hybrid | Varies | Depends on weakest sub-topology |`,
    keyTakeaways: [
      "Star topology is most common today - simple but has a single point of failure",
      "Bus topology is largely obsolete in modern LANs",
      "Mesh provides maximum redundancy but at high cost",
      "Most networks use hybrid topologies combining multiple approaches",
      "Physical and logical topologies can differ significantly"
    ],
    quiz: "nf-q1"
  },
  {
    id: "nf-1.4",
    courseId: "network-fundamentals",
    title: "Network Architecture: Client-Server vs Peer-to-Peer",
    content: `# Network Architecture: Client-Server vs Peer-to-Peer\n\nNetwork architecture defines how devices communicate and share resources. The two primary models are **client-server** and **peer-to-peer (P2P)**.\n\n## Client-Server Architecture\n\n**Concept:** Centralized servers provide services to client devices\n\n### How It Works\n1. **Server** - Powerful computer providing centralized resources\n2. **Client** - Device requesting and using services\n3. **Request-Response** - Client requests, server responds\n\n### Common Server Types\n- **File servers** - Centralized storage and sharing\n- **Web servers** - Host websites and applications\n- **Database servers** - Store and manage data\n- **Mail servers** - Handle email communication\n- **DNS servers** - Resolve domain names to IP addresses\n\n### Advantages\n- **Centralized management** - Easier administration and security\n- **Scalability** - Add clients without re-architecting\n- **Security** - Control access at a single point\n- **Backup** - Centralized data protection\n\n### Disadvantages\n- **Single point of failure** - Server downtime affects all\n- **Cost** - Expensive server hardware and software\n- **Complexity** - Requires skilled administrators\n\n## Peer-to-Peer Architecture\n\n**Concept:** All devices are equals; each can act as client and server\n\n### How It Works\n1. Each peer has equal capabilities\n2. Peers connect directly to each other\n3. Resources distributed across all peers\n4. No central authority required\n\n### Advantages\n- **Simplicity** - No dedicated server needed\n- **Cost** - Uses existing workstations\n- **Resilience** - No single point of failure\n\n### Disadvantages\n- **Security** - Difficult to enforce policies\n- **Management** - No central control point\n- **Scalability** - Becomes chaotic at large scale\n\n## Security Comparison\n\n| Aspect | Client-Server | Peer-to-Peer |\n|--------|----------------|--------------|\n| Access Control | Centralized, strong | Distributed, weak |\n| Monitoring | Easy, at server | Difficult, distributed |\n| Data Protection | Centralized backup | User-managed |\n| Attack Surface | Concentrated on servers | Distributed across all peers |\n\n## SOC Analyst Perspective\n\n**Client-Server Networks:**\n- Focus on securing and monitoring servers\n- Server logs provide centralized visibility\n- Traffic patterns predictable (client to server)\n\n**Peer-to-Peer Networks:**\n- Monitor for unauthorized P2P applications\n- DLP (Data Loss Prevention) more challenging\n- Shadow IT risks - users can share freely`,
    keyTakeaways: [
      "Client-server centralizes resources and control; P2P distributes them",
      "Client-server is better for security and management at scale",
      "P2P is simpler for small networks but harder to secure",
      "Most modern networks use hybrid approaches",
      "Cloud computing extends client-server architecture with new security considerations"
    ],
    quiz: "nf-q1"
  },
  {
    id: "nf-q1",
    courseId: "network-fundamentals",
    title: "Computer Networks Basics Quiz",
    content: `
# Computer Networks Basics Quiz

This quiz covers Module 1.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q1"
  },
  {
    id: "nf-q2",
    courseId: "network-fundamentals",
    title: "OSI Model Quiz",
    content: `
# OSI Model Quiz

This quiz covers Module 2.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q2"
  },
  {
    id: "nf-q3",
    courseId: "network-fundamentals",
    title: "TCP/IP Protocol Suite Quiz",
    content: `
# TCP/IP Protocol Suite Quiz

This quiz covers Module 3.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q3"
  },
  {
    id: "nf-q4",
    courseId: "network-fundamentals",
    title: "IP Addressing & Subnetting Quiz",
    content: `
# IP Addressing & Subnetting Quiz

This quiz covers Module 4.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q4"
  },
  {
    id: "nf-q5",
    courseId: "network-fundamentals",
    title: "Network Devices Quiz",
    content: `
# Network Devices Quiz

This quiz covers Module 5.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q5"
  },
  {
    id: "nf-q6",
    courseId: "network-fundamentals",
    title: "Application Protocols Quiz",
    content: `
# Application Protocols Quiz

This quiz covers Module 6.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q6"
  },
  {
    id: "nf-q7",
    courseId: "network-fundamentals",
    title: "Ethernet & Data Link Quiz",
    content: `
# Ethernet & Data Link Quiz

This quiz covers Module 7.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q7"
  },
  {
    id: "nf-q8",
    courseId: "network-fundamentals",
    title: "Wireless Networking Quiz",
    content: `
# Wireless Networking Quiz

This quiz covers Module 8.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q8"
  },
  {
    id: "nf-q9",
    courseId: "network-fundamentals",
    title: "Network Troubleshooting Quiz",
    content: `
# Network Troubleshooting Quiz

This quiz covers Module 9.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q9"
  },
  {
    id: "nf-q10",
    courseId: "network-fundamentals",
    title: "Network Fundamentals Certification Exam",
    content: `
# Network Fundamentals Certification Exam

This final exam covers Modules 1-10.

Click the "Start Quiz" button when you're ready.
    `,
    quiz: "nf-q10"
  }
];
