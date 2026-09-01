# 🛡️ JobShield AI

## AI-Powered Recruitment Scam Detection & Awareness

**JobShield AI** is an AI-assisted recruitment scam detection and awareness system developed for the **OMNIKON National Hackathon 2026** under:

> **Omni_CyberTech_10 — Identifying Fake Job Postings and Recruitment Scams**

It analyzes job postings and recruitment messages for suspicious recruitment patterns and combines a **deterministic Rule-Based Scam Detection Engine** with **Google Gemini AI contextual analysis**.

The system provides a risk score, risk level, AI assessment, detected red flags, evidence, detection sources, explanations, and safety recommendations.

> **Important:** JobShield AI is a decision-support and awareness tool. It does not definitively determine whether a job posting or employer is genuine or fraudulent.

---

# 🎯 Hackathon Information

| Detail | Information |
|---|---|
| **Hackathon** | OMNIKON National Hackathon 2026 |
| **Theme** | Cybersecurity, Blockchain & Digital Trust |
| **Problem Statement** | **Omni_CyberTech_10 — Identifying Fake Job Postings and Recruitment Scams** |
| **Project** | **JobShield AI** |
| **Team** | **VisionForge** |
| **Tagline** | **AI-Powered Recruitment Scam Detection** |

---

# 🚨 Problem

Fake job postings and recruitment scams can closely resemble genuine employment opportunities.

Scammers may use:

- Unrealistic salary or earning claims
- Upfront registration or verification fees
- Requests for sensitive personal information
- Requests for financial credentials
- Requests for OTPs
- Urgency and pressure tactics
- Unofficial communication channels
- Guaranteed employment claims
- Unusual recruitment processes
- Missing or questionable company information
- Suspicious recruiter contact details

Job seekers need an accessible way to identify suspicious signals before sharing money, sensitive information, or proceeding with a potentially risky opportunity.

---

# 💡 Our Solution

JobShield AI provides an AI-assisted recruitment scam analysis workflow.

The user submits a job advertisement, recruiter message, employment offer, internship message, or other recruitment-related text.

The system performs:

**Rule-Based Scam Detection + Gemini AI Contextual Analysis**

The result includes:

- Risk score
- Risk classification
- AI assessment
- Detected red flags
- Detection source
- Supporting evidence for rule-based findings
- Explanation of suspicious signals
- Safety recommendations

The system is designed as a **decision-support and awareness tool**, rather than a system that definitively determines whether a job posting is genuine or fraudulent.

---

# 🧠 Why a Hybrid Rule + AI Approach?

A keyword-only detector can produce false positives when a legitimate posting contains words associated with urgency, salary, applications, or recruitment.

At the same time, a purely AI-based approach can be difficult to make deterministic and explainable.

JobShield AI therefore combines:

### Rule Engine

- Deterministic
- Fast
- Consistent
- Explainable
- Detects known recruitment scam patterns
- Provides evidence for detected indicators

### Gemini AI

- Contextual
- Understands the overall recruitment message
- Identifies combinations of suspicious signals
- Provides natural-language assessment
- Can identify warning signs beyond fixed matching

This hybrid approach provides both **transparent rule-based signals** and **contextual AI reasoning**.

---

# ⚙️ How JobShield AI Works

## 1️⃣ Analyze

The user enters a job posting or recruitment message.

## 2️⃣ Detect

The Rule Engine checks the content for known recruitment scam indicators.

## 3️⃣ Understand

Google Gemini performs contextual analysis of the submitted recruitment content.

## 4️⃣ Assess Risk

The Rule Engine and Gemini results are combined.

Current weighting:

```text
Rule Engine = 40%
Gemini AI   = 60%
```

Formula:

```text
Final Score =
(Rule Engine Score × 0.40) +
(Gemini Score × 0.60)
```

## 5️⃣ Classify

| Score | Classification |
|---:|---|
| **0–29** | 🟢 Low Risk |
| **30–59** | 🟠 Suspicious |
| **60–100** | 🔴 High Risk |

## 6️⃣ Explain

The interface presents red flags, severity, detection source, evidence, and contextual explanation.

## 7️⃣ Protect

Safety recommendations help users decide what to verify and what information or payments they should avoid sharing.

---

# 🔍 Key Features

