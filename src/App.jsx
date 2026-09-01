import React, { useState } from "react";
import "./App.css";

// =====================================================
// CONFIG
// =====================================================
const BACKEND_URL = "https://jobshield-ai-fdz9.onrender.com/analyze";

// =====================================================
// HELPERS
// =====================================================

function clampScore(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return 0;
  return Math.min(100, Math.max(0, Math.round(num)));
}

function getRiskLevel(score) {
  if (score >= 60) return "High Risk";
  if (score >= 30) return "Suspicious";
  return "Low Risk";
}

function riskLevelClass(level) {
  if (level === "High Risk") return "risk-high";
  if (level === "Suspicious") return "risk-suspicious";
  return "risk-low";
}

function severityClass(severity) {
  const s = (severity || "").toLowerCase();
  if (s === "high") return "severity-high";
  if (s === "medium") return "severity-medium";
  return "severity-low";
}

// Split a block of text into individual sentences so we can check
// each one on its own (this is how we tell a "no fee" sentence
// apart from a real payment-request sentence).
function splitIntoSentences(text) {
  const normalized = text.replace(/\r\n/g, "\n").split(/\n+/).join(". ");
  const parts = normalized.split(/(?<=[.!?])\s+/);
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

// =====================================================
// RULE ENGINE — INDIVIDUAL DETECTORS
// Each detector looks sentence-by-sentence and returns
// { matched: boolean, evidence: string }
// =====================================================

// ---- 1. Upfront payment request (with negation awareness) ----
const PAYMENT_NEGATION_PHRASES = [
  "no application fee",
  "no registration fee",
  "no processing fee",
  "no joining fee",
  "no training fee",
  "no security fee",
  "no security deposit",
  "no verification fee",
  "no verification deposit",
  "no onboarding fee",
  "no onboarding deposit",
  "no confirmation fee",
  "no payment required",
  "no upfront payment",
  "no upfront fee",
  "there is no fee",
  "there are no fees",
  "no fee is required",
  "no fees are required",
  "without any fee",
  "without a fee",
  "without payment",
  "payment is not required",
  "does not require payment",
  "doesn't require payment",
  "do not require payment",
  "don't require payment",
];

const PAYMENT_TRIGGER_REGEXES = [
  /\bpay\b[^.!?]{0,40}(₹|rs\.?|inr)\s?[\d,]+/i,
  /(₹|rs\.?|inr)\s?[\d,]+[^.!?]{0,40}\b(fee|deposit|payment|charge)\b/i,
  /\bsend\b[^.!?]{0,40}(₹|rs\.?|inr)\s?[\d,]+/i,
  /\btransfer\b[^.!?]{0,40}(₹|rs\.?|inr)\s?[\d,]+/i,
  /\bdeposit\b[^.!?]{0,40}(₹|rs\.?|inr)\s?[\d,]+/i,
  /(registration|verification|security|processing|joining|training|onboarding|confirmation)\s+(fee|deposit)\s+of\s+(₹|rs\.?|inr)\s?[\d,]+/i,
];

function detectPaymentRequest(sentences) {
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const isNegated = PAYMENT_NEGATION_PHRASES.some((phrase) =>
      lower.includes(phrase)
    );
    if (isNegated) continue; // this sentence explicitly says NO fee — skip it

    const matched = PAYMENT_TRIGGER_REGEXES.some((rx) => rx.test(sentence));
    if (matched) {
      return { matched: true, evidence: sentence };
    }
  }
  return { matched: false, evidence: "" };
}

// ---- 2. Sensitive information request (with negation awareness) ----
const SENSITIVE_KEYWORDS = [
  "otp",
  "aadhaar",
  "aadhar",
  "pan card",
  "pan number",
  "cvv",
  "bank details",
  "bank account",
  "account number",
  "debit card",
  "credit card",
  "atm pin",
  "net banking",
  "ifsc code",
  "upi pin",
];

const SENSITIVE_NEGATION_PHRASES = [
  "never ask",
  "do not ask",
  "don't ask",
  "will not ask",
  "won't ask",
  "not required to share",
  "should not share",
  "never share",
  "never request",
  "we do not require",
  "we do not ask",
];

