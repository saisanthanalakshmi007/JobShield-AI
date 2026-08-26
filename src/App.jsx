import { useState } from "react";
import "./App.css";

const scamRules = [
  {
    name: "Upfront payment request",
    keywords: [
      "registration fee",
      "registration fees",
      "processing fee",
      "processing fees",
      "application fee",
      "application fees",
      "joining fee",
      "joining fees",
      "training fee",
      "training fees",
      "security deposit",
      "security fee",
      "pay a fee",
      "pay fee",
      "pay ₹",
      "pay rs",
      "send money",
      "make a payment",
      "payment required",
      "deposit money",
    ],
    points: 30,
    severity: "high",
    explanation:
      "The posting appears to request money before or during recruitment.",
  },
  {
    name: "Sensitive information request",
    keywords: [
      "otp",
      "one time password",
      "bank account",
      "bank details",
      "bank information",
      "credit card",
      "debit card",
      "cvv",
      "atm pin",
      "pin number",
      "password",
      "aadhaar",
      "aadhar",
      "pan card",
      "passport details",
    ],
    points: 25,
    severity: "high",
    explanation:
      "The posting may be requesting sensitive personal or financial information.",
  },
  {
    name: "Unrealistic earning claim",
    keywords: [
      "earn ₹",
      "earn rs",
      "earn 50000",
      "earn 100000",
      "earn 1 lakh",
      "earn 2 lakh",
      "guaranteed income",
      "guaranteed salary",
      "guaranteed earnings",
      "easy money",
      "huge income",
      "unlimited income",
      "earn money easily",
      "make money easily",
      "daily income",
      "weekly income",
    ],
    points: 20,
    severity: "medium",
    explanation:
      "The posting contains claims about unusually easy or guaranteed earnings.",
  },
  {
    name: "Urgency or pressure",
    keywords: [
      "act now",
      "apply immediately",
      "limited vacancies",
      "limited vacancy",
      "limited seats",
      "urgent",
      "immediate joining",
      "join immediately",
      "join today",
      "last chance",
      "respond immediately",
      "offer expires",
      "apply today",
      "hurry",
    ],
    points: 10,
    severity: "medium",
    explanation:
      "Pressure or urgency can be used to prevent applicants from properly verifying an offer.",
  },
  {
    name: "Guaranteed employment",
    keywords: [
      "guaranteed job",
      "100% job guarantee",
      "100% job guaranteed",
      "job guaranteed",
      "job guarantee",
      "no interview",
      "no interview required",
      "selected without interview",
      "job without interview",
      "guaranteed placement",
    ],
    points: 15,
    severity: "high",
    explanation:
      "Guaranteed employment claims or bypassing normal recruitment processes can be suspicious.",
  },
  {
    name: "Suspicious recruitment channel",
    keywords: [
      "contact only on whatsapp",
      "contact us only on whatsapp",
      "whatsapp only",
      "whatsapp recruitment",
      "contact only via whatsapp",
      "contact us via whatsapp",
      "message on whatsapp",
      "contact only on telegram",
      "telegram only",
      "telegram recruitment",
      "contact us via telegram",
      "contact me on telegram",
      "message me on telegram",
      "dm me",
      "contact through whatsapp",
    ],
    points: 10,
    severity: "medium",
    explanation:
      "Recruitment that relies heavily on informal messaging channels may require additional verification.",
  },
  {
    name: "Unusual recruitment process",
    keywords: [
      "selected without interview",
      "no interview required",
      "no qualification required",
      "no experience required",
      "instant selection",
      "instant job",
      "immediate selection",
      "selected immediately",
    ],
    points: 10,
    severity: "medium",
    explanation:
      "An unusually easy or immediate recruitment process may require additional verification.",
  },
  {
    name: "Suspicious contact information",
    keywords: [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "protonmail",
      "contact me personally",
      "personal email",
    ],
    points: 5,
    severity: "medium",
    explanation:
      "The contact information may not clearly identify an official company communication channel.",
  },
];

function analyzeJobPosting(text) {
  const normalizedText = text.toLowerCase();

  let score = 0;
  const detectedRules = [];

  scamRules.forEach((rule) => {
    const matchedKeyword = rule.keywords.some((keyword) =>
      normalizedText.includes(keyword)
    );

    if (matchedKeyword) {
      score += rule.points;

      detectedRules.push({
        name: rule.name,
        severity: rule.severity,
        explanation: rule.explanation,
      });
    }
  });

  score = Math.min(score, 100);

  let level;

  if (score >= 60) {
    level = "High Risk";
  } else if (score >= 30) {
    level = "Suspicious";
  } else {
    level = "Low Risk";
  }

  return {
    score,
    level,
    redFlags: detectedRules,
  };
}