- 🤖 AI-powered recruitment scam analysis
- 🔎 Rule-based scam indicator detection
- 🧠 Google Gemini contextual analysis
- ⚖️ Combined 40/60 risk assessment
- 📊 0–100 risk scoring
- 🚦 Low Risk / Suspicious / High Risk classification
- 🚩 Explainable red-flag detection
- 🧾 Evidence from submitted content
- 🔧 Detection-source breakdown
- 💡 AI assessment and explanation
- 🛡️ Safety recommendations
- 🔄 Rule Engine fallback when Gemini is unavailable
- 💻 React + FastAPI full-stack prototype
- 📱 Responsive user interface

---

# 🚩 Risk Indicators

JobShield AI considers potential indicators including:

1. Upfront payment or registration fees
2. Refundable verification deposits
3. Requests for sensitive personal information
4. Requests for financial information
5. OTP requests
6. Unrealistic salary or earning claims
7. Guaranteed employment claims
8. Urgency or pressure tactics
9. Suspicious recruitment channels such as Telegram or WhatsApp
10. Unusual recruitment processes such as no interview
11. Missing or questionable company information
12. Suspicious contact details
13. Other contextual warning signs identified by AI

---

# 🏗️ Technical Architecture

```text
                         USER
                          │
                          ▼
                ┌───────────────────┐
                │ React + Vite      │
                │ Frontend          │
                └─────────┬─────────┘
                          │
                          │ HTTP Request
                          ▼
                ┌───────────────────┐
                │ FastAPI Backend   │
                │ Python            │
                └─────────┬─────────┘
                          │
                          ▼
                       /analyze
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
       ┌──────────────┐       ┌──────────────┐
       │ Rule Engine  │       │ Gemini AI    │
       │              │       │              │
       │ Deterministic│       │ Contextual   │
       │ Detection    │       │ Analysis     │
       └──────┬───────┘       └──────┬───────┘
              │                      │
              └──────────┬───────────┘
                         ▼
                Combined Risk Score
                         │
                         ▼
              ┌─────────────────────┐
              │ Risk Classification │
              └─────────┬───────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       Red Flags     Evidence     AI Assessment
          │             │             │
          └─────────────┼─────────────┘
                        ▼
              Safety Recommendations
                        │
                        ▼
                       USER
```

---

# 🔌 API Flow

```text
Frontend
   │
   │ Recruitment text
   ▼
POST /analyze
   │
   ├──► Rule-Based Analysis
   │       ├── Rule Score
   │       └── Indicators + Evidence
   │
   └──► Gemini AI Analysis
           ├── AI Score
           └── Contextual Findings
                │
                ▼
        Combined Assessment
                │
                ▼
        Risk Classification
                │
                ▼
      Frontend Result Display
```

---

# 🧮 Example Combined Scoring

For example:

```text
Rule Engine = 50/100
Gemini AI   = 92/100
```

The calculation is:

```text
(50 × 0.40) + (92 × 0.60)
= 20 + 55.2
= 75.2
```

The application displays the rounded result:

```text
75/100
```

This demonstrates how deterministic rule signals and contextual AI reasoning contribute to the final assessment.

---

# 🧪 Testing & Validation

The prototype has been tested with:

- Legitimate recruitment messages
- Obvious recruitment scams
- Suspicious recruitment messages
- Upfront payment requests
- Refundable deposit requests
- Sensitive information requests
- OTP requests
- Unrealistic salary claims
- Guaranteed employment claims
- Urgency and pressure
- Telegram/WhatsApp recruitment
- Unusual recruitment processes
- Gemini contextual analysis
- Combined scoring
- Gemini fallback behavior
- Frontend-backend communication
- Production deployment

## 🟢 Test 1 — Legitimate Recruitment

A software development recruitment message describing a standard assessment/interview process and explicitly stating that no application or recruitment fees are required was tested in production.

```text
Rule Engine : 0/100
Gemini AI   : 5/100
Combined    : 3/100
Risk        : Low Risk
```

**Result: Correctly classified as Low Risk.**

## 🔴 Test 2 — Obvious Recruitment Scam

A work-from-home offer containing:

- ₹999 registration fee
- Aadhaar/PAN request
- Bank details request
- OTP request
- Guaranteed ₹80,000 monthly salary
- No interview
- Immediate deadline
- WhatsApp recruitment

was tested in production.

```text
Rule Engine : 100/100
Gemini AI   : 98/100
Combined    : 99/100
Risk        : High Risk
```

**Result: Correctly classified as High Risk.**

## 🟠 Test 3 — Refundable Verification Deposit

A recruitment message requesting a **₹299 refundable verification deposit** and directing the candidate to **Telegram** was tested in production.

```text
Rule Engine : 50/100
Gemini AI   : 92/100
Combined    : 75/100
Risk        : High Risk
```

