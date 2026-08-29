import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI(
    title="JobShield AI API",
    description="AI-powered recruitment scam analysis backend",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://job-shield-ai-mu.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobRequest(BaseModel):
    text: str


client = None

if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as error:
        print(f"Gemini client initialization failed: {error}")
        client = None


@app.get("/")
def root():
    return {
        "message": "JobShield AI backend is running",
        "status": "ok",
        "ai_available": client is not None,
    }


@app.post("/analyze")
def analyze_job(request: JobRequest):
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Job posting text cannot be empty.",
        )

    # Gemini unavailable → return controlled fallback response
    if client is None:
        return {
            "success": False,
            "ai_available": False,
            "analysis": None,
            "message": (
                "Gemini AI is currently unavailable. "
                "The application can continue using rule-based analysis."
            ),
        }

    prompt = f"""
You are the AI analysis component of JobShield AI,
a recruitment scam awareness and decision-support system.

Analyze the following job posting or recruitment message.

JOB POSTING:
{request.text}

Identify possible recruitment scam indicators.

Consider:
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

Return ONLY valid JSON in this exact structure:

{{
  "risk_level": "Low Risk | Suspicious | High Risk",
  "risk_score": 0,
  "summary": "short explanation",
  "red_flags": [
    {{
      "title": "red flag name",
      "severity": "high | medium | low",
      "explanation": "why this may be concerning"
    }}
  ],
  "safety_recommendations": [
    "recommendation 1",
    "recommendation 2"
  ]
}}

Important:
- Do not claim with certainty that a posting is a scam.
- Treat the result as decision-support and awareness guidance.
- Use a risk score from 0 to 100.
- Base the assessment only on the provided text.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        return {
            "success": True,
            "ai_available": True,
            "analysis": response.text,
        }

    except Exception as error:
        print(f"Gemini analysis failed: {error}")

        return {
            "success": False,
            "ai_available": False,
            "analysis": None,
            "message": (
                "Gemini AI analysis is temporarily unavailable. "
                "The application can continue using its rule-based assessment."
            ),
        }