function detectSensitiveInfo(sentences) {
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const isNegated = SENSITIVE_NEGATION_PHRASES.some((phrase) =>
      lower.includes(phrase)
    );
    if (isNegated) continue;

    const matched = SENSITIVE_KEYWORDS.some((k) => lower.includes(k));
    if (matched) {
      return { matched: true, evidence: sentence };
    }
  }
  return { matched: false, evidence: "" };
}

// ---- 3. Unrealistic earning claims ----
const EARNING_REGEXES = [
  /(₹|rs\.?|inr)\s?[\d,]+[^.!?]{0,20}per\s?(month|week|day)/i,
  /\bearn\b[^.!?]{0,40}(₹|rs\.?|inr)\s?[\d,]+/i,
  /\beasy money\b/i,
];

function detectEarningClaims(sentences) {
  for (const sentence of sentences) {
    const matched = EARNING_REGEXES.some((rx) => rx.test(sentence));
    if (matched) return { matched: true, evidence: sentence };
  }
  return { matched: false, evidence: "" };
}

// ---- 4. Guaranteed employment ----
const GUARANTEED_REGEXES = [
  /\bguaranteed\b[^.!?]{0,30}(job|employment|position|salary|income|selection|placement|offer)/i,
  /\b(100%\s*)?job\s*guarantee\b/i,
];

function detectGuaranteedEmployment(sentences) {
  for (const sentence of sentences) {
    const matched = GUARANTEED_REGEXES.some((rx) => rx.test(sentence));
    if (matched) return { matched: true, evidence: sentence };
  }
  return { matched: false, evidence: "" };
}

// ---- 5. Urgency or pressure ----
const URGENCY_PHRASES = [
  "apply immediately",
  "join immediately",
  "act now",
  "hurry up",
  "offer expires today",
  "expires today",
  "limited positions",
  "limited time",
  "limited slots",
  "urgent requirement",
  "apply now",
  "only few hours",
  "last chance",
];

function detectUrgency(sentences) {
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const matched = URGENCY_PHRASES.some((p) => lower.includes(p));
    if (matched) return { matched: true, evidence: sentence };
  }
  return { matched: false, evidence: "" };
}

// ---- 6. Suspicious recruitment channels ----
const CHANNEL_WORDS = ["telegram", "whatsapp"];
const CHANNEL_PROXIMITY_WORDS = [
  "contact",
  "apply",
  "through",
  "only",
  "message",
  "chat",
  "recruiter",
  "send",
  "reach",
  "join",
];

function detectSuspiciousChannel(sentences) {
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const hasChannel = CHANNEL_WORDS.some((w) => lower.includes(w));
    const hasProximity = CHANNEL_PROXIMITY_WORDS.some((w) => lower.includes(w));
    if (hasChannel && hasProximity) {
      return { matched: true, evidence: sentence };
    }
  }
  return { matched: false, evidence: "" };
}

// ---- 7. Unusual recruitment process ----
const UNUSUAL_PROCESS_PHRASES = [
  "no interview required",
  "no interview needed",
  "without any interview",
  "instant hiring",
  "instant selection",
  "hired without interview",
  "no assessment required",
];

function detectUnusualProcess(sentences) {
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const phraseMatch = UNUSUAL_PROCESS_PHRASES.some((p) => lower.includes(p));
    const regexMatch = /\bno\s+interview\b/i.test(sentence);
    if (phraseMatch || regexMatch) {
      return { matched: true, evidence: sentence };
    }
  }
  return { matched: false, evidence: "" };
}

// ---- 8. Suspicious contact information ----
const CONTACT_PROXIMITY_WORDS = ["contact", "call", "whatsapp", "reach", "number"];

function detectSuspiciousContact(sentences) {
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const hasRawNumber = /\b\d{10}\b/.test(sentence);
    const hasProximity = CONTACT_PROXIMITY_WORDS.some((w) => lower.includes(w));
    if (hasRawNumber && hasProximity) {
      return { matched: true, evidence: sentence };
    }
  }
  return { matched: false, evidence: "" };
}