Detected indicators included:

- Upfront payment
- Urgency
- Telegram recruitment
- Instant selection without prior assessment
- Missing company information

**Result: Correctly identified as high risk.**

Detailed testing can be documented in `TESTING.md`.

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

## AI

- Google Gemini API

## Deployment

- Vercel — Frontend
- Render — Backend

---

# 📂 Project Structure

```text
JobShield-AI/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── README.md
├── TESTING.md
├── LICENSE
├── SECURITY.md
└── ...
```

> The exact structure may vary according to the current repository configuration.

---

# 🚀 Local Setup

## Prerequisites

Install:

- Python 3.x
- Node.js and npm
- Git

A Google Gemini API key is required for Gemini contextual analysis.

## Backend

```bash
cd backend
python -m venv .venv
```

### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn main:app --reload --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Use the Vite URL displayed in the terminal.

> Store API keys and other secrets in environment variables or deployment secret management. Never commit secrets to the public repository.

---

# 🌐 Live Demo

### 🚀 JobShield AI

**Live Application:**

https://job-shield-ai-mu.vercel.app/

**GitHub Repository:**

https://github.com/saisanthanalakshmi007/JobShield-AI

The deployed frontend connects to the deployed FastAPI backend for recruitment scam analysis.

**🎥 Project Showcase Video:**

https://youtu.be/dA_-aRM1Tfo

The video demonstrates the working JobShield AI prototype, including recruitment scam analysis, risk assessment, explainable red-flag detection, and safety recommendations.

---

# 🔐 Security & Responsible Data Handling

JobShield AI is an awareness and decision-support application.

Users should avoid entering unnecessary sensitive personal information into the analysis interface.

Never share:

- Passwords
- OTPs
- Banking passwords
- Card PINs
- Authentication credentials
- Unnecessary financial information

API keys and secrets must be stored securely and must never be committed to the public repository.

Detailed security practices should be maintained in:

```text
SECURITY.md
```

---

# 🤖 AI & Generative AI Disclosure

JobShield AI uses the **Google Gemini API** as a third-party AI service for contextual recruitment scam analysis.

Gemini assists with:

- Identifying potential scam indicators
- Contextual risk assessment
- Explaining suspicious patterns
- Providing safety recommendations

Generative AI tools were also used as development assistance during the software development process.

The project team remains responsible for:

- Solution design
- System integration
- Code review
- Testing
- Validation
- Deployment
- Final project decisions

AI-generated output is treated as decision-support rather than definitive proof of fraud.

---

# 🔗 Third-Party Technologies & Attribution

| Technology / Service | Purpose |
|---|---|
| React | Frontend application |
| Vite | Frontend build/development |
| JavaScript | Frontend implementation |
| CSS | User interface styling |
| Python | Backend implementation |
| FastAPI | Backend API framework |
| Uvicorn | ASGI server |
| Pydantic | Data validation |
| Google Gemini API | Contextual AI analysis |
| Vercel | Frontend deployment |
| Render | Backend deployment |

Third-party technologies and services are used according to their respective licenses and terms.

---

# 📈 Scalability & Future Scope

## 🌐 Job URL Analysis

Allow users to submit a job posting URL for analysis.

## 📧 Recruitment Email Analysis

Analyze suspicious recruitment emails while following appropriate privacy and security practices.

## 📷 Screenshot Analysis

Extend the platform to analyze screenshots of suspicious recruiter messages and job advertisements.

## 📄 Document Analysis

Support offer letters and recruitment documents.

## 🌍 Multilingual Support

Extend scam analysis to Indian regional languages and multilingual recruitment content.

## 🌐 Browser Extension

Provide scam-awareness assistance while users browse job portals and recruitment websites.

## 📊 Scam Trend Intelligence

Use privacy-preserving, anonymized indicators to understand emerging recruitment scam patterns.

## 🔗 Employer & Threat Intelligence Verification

Future versions could integrate trusted employer-verification and threat-intelligence sources.

---

# 🌍 Impact & Usefulness

JobShield AI focuses on a real-world problem affecting students, fresh graduates, internship seekers, and job seekers.

The system aims to help users recognize warning signs before they:

- Pay recruitment fees
- Pay verification deposits
- Share OTPs
- Share financial credentials
- Share unnecessary identity information
- Move to suspicious communication channels
- Make rushed decisions because of artificial urgency

Rather than simply presenting:

> **"This job is a scam."**

JobShield AI attempts to show:

> **What signals were detected, what evidence triggered them, why they may be concerning, and what the user should do next.**

