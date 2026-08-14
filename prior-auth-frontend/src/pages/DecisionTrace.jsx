import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const defaultRules = [
  {
    id: 1,
    condition: "Diagnosis documented",
    evidence: "Chronic Knee Pain",
    policy: "Knee MRI Policy §1.1",
    result: "PASS",
    evaluation:
      "Diagnosis is clearly documented in the clinical request.",
  },
  {
    id: 2,
    condition: "Symptoms ≥ 6 weeks",
    evidence: "Symptoms present for 6 months",
    policy: "Knee MRI Policy §2.1",
    result: "PASS",
    evaluation: "Requirement satisfied.",
  },
  {
    id: 3,
    condition: "Conservative treatment completed",
    evidence: "Physical Therapy — 8 weeks",
    policy: "Knee MRI Policy §3.1",
    result: "PASS",
    evaluation:
      "Required conservative treatment has been completed.",
  },
  {
    id: 4,
    condition: "Clinical indication documented",
    evidence:
      "Persistent right knee pain despite treatment",
    policy: "Knee MRI Policy §4.1",
    result: "PASS",
    evaluation:
      "Clinical indication supports the requested MRI.",
  },
  {
    id: 5,
    condition: "Plan coverage",
    evidence:
      "HealthPlus PPO — MRI Knee covered",
    policy: "Knee MRI Policy §5.1",
    result: "PASS",
    evaluation:
      "Requested service is covered under the patient's plan.",
  },
];

const outcomeData = {
  APPROVE: {
    reason:
      "All required policy conditions are satisfied.",
    action: "Proceed with authorization.",
    confidence: "HIGH",
  },

  "PEND FOR NURSE REVIEW": {
    reason:
      "The request requires additional clinical review.",
    action:
      "Assign the request to a nurse reviewer.",
    confidence: "MEDIUM",
  },

  "REQUEST MORE INFORMATION": {
    reason:
      "Required documentation is missing.",
    action:
      "Request additional clinical information.",
    confidence: "LOW",
  },
};

function normalizeResult(result) {
  if (!result) return "PASS";

  const normalized = String(result)
    .trim()
    .toUpperCase();

  if (
    normalized === "PASS" ||
    normalized === "PASSED"
  ) {
    return "PASS";
  }

  if (
    normalized === "FAIL" ||
    normalized === "FAILED"
  ) {
    return "FAIL";
  }

  if (
    normalized === "MISSING" ||
    normalized === "INCOMPLETE"
  ) {
    return "MISSING";
  }

  return "PASS";
}

function normalizeOutcome(outcome) {
  if (!outcome) return "APPROVE";

  const normalized = String(outcome)
    .trim()
    .toUpperCase();

  if (normalized === "APPROVE") {
    return "APPROVE";
  }

  if (
    normalized === "PEND FOR NURSE REVIEW" ||
    normalized === "PEND" ||
    normalized === "PENDING"
  ) {
    return "PEND FOR NURSE REVIEW";
  }

  if (
    normalized === "REQUEST MORE INFORMATION" ||
    normalized === "REQUEST INFORMATION" ||
    normalized === "MORE INFORMATION"
  ) {
    return "REQUEST MORE INFORMATION";
  }

  return "APPROVE";
}

function getResultClass(result) {
  switch (result) {
    case "PASS":
      return "result-pass";

    case "FAIL":
      return "result-fail";

    case "MISSING":
      return "result-missing";

    default:
      return "";
  }
}

function getOutcomeClass(outcome) {
  switch (outcome) {
    case "APPROVE":
      return "outcome-approve";

    case "PEND FOR NURSE REVIEW":
      return "outcome-pend";

    case "REQUEST MORE INFORMATION":
      return "outcome-request";

    default:
      return "";
  }
}

function getStatusIcon(result) {
  switch (result) {
    case "PASS":
      return "✓";

    case "FAIL":
      return "✕";

    case "MISSING":
      return "!";

    default:
      return "?";
  }
}

