# JobShield AI

## AI-Powered Recruitment Scam Detection

JobShield AI is an AI-powered recruitment scam detection and awareness system developed for the **OMNIKON National Hackathon 2026**.

It analyzes job postings and recruitment messages to identify suspicious patterns and potential recruitment scam indicators. The system combines **rule-based detection** with **Google Gemini AI contextual analysis** to provide a risk assessment, explain detected red flags, and provide safety recommendations.

---

## Hackathon Information

**Hackathon:** OMNIKON National Hackathon 2026

**Theme:** Cybersecurity, Blockchain & Digital Trust

**Problem Statement:**
**Omni_CyberTech_10 — Identifying Fake Job Postings and Recruitment Scams**

**Project:** JobShield AI

**Tagline:** AI-Powered Recruitment Scam Detection

---

## Team

### VisionForge

| Name | GitHub Username | Role |
|---|---|---|
| **Sai Santhana Lakshmi S** | [`saisanthanalakshmi007`](https://github.com/saisanthanalakshmi007) | Team Leader — Project Development & Integration |
| **M Preethi** | [`MPreethi2007`](https://github.com/preethibinita) | Team Member — Documentation, Testing & Development Support |

---

## Problem

Fake job postings and recruitment scams can appear similar to genuine employment opportunities.

Scammers may use:

- Unrealistic salary or earning claims
- Requests for upfront payments
- Requests for sensitive personal information
- Requests for financial credentials
- Urgency and pressure tactics
- Unsecured communication channels
- Guaranteed employment claims
- Unusual recruitment processes

Job seekers need an accessible way to identify suspicious signals before sharing sensitive information or proceeding with a potentially risky opportunity.

---

## Our Solution

**JobShield AI** provides AI-assisted recruitment scam analysis.

The user submits a job posting or recruitment message, and the system analyzes the content using:

**Rule-Based Scam Detection + Gemini AI Contextual Analysis**

The results provide:

- Risk score
- Risk level
- AI assessment
- Detected red flags
- Detection source information
- Explanation of suspicious signals
- Safety recommendations

The system is designed as a **decision-support and awareness tool** rather than a system that definitively determines whether a job posting is genuine or fraudulent.

---

## How JobShield AI Works

### 1. Analyze

The user enters a job posting or recruitment message into the JobShield AI interface.

### 2. Detect

The system checks the submitted content for known recruitment scam indicators using rule-based analysis.

### 3. Analyze with AI

Google Gemini provides contextual analysis of the submitted recruitment content.

### 4. Assess Risk

The rule-based analysis and AI analysis are combined to produce a risk assessment.

### 5. Explain

The system presents detected red flags and explains why specific signals may be concerning.

### 6. Protect

Safety recommendations are provided to help the user make a safer decision.

---

## Key Features

- AI-powered recruitment scam analysis
- Rule-based scam indicator detection
- Google Gemini contextual analysis
- Combined risk assessment
- Risk classification
- Recruitment scam red-flag detection
- Explainable AI assessment
- Detection source breakdown
- Safety recommendations
- Job posting and recruitment message analysis
- React + FastAPI working prototype

---

## Risk Indicators

JobShield AI considers potential indicators such as:

1. Upfront payment or registration fees
2. Requests for sensitive personal or financial information
3. Unrealistic salary or earning claims
4. Urgency or pressure tactics
5. Guaranteed employment claims
6. Suspicious recruitment channels
7. Unusual recruitment processes
8. Missing or questionable company information
9. Suspicious contact details
10. Other contextual warning signs

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- Uvicorn

### AI

- Google Gemini API

---

## AI Use Disclosure

JobShield AI uses the Google Gemini API for contextual analysis of submitted job postings and recruitment messages.

Gemini assists the system in:

- Identifying potential recruitment scam indicators
- Generating risk assessments
- Explaining suspicious signals
- Providing safety recommendations

The AI output is intended as decision-support and awareness guidance. JobShield AI does not claim with certainty that a job posting is fraudulent. The assessment is based only on the information provided by the user.

---

## Technical Architecture

```text
User
  ↓
React + Vite Frontend
  ↓
FastAPI Backend
  ↓
POST /analyze
  ↓
┌────────────────────────────────┐
│       Analysis Engine          │
│                                │
│ Rule-Based Detection           │
│              +                 │
│ Gemini AI Contextual Analysis  │
└────────────────────────────────┘
  ↓
Combined Risk Assessment
  ↓
Risk Score + Risk Level
  ↓
Red Flags + AI Assessment
  ↓
Safety Recommendations
  ↓
User
```

---

## Testing & Live Demo

### Testing

Testing was performed using different recruitment messages to verify:

- High-risk scam detection
- Suspicious recruitment patterns
- Low-risk job postings
- Red-flag identification
- AI contextual analysis
- Risk score generation
- Safety recommendations
- Frontend-backend communication

Detailed test cases are documented in [TESTING.md](TESTING.md).

### Live Demo

[**JobShield AI — Live Application**](https://job-shield-ai-mu.vercel.app/)

The live application provides the deployed JobShield AI frontend and connects to the deployed FastAPI backend for recruitment scam analysis.
