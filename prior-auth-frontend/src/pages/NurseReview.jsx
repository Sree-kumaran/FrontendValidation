import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Info,
  ShieldCheck,
  Stethoscope,
  UserRound,
  AlertCircle,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| MOCK DATA
|--------------------------------------------------------------------------
| Keep request, clinical evidence, policy evaluation, AI recommendation,
| and reviewer decision as separate objects.
| These can later be replaced with API data.
|--------------------------------------------------------------------------
*/

const reviewRequest = {
  requestId: "PA-10025",
  patient: "John Smith",
  patientId: "P10025",
  age: 47,
  gender: "Male",
  insurance: "HealthPlus PPO",
  diagnosis: "Chronic Knee Pain",
  diagnosisCode: "M25.561",
  requestedService: "MRI — Knee",
  urgency: "High",
  status: "Pending Nurse Review",
  priority: "High",
  submitted: "13 Aug 2026",
};

const clinicalEvidence = {
  symptoms: "Persistent right knee pain",
  duration: "6 months",
  previousTreatment: "Physical Therapy",
  treatmentDuration: "8 weeks",
  treatmentOutcome: "Insufficient improvement",
  currentMedication: "NSAIDs",
  clinicalIndication:
    "Persistent pain despite conservative treatment",
};

const policyData = {
  name: "Knee MRI Policy",
  version: "v2.1",
  rulesEvaluated: 5,
  passed: 5,
  failed: 0,
  missing: 0,
};

const policyRules = [
  {
    id: 1,
    condition: "Diagnosis documented",
    result: "PASS",
  },
  {
    id: 2,
    condition: "Symptoms ≥ 6 weeks",
    result: "PASS",
  },
  {
    id: 3,
    condition: "Conservative treatment completed",
    result: "PASS",
  },
  {
    id: 4,
    condition: "Clinical indication documented",
    result: "PASS",
  },
  {
    id: 5,
    condition: "Plan coverage",
    result: "PASS",
  },
];

const aiRecommendation = {
  recommendation: "PEND FOR NURSE REVIEW",
  confidence: "MEDIUM",
  explanation:
    "The request meets several policy requirements, but clinical review is recommended before final authorization.",
};

/*
|--------------------------------------------------------------------------
| REVIEW ACTIONS
|--------------------------------------------------------------------------
*/

const reviewActions = [
  {
    id: "APPROVE",
    title: "APPROVE",
    description: "Request meets criteria",
    icon: CheckCircle2,
  },
  {
    id: "PEND",
    title: "PEND FOR FURTHER REVIEW",
    description: "Requires additional review",
    icon: ClipboardCheck,
  },
  {
    id: "MORE_INFO",
    title: "REQUEST MORE INFORMATION",
    description: "Missing documentation",
    icon: FileText,
  },
];

/*
|--------------------------------------------------------------------------
| SMALL REUSABLE COMPONENTS
|--------------------------------------------------------------------------
*/

function InfoField({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold leading-5 text-text-primary">
        {value}
      </p>
    </div>
  );
}

function EvidenceItem({ label, value }) {
  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 text-text-primary">
        {value}
      </p>
    </div>
  );
}