This explainable approach is intended to improve recruitment scam awareness and safer decision-making.

---

# 💎 Key Innovation

### 1. Hybrid AI + Rule Detection

Combines deterministic detection with contextual AI analysis.

### 2. Explainable Assessment

Provides red flags and evidence rather than only a black-box score.

### 3. Actionable Safety Guidance

Connects detected indicators with practical safety recommendations.

### 4. AI Fallback

Maintains rule-based analysis when Gemini is temporarily unavailable.

### 5. Recruitment-Specific Detection

Focuses specifically on patterns associated with recruitment scams.

### 6. Simple User Workflow

Users can paste a recruitment message and quickly receive an understandable assessment.

---

# 🎓 Intended Users

- College students
- Fresh graduates
- Internship seekers
- First-time job seekers
- Work-from-home job seekers
- Professionals evaluating unfamiliar recruitment offers

---

# 🧭 Responsible Use

Before accepting an unfamiliar opportunity, users should:

1. Verify the employer's official website.
2. Check whether the job exists on the official careers page.
3. Verify the recruiter's identity.
4. Check official communication channels.
5. Never pay an upfront recruitment fee.
6. Never share OTPs or banking credentials.
7. Avoid rushed decisions caused by artificial urgency.
8. Independently verify suspicious claims.

---

# 👥 Team — VisionForge

## Sai Santhana Lakshmi S

**GitHub:** `saisanthanalakshmi007`

**Role:** Team Leader — Project Development & Integration

**Contribution Areas:**

- Project development
- Frontend and backend integration
- Rule Engine and AI integration
- System implementation
- Testing and deployment
- Project coordination

## M Preethi

**GitHub:** `MPreethi2007`

**Role:** Team Member — Documentation, Testing & Development Support

**Contribution Areas:**

- Documentation
- Testing and validation
- Development support
- User-facing evaluation
- Presentation support

> Both registered team members contribute to the development, testing, documentation, and improvement of the project.

---

# 📜 Open Source

JobShield AI is intended to be released as an open-source project in accordance with the OMNIKON requirements.

The repository should contain a valid open-source license such as MIT, Apache 2.0, or GPL.

Refer to:

```text
LICENSE
```

for the project's applicable license.

---

# 📑 OMNIKON Round 2 Compliance

The OMNIKON rulebook requires shortlisted Round 2 projects to have:

- A public GitHub repository
- A live deployed service
- Complete and up-to-date `README.md`
- `LICENSE`
- `SECURITY.md`
- Third-party attribution
- Generative AI disclosure
- Official Round 2 PPT
- A 2–5 minute project showcase video
- The deployed link in the GitHub repository **About** section

The rulebook also requires a **Reviewer Notes** section in the Round 2 PPT.

The repository and submission should be finalized before the Round 2 deadline because **post-deadline commits are prohibited**.

---

# 📝 Reviewer Notes

**JobShield AI is a working prototype focused on recruitment scam detection and user awareness.**

The project combines deterministic Rule Engine analysis with Gemini contextual analysis so that users receive both explainable known-pattern detection and broader contextual assessment.

The system is not an authoritative employer-verification service. Recruitment scams evolve continuously, and legitimate messages can sometimes contain language resembling risk indicators. Therefore, the final result should be treated as decision support and users should independently verify employers and recruitment channels.

Future improvements include broader multilingual support, URL/screenshot/document analysis, richer employer verification, and expanded threat-intelligence integration.

---

# 📚 Documentation

| File | Purpose |
|---|---|
| `README.md` | Project overview, setup, architecture, features, testing, and documentation |
| `TESTING.md` | Test cases and validation |
| `SECURITY.md` | Security and data-handling practices |
| `LICENSE` | Open-source license |
| `CONTRIBUTING.md` | Contribution guidelines, if included |
| `CODE_OF_CONDUCT.md` | Community conduct guidelines, if included |

---

# 🏆 Project Goal

JobShield AI aims to create a practical safety layer for people navigating the modern recruitment ecosystem.

## Protect your career. Verify before you trust.

**Built by VisionForge for the OMNIKON National Hackathon 2026.**

---

# ⚠️ Disclaimer

JobShield AI provides **decision-support and recruitment scam awareness guidance**.

A high-risk result does not constitute definitive proof that an employer or job posting is fraudulent.

A low-risk result does not guarantee that an opportunity is genuine.

Users should independently verify employment opportunities through official company websites, trusted recruitment platforms, and verified communication channels before sharing information, making payments, or accepting offers.
