import { LessonContent } from "../../lessonContent";

// Module 4: Network & Cloud Logs
export const module4: LessonContent[] = [
  {
    id: "4.1",
    courseId: "log-analysis",
    title: "Firewall & Network Device Logs",
    content: `
# Firewall & Network Device Logs

Network device logs provide visibility into traffic patterns, connection attempts, and potential threats traversing your network.

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

## Analysis Techniques

### Traffic Pattern Analysis
\`\`\`bash
# Top talkers by volume
awk '{print $8}' firewall.log | sort | uniq -c | sort -rn

# Blocked connections by country
geoiplookup <blocked_ips> | grep Country

# DNS anomalies - high NXDOMAIN rate
grep NXDOMAIN dns.log | awk '{print $4}' | sort | uniq -c | awk '$1 > 100'
\`\`\`

### Correlation with Other Sources
- Firewall denies + auth failures = brute force
- DNS queries + firewall allows = C2 communication
- Large outbound transfers + unusual user = data exfiltration
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
    id: "4.2",
    courseId: "log-analysis",
    title: "Cloud Service Logs (AWS/Azure)",
    content: `
# Cloud Service Logs (AWS/Azure)

Cloud platforms generate extensive logs that are crucial for security monitoring in modern environments.

## AWS Cloud Logs

### CloudTrail
**What it logs:** API calls and management events

**Key fields:**
- EventTime
- EventSource (service)
- EventName (action)
- SourceIPAddress
- UserAgent
- AwsRegion
- UserName

**Example CloudTrail Event:**
\`\`\`json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "admin"
  },
  "eventTime": "2024-01-15T10:30:00Z",
  "eventSource": "iam.amazonaws.com",
  "eventName": "CreateUser",
  "sourceIPAddress": "203.0.113.50",
  "userAgent": "aws-cli/2.0.55"
}
\`\`\`

### VPC Flow Logs
**What it logs:** Network traffic in VPC

**Format:**
\`\`\`
version account-id interfaceid srcaddr dstaddr srcport dstport protocol packets bytes action start end
\`\`\`

**Example:**
\`\`\`
2 123456789012 eni-12345678 10.0.0.5 52.94.0.1 443 49152 6 25 2000 ACCEPT 1705312800 1705312860
\`\`\`

### S3 Access Logs
**What it logs:** Object-level access

**Fields:**
- Bucket Owner
- Bucket
- Time
- Remote IP
- Requester
- Request ID
- Operation
- Key
- Request-URI
- HTTP status
- Error Code
- Bytes Sent
- Object Size
- Total Time
- Turnaround Time
- Referer
- User Agent
- Version ID

### GuardDuty
**What it logs:** Threat detection findings

**Example Finding:**
\`\`\`json
{
  "type": "UnauthorizedAccess:EC2/SSHBruteForce",
  "severity": "high",
  "resource": {
    "resourceType": "Instance",
    "instanceId": "i-1234567890abcdef0"
  },
  "service": {
    "action": {
      "actionType": "PORT_PROBE",
      "portProbeDetails": {
        "localPortDetails": {
          "port": 22,
          "portName": "SSH"
        }
      }
    }
  }
}
\`\`\`

## Azure Cloud Logs

### Activity Log
**What it logs:** Management operations

**Key fields:**
- Timestamp
- Operation name
- Caller
- Resource
- Category
- Level
- Status

### Azure AD Sign-in Logs
**What it logs:** Authentication events

**Fields:**
- Date
- User
- Application
- Status
- Failure Reason
- IP Address
- Location
- Device

### Network Security Group (NSG) Flow Logs
**What it logs:** Network traffic

**Format similar to AWS VPC Flow Logs**

### Microsoft Defender for Cloud
**What it logs:** Security alerts

**Example Alert:**
\`\`\`json
{
  "alertDisplayName": "Suspicious PowerShell command",
  "severity": "Medium",
  "status": "New",
  "entities": [
    {
      "type": "Account",
      "accountName": "user@domain.com"
    }
  ]
}
\`\`\`

## Google Cloud Logs

### Cloud Audit Logs
- Admin Activity
- Data Access
- System Events

### VPC Flow Logs
Similar to AWS/Azure

### Cloud Armor Logs
WAF and DDoS protection logs

## Cloud Log Collection

### AWS
\`\`\`bash
# CloudTrail via S3
aws s3 cp s3://my-cloudtrail-bucket/AWSLogs/ ./ --recursive

# Enable CloudTrail logging
aws cloudtrail create-trail --name my-trail --s3-bucket-name my-bucket

# Query CloudTrail with Athena
SELECT * FROM cloudtrail_logs WHERE eventname = 'CreateUser'
\`\`\`

### Azure
\`\`\`bash
# Export logs via Azure Monitor
az monitor activity-log list --offset 1d

# Stream to Log Analytics
az monitor log-analytics workspace create --resource-group myRG --name myWorkspace
\`\`\`

## Cloud Security Monitoring

### IAM Privilege Escalation
\`\`\`
# AWS: Detect admin role assumption
EventName = AssumeRole AND RoleName CONTAINS "Admin"

# Azure: Detect role assignment
OperationName = "Create role assignment" AND RoleName CONTAINS "Owner"
\`\`\`

### Unauthorized API Access
\`\`\`
# AWS: Root account usage
UserIdentity.type = "Root"

# Azure: Suspicious locations
Location NOT IN ("United States", "Canada") AND User = "admin@domain.com"
\`\`\`

### Data Exfiltration
\`\`\`
# AWS: Unusual S3 access
EventName = "GetObject" AND Bucket = "sensitive-data" AND SourceIPAddress NOT IN corporate_ips

# Azure: Blob downloads
OperationName = "BlobRead" AND Status = "Success" AND unusual_time
\`\`\`

## Cloud-Specific Threats

### Misconfigured S3 Buckets
- Public read/write permissions
- Unauthenticated access
- Data exposed to internet

### Cloud Credential Theft
- Access keys in code repositories
- Stolen session tokens
- Compromised service accounts

### Resource Hijacking
- Crypto-mining instances
- Unauthorized resource creation
- Cost spikes

### Insider Threats
- Data downloads before leaving
- Privilege abuse
- Accessing unusual resources
    `,
    keyTakeaways: [
      "CloudTrail (AWS) and Activity Log (Azure) track all management operations",
      "VPC/NSG flow logs provide network visibility in cloud environments",
      "GuardDuty and Defender for Cloud provide managed threat detection",
      "Cloud logs require different collection methods (APIs, streaming, storage)",
      "Monitor for privilege escalation, unauthorized access, and data exfiltration"
    ]
  },
  {
    id: "4.3",
    courseId: "log-analysis",
    title: "Email & Collaboration Logs",
    content: `
# Email & Collaboration Logs

Email and collaboration platforms (Microsoft 365, Google Workspace) generate valuable logs for detecting phishing, account compromise, and data leaks.

## Microsoft 365 Logs

### Unified Audit Log (UAL)
**What it logs:** All user and admin activities across M365

**Access via:**
- Security & Compliance Center
- PowerShell (Search-UnifiedAuditLog)
- API

**Key activities:**
- Exchange (email)
- SharePoint/OneDrive
- Teams
- Azure AD
- Power Platform

### Exchange Online Logs

**MailItemsAccessed:**
\`\`\`json
{
  "CreationTime": "2024-01-15T10:30:00",
  "Operation": "MailItemsAccessed",
  "UserId": "user@domain.com",
  "ClientIP": "192.168.1.100",
  "AffectedItems": [
    {
      "Id": "abc123",
      "Subject": "Confidential Project",
      "Folder": "Inbox"
    }
  ]
}
\`\`\`

**MailItemsAccessed with suspicious patterns:**
- Large number of emails accessed
- Access to sensitive folders
- Unusual time patterns
- Access from new locations

### Azure AD Sign-in Logs

**Sign-in activity:**
\`\`\`json
{
  "date": "2024-01-15T10:30:00",
  "user": "user@domain.com",
  "app": "Office 365",
  "status": "Success",
  "failureReason": "",
  "clientApp": "Browser",
  "conditionalAccessStatus": "Success",
  "ipAddress": "192.168.1.100",
  "location": {
    "city": "New York",
    "country": "United States"
  },
  "riskDetail": "none",
  "riskLevelAggregated": "low",
  "riskLevelDuringSignIn": "low"
}
\`\`\`

**Suspicious sign-in indicators:**
- Impossible travel
- Anonymous IP addresses
- Impossible locations
- Risky IP addresses
- Unfamiliar sign-in properties

### Teams Logs

**Call and meeting activities:**
- CallStarted
- CallEnded
- MeetingJoined
- MeetingLeft
- FileShared
- MessageSent

**File operations:**
- FileUploaded
- FileDownloaded
- FileModified
- FileDeleted
- FileAccessed

## Google Workspace Logs

### Admin Audit Logs
**What it logs:** Admin actions in Google Workspace

**Examples:**
- User creation/deletion
- Group membership changes
- Security settings modifications
- License assignments

### Drive Logs
**File activities:**
- View
- Edit
- Create
- Delete
- Download
- Print
- Copy
- Move
- Rename
- Share

**Example Drive Activity:**
\`\`\`json
{
  "id": {
    "time": "2024-01-15T10:30:00.000Z",
    "uniqueQualifier": "1234567890"
  },
  "actor": {
    "email": "user@domain.com",
    "profileId": "123456789"
  },
  "actions": [
    {
      "detail": {
        "targetUser": "target@domain.com"
      },
      "type": "download"
    }
  ],
  "target": {
    "type": "DriveItem",
    "id": "abc123def456"
  }
}
\`\`\`

### Gmail Logs
**Message operations:**
- View
- Compose
- Send
- Delete
- Export
- Import
- Label changes

### Calendar Logs
- Event creation
- Event modification
- Event deletion
- Sharing changes

## Phishing Detection

### Email Gateway Logs
**Key indicators:**
- Spam score
- Malware detected
- URL rewriting
- Attachment scanning
- Sender reputation

**Example:**
\`\`\`
Timestamp: 2024-01-15 10:30:00
From: support@micros0ft.com
To: user@domain.com
Subject: Account Verification
Action: Quarantine
Reason: Spoofed domain
SpamScore: 9.5
Malware: None
URLs: [suspicious-link.com]
\`\`\`

### User-Reported Phishing
**Microsoft 365:**
- Report Phishing button
- Admin submissions
- User feedback

**Google Workspace:**
- Report phishing
- Safety Toolbox
- Admin reports

## Data Loss Prevention (DLP)

### Sensitive Content Detection
**Credit card numbers:**
- Pattern: 4xxx-xxxx-xxxx-xxxx
- Context: Financial documents

**Social Security Numbers:**
- Pattern: xxx-xx-xxxx
- Context: HR documents

**Custom patterns:**
- Internal identifiers
- Project codes
- Confidential markers

### DLP Policy Violations
\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00",
  "policy": "PII Data Protection",
  "rule": "Credit Card Numbers",
  "severity": "High",
  "user": "user@domain.com",
  "action": "Block",
  "location": "Email",
  "content": "Email containing credit card"
}
\`\`\`

## Investigation Techniques

### Timeline Analysis
\`\`\`
# M365: Mail access pattern
Search-UnifiedAuditLog -Operations MailItemsAccessed -StartDate (Get-Date).AddDays(-7) -EndDate (Get-Date) | 
  Group-Object UserId | 
  Sort-Object Count -Descending
\`\`\`

### Geographic Anomalies
\`\`\`
# Azure AD: Unusual locations
Get-AzureADAuditSignInLogs -Filter "location/countryOrRegion ne 'United States'" | 
  Select-Object UserDisplayName, IPAddress, Location
\`\`\`

### Mass Email Operations
\`\`\`
# Detect mass deletion or forwarding
Operation = "SoftDelete" AND Folder = "Sent Items" AND Count > 100
Operation = "CreateInboxRule" AND Actions = "MoveToFolder"
\`\`\`

### External Sharing
\`\`\`
# Google Drive: External sharing
target.type = "ExternalUser" OR target.type = "Public"
\`\`\`

## Response Procedures

### Compromised Account
1. **Immediate actions:**
   - Reset password
   - Revoke sessions
   - Block sign-ins
   - Enable MFA

2. **Investigation:**
   - Review sign-in logs
   - Check email forwarding rules
   - Analyze sent items
   - Review file access

3. **Recovery:**
   - Remove malicious rules
   - Delete sent spam
   - Notify contacts
   - Monitor activity
    `,
    keyTakeaways: [
      "Unified Audit Log (M365) and Workspace logs track all user activities",
      "Sign-in logs reveal geographic anomalies and impossible travel",
      "MailItemsAccessed events show email access patterns",
      "Drive/SharePoint logs detect file access and sharing",
      "Monitor for mass operations, external sharing, and DLP violations"
    ]
  },
  {
    id: "4.4",
    courseId: "log-analysis",
    title: "Hands-On: Cloud Log Investigation",
    content: `
# Hands-On: Cloud Log Investigation

Investigate a potential cloud security incident using AWS and Microsoft 365 logs.

## Scenario

Your organization uses AWS and Microsoft 365. An alert triggered about suspicious activity. You need to:

1. Identify if there's a breach
2. Determine the scope
3. Document all findings

## AWS CloudTrail Logs

### Event 1: Console Login
\`\`\`json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "admin",
    "arn": "arn:aws:iam::123456789012:user/admin"
  },
  "eventTime": "2024-01-15 08:00:00Z",
  "eventSource": "signin.amazonaws.com",
  "eventName": "ConsoleLogin",
  "sourceIPAddress": "203.0.113.50",
  "userAgent": "Mozilla/5.0",
  "responseElements": {
    "ConsoleLogin": "Success"
  }
}
\`\`\`

### Event 2: User Creation
\`\`\`json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "admin"
  },
  "eventTime": "2024-01-15 08:05:00Z",
  "eventSource": "iam.amazonaws.com",
  "eventName": "CreateUser",
  "sourceIPAddress": "203.0.113.50",
  "requestParameters": {
    "userName": "backup-admin"
  }
}
\`\`\`

### Event 3: Policy Attachment
\`\`\`json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "admin"
  },
  "eventTime": "2024-01-15 08:06:00Z",
  "eventSource": "iam.amazonaws.com",
  "eventName": "AttachUserPolicy",
  "sourceIPAddress": "203.0.113.50",
  "requestParameters": {
    "userName": "backup-admin",
    "policyArn": "arn:aws:iam::aws:policy/AdministratorAccess"
  }
}
\`\`\`

### Event 4: S3 Access
\`\`\`json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "backup-admin"
  },
  "eventTime": "2024-01-15 08:10:00Z",
  "eventSource": "s3.amazonaws.com",
  "eventName": "GetObject",
  "sourceIPAddress": "203.0.113.50",
  "requestParameters": {
    "bucketName": "confidential-data",
    "key": "customer-list.csv"
  }
}
\`\`\`

## Microsoft 365 Logs

### Event 5: Suspicious Sign-in
\`\`\`json
{
  "date": "2024-01-15 08:15:00",
  "user": "admin@company.com",
  "app": "Office 365",
  "status": "Success",
  "clientApp": "Browser",
  "ipAddress": "203.0.113.50",
  "location": {
    "city": "Unknown",
    "country": "Unknown"
  },
  "riskDetail": "anomalousLocation",
  "riskLevelDuringSignIn": "high"
}
\`\`\`

### Event 6: Mail Forwarding Rule
\`\`\`json
{
  "CreationTime": "2024-01-15 08:20:00",
  "Operation": "New-InboxRule",
  "UserId": "admin@company.com",
  "ClientIP": "203.0.113.50",
  "Parameters": [
    {
      "Name": "ForwardTo",
      "Value": "external@attacker.com"
    },
    {
      "Name": "Name",
      "Value": "Forward Rule"
    }
  ]
}
\`\`\`

### Event 7: Mass Email Export
\`\`\`json
{
  "CreationTime": "2024-01-15 08:25:00",
  "Operation": "MailItemsAccessed",
  "UserId": "admin@company.com",
  "ClientIP": "203.0.113.50",
  "AffectedItems": [
    {
      "Id": "item1",
      "Subject": "Q1 Financial Report",
      "Folder": "Inbox"
    },
    {
      "Id": "item2",
      "Subject": "Customer Database",
      "Folder": "Inbox"
    }
    // ... 48 more items accessed in 5 minutes
  ]
}
\`\`\`

## Investigation Questions

### Question 1: Initial Access (AWS)
How did the attacker gain initial AWS access?

**Answer:** _______________________

### Question 2: Privilege Escalation (AWS)
What method was used to escalate privileges?

**Answer:** _______________________

### Question 3: Data Access (AWS)
What sensitive data was accessed?

**Answer:** _______________________

### Question 4: Initial Access (M365)
What was suspicious about the M365 sign-in?

**Answer:** _______________________

### Question 5: Data Exfiltration (M365)
How was data being exfiltrated from email?

**Answer:** _______________________

### Question 6: Attacker Source
What IP address was used for all activities?

**Answer:** _______________________

### Question 7: Persistence
What persistence mechanisms were established?

**Answer:** _______________________

## Attack Timeline

\`\`\`
08:00:00 ─── ___________________________
    │
08:05:00 ─── ___________________________
    │
08:06:00 ─── ___________________________
    │
08:10:00 ─── ___________________________
    │
08:15:00 ─── ___________________________
    │
08:20:00 ─── ___________________________
    │
08:25:00 ─── ___________________________
\`\`\`

## IOC Extraction

**IP Address:**
- _______________________

**AWS Resources:**
- User: _______________________
- Policy: _______________________
- S3 Bucket: _______________________

**M365 Indicators:**
- Email rule: _______________________
- Data accessed: _______________________

## Remediation Steps

List the immediate actions needed:

1. _______________________
2. _______________________
3. _______________________
4. _______________________
5. _______________________

---

## Answers

1. Console login as admin from external IP (203.0.113.50)
2. Created new user "backup-admin" and attached AdministratorAccess policy
3. Accessed "customer-list.csv" from "confidential-data" bucket
4. High-risk sign-in from unknown location, anomalousLocation detected
5. Created email forwarding rule to external@attacker.com
6. 203.0.113.50
7. AWS: backup-admin user with admin rights; M365: Email forwarding rule

**Timeline:**
\`\`\`
08:00:00 ─── AWS console login
08:05:00 ─── Created backup-admin user
08:06:00 ─── Attached admin policy to backup-admin
08:10:00 ─── Accessed S3 confidential data
08:15:00 ─── Suspicious M365 sign-in
08:20:00 ─── Created email forwarding rule
08:25:00 ─── Mass email export
\`\`\`

**IOCs:**
- IP: 203.0.113.50
- AWS: backup-admin user, AdministratorAccess policy, confidential-data bucket
- M365: Forwarding rule to external@attacker.com, 50+ emails accessed

**Remediation:**
1. Block IP 203.0.113.50
2. Disable backup-admin AWS user
3. Remove forwarding rule from admin mailbox
4. Reset admin password and enable MFA
5. Review all AWS and M365 activity from this IP
    `,
    keyTakeaways: [
      "Cloud logs provide detailed audit trails of all activities",
      "Cross-platform correlation reveals full attack scope",
      "Privilege escalation in cloud often involves creating new identities",
      "Email forwarding rules are common data exfiltration method",
      "Immediate containment requires blocking source and disabling compromised accounts"
    ],
    practicalExercise: {
      title: "Create Incident Report",
      description: "Document this cloud breach investigation.",
      steps: [
        "Write executive summary",
        "Document attack chain across AWS and M365",
        "List all affected assets and data",
        "Provide containment and eradication steps",
        "Recommend security improvements"
      ]
    }
  },
];