function parseGeminiAnalysis(rawAnalysis) {
  try {
    let cleaned = rawAnalysis.trim();

    cleaned = cleaned.replace(/^```json\s*/i, "");
    cleaned = cleaned.replace(/^```\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Could not parse Gemini response:", error);
    return null;
  }
}

async function analyzeWithAI(text) {
  const response = await fetch("https://jobshield-ai-fdz9.onrender.com/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.detail || `Backend error: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Gemini analysis was unsuccessful.");
  }

  const parsed = parseGeminiAnalysis(data.analysis);

  if (!parsed) {
    throw new Error("Gemini returned an unexpected response format.");
  }

  return parsed;
}

function App() {
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const analyzeJob = async () => {
    if (!jobText.trim()) {
      alert("Please paste a job posting or recruitment message.");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setError("");

    try {
      const ruleAnalysis = analyzeJobPosting(jobText);

      const aiAnalysis = await analyzeWithAI(jobText);

      const aiScore = Number(aiAnalysis.risk_score) || 0;

      const combinedScore = Math.round(
        ruleAnalysis.score * 0.4 + aiScore * 0.6
      );

      let combinedLevel;

      if (combinedScore >= 60) {
        combinedLevel = "High Risk";
      } else if (combinedScore >= 30) {
        combinedLevel = "Suspicious";
      } else {
        combinedLevel = "Low Risk";
      }

      const combinedFlags = [];

      ruleAnalysis.redFlags.forEach((flag) => {
        combinedFlags.push({
          name: flag.name,
          severity: flag.severity,
          explanation: flag.explanation,
          source: "Rule-based",
        });
      });

      if (Array.isArray(aiAnalysis.red_flags)) {
        aiAnalysis.red_flags.forEach((flag) => {
          const title = flag.title || "AI-detected warning";

          const alreadyExists = combinedFlags.some(
            (existing) =>
              existing.name.toLowerCase() === title.toLowerCase()
          );

          if (!alreadyExists) {
            combinedFlags.push({
              name: title,
              severity: flag.severity || "medium",
              explanation:
                flag.explanation ||
                "Gemini identified this as a possible warning sign.",
              source: "Gemini AI",
            });
          }
        });
      }

      let finalRecommendation =
        "Verify the employer independently before proceeding.";

      if (
        Array.isArray(aiAnalysis.safety_recommendations) &&
        aiAnalysis.safety_recommendations.length > 0
      ) {
        finalRecommendation =
          aiAnalysis.safety_recommendations.join(" ");
      }

      setResult({
        score: combinedScore,
        level: combinedLevel,
        redFlags: combinedFlags,
        recommendation: finalRecommendation,

        summary:
          aiAnalysis.summary ||
          "Gemini AI analyzed this recruitment message for contextual scam indicators.",

        aiScore,
        ruleScore: ruleAnalysis.score,
      });
    } catch (error) {
      console.error("Analysis failed:", error);

      setError(
        "Unable to connect to the AI analysis service. Please make sure the JobShield FastAPI backend is running on port 8000."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="shield">🛡️</div>

          <div>
            <h1>JobShield AI</h1>
            <p>Recruitment Scam Detection</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Protection
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="badge">AI-POWERED SCAM PROTECTION</div>

          <h2>
            Detect suspicious jobs
            <br />
            <span>before they become scams.</span>
          </h2>

          <p className="hero-text">
            Analyze job postings and recruitment messages for suspicious
            patterns, financial requests, misleading claims, and other
            recruitment scam indicators.
          </p>
        </section>

        <section className="analyzer-card">
          <div className="card-header">
            <div>
              <h3>Analyze a Job Posting</h3>

              <p>
                Paste the job description or recruitment message below.
              </p>
            </div>

            <span className="input-label">AI + RULE ANALYSIS</span>
          </div>

          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Example: Congratulations! You have been selected for a work-from-home opportunity. Earn ₹50,000 per month. Pay ₹999 registration fee to confirm your position..."
          />

          <div className="input-footer">
            <span>{jobText.length} characters</span>

            <button onClick={analyzeJob} disabled={analyzing}>
              {analyzing ? "⏳ Analyzing with AI..." : "🔍 Analyze Job"}
            </button>
          </div>
        </section>

        {error && (
          <section className="result-card">
            <div className="no-flags">🔴 {error}</div>
          </section>
        )}

        {result && (
          <section className="result-card">
            <div className="result-top">
              <div>
                <span className="result-label">
                  AI + RULE ANALYSIS RESULT
                </span>

                <h3
                  className={
                    result.score >= 60
                      ? "high-risk"
                      : result.score >= 30
                      ? "suspicious-risk"
                      : "low-risk"
                  }
                >
                  {result.level}
                </h3>
              </div>

              <div className="score">
                <strong>{result.score}</strong>
                <span>/100</span>
              </div>
            </div>

            <div className="risk-bar">
              <div
                className="risk-progress"
                style={{ width: `${result.score}%` }}
              ></div>
            </div>

            {/* AI ASSESSMENT */}
            <div className="result-section">
              <h4>🤖 AI Assessment</h4>

              <div className="no-flags">
                {result.summary}
              </div>
            </div>

            {/* ANALYSIS BREAKDOWN */}
            <div className="result-section">
              <h4>📊 Analysis Breakdown</h4>

              <div className="no-flags">
                <strong>Rule-based score:</strong>{" "}
                {result.ruleScore}/100
                <br />

                <strong>Gemini AI risk score:</strong>{" "}
                {result.aiScore}/100
                <br />

                <strong>Combined score:</strong>{" "}
                {result.score}/100
              </div>
            </div>

            {/* DETECTION SOURCES */}
            <div className="result-section">
              <h4>🔧 Detection Sources</h4>

              <div className="no-flags">
                <p>✓ Rule-Based Scam Detection</p>
                <p>✓ Gemini AI Contextual Analysis</p>
                <p>✓ Combined Risk Assessment</p>
              </div>
            </div>

            {/* WHY THIS IS RISKY */}
            <div className="result-section">
              <h4>💡 Why This Job Is Risky</h4>

              <div className="no-flags">
                {result.score >= 60 ? (
                  <p>
                    This posting contains multiple warning signs
                    that may indicate recruitment fraud. Review the
                    detected red flags carefully before sharing
                    information, making payments, or continuing
                    communication with the recruiter.
                  </p>
                ) : result.score >= 30 ? (
                  <p>
                    This posting contains some characteristics that
                    deserve additional verification. Confirm the
                    employer, recruiter identity, job details, and
                    communication channels before proceeding.
                  </p>
                ) : (
                  <p>
                    No major recruitment scam indicators were
                    identified. The posting appears relatively low
                    risk based on the available information, but
                    applicants should still independently verify the
                    employer before proceeding.
                  </p>
                )}
              </div>
            </div>

            {/* RED FLAGS */}
            <div className="result-section">
              <h4>🚩 Detected Red Flags</h4>

              {result.redFlags.length > 0 ? (
                <div className="flags">
                  {result.redFlags.map((flag, index) => (
                    <div className="flag" key={index}>
                      <div>
                        <strong>
                          {flag.severity === "high"
                            ? "🔴"
                            : "🟠"}{" "}
                          {flag.name}
                        </strong>

                        <p>{flag.explanation}</p>

                        <small>
                          Source: {flag.source}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-flags">
                  🟢 No major scam indicators were detected.
                </div>
              )}
            </div>

            {/* SAFETY */}
            <div className="recommendation">
              <h4>🛡️ Safety Recommendation</h4>

              <p>{result.recommendation}</p>
            </div>

            <p className="disclaimer">
              JobShield AI provides decision-support and awareness
              guidance. It does not definitively determine whether an
              employer or job posting is genuine.
            </p>
          </section>
        )}

        <section className="how-it-works">
          <h3>How JobShield AI Works</h3>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h4>Analyze</h4>
              <p>
                Submit a job posting or recruitment message.
              </p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h4>Detect</h4>
              <p>
                Combine rule-based detection with Gemini AI
                analysis.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h4>Explain</h4>
              <p>
                Identify suspicious patterns and explain why they
                matter.
              </p>
            </div>

            <div className="step">
              <div className="step-number">04</div>
              <h4>Protect</h4>
              <p>
                Receive practical safety recommendations before
                proceeding.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <strong>JobShield AI</strong>
        <span>AI-powered recruitment scam awareness</span>
      </footer>
    </div>
  );
}

export default App;