// =====================================================
// DEFAULT SAFETY RECOMMENDATIONS PER FLAG
// =====================================================
const DEFAULT_RECOMMENDATIONS = {
  payment:
    "Never pay money — a genuine employer does not ask candidates to pay fees, deposits, or refundable amounts.",
  sensitive:
    "Do not share OTPs, bank details, Aadhaar, PAN, or card details with unknown recruiters.",
  earning:
    "Be cautious of jobs promising unusually high pay for little or no experience.",
  guaranteed:
    "No legitimate employer can guarantee a job or salary without an interview or assessment.",
  urgency:
    "Take your time — scammers create false urgency to pressure quick decisions.",
  channel:
    "Be cautious if recruitment happens only through personal messaging apps like Telegram or WhatsApp instead of official company channels.",
  process:
    "A proper hiring process usually includes an interview or assessment — be cautious of postings that skip this entirely.",
  contact:
    "Verify recruiter contact details against the company's official website or official HR email.",
};

const GENERAL_RECOMMENDATION =
  "Always verify the company's official website and reach out through official channels before proceeding.";

// =====================================================
// RULE ENGINE — MAIN FUNCTION
// =====================================================
function runRuleEngine(text) {
  const sentences = splitIntoSentences(text);
  const flags = [];
  let score = 0;

  const payment = detectPaymentRequest(sentences);
  if (payment.matched) {
    score += 30;
    flags.push({
      id: "payment",
      title: "Upfront payment request",
      severity: "high",
      points: 30,
      explanation:
        "The posting asks the candidate to pay money (a fee, deposit, or payment) before or during recruitment. Legitimate employers do not charge candidates.",
      evidence: payment.evidence,
    });
  }

  const sensitive = detectSensitiveInfo(sentences);
  if (sensitive.matched) {
    score += 25;
    flags.push({
      id: "sensitive",
      title: "Sensitive information request",
      severity: "high",
      points: 25,
      explanation:
        "The posting asks for sensitive personal or financial information such as OTP, Aadhaar, PAN, or bank details.",
      evidence: sensitive.evidence,
    });
  }

  const earning = detectEarningClaims(sentences);
  if (earning.matched) {
    score += 15;
    flags.push({
      id: "earning",
      title: "Unrealistic earning claims",
      severity: "medium",
      points: 15,
      explanation:
        "The posting makes an earning claim that sounds unusually high or easy for the described role.",
      evidence: earning.evidence,
    });
  }

  const guaranteed = detectGuaranteedEmployment(sentences);
  if (guaranteed.matched) {
    score += 15;
    flags.push({
      id: "guaranteed",
      title: "Guaranteed employment",
      severity: "medium",
      points: 15,
      explanation:
        "The posting guarantees a job, position, or salary, which is unusual for a legitimate hiring process.",
      evidence: guaranteed.evidence,
    });
  }

  const urgency = detectUrgency(sentences);
  if (urgency.matched) {
    score += 10;
    flags.push({
      id: "urgency",
      title: "Urgency or pressure",
      severity: "medium",
      points: 10,
      explanation:
        "The posting uses urgent or pressuring language to push the candidate into a quick decision.",
      evidence: urgency.evidence,
    });
  }

  const channel = detectSuspiciousChannel(sentences);
  if (channel.matched) {
    score += 10;
    flags.push({
      id: "channel",
      title: "Suspicious recruitment channel",
      severity: "medium",
      points: 10,
      explanation:
        "The posting directs candidates to informal messaging apps like Telegram or WhatsApp instead of official company channels.",
      evidence: channel.evidence,
    });
  }

  const process_ = detectUnusualProcess(sentences);
  if (process_.matched) {
    score += 15;
    flags.push({
      id: "process",
      title: "Unusual recruitment process",
      severity: "medium",
      points: 15,
      explanation:
        "The posting skips standard hiring steps such as an interview or assessment.",
      evidence: process_.evidence,
    });
  }

  const contact = detectSuspiciousContact(sentences);
  if (contact.matched) {
    score += 10;
    flags.push({
      id: "contact",
      title: "Suspicious contact information",
      severity: "low",
      points: 10,
      explanation:
        "The posting shares a personal-looking phone number for recruitment contact instead of an official company channel.",
      evidence: contact.evidence,
    });
  }

  return { score: clampScore(score), flags };
}