function RuleResult({ rule }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rule-card">
      <button
        type="button"
        className="rule-header"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <div className="rule-title-area">
          <span
            className={`status-icon ${getResultClass(
              rule.result
            )}`}
            aria-hidden="true"
          >
            {getStatusIcon(rule.result)}
          </span>

          <div>
            <h3>{rule.condition}</h3>

            <span
              className={`result-badge ${getResultClass(
                rule.result
              )}`}
            >
              {rule.result}
            </span>
          </div>
        </div>

        <span
          className="expand-icon"
          aria-hidden="true"
        >
          {expanded ? "⌃" : "⌄"}
        </span>
      </button>

      {expanded && (
        <div className="rule-details">
          <div className="detail-item">
            <span>Condition</span>
            <strong>{rule.condition}</strong>
          </div>

          <div className="detail-item">
            <span>Evidence</span>
            <strong>{rule.evidence}</strong>
          </div>

          <div className="detail-item">
            <span>Policy Reference</span>
            <strong>{rule.policy}</strong>
          </div>

          <div className="detail-item">
            <span>Evaluation</span>
            <strong>{rule.evaluation}</strong>
          </div>

          <div className="detail-item detail-result">
            <span>Result</span>

            <strong
              className={getResultClass(
                rule.result
              )}
            >
              {getStatusIcon(rule.result)}{" "}
              {rule.result}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DecisionTrace() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};

  /*
   * Decision.jsx sends:
   *
   * navigate("/decision-trace", {
   *   state: {
   *     decision,
   *     evaluation,
   *   },
   * });
   */

  const decision = state.decision || {};
  const evaluation = state.evaluation || {};

  /*
   * ---------------------------------------------------------
   * REQUEST INFORMATION
   * ---------------------------------------------------------
   */

  const requestId =
    decision.requestId ||
    evaluation?.patient?.requestId ||
    evaluation?.requestId ||
    "PA-10025";

  const patient =
    decision.patient ||
    evaluation?.patient?.patient ||
    "John Smith";

  const requestedService =
    decision.requestedService ||
    evaluation?.patient?.requestedService ||
    "MRI — Knee";

  const policy =
    decision.policy ||
    evaluation?.policy?.name ||
    "Knee MRI Policy";

  const policyVersion =
    decision.policyVersion ||
    evaluation?.policy?.version ||
    "v2.1";

  /*
   * ---------------------------------------------------------
   * OUTCOME
   * ---------------------------------------------------------
   */

  const rawOutcome =
    decision.outcome ||
    decision.status ||
    decision.decision ||
    evaluation?.outcome ||
    evaluation?.decision ||
    "APPROVE";

  const normalizedOutcome =
    normalizeOutcome(rawOutcome);

  const decisionInfo =
    outcomeData[normalizedOutcome];

  /*
   * ---------------------------------------------------------
   * RULES
   * ---------------------------------------------------------
   */

  const rules =
    Array.isArray(evaluation?.rules) &&
    evaluation.rules.length > 0
      ? evaluation.rules.map((rule, index) => ({
          id: rule.id || index + 1,

          condition:
            rule.condition ||
            rule.name ||
            rule.title ||
            `Policy Condition ${index + 1}`,

          evidence:
            rule.evidence ||
            rule.value ||
            rule.input ||
            "Evidence available in clinical documentation",

          policy:
            rule.policyReference ||
            rule.policy ||
            rule.reference ||
            `Knee MRI Policy §${index + 1}.1`,

          result: normalizeResult(
            rule.result ||
              rule.status ||
              rule.outcome
          ),

          evaluation:
            rule.evaluation ||
            rule.explanation ||
            rule.reason ||
            "Requirement evaluated against the applicable policy.",
        }))
      : defaultRules;

  /*
   * ---------------------------------------------------------
   * RULE COUNTS
   * ---------------------------------------------------------
   */

  const rulesEvaluated = rules.length;

  const rulesPassed = rules.filter(
    (rule) => rule.result === "PASS"
  ).length;

  const rulesFailed = rules.filter(
    (rule) => rule.result === "FAIL"
  ).length;

  const missingInformation = rules.filter(
    (rule) => rule.result === "MISSING"
  ).length;

  /*
   * Every rule has been evaluated if it has a result.
   * Therefore completion is based on evaluated rules.
   */

  const completion =
    rulesEvaluated === 0
      ? 0
      : Math.round(
          ((rulesPassed +
            rulesFailed +
            missingInformation) /
            rulesEvaluated) *
            100
        );

  /*
   * ---------------------------------------------------------
   * AI EXPLANATION
   * ---------------------------------------------------------
   */

  const aiExplanation =
    decision.aiExplanation ||
    decision.explanation ||
    evaluation.aiExplanation ||
    (normalizedOutcome === "APPROVE"
      ? "The request meets the applicable policy criteria because the diagnosis is documented, symptoms have persisted for more than six weeks, conservative treatment has been attempted, and the requested MRI is covered under the patient's plan."
      : normalizedOutcome ===
        "PEND FOR NURSE REVIEW"
      ? "The request contains relevant clinical information, but additional clinical review is required before a final authorization decision can be made."
      : "The request cannot be fully evaluated because required clinical documentation is missing.");

  /*
   * ---------------------------------------------------------
   * HANDLERS
   * ---------------------------------------------------------
   */

  const handleBackToDecision = () => {
    navigate("/decision", {
      state: {
        evaluation,
      },
    });
  };

  const handleBackToPolicyEvaluation = () => {
    navigate("/policy-evaluation", {
      state: {
        evaluation,
      },
    });
  };

  return (
    <div className="decision-trace-page">
      <style>{`
        .decision-trace-page {
          min-height: 100%;
          width: 100%;
          padding: 32px;
          background: var(--background, #ffffff);
          color: var(--foreground, #17131f);
        }

        .trace-container {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
        }

        /* --------------------------------------------------
           BACK BUTTON
        -------------------------------------------------- */

        .trace-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          color: #7c5cfc;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 22px;
          padding: 4px 0;
        }

        .trace-back:hover {
          text-decoration: underline;
        }

        /* --------------------------------------------------
           HEADER
        -------------------------------------------------- */

        .trace-header {
          margin-bottom: 30px;
        }

        .trace-header h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--text-primary, #17131f);
        }

        .trace-header p {
          margin: 9px 0 0;
          max-width: 760px;
          color: var(
            --text-secondary,
            #8e879f
          );
          font-size: 15px;
          line-height: 1.6;
        }

        /* --------------------------------------------------
           REQUEST INFORMATION
        -------------------------------------------------- */

        .request-info {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 34px;
        }

        .info-card {
          min-width: 0;
          padding: 18px;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-radius: 14px;
          background: var(
            --surface,
            #181522
          );
        }

        .info-card span {
          display: block;
          margin-bottom: 7px;
          color: var(
            --text-muted,
            #8e879f
          );
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .info-card strong {
          display: block;
          overflow-wrap: anywhere;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 14px;
          line-height: 1.45;
        }

        /* --------------------------------------------------
           SECTIONS
        -------------------------------------------------- */

        .section {
          margin-bottom: 32px;
        }

        .section-title {
          margin-bottom: 15px;
        }

        .section-title h2 {
          margin: 0;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 21px;
          line-height: 1.3;
        }

        .section-title p {
          margin: 5px 0 0;
          color: var(
            --text-secondary,
            #8e879f
          );
          font-size: 13px;
          line-height: 1.5;
        }

        /* --------------------------------------------------
           WORKFLOW
        -------------------------------------------------- */

        .workflow {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-radius: 16px;
          background: var(
            --surface,
            #181522
          );
          overflow-x: auto;
        }

        .workflow-step {
          display: flex;
          min-width: 150px;
          flex: 1;
          align-items: center;
          gap: 9px;
        }

        .workflow-node {
          display: flex;
          width: 36px;
          height: 36px;
          min-width: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #7c5cfc;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
        }

        .workflow-label {
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 11px;
          font-weight: 600;
          line-height: 1.3;
        }

        .workflow-arrow {
          flex-shrink: 0;
          color: #7c5cfc;
          font-size: 19px;
          font-weight: 700;
        }

        /* --------------------------------------------------
           RULES
        -------------------------------------------------- */

        .rule-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rule-card {
          overflow: hidden;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-radius: 14px;
          background: var(
            --surface,
            #181522
          );
        }

        .rule-header {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 17px 20px;
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
          text-align: left;
        }

        .rule-header:hover {
          background: rgba(124, 92, 252, 0.04);
        }

        .rule-title-area {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 13px;
        }

        .status-icon {
          display: flex;
          width: 35px;
          height: 35px;
          min-width: 35px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 15px;
          font-weight: 800;
        }

        .result-pass {
          color: #22c55e !important;
        }

        .result-fail {
          color: #ef4444 !important;
        }

        .result-missing {
          color: #f59e0b !important;
        }

        .status-icon.result-pass {
          background: rgba(34, 197, 94, 0.12);
        }

        .status-icon.result-fail {
          background: rgba(239, 68, 68, 0.12);
        }

        .status-icon.result-missing {
          background: rgba(245, 158, 11, 0.12);
        }

        .rule-header h3 {
          margin: 0 0 5px;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
        }

        .result-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .expand-icon {
          flex-shrink: 0;
          color: var(
            --text-secondary,
            #b8b2c7
          );
          font-size: 19px;
        }

        .rule-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          padding: 20px;
          border-top: 1px solid var(
            --border,
            #302a40
          );
          background: var(
            --surface-secondary,
            #211d2d
          );
        }

        .detail-item {
          min-width: 0;
        }

        .detail-item span {
          display: block;
          margin-bottom: 6px;
          color: var(
            --text-muted,
            #8e879f
          );
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-item strong {
          display: block;
          overflow-wrap: anywhere;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 13px;
          font-weight: 600;
          line-height: 1.6;
        }

        /* --------------------------------------------------
           SUMMARY
        -------------------------------------------------- */

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .summary-card {
          padding: 20px;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-radius: 14px;
          background: var(
            --surface,
            #181522
          );
        }

        .summary-card span {
          color: var(
            --text-muted,
            #8e879f
          );
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .summary-card strong {
          display: block;
          margin-top: 8px;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 26px;
          line-height: 1;
        }

        /* --------------------------------------------------
           PROGRESS
        -------------------------------------------------- */

        .progress-wrapper {
          margin-top: 16px;
          padding: 20px;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-radius: 14px;
          background: var(
            --surface,
            #181522
          );
        }

        .progress-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 10px;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 13px;
        }

        .progress-top strong {
          color: #7c5cfc;
        }

        .progress-bar {
          width: 100%;
          height: 9px;
          overflow: hidden;
          border-radius: 20px;
          background: var(
            --border,
            #302a40
          );
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #7c5cfc;
          transition: width 0.3s ease;
        }

        /* --------------------------------------------------
           FINAL DECISION
        -------------------------------------------------- */

        .final-decision {
          padding: 28px;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-radius: 18px;
          background: var(
            --surface,
            #181522
          );
        }

        .final-label {
          color: var(
            --text-muted,
            #8e879f
          );
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .final-decision h2 {
          margin: 10px 0 0;
          font-size: 28px;
          line-height: 1.25;
        }

        .outcome-approve h2 {
          color: #22c55e;
        }

        .outcome-pend h2 {
          color: #f59e0b;
        }

        .outcome-request h2 {
          color: #ef4444;
        }

        .final-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 22px;
        }

        .final-box {
          min-width: 0;
          padding: 18px;
          border-radius: 12px;
          background: var(
            --surface-secondary,
            #211d2d
          );
        }

        .final-box span {
          display: block;
          margin-bottom: 8px;
          color: var(
            --text-muted,
            #8e879f
          );
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .final-box strong {
          display: block;
          overflow-wrap: anywhere;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 13px;
          line-height: 1.6;
        }

        /* --------------------------------------------------
           AI EXPLANATION
        -------------------------------------------------- */

        .ai-box {
          padding: 22px;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-left: 3px solid #7c5cfc;
          border-radius: 14px;
          background: var(
            --surface,
            #181522
          );
        }

        .ai-label {
          margin-bottom: 10px;
          color: #7c5cfc;
          font-size: 13px;
          font-weight: 800;
        }

        .ai-box p {
          margin: 0;
          color: var(
            --text-secondary,
            #b8b2c7
          );
          font-size: 14px;
          line-height: 1.7;
        }

        /* --------------------------------------------------
           METADATA
        -------------------------------------------------- */

        .metadata {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .metadata-item {
          min-width: 0;
          padding: 15px;
          border-radius: 11px;
          background: var(
            --surface-secondary,
            #211d2d
          );
        }

        .metadata-item span {
          display: block;
          margin-bottom: 5px;
          color: var(
            --text-muted,
            #8e879f
          );
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .metadata-item strong {
          display: block;
          overflow-wrap: anywhere;
          color: var(
            --text-primary,
            #f8f7fc
          );
          font-size: 13px;
          line-height: 1.45;
        }

        /* --------------------------------------------------
           ACTIONS
        -------------------------------------------------- */

        .bottom-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
          padding-bottom: 30px;
        }

        .action-button {
          min-height: 44px;
          padding: 11px 18px;
          border: 1px solid var(
            --border,
            #302a40
          );
          border-radius: 10px;
          background: var(
            --surface,
            #181522
          );
          color: var(
            --text-primary,
            #f8f7fc
          );
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .action-button:hover {
          border-color: rgba(124, 92, 252, 0.5);
          background: var(
            --surface-secondary,
            #211d2d
          );
        }

        .action-button.primary {
          border-color: #7c5cfc;
          background: #7c5cfc;
          color: #ffffff;
        }

        .action-button.primary:hover {
          background: #6c4bea;
        }

        /* --------------------------------------------------
           RESPONSIVE
        -------------------------------------------------- */

        @media (max-width: 1100px) {
          .request-info {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .metadata {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .workflow {
            overflow-x: auto;
          }
        }

        @media (max-width: 900px) {
          .decision-trace-page {
            padding: 24px;
          }

          .request-info,
          .summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .final-grid {
            grid-template-columns: 1fr;
          }

          .metadata {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .workflow {
            flex-direction: column;
            align-items: stretch;
            overflow-x: visible;
          }

          .workflow-step {
            width: 100%;
            min-width: 0;
          }

          .workflow-arrow {
            align-self: center;
            transform: rotate(90deg);
          }
        }

        @media (max-width: 600px) {
          .decision-trace-page {
            padding: 18px;
          }

          .trace-header h1 {
            font-size: 26px;
          }

          .request-info,
          .summary-grid,
          .rule-details,
          .metadata {
            grid-template-columns: 1fr;
          }

          .rule-header {
            padding: 15px;
          }

          .rule-details {
            padding: 16px;
          }

          .final-decision {
            padding: 22px;
          }

          .final-decision h2 {
            font-size: 23px;
          }

          .bottom-actions {
            flex-direction: column;
          }

          .action-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="trace-container">

        {/* --------------------------------------------------
            BACK TO DECISION
        -------------------------------------------------- */}

        <button
          type="button"
          className="trace-back"
          onClick={handleBackToDecision}
        >
          ← Back to Decision
        </button>

        {/* --------------------------------------------------
            PAGE HEADER
        -------------------------------------------------- */}

        <header className="trace-header">
          <h1>Why This Decision?</h1>

          <p>
            Review the clinical evidence, policy conditions,
            evaluation results, and final recommendation.
          </p>
        </header>

        {/* --------------------------------------------------
            REQUEST INFORMATION
        -------------------------------------------------- */}

        <section className="request-info">
          <div className="info-card">
            <span>Request ID</span>
            <strong>{requestId}</strong>
          </div>

          <div className="info-card">
            <span>Patient</span>
            <strong>{patient}</strong>
          </div>

          <div className="info-card">
            <span>Requested Service</span>
            <strong>{requestedService}</strong>
          </div>

          <div className="info-card">
            <span>Policy</span>
            <strong>{policy}</strong>
          </div>

          <div className="info-card">
            <span>Policy Version</span>
            <strong>{policyVersion}</strong>
          </div>
        </section>

        {/* --------------------------------------------------
            DECISION WORKFLOW
        -------------------------------------------------- */}

        <section className="section">
          <div className="section-title">
            <h2>Decision Workflow</h2>

            <p>
              The decision is generated through the following
              evaluation process.
            </p>
          </div>

          <div className="workflow">
            {[
              "Clinical Request",
              "AI Extraction",
              "Policy Evaluation",
              "Rule Results",
              "Final Decision",
              "Recommended Action",
            ].map((step, index, array) => (
              <React.Fragment key={step}>
                <div className="workflow-step">
                  <div className="workflow-node">
                    {index + 1}
                  </div>

                  <span className="workflow-label">
                    {step}
                  </span>
                </div>

                {index < array.length - 1 && (
                  <div
                    className="workflow-arrow"
                    aria-hidden="true"
                  >
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------
            CONDITIONS EVALUATED
        -------------------------------------------------- */}

        <section className="section">
          <div className="section-title">
            <h2>Conditions Evaluated</h2>

            <p>
              Each policy condition is evaluated against
              supporting clinical evidence.
            </p>
          </div>

          <div className="rule-list">
            {rules.map((rule) => (
              <RuleResult
                key={rule.id}
                rule={rule}
              />
            ))}
          </div>
        </section>

        {/* --------------------------------------------------
            EVALUATION SUMMARY
        -------------------------------------------------- */}

        <section className="section">
          <div className="section-title">
            <h2>Evaluation Summary</h2>

            <p>
              Summary of the policy rules evaluated for this request.
            </p>
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <span>Rules Evaluated</span>
              <strong>{rulesEvaluated}</strong>
            </div>

            <div className="summary-card">
              <span>Passed</span>
              <strong className="result-pass">
                {rulesPassed}
              </strong>
            </div>

            <div className="summary-card">
              <span>Failed</span>
              <strong className="result-fail">
                {rulesFailed}
              </strong>
            </div>

            <div className="summary-card">
              <span>Missing</span>
              <strong className="result-missing">
                {missingInformation}
              </strong>
            </div>
          </div>

          <div className="progress-wrapper">
            <div className="progress-top">
              <span>Evaluation Completion</span>

              <strong>{completion}%</strong>
            </div>

            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-fill"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------
            FINAL DECISION
        -------------------------------------------------- */}

        <section className="section">
          <div className="section-title">
            <h2>Final Decision</h2>

            <p>
              The final recommendation derived from the evaluated
              policy conditions.
            </p>
          </div>

          <div
            className={`final-decision ${getOutcomeClass(
              normalizedOutcome
            )}`}
          >
            <span className="final-label">
              FINAL DECISION
            </span>

            <h2>{normalizedOutcome}</h2>

            <div className="final-grid">
              <div className="final-box">
                <span>Reason</span>

                <strong>
                  {decisionInfo.reason}
                </strong>
              </div>

              <div className="final-box">
                <span>Recommended Action</span>

                <strong>
                  {decisionInfo.action}
                </strong>
              </div>

              <div className="final-box">
                <span>Confidence</span>

                <strong>
                  {decisionInfo.confidence}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------
            AI EXPLANATION
        -------------------------------------------------- */}

        <section className="section">
          <div className="section-title">
            <h2>AI Explanation</h2>

            <p>
              Supporting explanation generated from the evaluated
              clinical evidence.
            </p>
          </div>

          <div className="ai-box">
            <div className="ai-label">
              AI Explanation
            </div>

            <p>{aiExplanation}</p>
          </div>
        </section>

        {/* --------------------------------------------------
            DECISION TRACE INFORMATION
        -------------------------------------------------- */}

        <section className="section">
          <div className="section-title">
            <h2>Decision Trace Information</h2>

            <p>
              Metadata associated with this authorization decision.
            </p>
          </div>

          <div className="metadata">
            <div className="metadata-item">
              <span>Request ID</span>
              <strong>{requestId}</strong>
            </div>

            <div className="metadata-item">
              <span>Policy Version</span>
              <strong>{policyVersion}</strong>
            </div>

            <div className="metadata-item">
              <span>Rules Evaluated</span>
              <strong>{rulesEvaluated}</strong>
            </div>

            <div className="metadata-item">
              <span>Rules Passed</span>
              <strong>{rulesPassed}</strong>
            </div>

            <div className="metadata-item">
              <span>Rules Failed</span>
              <strong>{rulesFailed}</strong>
            </div>

            <div className="metadata-item">
              <span>Missing Information</span>
              <strong>{missingInformation}</strong>
            </div>

            <div className="metadata-item">
              <span>Decision</span>
              <strong>{normalizedOutcome}</strong>
            </div>

            <div className="metadata-item">
              <span>Evaluation Timestamp</span>

              <strong>
                {evaluation?.timestamp ||
                  decision?.timestamp ||
                  "13 Aug 2026, 20:30"}
              </strong>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------
            NAVIGATION
        -------------------------------------------------- */}

        <div className="bottom-actions">
          <button
            type="button"
            className="action-button"
            onClick={handleBackToDecision}
          >
            ← Back to Decision
          </button>

          <button
            type="button"
            className="action-button primary"
            onClick={handleBackToPolicyEvaluation}
          >
            Back to Policy Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}