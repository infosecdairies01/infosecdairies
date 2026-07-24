import Navbar from "@/components/Navbar";
import SOCSidebar from "@/components/soc/SOCSidebar";
import { Bell, User, Search, Mail, Shield, ShieldAlert, ShieldCheck, ShieldX, Paperclip, ExternalLink, Clock, Filter, Eye, AlertTriangle, XCircle, MailWarning } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

type EmailVerdict = "Clean" | "Suspicious" | "Malicious" | "Quarantined";

interface EmailEntry {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  time: string;
  direction: "Inbound" | "Outbound";
  verdict: EmailVerdict;
  hasAttachment: boolean;
  attachmentName?: string;
  spfResult: "Pass" | "Fail" | "None";
  dkimResult: "Pass" | "Fail" | "None";
  dmarcResult: "Pass" | "Fail" | "None";
  senderIP: string;
  threatType?: string;
  body?: string;
}

const emailData: EmailEntry[] = [
  {
    id: "EM-001", from: "admin@network-alert.com", to: "aaron@blueteamers.com", subject: "Network Access Issue",
    date: "Feb 19, 2026", time: "09:14 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "185.220.101.34",
    threatType: "Credential Phishing",
    body: "Dear Aaron,\n\nThere is an issue with your network access.\n\nPlease login to resolve it: http://tsb.network/Login.php\n\nIf not resolved, your access may be blocked.\n\nThanks,\nNetwork Team",
  },
  {
    id: "EM-002", from: "account@service-alert.com", to: "benjamin@blueteamers.com", subject: "Account Suspension Warning",
    date: "Feb 19, 2026", time: "08:47 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "91.234.99.117",
    threatType: "Credential Phishing",
    body: "Hi Benjamin,\n\nYour account is at risk of suspension.\n\nPlease verify your details immediately: http://accountsecurity-issue.com\n\nIf not verified, your account will be suspended.\n\nThank you,\nService Team",
  },
  {
    id: "EM-003", from: "rewards@blockchain-events.com", to: "daniel@blueteamers.com", subject: "Claim Your Blockchain Anniversary Reward",
    date: "Feb 19, 2026", time: "08:32 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "103.42.88.211",
    threatType: "Reward Scam / Credential Phishing",
    body: "Dear Daniel,\n\nAs part of our 10th anniversary program, you are eligible for a blockchain reward.\n\nPlease verify your details and withdraw your reward here: http://blockchain.celebrate.10th.anniversary.rewards-withdrawals.info\n\nIf not claimed, the reward may expire soon.\n\nThanks,\nBlockchain Rewards Team",
  },
  {
    id: "EM-004", from: "support@aws.amazon.com", to: "elon@blueteamers.com", subject: "Payment Reminder for AWS Services",
    date: "Feb 19, 2026", time: "08:15 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "45.155.204.63",
    threatType: "Brand Impersonation / Billing Phishing",
    body: "Hi Elon,\n\nYour AWS account has pending billing charges.\n\nPlease check your payment details here: http://bucketbill6.s3.amazonaws.com/billing.html\n\nIf not completed, services may be interrupted.\n\nRegards,\nSupport",
  },
  {
    id: "EM-005", from: "office@ms-update.com", to: "elisha@blueteamers.com", subject: "Excel Document Access Required",
    date: "Feb 18, 2026", time: "11:58 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "172.16.88.200",
    threatType: "Brand Impersonation / Credential Phishing",
    body: "Hi Elisha,\n\nA Microsoft Excel file has been shared with you.\n\nPlease access it here: https://cobig99.github.io/microsoft365-en-us-excel/\n\nIf not accessed, the file may expire.\n\nRegards,\nMicrosoft Team",
  },
  {
    id: "EM-006", from: "support@helpdesk-alert.com", to: "gabriel@blueteamers.com", subject: "Helpdesk Access Required",
    date: "Feb 18, 2026", time: "04:30 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "185.220.101.47",
    threatType: "Credential Phishing",
    body: "Hi Gabriel,\n\nYour helpdesk account needs verification.\n\nPlease login here: https://op-helpdesk.com/\n\nIf not verified, ticket access may be restricted.\n\nThanks,\nHelpdesk Team",
  },
  {
    id: "EM-007", from: "support@payroll-help.com", to: "gabriel@blueteamers.com", subject: "Payroll Action Required",
    date: "Feb 18, 2026", time: "03:22 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "195.22.127.93",
    threatType: "Credential Phishing / Payroll Fraud",
    body: "Hi Gabriel,\n\nYour payroll account needs verification.\n\nPlease confirm your details here: https://payrollruntimesheet.weebly.com/verify.html\n\nIf not verified, salary processing may be affected.\n\nRegards,\nPayroll Support",
  },
  {
    id: "EM-008", from: "security@billing-alert.com", to: "benjamin@blueteamers.com", subject: "Payment Alert",
    date: "Feb 18, 2026", time: "02:00 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "198.51.100.23",
    threatType: "Credential Phishing / Payment Fraud",
    body: "Hi Benjamin,\n\nA transaction has been initiated from your account.\n\nPlease confirm it here: https://transaction-booking.com/\n\nIf not confirmed, it may be declined.\n\nRegards,\nBilling Team",
  },
  {
    id: "EM-009", from: "network@alerts-service.com", to: "elon@blueteamers.com", subject: "Network Configuration Update",
    date: "Feb 18, 2026", time: "01:15 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "103.235.46.19",
    threatType: "Credential Phishing",
    body: "Hi Elon,\n\nA network configuration update is available.\n\nPlease review it here: https://tmsnetworkio.pages.dev/\n\nIf not applied, performance may be affected.\n\nRegards,\nNetwork Team",
  },
  {
    id: "EM-010", from: "alerts@bugbounty-security.com", to: "daniel@blueteamers.com", subject: "Account Access Review",
    date: "Feb 18, 2026", time: "10:00 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "91.234.99.204",
    threatType: "Credential Phishing",
    body: "Dear Daniel,\n\nA login attempt was detected on your account.\n\nPlease review it here: https://review-login-mobile.web.app/\n\nIf not verified, access may be restricted.\n\nThanks,\nSecurity Team",
  },
  {
    id: "EM-011", from: "devops@project-update.com", to: "elisha@blueteamers.com", subject: "Project File Shared",
    date: "Feb 17, 2026", time: "05:12 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "185.220.101.61",
    threatType: "Credential Phishing",
    body: "Hi Elisha,\n\nA project file has been shared with you.\n\nPlease access it here: https://projet-4-c3e2c.firebaseapp.com/\n\nIf not accessed, it may expire.\n\nThanks,\nDevOps Team",
  },
  {
    id: "EM-012", from: "network@device-alert.com", to: "elon@blueteamers.com", subject: "Network Device Alert",
    date: "Feb 17, 2026", time: "04:03 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "45.155.204.88",
    threatType: "Credential Phishing",
    body: "Hi Elon,\n\nA new device has been connected to your network account.\n\nPlease verify and remove unauthorized devices: http://deregister-new-device-alert.com/\n\nIf not checked, network access may be affected.\n\nRegards,\nNetwork Team",
  },
  {
    id: "EM-013", from: "network@domain-alert.com", to: "elon@blueteamers.com", subject: "Domain Access Update",
    date: "Feb 17, 2026", time: "02:47 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "172.16.88.214",
    threatType: "Credential Phishing",
    body: "Hi Elon,\n\nYour domain access needs to be updated.\n\nPlease verify here: https://domainaccess.net/\n\nIf not updated, network access may be affected.\n\nRegards,\nNetwork Team",
  },
  {
    id: "EM-014", from: "rewards@bugbounty-bonus.com", to: "daniel@blueteamers.com", subject: "Bounty Bonus Reward",
    date: "Feb 17, 2026", time: "11:30 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "103.42.88.229",
    threatType: "Reward Scam / Credential Phishing",
    body: "Dear Daniel,\n\nYou have received a bonus reward for your recent submission.\n\nPlease claim it here: https://accesssrewards.firebaseapp.com/\n\nIf not claimed, the reward may expire.\n\nThanks,\nBounty Team",
  },
  {
    id: "EM-015", from: "alerts@system-update.com", to: "aaron@blueteamers.com", subject: "System Update Required",
    date: "Feb 17, 2026", time: "09:52 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "195.22.127.108",
    threatType: "Credential Phishing",
    body: "Dear Aaron,\n\nA system update is required for your account.\n\nPlease update here: https://update-spk.de/start/index.php\n\nIf not updated, access may be restricted.\n\nThanks,\nSystem Team",
  },
  {
    id: "EM-016", from: "support@delivery-alert.com", to: "gabriel@blueteamers.com", subject: "Delivery Confirmation Needed",
    date: "Feb 17, 2026", time: "08:41 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "198.51.100.47",
    threatType: "Credential Phishing / Delivery Scam",
    body: "Hi Gabriel,\n\nYour delivery requires confirmation.\n\nPlease confirm here: http://newupdate.nl/tracking/myorder/confirmation.php\n\nIf not confirmed, delivery may be delayed.\n\nRegards,\nSupport Team",
  },
  {
    id: "EM-017", from: "alerts@parcel-service.com", to: "elon@blueteamers.com", subject: "Parcel Confirmation Required",
    date: "Feb 16, 2026", time: "06:19 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "103.235.46.52",
    threatType: "Credential Phishing / Delivery Scam",
    body: "Hi Elon,\n\nYour shipment needs confirmation.\n\nPlease confirm here: https://online-parcelsondemand.com/ondemand/shipmentconfirmation/card.html\n\nIf not confirmed, delivery may be delayed.\n\nRegards,\nParcel Service",
  },
  {
    id: "EM-018", from: "security@file-alert.com", to: "benjamin@blueteamers.com", subject: "File Access Notification",
    date: "Feb 16, 2026", time: "03:55 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "91.234.99.161",
    threatType: "Credential Phishing",
    body: "Hi Benjamin,\n\nA secure file is available for you.\n\nPlease review it here: http://appadmin.tclgcc.com/storage/y0y1l/\n\nIf not reviewed, access may expire.\n\nRegards,\nSecurity Team",
  },
  {
    id: "EM-019", from: "devops@cloud-update.com", to: "elisha@blueteamers.com", subject: "Project File Uploaded",
    date: "Feb 16, 2026", time: "01:27 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "185.220.101.79",
    threatType: "Credential Phishing",
    body: "Hi Elisha,\n\nA project file has been uploaded.\n\nPlease access it here: https://storage.cloud.google.com/user517497679326978.appspot.com/index.html\n\nIf not accessed, it may be deleted.\n\nThanks,\nDevOps Team",
  },
  {
    id: "EM-020", from: "alerts@security-platform.com", to: "daniel@blueteamers.com", subject: "Security Warning",
    date: "Feb 16, 2026", time: "10:04 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "45.155.204.101",
    threatType: "Credential Phishing",
    body: "Dear Daniel,\n\nYour account requires immediate attention.\n\nPlease review it here: https://warning-acounts.start.page/\n\nIf not verified, access may be restricted.\n\nThanks,\nSecurity Team",
  },
  {
    id: "EM-021", from: "support@github-secure.com", to: "james@blueteamers.com", subject: "Alert: Multiple Failed Login Attempts",
    date: "Feb 16, 2026", time: "09:40 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "103.85.112.216",
    threatType: "Credential Phishing",
    body: "Hi James,\n\nWe noticed multiple failed login attempts on your account.\n\nPlease verify your account immediately using the link below: http://secure-login-verifcation.net/Login.php\n\nIf not verified, your account may be blocked.\n\nThank you,\nSecurity Team",
  },
  {
    id: "EM-022", from: "support@whatsapp-alerts.com", to: "kanelazarus@blueteamers.com", subject: "You've Been Added to a New WhatsApp Group",
    date: "Feb 16, 2026", time: "08:22 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "104.128.132.174",
    threatType: "Brand Impersonation / Credential Phishing",
    body: "Dear Kane Lazarus,\n\nYou have been added to a new WhatsApp group.\n\nClick the link below to view and join the group: http://joingroupwhatsapp18.25u.com/\n\nIf you do not recognize this, please check immediately.\n\nThank you,\nWhatsApp Team",
  },
  {
    id: "EM-023", from: "security@company-alerts.com", to: "jesse@blueteamers.com", subject: "Urgent: Verify Your Login to Prevent Security Risk",
    date: "Feb 15, 2026", time: "07:58 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "109.177.10.206",
    threatType: "Credential Phishing",
    body: "Dear Jesse,\n\nA security issue has been detected in your account.\n\nKindly confirm your login information as soon as possible using the link below: https://www.verification-userlogin7364-auth.com/Login.php\n\nIf you don't verify, you may lose access to your account.\n\nThanks,\nIT Security Team",
  },
  {
    id: "EM-024", from: "hr@admin-alerts.com", to: "hr@blueteamers.com", subject: "Important Notice from Administration",
    date: "Feb 15, 2026", time: "06:33 PM", direction: "Inbound", verdict: "Suspicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "146.255.61.148",
    threatType: "Credential Phishing",
    body: "Dear HR Team,\n\nThis is to notify you about an important administrative notice that requires your attention.\n\nPlease check the details using the link below: https://www.admin-raiffeisen.club/pass.php\n\nPlease review it as soon as possible.\n\nThank you,\nAdministration Team",
  },
  {
    id: "EM-025", from: "support@delivery-update.net", to: "johnjoel@blueteamers.com", subject: "Security Notice: System Activity Requires Attention",
    date: "Feb 15, 2026", time: "04:11 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "101.115.133.190",
    threatType: "Credential Phishing / Delivery Scam",
    body: "Dear JohnJoel,\n\nWe were unable to deliver your package due to an issue with the address.\n\nPlease check the details using the link below: https://simplythisla.com/OTF/AutoDHL/DHL/deliveryform.php\n\nYour package may be returned if no action is taken.\n\nThank you,\nDelivery Team",
  },
  {
    id: "EM-026", from: "support@bank-alerts.com", to: "markmattew@blueteamers.com", subject: "Bank Account Update Notification",
    date: "Feb 15, 2026", time: "02:49 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "104.155.2.89",
    threatType: "Brand Impersonation / Banking Phishing",
    body: "Dear Mark Mattew,\n\nWe would like to inform you that there has been an update related to your bank account.\n\nPlease check the details using the link below: http://lloyds-help-online-banking.com/\n\nFurther action may be required.\n\nThank you,\nBanking Team",
  },
  {
    id: "EM-027", from: "security-awareness@blueteamers.com", to: "james@blueteamers.com", subject: "Important: Verify Your Bank Details",
    date: "Feb 15, 2026", time: "01:20 PM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "185.255.212.75",
    threatType: "Internal Spoofing / Banking Phishing",
    body: "Hi James,\n\nWe noticed that your bank details may require verification to ensure there are no interruptions to your account services.\n\nAs part of our ongoing security checks, we request you to review and confirm your details at the link below: http://lloydsbank.online-personal-secure-payee.com/Login.php\n\nThanks,\nSecurity Team",
  },
  {
    id: "EM-028", from: "account-update@service-alerts.com", to: "jesse@blueteamers.com", subject: "Verify Your Phone Number to Continue",
    date: "Feb 15, 2026", time: "11:05 AM", direction: "Inbound", verdict: "Malicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "134.122.33.171",
    threatType: "Credential Phishing",
    body: "Hi Jesse,\n\nYour phone number needs to be verified to continue using your account without any issues.\n\nIf you don't verify, you may lose access to your account.\n\nTo proceed, click the link below and follow the instruction: https://phone-rapport-call.web.app/\n\nEnter your details and complete the verification process.\n\nThanks,\nSupport Team",
  },
  {
    id: "EM-029", from: "it-support@blueteamers.com", to: "johnjoel@blueteamers.com", subject: "Your Email Storage is Full",
    date: "Feb 15, 2026", time: "09:47 AM", direction: "Inbound", verdict: "Suspicious", hasAttachment: false,
    spfResult: "Fail", dkimResult: "Fail", dmarcResult: "Fail", senderIP: "172.161.104.93",
    threatType: "Internal Spoofing / Credential Phishing",
    body: "Hi John Joel,\n\nYour mailbox storage has reached its limit, and you may not be able to send or receive new emails.\n\nTo restore access, please review your storage and update it using the link below: https://mail.security-device.co.uk/\n\nFollow the steps on the page to continue using your email without interruption.\n\nThanks,\nIT Support Team",
  },
  {
    id: "EM-030", from: "notifications@crowdstrike.com", to: "kanelazarus@blueteamers.com", subject: "New Incident Detection Alert",
    date: "Feb 14, 2026", time: "10:12 AM", direction: "Inbound", verdict: "Clean", hasAttachment: false,
    spfResult: "Pass", dkimResult: "Pass", dmarcResult: "Pass", senderIP: "66.132.159.67",
    body: "Dear Kane Lazarus,\n\nA new security incident has been detected in your environment.\n\nPlease review the incident details here: https://falcon.crowdstrike.com/\n\nIf you have already reviewed the alert, no further action is needed.\n\nThanks,\nCrowdStrike Falcon Team",
  },
  {
    id: "EM-031", from: "noreply@linkedin.com", to: "hr@blueteamers.com", subject: "New Job Applications Received",
    date: "Feb 14, 2026", time: "09:30 AM", direction: "Inbound", verdict: "Clean", hasAttachment: false,
    spfResult: "Pass", dkimResult: "Pass", dmarcResult: "Pass", senderIP: "91.134.178.45",
    body: "Dear HR,\n\nNew applications have been received for your recent job posting.\n\nPlease review the candidate profiles here: https://www.linkedin.com/talent/\n\nIf you have already reviewed the applications, no further action is needed.\n\nThanks,\nLinkedIn Talent Solutions",
  },
  {
    id: "EM-032", from: "service@paypal.com", to: "markmattew@blueteamers.com", subject: "Payment Report Available",
    date: "Feb 14, 2026", time: "08:45 AM", direction: "Inbound", verdict: "Clean", hasAttachment: false,
    spfResult: "Pass", dkimResult: "Pass", dmarcResult: "Pass", senderIP: "167.71.208.94",
    body: "Dear Mark Mattew,\n\nYour latest payment activity report is now available.\n\nView the report here: https://www.paypal.com/business\n\nThanks,\nPayPal Business",
  },
  {
    id: "EM-033", from: "notifications@freshservice.com", to: "gabriel@blueteamers.com", subject: "New Helpdesk Ticket Assigned",
    date: "Feb 14, 2026", time: "08:05 AM", direction: "Inbound", verdict: "Clean", hasAttachment: false,
    spfResult: "Pass", dkimResult: "Pass", dmarcResult: "Pass", senderIP: "206.189.152.73",
    body: "Dear Gabriel,\n\nA new helpdesk ticket has been assigned to you.\n\nView the ticket here: https://www.freshworks.com/freshservice/\n\nRegards,\nFreshservice Team",
  },
];