// =====================================================
// GEMINI BACKEND CALL
// =====================================================
async function callGeminiBackend(text) {
  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Backend returned an error status: " + response.status);
  }

  const data = await response.json();

  if (!data || !data.success || !data.ai_available || !data.analysis) {
    return null; // Gemini not available — caller will fall back to rule engine
  }

  // Gemini sometimes wraps its JSON in ```json ... ``` code fences.
  const cleaned = String(data.analysis)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned); // may throw — caller catches it
  return parsed;
}

// =====================================================
// EXAMPLE POSTINGS (for the demo buttons)
// =====================================================
const EXAMPLE_GENUINE = `ABC Technologies is hiring software developers.

There is no application fee, no registration fee, and no payment required at any stage of recruitment.

Candidates will complete an online assessment followed by a technical interview.`;

const EXAMPLE_SUSPICIOUS = `Congratulations! You have been selected for a work-from-home data entry position.

No application fee is required.

However, you must pay a refundable verification deposit of ₹299 before onboarding.

Candidates should contact our recruitment team through Telegram for the next steps.

Limited positions are available. Apply immediately.`;

const EXAMPLE_SCAM = `Congratulations! You have been selected for a work-from-home opportunity.

You are guaranteed a salary of ₹80,000 per month.

Pay a ₹999 registration fee today to confirm your position.

Send your Aadhaar, PAN card, bank details and OTP to our recruiter on WhatsApp.

No interview is required.

This offer expires today. Join immediately.`;

