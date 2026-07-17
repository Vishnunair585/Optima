const db = require('better-sqlite3')('optima.db');
const crypto = require('crypto');

const generateId = () => crypto.randomUUID();
const now = Date.now();

// CREATE TABLE
db.exec(`
CREATE TABLE IF NOT EXISTS legal_policies (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  effective_date INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS consent_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  consent_type TEXT NOT NULL,
  consented INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
`);

const privacyPolicyContent = `
# Privacy Policy

**Effective Date:** January 1, 2026
**Last Updated:** January 1, 2026
**Version:** 1.0.0

## 1. Introduction
Welcome to AIRank. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.

## 2. Information Collected
We collect several types of information from and about users of our Website, including information:
- **Account Information:** Name, email address, password, profile picture.
- **Usage Data:** Details of your visits to our Website, including traffic data, location data, logs, and other communication data and the resources that you access and use on the Website.
- **Device Information:** Information about your computer and internet connection, including your IP address, operating system, and browser type.
- **Payment Information:** We do not store full credit card numbers. All payments are processed securely by our third-party payment processors (e.g., Stripe).

## 3. Cookies and Tracking Technologies
We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 

## 4. Third-Party Integrations
We may use third-party Service Providers to monitor and analyze the use of our Service:
- **Authentication Providers:** Google Login, GitHub Login, Email Authentication.
- **Analytics:** Google Analytics, Vercel Analytics.

## 5. Data Usage & Legal Basis (GDPR / CCPA)
We process your personal data under the following legal bases:
- **Consent:** You have given clear consent for us to process your personal data for a specific purpose.
- **Contract:** Processing is necessary for a contract you have with us, or because you have asked us to take specific steps before entering into a contract.
- **Legitimate Interests:** Processing is necessary for our legitimate interests or the legitimate interests of a third party.

## 6. User Rights
Under GDPR and CCPA, you have the right to:
- Access your data.
- Correct inaccurate data.
- Erase your data ("Right to be Forgotten").
- Export your data.
- Restrict processing.

## 7. Data Retention & Sharing
We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for. We do not sell your personal data. We may share your data with trusted third parties for service operation.

## 8. Security Measures
We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed (Encryption, Regular Backups, Secure Access).

## 9. Contact Information
For any privacy-related inquiries, please contact us at privacy@airank.example.com.
`;

const termsOfServiceContent = `
# Terms of Service

**Effective Date:** January 1, 2026
**Last Updated:** January 1, 2026
**Version:** 1.0.0

## 1. Acceptance of Terms
By accessing or using AIRank, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.

## 2. Eligibility & Account Registration
You must be at least 18 years old to use this Service. You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.

## 3. User Responsibilities & Acceptable Use
You agree not to use the Service:
- In any way that violates any applicable national or international law or regulation.
- For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.
- To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.

## 4. AI Tool Information Disclaimer
AIRank provides information and rankings for third-party AI tools. **AIRank does not guarantee the accuracy, reliability, or quality of any third-party AI tools.** Users should independently evaluate AI tools before making business-critical decisions. We are not responsible for damages resulting from the use of tools listed on our platform.

## 5. User Generated Content
Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.

## 6. Subscriptions, Billing, and Refunds
Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis. Subscription fees are non-refundable except as required by law or as explicitly stated in our Refund Policy.

## 7. Termination
We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

## 8. Intellectual Property & DMCA
The Service and its original content, features, and functionality are and will remain the exclusive property of AIRank and its licensors. We respect the intellectual property rights of others and respond to valid DMCA takedown requests.

## 9. Limitation of Liability
In no event shall AIRank, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.

## 10. Dispute Resolution & Jurisdiction
These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
`;

const cookiePolicyContent = `
# Cookie Policy

**Effective Date:** January 1, 2026
**Version:** 1.0.0

We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.

- **Essential Cookies:** Necessary for the website to function. Cannot be disabled.
- **Analytics Cookies:** Help us understand how visitors interact with our website.
- **Marketing Cookies:** Used to track visitors across websites to display relevant ads.
`;

try {
  const stmt = db.prepare("INSERT OR REPLACE INTO legal_policies (id, type, title, content, version, effective_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  
  stmt.run(generateId(), 'privacy', 'Privacy Policy', privacyPolicyContent, '1.0.0', now, 'published', now, now);
  stmt.run(generateId(), 'terms', 'Terms of Service', termsOfServiceContent, '1.0.0', now, 'published', now, now);
  stmt.run(generateId(), 'cookie', 'Cookie Policy', cookiePolicyContent, '1.0.0', now, 'published', now, now);

  console.log("Legal policies seeded successfully.");
} catch (e) {
  console.error("Error seeding legal policies:", e);
}
