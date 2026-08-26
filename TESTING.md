# JobShield AI Testing

## Overview

JobShield AI was tested using different types of recruitment messages to verify
risk detection, AI analysis, red-flag identification, and safety recommendations.

## Test Case 1 — High-Risk Recruitment Message

### Input

A recruitment message offering a high salary while requesting Aadhaar,
PAN, bank details, ATM PIN and OTP through WhatsApp.

### Expected Result

The system should identify the posting as high risk and detect indicators
related to sensitive information requests, unrealistic earnings, unsecured
communication channels, and urgency.

### Observed Result

Risk Level: High Risk  
Combined Risk Score: 83/100

---

## Test Case 2 — Low-Risk Job Posting

### Input

A standard internship posting containing normal eligibility requirements,
location, duration, and application through an official company careers portal.

### Expected Result

The system should identify few or no major recruitment scam indicators.

### Observed Result

Risk Level: Low Risk  
Combined Risk Score: 6/100

---

## Test Case 3 — Empty Input

### Input

No job posting or recruitment message.

### Expected Result

The system should prevent analysis of empty input and display an appropriate
validation message.

---

## Testing Areas

- Job posting analysis
- Recruitment message analysis
- Rule-based detection
- Gemini AI analysis
- Risk scoring
- Red-flag detection
- Safety recommendations
- Empty-input validation
- Frontend-backend communication