// =====================================================
// MAIN APP COMPONENT
// =====================================================
export default function App() {
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function loadExample(text) {
    setJobText(text);
    setError("");
    setResult(null);
  }

  async function handleAnalyze() {
    setError("");
    setResult(null);

    if (!jobText.trim()) {
      setError("Please paste a job posting or recruitment message first.");
      return;
    }

    setLoading(true);

    // 1. Rule engine always runs, and always succeeds.
    const ruleResult = runRuleEngine(jobText);

    // 2. Try Gemini AI, but never let it break the app.
    let gemini = null;
    try {
      gemini = await callGeminiBackend(jobText);
    } catch (err) {
      gemini = null; // treat any failure as "AI unavailable"
    }

    let combinedScore;
    let aiScore = null;
    let aiSummary = "";
    let aiRedFlags = [];
    let aiRecommendations = [];
    let sources;

    if (gemini) {
      aiScore = clampScore(gemini.risk_score);
      combinedScore = clampScore(ruleResult.score * 0.4 + aiScore * 0.6);
      sources = "Rule Engine + Gemini AI";
      aiSummary = gemini.summary || "";
      aiRedFlags = Array.isArray(gemini.red_flags) ? gemini.red_flags : [];
      aiRecommendations = Array.isArray(gemini.safety_recommendations)
        ? gemini.safety_recommendations
        : [];
    } else {
      combinedScore = clampScore(ruleResult.score);
      sources = "Rule Engine only (Gemini AI unavailable)";
    }

    const riskLevel = getRiskLevel(combinedScore);

    // Build a fallback explanation when Gemini has nothing to say.
    let explanation = aiSummary;
    if (!explanation) {
      if (ruleResult.flags.length === 0) {
        explanation =
          "No suspicious patterns were detected by the Rule Engine. This posting looks consistent with a genuine job listing, but always verify the company independently before proceeding.";
      } else {
        const titles = ruleResult.flags.map((f) => f.title.toLowerCase()).join(", ");
        explanation = `Based on rule-based analysis, this posting shows signs of: ${titles}.`;
      }
      if (!gemini) {
        explanation +=
          " Gemini AI analysis is temporarily unavailable, so this result is based solely on the Rule Engine.";
      }
    }

    // Merge red flags from both sources, removing obvious duplicates by title.
    const seenTitles = new Set();
    const mergedFlags = [];

    ruleResult.flags.forEach((f) => {
      const key = f.title.trim().toLowerCase();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        mergedFlags.push({
          title: f.title,
          severity: f.severity,
          explanation: f.explanation,
          evidence: f.evidence,
          source: "Rule Engine",
        });
      }
    });

    aiRedFlags.forEach((f) => {
      if (!f || !f.title) return;
      const key = f.title.trim().toLowerCase();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        mergedFlags.push({
          title: f.title,
          severity: f.severity || "medium",
          explanation: f.explanation || "",
          evidence: "",
          source: "Gemini AI",
        });
      }
    });

    // Merge safety recommendations (rule-based defaults + AI recommendations).
    const recSet = new Set();
    const mergedRecommendations = [];

    ruleResult.flags.forEach((f) => {
      const rec = DEFAULT_RECOMMENDATIONS[f.id];
      if (rec && !recSet.has(rec.toLowerCase())) {
        recSet.add(rec.toLowerCase());
        mergedRecommendations.push(rec);
      }
    });

    aiRecommendations.forEach((rec) => {
      if (rec && !recSet.has(String(rec).toLowerCase())) {
        recSet.add(String(rec).toLowerCase());
        mergedRecommendations.push(rec);
      }
    });

    if (!recSet.has(GENERAL_RECOMMENDATION.toLowerCase())) {
      mergedRecommendations.push(GENERAL_RECOMMENDATION);
    }

    setResult({
      ruleScore: ruleResult.score,
      aiScore,
      aiAvailable: !!gemini,
      combinedScore,
      riskLevel,
      sources,
      explanation,
      flags: mergedFlags,
      recommendations: mergedRecommendations,
    });

    setLoading(false);
  }

  return (
    <div className="app-container">
      {/* ============ SINGLE UNIFIED HEADER ============ */}
      <nav className="site-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="nav-shield" aria-hidden="true"></span>
            JobShield AI
          </div>
          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="#safety" className="nav-link">
              Safety
            </a>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-eyebrow">AI + Rule-Based Protection</span>
          <h1 className="hero-title">Protect Your Career From Recruitment Scams</h1>
          <p className="hero-subtitle">
            JobShield AI analyzes job postings and recruiter messages using
            rule-based intelligence and Gemini AI to identify suspicious
            patterns before you share your money or sensitive information.
          </p>
          <div className="hero-actions">
            <a href="#analysis" className="hero-cta">
              Analyze a Job Posting
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-shield">
            <span className="hero-shield-check">✓</span>
          </div>
        </div>
      </section>

      {/* ============ FEATURE CARDS ============ */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Powered Analysis</h3>
            <p className="feature-desc">
              Gemini AI provides contextual analysis of suspicious
              recruitment patterns.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Explainable Detection</h3>
            <p className="feature-desc">
              The system identifies red flags and shows evidence from the
              submitted message.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Instant Risk Assessment</h3>
            <p className="feature-desc">
              Users receive a risk score and classification quickly.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Safety Guidance</h3>
            <p className="feature-desc">
              Users receive practical recommendations before sharing money or
              sensitive information.
            </p>
          </div>
        </div>
      </section>

      {/* ============ ANALYSIS SECTION (existing functionality) ============ */}
      <section id="analysis" className="analysis-section content-narrow">
        <h2 className="section-heading">Analyze a Job Posting</h2>
        <p className="section-subtext">
          Paste a job advertisement, recruiter message, or employment offer
          to assess potential scam indicators.
        </p>

        <div className="example-buttons">
          <button
            type="button"
            className="example-button example-genuine"
            onClick={() => loadExample(EXAMPLE_GENUINE)}
          >
            🟢 Genuine Job
          </button>
          <button
            type="button"
            className="example-button example-suspicious"
            onClick={() => loadExample(EXAMPLE_SUSPICIOUS)}
          >
            🟠 Suspicious Job
          </button>
          <button
            type="button"
            className="example-button example-scam"
            onClick={() => loadExample(EXAMPLE_SCAM)}
          >
            🔴 Scam Example
          </button>
        </div>

        <div className="input-section">
          <label htmlFor="jobText" className="input-label">
            Paste a job posting or recruitment message
          </label>
          <textarea
            id="jobText"
            className="job-textarea"
            rows={10}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste the full job posting or recruiter message here..."
          />

          {error && <div className="error-banner">{error}</div>}

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Job Posting"}
          </button>
        </div>

        {loading && (
          <div className="loading-indicator">Analyzing job posting...</div>
        )}

        {result && (
          <section className="results-section">
            <div className={`risk-banner ${riskLevelClass(result.riskLevel)}`}>
              <div className="risk-level-text">{result.riskLevel}</div>
              <div className="risk-score-text">{result.combinedScore}/100</div>
            </div>

            <div className="score-grid">
              <div className="score-card">
                <div className="score-label">Rule Engine</div>
                <div className="score-value">{result.ruleScore}/100</div>
              </div>
              <div className="score-card">
                <div className="score-label">Gemini AI</div>
                <div className="score-value">
                  {result.aiAvailable ? `${result.aiScore}/100` : "Unavailable"}
                </div>
              </div>
              <div className="score-card">
                <div className="score-label">Combined Score</div>
                <div className="score-value">{result.combinedScore}/100</div>
              </div>
            </div>

            <div className="sources-badges">
              <span className="source-label">Detection Sources:</span>
              <span className="source-badge">{result.sources}</span>
            </div>

            <div className="explanation-box">
              <h3>Explanation</h3>
              <p>{result.explanation}</p>
            </div>

            <div className="flags-section">
              <h3>Detected Red Flags</h3>
              {result.flags.length === 0 ? (
                <p className="no-flags-text">No red flags detected.</p>
              ) : (
                result.flags.map((flag, idx) => (
                  <div className="flag-card" key={idx}>
                    <div className="flag-header">
                      <span className="flag-title">{flag.title}</span>
                      <span
                        className={`severity-badge ${severityClass(flag.severity)}`}
                      >
                        {flag.severity}
                      </span>
                      <span className="flag-source">({flag.source})</span>
                    </div>
                    {flag.explanation && (
                      <p className="flag-explanation">{flag.explanation}</p>
                    )}
                    {flag.evidence && (
                      <p className="flag-evidence">
                        Evidence detected: "{flag.evidence}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="recommendations-section">
              <h3>Safety Recommendations</h3>
              <ul>
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="recommendation-item">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </section>

      {/* ============ HOW JOBSHIELD AI WORKS ============ */}
      <section id="how-it-works" className="how-it-works-section content-narrow">
        <h3>How JobShield AI Works</h3>
        <div className="how-it-works-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4 className="step-title">Analyze</h4>
            <p className="step-desc">
              Submit a job posting or recruiter message.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h4 className="step-title">Detect</h4>
            <p className="step-desc">
              Rule Engine (40% weight) identifies known scam patterns such as
              upfront payments, sensitive-info requests, and urgency tactics.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h4 className="step-title">Understand</h4>
            <p className="step-desc">
              Gemini AI (60% weight) provides contextual analysis beyond
              simple keyword matching.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">04</div>
            <h4 className="step-title">Protect</h4>
            <p className="step-desc">
              Receive a combined risk assessment and safety guidance. If
              Gemini is unavailable, the Rule Engine result is used on its
              own.
            </p>
          </div>
        </div>
      </section>

      {/* ============ TRUST / SAFETY SECTION ============ */}
      <section id="safety" className="trust-section content-narrow">
        <h3 className="section-heading">Stay Safe While Job Hunting</h3>
        <div className="safety-tips-grid">
          <div className="safety-tip">🛡️ Don't pay upfront fees</div>
          <div className="safety-tip">🔐 Never share OTPs</div>
          <div className="safety-tip">🌐 Verify the official company website</div>
          <div className="safety-tip">📧 Verify recruiter email/domain</div>
          <div className="safety-tip">⚠️ Avoid unverified messaging channels</div>
        </div>
        <p className="trust-disclaimer">
          JobShield AI provides decision-support and awareness guidance. It
          does not definitively determine whether an employer or job posting
          is genuine.
        </p>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="footer-brand">JobShield AI</div>
        <div className="footer-tagline">AI-Powered Recruitment Scam Detection</div>
        <div className="footer-note">Built for safer digital recruitment.</div>
      </footer>
    </div>
  );
}