function RuleRow({ rule }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-secondary px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={17} />
        </div>

        <span className="text-sm font-medium text-text-primary">
          {rule.condition}
        </span>
      </div>

      <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold tracking-wide text-success">
        PASS
      </span>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          {label}
        </p>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={16} />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-text-primary">
        {value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN PAGE
|--------------------------------------------------------------------------
*/

export default function NurseReview() {
  const navigate = useNavigate();

  const [reviewerNotes, setReviewerNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const [conditionalReason, setConditionalReason] = useState("");

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Character Counter
  |--------------------------------------------------------------------------
  */

  const characterCount = reviewerNotes.length;

  /*
  |--------------------------------------------------------------------------
  | CONDITIONAL FIELD LABEL
  |--------------------------------------------------------------------------
  */

  const getConditionalField = () => {
    switch (selectedAction) {
      case "APPROVE":
        return {
          label: "Approval Reason",
          placeholder:
            "Enter the clinical rationale supporting approval...",
        };

      case "PEND":
        return {
          label: "Reason for Further Review",
          placeholder:
            "Explain why additional clinical review is required...",
        };

      case "MORE_INFO":
        return {
          label: "Information Required",
          placeholder:
            "Specify the documentation or clinical information required...",
        };

      default:
        return null;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const newErrors = {};

    if (!selectedAction) {
      newErrors.action = "Please select a review decision.";
    }

    if (!reviewerNotes.trim()) {
      newErrors.notes = "Reviewer notes are required.";
    }

    if (
      selectedAction &&
      !conditionalReason.trim()
    ) {
      newErrors.reason =
        getConditionalField()?.label +
        " is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
     * Mock submission only.
     * Backend integration will be added later.
     */

    const reviewResult = {
      requestId: reviewRequest.requestId,
      reviewerNotes,
      decision: selectedAction,
      reason: conditionalReason,
      submittedAt: new Date().toISOString(),
      status: "Review Completed",
    };

    console.log("Mock Nurse Review Submission:", reviewResult);

    setSubmitted(true);

    /*
     * Simulate request status update.
     */
    reviewRequest.status = "Review Completed";
  };

  /*
  |--------------------------------------------------------------------------
  | CANCEL
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {
    navigate("/requests");
  };

  /*
  |--------------------------------------------------------------------------
  | SUCCESS SCREEN
  |--------------------------------------------------------------------------
  */

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={34} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-text-primary">
              Review Submitted Successfully
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
              The nurse review for request{" "}
              <strong className="text-text-primary">
                {reviewRequest.requestId}
              </strong>{" "}
              has been submitted successfully.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-surface-secondary p-4 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-text-muted">
                  Request Status
                </span>

                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                  Review Completed
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-xs text-text-muted">
                  Review Decision
                </span>

                <span className="text-sm font-bold text-text-primary">
                  {selectedAction === "PEND"
                    ? "PEND FOR FURTHER REVIEW"
                    : selectedAction === "MORE_INFO"
                    ? "REQUEST MORE INFORMATION"
                    : selectedAction}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate("/requests")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <ArrowLeft size={17} />
                Back to Review Queue
              </button>

              <button
                type="button"
                onClick={() => navigate("/decision-trace")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                View Decision Trace
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const conditionalField = getConditionalField();

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* ================================================================
          PAGE HEADER
      ================================================================ */}

      <header className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/requests")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <ArrowLeft size={17} />
          Back to Review Queue
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Nurse Review
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
                Review authorization requests requiring clinical
                attention.
              </p>
            </div>
          </div>

          {/* Request status */}
          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Request ID
              </p>

              <p className="mt-1 text-sm font-bold text-text-primary">
                {reviewRequest.requestId}
              </p>
            </div>

            <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Status
              </p>

              <p className="mt-1 text-sm font-bold text-warning">
                {reviewRequest.status}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================
          QUEUE SUMMARY
      ================================================================ */}

      <section className="mb-6">
        <div className="mb-3">
          <h2 className="text-sm font-bold text-text-primary">
            Review Queue Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Pending Reviews"
            value="12"
            icon={ClipboardCheck}
          />

          <SummaryCard
            label="High Priority"
            value="4"
            icon={AlertCircle}
          />

          <SummaryCard
            label="Due Today"
            value="3"
            icon={FileText}
          />

          <SummaryCard
            label="Completed Today"
            value="8"
            icon={CheckCircle2}
          />
        </div>
      </section>

      {/* ================================================================
          REQUEST / AI TWO COLUMN AREA
      ================================================================ */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* ============================================================
              AUTHORIZATION REQUEST
          ============================================================ */}

          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRound size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-text-primary">
                  Authorization Request
                </h2>

                <p className="mt-0.5 text-xs text-text-secondary">
                  Patient and authorization information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
              <InfoField
                label="Patient"
                value={reviewRequest.patient}
              />

              <InfoField
                label="Patient ID"
                value={reviewRequest.patientId}
              />

              <InfoField
                label="Age"
                value={reviewRequest.age}
              />

              <InfoField
                label="Gender"
                value={reviewRequest.gender}
              />

              <InfoField
                label="Insurance"
                value={reviewRequest.insurance}
              />

              <InfoField
                label="Requested Service"
                value={reviewRequest.requestedService}
              />

              <InfoField
                label="Diagnosis"
                value={reviewRequest.diagnosis}
              />

              <InfoField
                label="Diagnosis Code"
                value={reviewRequest.diagnosisCode}
              />

              <InfoField
                label="Urgency"
                value={reviewRequest.urgency}
              />
            </div>
          </section>

          {/* ============================================================
              CLINICAL EVIDENCE
          ============================================================ */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="mb-4">
              <h2 className="text-base font-bold text-text-primary">
                Clinical Evidence
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                Evidence extracted from the authorization request.
              </p>
            </div>

            <div className="divide-y divide-border">
              <EvidenceItem
                label="Symptoms"
                value={clinicalEvidence.symptoms}
              />

              <EvidenceItem
                label="Duration"
                value={clinicalEvidence.duration}
              />

              <EvidenceItem
                label="Previous Treatment"
                value={clinicalEvidence.previousTreatment}
              />

              <EvidenceItem
                label="Treatment Duration"
                value={clinicalEvidence.treatmentDuration}
              />

              <EvidenceItem
                label="Treatment Outcome"
                value={clinicalEvidence.treatmentOutcome}
              />

              <EvidenceItem
                label="Current Medication"
                value={clinicalEvidence.currentMedication}
              />

              <EvidenceItem
                label="Clinical Indication"
                value={clinicalEvidence.clinicalIndication}
              />
            </div>
          </section>

          {/* ============================================================
              POLICY EVALUATION
          ============================================================ */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Policy Evaluation
                </h2>

                <p className="mt-1 text-xs text-text-secondary">
                  Results from the applicable authorization policy.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/decision-trace")}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-text-primary transition hover:border-primary/40 hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
              >
                View Decision Trace
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Policy metadata */}
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <InfoField
                label="Policy"
                value={policyData.name}
              />

              <InfoField
                label="Version"
                value={policyData.version}
              />

              <InfoField
                label="Rules Evaluated"
                value={policyData.rulesEvaluated}
              />

              <InfoField
                label="Passed"
                value={policyData.passed}
              />
            </div>

            {/* Policy result summary */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-success/20 bg-success/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Failed
                </p>

                <p className="mt-1 text-xl font-bold text-text-primary">
                  {policyData.failed}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface-secondary p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Missing
                </p>

                <p className="mt-1 text-xl font-bold text-text-primary">
                  {policyData.missing}
                </p>
              </div>
            </div>

            {/* Rules */}
            <div className="mt-5 space-y-2">
              {policyRules.map((rule) => (
                <RuleRow key={rule.id} rule={rule} />
              ))}
            </div>
          </section>
        </div>

        {/* ==============================================================
            RIGHT COLUMN
        ============================================================== */}

        <div className="space-y-6">
          {/* ============================================================
              AI RECOMMENDATION
          ============================================================ */}

          <section className="rounded-2xl border border-primary/20 bg-surface shadow-card">
            <div className="border-b border-primary/10 bg-primary/[0.04] px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    AI Recommendation
                  </p>

                  <h2 className="mt-1 text-base font-bold text-text-primary">
                    Automated Review Suggestion
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* Important notice */}
              <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <Info
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <p className="text-xs leading-5 text-text-secondary">
                  This is an AI-generated recommendation and
                  must not be treated as the final clinical
                  decision. The nurse reviewer must make the
                  final review action.
                </p>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Recommendation
                </p>

                <div className="mt-2 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
                  <p className="text-sm font-bold text-warning">
                    {aiRecommendation.recommendation}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Confidence
                </p>

                <p className="mt-1 text-sm font-bold text-text-primary">
                  {aiRecommendation.confidence}
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-surface-secondary p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Explanation
                </p>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {aiRecommendation.explanation}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================
              REVIEW NOTICE
          ============================================================ */}

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex gap-3">
              <Info
                size={18}
                className="mt-0.5 shrink-0 text-primary"
              />

              <p className="text-xs leading-5 text-text-secondary">
                Clinical review is required before final
                authorization when automated policy evaluation
                does not provide a definitive outcome.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          REVIEW FORM
      ================================================================ */}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6"
        noValidate
      >
        {/* ============================================================
            REVIEWER NOTES
        ============================================================ */}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-text-primary">
              Reviewer Notes
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              Document your clinical review, rationale, additional
              findings, or recommendation.
            </p>
          </div>

          <label
            htmlFor="reviewer-notes"
            className="sr-only"
          >
            Reviewer Notes
          </label>

          <textarea
            id="reviewer-notes"
            value={reviewerNotes}
            maxLength={1000}
            onChange={(event) => {
              setReviewerNotes(event.target.value);

              if (errors.notes) {
                setErrors((previous) => ({
                  ...previous,
                  notes: "",
                }));
              }
            }}
            placeholder="Enter your clinical review notes, rationale, additional findings, or recommendation..."
            rows={7}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={
              errors.notes
                ? "reviewer-notes-error"
                : "reviewer-notes-count"
            }
            className={`w-full resize-y rounded-xl border bg-surface-secondary px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.notes
                ? "border-error"
                : "border-border"
            }`}
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            {errors.notes ? (
              <p
                id="reviewer-notes-error"
                className="text-xs font-medium text-error"
                role="alert"
              >
                {errors.notes}
              </p>
            ) : (
              <span />
            )}

            <span
              id="reviewer-notes-count"
              className={`text-xs ${
                characterCount >= 950
                  ? "text-warning"
                  : "text-text-muted"
              }`}
            >
              {characterCount} / 1000 characters
            </span>
          </div>
        </section>

        {/* ============================================================
            REVIEW DECISION
        ============================================================ */}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-text-primary">
              Review Decision
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              Select the final clinical review action.
            </p>
          </div>

          {/* Accessible radio group */}
          <fieldset>
            <legend className="sr-only">
              Review Decision
            </legend>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {reviewActions.map((action) => {
                const Icon = action.icon;
                const selected =
                  selectedAction === action.id;

                return (
                  <label
                    key={action.id}
                    className={`relative flex cursor-pointer rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-primary/30 ${
                      selected
                        ? action.id === "APPROVE"
                          ? "border-success bg-success/5"
                          : action.id === "PEND"
                          ? "border-warning bg-warning/5"
                          : "border-error bg-error/5"
                        : "border-border bg-surface-secondary hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="review-decision"
                      value={action.id}
                      checked={selected}
                      onChange={() => {
                        setSelectedAction(action.id);
                        setConditionalReason("");

                        if (errors.action || errors.reason) {
                          setErrors((previous) => ({
                            ...previous,
                            action: "",
                            reason: "",
                          }));
                        }
                      }}
                      className="sr-only"
                    />

                    <div className="flex w-full items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? action.id === "APPROVE"
                              ? "bg-success/10 text-success"
                              : action.id === "PEND"
                              ? "bg-warning/10 text-warning"
                              : "bg-error/10 text-error"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-bold text-text-primary">
                            {action.title}
                          </span>

                          {selected && (
                            <CheckCircle2
                              size={16}
                              className="mt-0.5 shrink-0 text-primary"
                            />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {errors.action && (
            <p
              className="mt-3 text-xs font-medium text-error"
              role="alert"
            >
              {errors.action}
            </p>
          )}

          {/* ==========================================================
              CONDITIONAL FIELD
          ========================================================== */}

          {conditionalField && (
            <div className="mt-6 border-t border-border pt-6">
              <label
                htmlFor="conditional-reason"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                {conditionalField.label}
                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <textarea
                id="conditional-reason"
                value={conditionalReason}
                onChange={(event) => {
                  setConditionalReason(event.target.value);

                  if (errors.reason) {
                    setErrors((previous) => ({
                      ...previous,
                      reason: "",
                    }));
                  }
                }}
                rows={4}
                placeholder={conditionalField.placeholder}
                aria-invalid={Boolean(errors.reason)}
                className={`w-full resize-y rounded-xl border bg-surface-secondary px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.reason
                    ? "border-error"
                    : "border-border"
                }`}
              />

              {errors.reason && (
                <p
                  className="mt-2 text-xs font-medium text-error"
                  role="alert"
                >
                  {errors.reason}
                </p>
              )}
            </div>
          )}
        </section>

        {/* ============================================================
            FORM ACTIONS
        ============================================================ */}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface sm:w-auto"
          >
            Submit Review
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}