const verdictConfig: Record<EmailVerdict, { icon: typeof Shield; color: string; bg: string; border: string }> = {
  Clean: { icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/25" },
  Suspicious: { icon: ShieldAlert, color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/25" },
  Malicious: { icon: ShieldX, color: "text-destructive", bg: "bg-destructive/15", border: "border-destructive/25" },
  Quarantined: { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/25" },
};

const authBadge = (result: string) => {
  return <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted/20 text-muted-foreground border border-white/[0.06]">{result}</span>;
};

const EmailSecurity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<EmailVerdict | "All">("All");
  const [selectedEmail, setSelectedEmail] = useState<EmailEntry | null>(null);
  const pageScrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    if (pageScrollRef.current) pageScrollRef.current.scrollTop = 0;
  };

  useEffect(() => {
    if (selectedEmail) {
      scrollToTop();
      const raf = requestAnimationFrame(() => {
        scrollToTop();
        cancelAnimationFrame(raf);
      });
    }
  }, [selectedEmail]);

  const filtered = emailData.filter((e) => {
    const matchesSearch =
      e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerdict = verdictFilter === "All" || e.verdict === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SOCSidebar activeItem="Email Security" />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-card/25 backdrop-blur-lg border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Email Security</h1>
              <p className="text-sm text-muted-foreground">Email gateway monitoring and threat analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search emails..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-background/50 border border-white/[0.08] rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 w-64 transition-colors backdrop-blur-sm" />
              </div>
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.04]"><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" /></button>
              <button className="w-8 h-8 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"><User className="w-4 h-4" /></button>
            </div>
          </header>

          <div ref={pageScrollRef} className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {!selectedEmail ? (
                <>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    {(["All", "Clean", "Suspicious", "Malicious", "Quarantined"] as const).map((v) => (
                      <button key={v} onClick={() => setVerdictFilter(v)} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all", verdictFilter === v ? "bg-primary/15 text-primary border border-primary/25" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent")}>
                        {v}
                      </button>
                    ))}
                  </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {(["All", "Clean", "Suspicious", "Malicious", "Quarantined"] as const).map((v) => (
                  <button key={v} onClick={() => setVerdictFilter(v)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", verdictFilter === v ? "bg-primary/15 text-primary border border-primary/25" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent")}>
                    {v}
                  </button>
                ))}
              </div>

              {/* Email List + Detail Split */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className={cn("relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] shadow-lg shadow-black/20", selectedEmail ? "lg:col-span-3" : "lg:col-span-5")}>
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Verdict</th>
                          <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">From</th>
                          <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">To</th>
                          <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Subject</th>
                          <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Date</th>
                          <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 text-center">Att.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((email) => {
                          const vc = verdictConfig[email.verdict];
                          const VIcon = vc.icon;
                          return (
                            <tr key={email.id} onClick={() => setSelectedEmail(email)} className={cn("border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.03] transition-colors cursor-pointer group", selectedEmail?.id === email.id && "bg-primary/5 border-l-2 border-l-primary")}>
                              <td className="px-4 py-3">
                                <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", vc.bg, vc.color, vc.border)}>
                                  <VIcon className="w-3 h-3" />
                                  {email.verdict}
                                </span>
                              </td>
                              <td className="px-4 py-3"><span className="text-xs text-foreground font-mono truncate max-w-[180px] block">{email.from}</span></td>
                              <td className="px-4 py-3"><span className="text-xs text-muted-foreground font-mono truncate max-w-[140px] block">{email.to}</span></td>
                              <td className="px-4 py-3"><span className="text-xs text-foreground group-hover:text-primary transition-colors truncate max-w-[220px] block">{email.subject}</span></td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{email.time}</span>
                                <span className="text-[11px] text-muted-foreground/60">{email.date}</span>
                              </td>
                            </tr>
                          ))}
                          {filtered.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground">No emails match your filters</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] shadow-lg shadow-black/20">
                  <div className="px-8 py-5 border-b border-white/[0.06] flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-1 break-words">{selectedEmail.subject}</h3>
                      <p className="text-[11px] text-muted-foreground">{selectedEmail.id} · {selectedEmail.date} {selectedEmail.time}</p>
                    </div>
                    <button onClick={() => { setSelectedEmail(null); scrollToTop(); }} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="px-8 py-6 space-y-6 max-w-4xl w-full">
                    <div className="rounded-lg bg-background/50 border border-white/[0.06] p-5 space-y-1">
                      <p className="text-sm text-foreground"><span className="text-muted-foreground">From:</span> {selectedEmail.from}</p>
                      <p className="text-sm text-foreground"><span className="text-muted-foreground">To:</span> {selectedEmail.to}</p>
                      <p className="text-sm text-foreground"><span className="text-muted-foreground">Subject:</span> {selectedEmail.subject}</p>
                    </div>

                    {selectedEmail.body && (
                      <div className="rounded-lg bg-background/50 border border-white/[0.06] p-5">
                        <p className="text-sm text-foreground leading-relaxed">
                          {(() => {
                            const toName = selectedEmail.to.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                            const bodyLines = selectedEmail.body.split("\n");
                            const processedLines = bodyLines.map((line) => {
                              const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
                              if (ipRegex.test(line.trim())) return null;
                              return line;
                            }).filter((line): line is string => line !== null);
                            const greetingIdx = processedLines.findIndex((l) => /^(Dear|Hi|Hello)/i.test(l.trim()));
                            if (greetingIdx >= 0) {
                              processedLines[greetingIdx] = processedLines[greetingIdx].replace(/^(Dear|Hi|Hello)\s+\S+/i, `$1 ${toName}`);
                            }
                            return processedLines.map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < processedLines.length - 1 && <br />}
                              </span>
                            ));
                          })()}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Email Authentication</p>
                      <div className="flex gap-4">
                        <div className="text-center"><p className="text-[11px] text-muted-foreground mb-1">SPF</p>{authBadge(selectedEmail.spfResult)}</div>
                        <div className="text-center"><p className="text-[11px] text-muted-foreground mb-1">DKIM</p>{authBadge(selectedEmail.dkimResult)}</div>
                        <div className="text-center"><p className="text-[11px] text-muted-foreground mb-1">DMARC</p>{authBadge(selectedEmail.dmarcResult)}</div>
                      </div>
                    </div>

                    {selectedEmail.hasAttachment && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Attachment</p>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-white/[0.06] w-fit">
                          <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">{selectedEmail.attachmentName}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Investigate
                      </button>
                      {selectedEmail.verdict !== "Clean" && (
                        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive border border-destructive/25 hover:bg-destructive/20 transition-colors flex items-center justify-center gap-1.5">
                          <ShieldX className="w-3.5 h-3.5" /> Block Sender
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detail Panel */}
                {selectedEmail && (
                  <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] shadow-lg shadow-black/20">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <div className="p-5 space-y-5 overflow-auto max-h-[calc(100vh-300px)]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground mb-1 break-words">{selectedEmail.subject}</h3>
                          <p className="text-[10px] text-muted-foreground">{selectedEmail.id} · {selectedEmail.date} {selectedEmail.time}</p>
                        </div>
                        <button onClick={() => setSelectedEmail(null)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>

                      {(() => {
                        const vc = verdictConfig[selectedEmail.verdict];
                        const VIcon = vc.icon;
                        return (
                          <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", vc.bg, vc.border)}>
                            <VIcon className={cn("w-5 h-5", vc.color)} />
                            <div>
                              <p className={cn("text-sm font-semibold", vc.color)}>{selectedEmail.verdict}</p>
                              {selectedEmail.threatType && <p className="text-[10px] text-muted-foreground">{selectedEmail.threatType}</p>}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">From</p>
                          <p className="text-xs text-foreground font-mono break-all">{selectedEmail.from}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">IP: {selectedEmail.senderIP}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">To</p>
                          <p className="text-xs text-foreground font-mono break-all">{selectedEmail.to}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Email Authentication</p>
                        <div className="flex gap-4">
                          <div className="text-center"><p className="text-[9px] text-muted-foreground mb-1">SPF</p>{authBadge(selectedEmail.spfResult)}</div>
                          <div className="text-center"><p className="text-[9px] text-muted-foreground mb-1">DKIM</p>{authBadge(selectedEmail.dkimResult)}</div>
                          <div className="text-center"><p className="text-[9px] text-muted-foreground mb-1">DMARC</p>{authBadge(selectedEmail.dmarcResult)}</div>
                        </div>
                      </div>

                      {selectedEmail.hasAttachment && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Attachment</p>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-white/[0.06]">
                            <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-foreground font-mono">{selectedEmail.attachmentName}</span>
                            {(selectedEmail.verdict === "Malicious" || selectedEmail.verdict === "Quarantined") && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20 ml-auto">Blocked</span>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedEmail.body && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Email Body</p>
                          <div className="px-3 py-3 rounded-lg bg-background/50 border border-white/[0.06]">
                            <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">{selectedEmail.body}</pre>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> Investigate
                        </button>
                        {selectedEmail.verdict !== "Clean" && (
                          <button className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-destructive/10 text-destructive border border-destructive/25 hover:bg-destructive/20 transition-colors flex items-center justify-center gap-1.5">
                            <ShieldX className="w-3.5 h-3.5" /> Block Sender
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmailSecurity;