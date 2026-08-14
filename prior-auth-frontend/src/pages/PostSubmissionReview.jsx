import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Info,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| MOCK AUTHORIZATION REQUEST
|--------------------------------------------------------------------------
| Keep this separate from the UI so it can later be replaced by API data.
*/
const postSubmissionReview = {
  requestId: "PA-10025",
  patient: "John Smith",
  patientId: "P10025",
  age: 47,
  gender: "Male",
  diagnosis: "Chronic Knee Pain",
  diagnosisCode: "M25.561",
  requestedService: "MRI — Knee",
  insurance: "HealthPlus PPO",
  priority: "High",

  policy: "Knee MRI Policy",
  policyVersion: "v2.1",

  responseStatus: "Received",
  documentsRequested: 3,
  documentsSubmitted: 3,

  rulesEvaluated: 5,
  rulesPassed: 5,
  rulesFailed: 0,
  missingInformation: 0,

  recommendation: "APPROVE",
  confidence: "HIGH",
};

/*
|--------------------------------------------------------------------------
| PROVIDER RESPONSE
|--------------------------------------------------------------------------
*/
const providerResponse = {
  submitted: "13 Aug 2026",
  status: "Received",
  documentsRequested: 3,
  documentsSubmitted: 3,
  additionalComments: "Provided",

  message:
    "Attached are the requested imaging results, physical therapy treatment records, and latest clinical progress notes.",
};

/*
|--------------------------------------------------------------------------
| SUBMITTED DOCUMENTS
|--------------------------------------------------------------------------
*/
const initialDocuments = [
  {
    id: 1,
    name: "Recent Imaging Results",
    fileName: "MRI_Report.pdf",
    size: "2.4 MB",
    type: "PDF",
    submitted: "13 Aug 2026",
    status: "Received",
    evidence:
      "MRI demonstrates persistent medial meniscus pathology.",
  },
  {
    id: 2,
    name: "Physical Therapy Treatment Records",
    fileName: "Physical_Therapy_Records.pdf",
    size: "4.1 MB",
    type: "PDF",
    submitted: "13 Aug 2026",
    status: "Received",
    evidence:
      "Physical therapy was completed for 8 weeks with limited improvement.",
  },
  {
    id: 3,
    name: "Latest Clinical Progress Notes",
    fileName: "Clinical_Notes.pdf",
    size: "1.8 MB",
    type: "PDF",
    submitted: "13 Aug 2026",
    status: "Received",
    evidence:
      "Clinical notes document persistent right knee pain despite conservative management.",
  },
];

/*
|--------------------------------------------------------------------------
| UPDATED POLICY RULES
|--------------------------------------------------------------------------
*/
const policyRules = [
  {
    id: 1,
    condition: "Diagnosis documented",
    evidence: "Chronic Knee Pain — M25.561",
    result: "PASS",
    reference: "Knee MRI Policy §1.1",
  },
  {
    id: 2,
    condition: "Symptoms ≥ 6 weeks",
    evidence: "Symptoms present for 6 months",
    result: "PASS",
    reference: "Knee MRI Policy §2.1",
  },
  {
    id: 3,
    condition: "Conservative treatment completed",
    evidence:
      "Physical therapy records confirm 8 weeks of treatment.",
    result: "PASS",
    reference: "Knee MRI Policy §3.1",
  },
  {
    id: 4,
    condition: "Clinical indication documented",
    evidence:
      "Clinical notes confirm persistent pain despite conservative treatment.",
    result: "PASS",
    reference: "Knee MRI Policy §4.1",
  },
  {
    id: 5,
    condition: "Plan coverage",
    evidence:
      "HealthPlus PPO covers MRI — Knee under the applicable plan.",
    result: "PASS",
    reference: "Knee MRI Policy §5.1",
  },
];

/*
|--------------------------------------------------------------------------
| BEFORE / AFTER EVIDENCE
|--------------------------------------------------------------------------
*/
const evidenceComparison = [
  {
    criterion: "Conservative treatment documentation",
    before: "Physical therapy documentation missing",
    after: "Physical therapy documentation received",
  },
  {
    criterion: "Clinical indication",
    before: "Latest clinical progress notes missing",
    after: "Clinical progress notes received",
  },
  {
    criterion: "Current clinical status",
    before: "Recent imaging results unavailable",
    after: "Recent MRI imaging results received",
  },
];

/*
|--------------------------------------------------------------------------
| OUTCOME CONFIGURATION
|--------------------------------------------------------------------------
*/
const outcomeConfig = {
  APPROVE: {
    title: "Authorization Approved",
    status: "Approved",
    confidence: "HIGH",
    confidenceScore: "95%",
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/20",
    icon: CheckCircle2,
    explanation:
      "Additional documentation satisfies the previously unresolved policy requirements. All required authorization criteria are now supported by the submitted evidence.",
    recommendedAction: "Proceed with authorization.",
    conditionalLabel: "Authorization Approval Reason",
    conditionalPlaceholder:
      "Enter the reason supporting the authorization approval...",
  },

  "PEND FOR NURSE REVIEW": {
    title: "Pending Nurse Review",
    status: "Pending Nurse Review",
    confidence: "MEDIUM",
    confidenceScore: "78%",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/20",
    icon: UserCheck,
    explanation:
      "The submitted documentation provides additional evidence, but the case still requires clinical nurse review before a final authorization outcome can be confirmed.",
    recommendedAction:
      "Assign the request to a nurse reviewer for additional clinical assessment.",
    conditionalLabel: "Reason for Nurse Review",
    conditionalPlaceholder:
      "Enter the clinical reason why nurse review is required...",
  },

  "REQUEST MORE INFORMATION": {
    title: "More Information Required",
    status: "More Information Required",
    confidence: "LOW",
    confidenceScore: "52%",
    colorClass: "text-error",
    bgClass: "bg-error/10",
    borderClass: "border-error/20",
    icon: XCircle,
    explanation:
      "The submitted documentation does not fully resolve the remaining authorization requirements. Additional information is required before the request can be finalized.",
    recommendedAction:
      "Request additional clinical or administrative documentation.",
    conditionalLabel: "Additional Information Required",
    conditionalPlaceholder:
      "Specify the additional information or documentation required...",
  },
};

export default function PostSubmissionReview() {
  const navigate = useNavigate();

  /*
   * Provider documents.
   */
  const [documents, setDocuments] = useState(
    initialDocuments.map((document) => ({
      ...document,
      reviewed: false,
      reviewerNote: "",
    }))
  );

  /*
   * Final review decision.
   */
  const [selectedOutcome, setSelectedOutcome] = useState("");

  /*
   * Final decision reason.
   */
  const [decisionReason, setDecisionReason] = useState("");

  /*
   * Conditional explanation.
   */
  const [conditionalExplanation, setConditionalExplanation] =
    useState("");

  /*
   * Validation.
   */
  const [errors, setErrors] = useState({});

  /*
   * Submission state.
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /*
   * Optional save state.
   */
  const [saveMessage, setSaveMessage] = useState("");

  /*
   * Expanded document preview.
   */
  const [previewDocumentId, setPreviewDocumentId] =
    useState(null);

  /*
   * Reviewer note character limits.
   */
  const MAX_REASON_LENGTH = 1000;

  /*
   * Number of reviewed documents.
   */
  const documentsReviewed = useMemo(
    () =>
      documents.filter((document) => document.reviewed).length,
    [documents]
  );

  /*
   * Currently selected outcome configuration.
   */
  const selectedOutcomeConfig =
    outcomeConfig[selectedOutcome];

  /*
   |--------------------------------------------------------------------------
   | TOGGLE DOCUMENT REVIEW
   |--------------------------------------------------------------------------
   */
  const toggleDocumentReview = (documentId) => {
    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? {
              ...document,
              reviewed: !document.reviewed,
            }
          : document
      )
    );

    setErrors((current) => ({
      ...current,
      documents: "",
    }));
  };

  /*
   |--------------------------------------------------------------------------
   | REVIEWER NOTE
   |--------------------------------------------------------------------------
   */
  const updateReviewerNote = (documentId, value) => {
    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? {
              ...document,
              reviewerNote: value.slice(0, 500),
            }
          : document
      )
    );
  };

  /*
   |--------------------------------------------------------------------------
   | FINAL OUTCOME
   |--------------------------------------------------------------------------
   */
  const handleOutcomeChange = (outcome) => {
    setSelectedOutcome(outcome);

    setErrors((current) => ({
      ...current,
      outcome: "",
    }));
  };

  /*
   |--------------------------------------------------------------------------
   | SAVE REVIEW
   |--------------------------------------------------------------------------
   */
  const handleSaveReview = () => {
    setSaveMessage(
      "Review progress saved locally for this mock session."
    );

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  /*
   |--------------------------------------------------------------------------
   | VALIDATE FINAL DECISION
   |--------------------------------------------------------------------------
   */
  const validateSubmission = () => {
    const validationErrors = {};

    if (documentsReviewed !== documents.length) {
      validationErrors.documents =
        "Please review all submitted documents before submitting the final decision.";
    }

    if (!selectedOutcome) {
      validationErrors.outcome =
        "Please select a final review decision.";
    }

    if (!decisionReason.trim()) {
      validationErrors.reason =
        "Final decision reason is required.";
    }

    if (!conditionalExplanation.trim()) {
      validationErrors.conditional =
        `${selectedOutcomeConfig?.conditionalLabel || "Decision explanation"} is required.`;
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /*
   |--------------------------------------------------------------------------
   | SUBMIT FINAL DECISION
   |--------------------------------------------------------------------------
   */
  const handleSubmitFinalDecision = () => {
    if (!validateSubmission()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  /*
   |--------------------------------------------------------------------------
   | SUCCESS STATE
   |--------------------------------------------------------------------------
   */
  if (submitted) {
    return (
      <FinalDecisionSuccess
        outcome={selectedOutcome}
        decisionReason={decisionReason}
        documentsReviewed={documentsReviewed}
        onViewDecision={() =>
          navigate("/decision", {
            state: {
              decision: {
                outcome: selectedOutcome,
                status: selectedOutcomeConfig?.status,
                summary: decisionReason,
                nextAction:
                  selectedOutcomeConfig?.recommendedAction,
                confidence:
                  selectedOutcomeConfig?.confidence,
                actionLabel:
                  selectedOutcome === "APPROVE"
                    ? "Proceed with Authorization"
                    : selectedOutcome ===
                      "PEND FOR NURSE REVIEW"
                    ? "Review by Nurse"
                    : "Request More Information",
              },
            },
          })
        }
        onBack={() => navigate("/requests")}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1450px] pb-10">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <header className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/requests")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg"
        >
          <ArrowLeft size={17} />
          Back to Requests
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Post-Submission Review
              </h1>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-text-secondary">
                Review the additional documentation submitted by
                the provider and complete the authorization
                evaluation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge
              label="Pending Final Review"
              type="warning"
            />

            <StatusBadge
              label={`Priority: ${postSubmissionReview.priority}`}
              type="error"
            />
          </div>
        </div>
      </header>

      {/* =========================================================
          REQUEST IDENTIFICATION
      ========================================================= */}
      <section className="mb-6 rounded-2xl border border-border bg-surface shadow-card">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          <InfoCell
            label="Request ID"
            value={postSubmissionReview.requestId}
          />

          <InfoCell
            label="Patient"
            value={postSubmissionReview.patient}
          />

          <InfoCell
            label="Requested Service"
            value={postSubmissionReview.requestedService}
          />

          <InfoCell
            label="Status"
            value="Pending Final Review"
          />
        </div>
      </section>

      {/* =========================================================
          WORKFLOW
      ========================================================= */}
      <WorkflowIndicator />

      {/* =========================================================
          MAIN TWO COLUMN LAYOUT
      ========================================================= */}
      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        {/* =======================================================
            LEFT COLUMN
        ======================================================= */}
        <main className="min-w-0 space-y-6">
          {/* PROVIDER RESPONSE */}
          <ProviderResponseCard />

          {/* SUBMITTED DOCUMENTS */}
          <SubmittedDocuments
            documents={documents}
            onToggleReview={toggleDocumentReview}
            onUpdateNote={updateReviewerNote}
            previewDocumentId={previewDocumentId}
            onPreview={setPreviewDocumentId}
          />

          {/* NEW EVIDENCE */}
          <EvidenceReview />

          {/* UPDATED POLICY */}
          <UpdatedPolicyEvaluation />

          {/* BEFORE / AFTER */}
          <EvidenceComparison />

          {/* UPDATED RECOMMENDATION */}
          <UpdatedRecommendation
            recommendation={postSubmissionReview.recommendation}
          />

          {/* FINAL DECISION */}
          <section className="rounded-2xl border border-border bg-surface shadow-card">
            <SectionHeader
              icon={<ClipboardCheck size={18} />}
              title="Final Review Decision"
              subtitle="The reviewer makes the final authorization decision."
            />

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-3">
                {Object.keys(outcomeConfig).map((outcome) => (
                  <DecisionOption
                    key={outcome}
                    outcome={outcome}
                    selected={selectedOutcome === outcome}
                    onSelect={() =>
                      handleOutcomeChange(outcome)
                    }
                  />
                ))}
              </div>

              {errors.outcome && (
                <ValidationMessage message={errors.outcome} />
              )}

              {/* FINAL DECISION REASON */}
              <div className="mt-6">
                <label
                  htmlFor="decision-reason"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Final Decision Reason
                  <span className="ml-1 text-error">*</span>
                </label>

                <textarea
                  id="decision-reason"
                  value={decisionReason}
                  maxLength={MAX_REASON_LENGTH}
                  onChange={(event) => {
                    setDecisionReason(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      reason: "",
                    }));
                  }}
                  placeholder="Enter the rationale supporting the final decision..."
                  rows={5}
                  className={`w-full resize-y rounded-xl border bg-surface-secondary px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.reason
                      ? "border-error"
                      : "border-border"
                  }`}
                />

                <div className="mt-1 flex justify-between text-xs text-text-muted">
                  <span>
                    {errors.reason ? (
                      <span className="text-error">
                        {errors.reason}
                      </span>
                    ) : (
                      "Required before final submission."
                    )}
                  </span>

                  <span>
                    {decisionReason.length} /{" "}
                    {MAX_REASON_LENGTH}
                  </span>
                </div>
              </div>

              {/* CONDITIONAL EXPLANATION */}
              {selectedOutcomeConfig && (
                <div className="mt-5">
                  <label
                    htmlFor="conditional-explanation"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    {selectedOutcomeConfig.conditionalLabel}
                    <span className="ml-1 text-error">*</span>
                  </label>

                  <textarea
                    id="conditional-explanation"
                    value={conditionalExplanation}
                    maxLength={1000}
                    onChange={(event) => {
                      setConditionalExplanation(
                        event.target.value
                      );

                      setErrors((current) => ({
                        ...current,
                        conditional: "",
                      }));
                    }}
                    placeholder={
                      selectedOutcomeConfig.conditionalPlaceholder
                    }
                    rows={4}
                    className={`w-full resize-y rounded-xl border bg-surface-secondary px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      errors.conditional
                        ? "border-error"
                        : "border-border"
                    }`}
                  />

                  {errors.conditional && (
                    <p className="mt-1 text-xs text-error">
                      {errors.conditional}
                    </p>
                  )}
                </div>
              )}

              {/* VALIDATION */}
              {errors.documents && (
                <ValidationMessage
                  message={errors.documents}
                />
              )}

              {/* BUTTONS */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/requests")}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 px-5 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Save Review
                </button>

                <button
                  type="button"
                  onClick={handleSubmitFinalDecision}
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Final Decision
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>

              {saveMessage && (
                <div
                  role="status"
                  className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
                >
                  {saveMessage}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* =======================================================
            RIGHT COLUMN
        ======================================================= */}
        <aside className="min-w-0 space-y-6">
          <RequestSummary />

          <ReviewStatusCard
            documentsReviewed={documentsReviewed}
            totalDocuments={documents.length}
          />

          <DecisionRecommendationCard />

          <ReviewInformation />

          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Info size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Decision Trace
                </h3>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Review the complete evidence and policy
                  evaluation history for this authorization.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/decision-trace")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 rounded"
                >
                  View Updated Decision Trace
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================================
   WORKFLOW INDICATOR
========================================================================= */

function WorkflowIndicator() {
  const steps = [
    "Authorization Request",
    "AI Extraction",
    "Policy Evaluation",
    "Information Requested",
    "Provider Response",
    "Final Review",
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {steps.map((step, index) => {
          const completed = index < 5;
          const current = index === 5;

          return (
            <React.Fragment key={step}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    current
                      ? "bg-primary text-white ring-4 ring-primary/10"
                      : "bg-success/10 text-success"
                  }`}
                  aria-label={
                    current
                      ? "Current step"
                      : "Completed step"
                  }
                >
                  {completed ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={`text-xs font-semibold ${
                    current
                      ? "text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden h-px flex-1 bg-border lg:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================================
   PROVIDER RESPONSE
========================================================================= */

function ProviderResponseCard() {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-card">
      <SectionHeader
        icon={<FileCheck2 size={18} />}
        title="Provider Response Received"
        subtitle="Additional documentation has been submitted for clinical review."
        action={
          <StatusBadge
            label="✓ Received"
            type="success"
          />
        }
      />

      <div className="grid grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-4">
        <ResponseCell
          label="Response Status"
          value="Received"
        />

        <ResponseCell
          label="Submitted"
          value={providerResponse.submitted}
        />

        <ResponseCell
          label="Documents"
          value={`${providerResponse.documentsSubmitted} / ${providerResponse.documentsRequested}`}
        />

        <ResponseCell
          label="Additional Comments"
          value={providerResponse.additionalComments}
        />
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Provider Message
        </p>

        <p className="mt-2 text-sm leading-6 text-text-primary">
          "{providerResponse.message}"
        </p>
      </div>
    </section>
  );
}

/* =========================================================================
   SUBMITTED DOCUMENTS
========================================================================= */

function SubmittedDocuments({
  documents,
  onToggleReview,
  onUpdateNote,
  previewDocumentId,
  onPreview,
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-card">
      <SectionHeader
        icon={<FileText size={18} />}
        title="Submitted Documents"
        subtitle="Review each document before making the final decision."
        action={
          <span className="text-xs font-semibold text-text-secondary">
            {documents.filter((item) => item.reviewed).length} /{" "}
            {documents.length} reviewed
          </span>
        }
      />

      <div className="divide-y divide-border">
        {documents.map((document) => (
          <div
            key={document.id}
            className={`p-5 transition sm:p-6 ${
              document.reviewed
                ? "bg-success/[0.025]"
                : ""
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText size={18} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-text-primary">
                    {document.name}
                  </h3>

                  <p className="mt-1 break-words text-sm font-semibold text-text-primary">
                    {document.fileName}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted">
                    <span>{document.size}</span>
                    <span>{document.type}</span>
                    <span>
                      Submitted: {document.submitted}
                    </span>
                  </div>
                </div>
              </div>

              <StatusBadge
                label={
                  document.reviewed
                    ? "✓ Reviewed"
                    : "○ Not Reviewed"
                }
                type={
                  document.reviewed
                    ? "success"
                    : "neutral"
                }
              />
            </div>

            <div className="mt-4 rounded-xl border border-border bg-surface-secondary p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Document Evidence
              </p>

              <p className="mt-1 text-sm leading-6 text-text-primary">
                {document.evidence}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onPreview(
                      previewDocumentId === document.id
                        ? null
                        : document.id
                    )
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs font-semibold text-text-primary transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <FileText size={14} />
                  {previewDocumentId === document.id
                    ? "Close Preview"
                    : "Preview"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onToggleReview(document.id)
                  }
                  className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    document.reviewed
                      ? "border border-success/20 bg-success/10 text-success"
                      : "border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  {document.reviewed ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Circle size={14} />
                  )}

                  {document.reviewed
                    ? "Reviewed"
                    : "Mark as Reviewed"}
                </button>
              </div>
            </div>

            {previewDocumentId === document.id && (
              <div
                className="mt-4 rounded-xl border border-primary/20 bg-primary/[0.04] p-4"
                role="status"
              >
                <p className="text-xs font-bold text-primary">
                  Mock Document Preview
                </p>

                <p className="mt-1 text-sm text-text-primary">
                  Preview available for{" "}
                  <strong>{document.fileName}</strong>.
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  A real document viewer can be connected during
                  backend integration.
                </p>
              </div>
            )}

            <div className="mt-4">
              <label
                htmlFor={`review-note-${document.id}`}
                className="mb-2 block text-xs font-semibold text-text-primary"
              >
                Optional Reviewer Note
              </label>

              <input
                id={`review-note-${document.id}`}
                value={document.reviewerNote}
                onChange={(event) =>
                  onUpdateNote(
                    document.id,
                    event.target.value
                  )
                }
                placeholder="Add a note about this document..."
                maxLength={500}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   NEW CLINICAL EVIDENCE
========================================================================= */

function EvidenceReview() {
  const evidence = [
    {
      label: "Imaging",
      value:
        "MRI demonstrates persistent medial meniscus pathology.",
    },
    {
      label: "Treatment History",
      value:
        "Physical therapy completed for 8 weeks.",
    },
    {
      label: "Treatment Outcome",
      value: "Limited improvement.",
    },
    {
      label: "Clinical Notes",
      value:
        "Persistent right knee pain despite conservative management.",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-card">
      <SectionHeader
        icon={<ClipboardCheck size={18} />}
        title="New Clinical Evidence"
        subtitle="Evidence reviewed from the documents submitted by the provider."
      />

      <div className="p-5 sm:p-6">
        <div className="mb-4 rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-3">
          <p className="text-xs font-semibold text-primary">
            Submitted Evidence
          </p>

          <p className="mt-1 text-xs leading-5 text-text-secondary">
            The information below is mock evidence for the
            frontend workflow. It does not represent real AI
            document extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {evidence.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-surface-secondary p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {item.label}
              </p>

              <p className="mt-2 text-sm leading-6 text-text-primary">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   UPDATED POLICY EVALUATION
========================================================================= */

function UpdatedPolicyEvaluation() {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-card">
      <SectionHeader
        icon={<ShieldCheck size={18} />}
        title="Updated Policy Evaluation"
        subtitle="Policy criteria re-evaluated using the newly submitted evidence."
        action={
          <StatusBadge
            label="5 / 5 Passed"
            type="success"
          />
        }
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-4">
        <ResponseCell
          label="Policy"
          value={postSubmissionReview.policy}
        />

        <ResponseCell
          label="Version"
          value={postSubmissionReview.policyVersion}
        />

        <ResponseCell
          label="Rules Evaluated"
          value={postSubmissionReview.rulesEvaluated}
        />

        <ResponseCell
          label="Missing"
          value={postSubmissionReview.missingInformation}
        />
      </div>

      <div className="divide-y divide-border">
        {policyRules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    {rule.condition}
                  </h3>

                  <span className="mt-1 inline-flex text-[10px] font-bold uppercase tracking-wider text-success">
                    ✓ {rule.result}
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold text-text-muted">
                {rule.reference}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-surface-secondary p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Condition
                </p>

                <p className="mt-1 text-xs leading-5 text-text-primary">
                  {rule.condition}
                </p>
              </div>

              <div className="rounded-lg bg-surface-secondary p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  New Evidence
                </p>

                <p className="mt-1 text-xs leading-5 text-text-primary">
                  {rule.evidence}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   BEFORE VS AFTER
========================================================================= */

function EvidenceComparison() {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-card">
      <SectionHeader
        icon={<FileCheck2 size={18} />}
        title="Evidence Status"
        subtitle="Comparison of unresolved evidence before and after provider response."
      />

      <div className="divide-y divide-border">
        {evidenceComparison.map((item) => (
          <div
            key={item.criterion}
            className="grid grid-cols-1 gap-4 p-5 sm:p-6 lg:grid-cols-[190px_1fr_1fr]"
          >
            <div>
              <p className="text-xs font-bold text-text-primary">
                {item.criterion}
              </p>
            </div>

            <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warning">
                Before Provider Response
              </p>

              <p className="mt-2 text-sm leading-5 text-text-primary">
                ⚠ {item.before}
              </p>
            </div>

            <div className="rounded-xl border border-success/20 bg-success/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-success">
                After Provider Response
              </p>

              <p className="mt-2 text-sm leading-5 text-text-primary">
                ✓ {item.after}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   UPDATED RECOMMENDATION
========================================================================= */

function UpdatedRecommendation({ recommendation }) {
  const config = outcomeConfig[recommendation];

  return (
    <section className="rounded-2xl border border-primary/20 bg-surface shadow-card">
      <div className="border-b border-primary/10 bg-primary/[0.04] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h2 className="text-base font-bold text-text-primary">
              Updated Recommendation
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Updated recommendation based on submitted evidence.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              AI / POLICY RECOMMENDATION
            </p>

            <h3
              className={`mt-2 text-2xl font-bold ${config.colorClass}`}
            >
              {recommendation}
            </h3>
          </div>

          <div className="rounded-xl border border-border bg-surface-secondary px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Confidence
            </p>

            <p className="mt-1 text-lg font-bold text-text-primary">
              {config.confidence} ·{" "}
              {config.confidenceScore}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-surface-secondary p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Explanation
          </p>

          <p className="mt-2 text-sm leading-7 text-text-primary">
            {config.explanation}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
          <p className="text-xs font-bold text-primary">
            Human Review Required
          </p>

          <p className="mt-1 text-xs leading-5 text-text-secondary">
            This is an updated recommendation only. The clinical
            reviewer must select and submit the final decision.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   REQUEST SUMMARY
========================================================================= */

function RequestSummary() {
  const items = [
    ["Patient", postSubmissionReview.patient],
    ["Patient ID", postSubmissionReview.patientId],
    ["Age", postSubmissionReview.age],
    ["Gender", postSubmissionReview.gender],
    ["Diagnosis", postSubmissionReview.diagnosis],
    [
      "Requested Service",
      postSubmissionReview.requestedService,
    ],
    ["Insurance", postSubmissionReview.insurance],
    ["Policy", postSubmissionReview.policy],
    ["Policy Version", postSubmissionReview.policyVersion],
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-card">
      <SectionHeader
        icon={<ClipboardCheck size={18} />}
        title="Request Summary"
        subtitle="Authorization request details."
      />

      <div className="divide-y divide-border">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="px-5 py-3.5"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {label}
            </p>

            <p className="mt-1 text-sm font-semibold leading-5 text-text-primary">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   REVIEW STATUS
========================================================================= */

function ReviewStatusCard({
  documentsReviewed,
  totalDocuments,
}) {
  const completion = Math.round(
    (documentsReviewed / totalDocuments) * 100
  );

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
        Review Progress
      </p>

      <h2 className="mt-1 text-base font-bold text-text-primary">
        Document Review
      </h2>

      <div className="mt-5 flex items-end justify-between">
        <span className="text-sm text-text-secondary">
          Documents reviewed
        </span>

        <strong className="text-lg text-text-primary">
          {documentsReviewed} / {totalDocuments}
        </strong>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-text-muted">
        {completion}% complete
      </p>
    </section>
  );
}

/* =========================================================================
   RECOMMENDATION CARD
========================================================================= */

function DecisionRecommendationCard() {
  const config =
    outcomeConfig[postSubmissionReview.recommendation];

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
        Updated Recommendation
      </p>

      <h2
        className={`mt-2 text-xl font-bold ${config.colorClass}`}
      >
        {postSubmissionReview.recommendation}
      </h2>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-secondary p-3">
        <span className="text-xs text-text-secondary">
          Confidence
        </span>

        <strong className="text-sm text-text-primary">
          {config.confidence}
        </strong>
      </div>

      <p className="mt-4 text-xs leading-5 text-text-secondary">
        Human reviewer must make the final authorization
        decision.
      </p>
    </section>
  );
}

/* =========================================================================
   REVIEW INFORMATION
========================================================================= */

function ReviewInformation() {
  const items = [
    ["Request ID", postSubmissionReview.requestId],
    ["Provider Response", "Received"],
    [
      "Documents Reviewed",
      `${postSubmissionReview.documentsSubmitted} / ${postSubmissionReview.documentsSubmitted}`,
    ],
    ["Policy Version", postSubmissionReview.policyVersion],
    ["Rules Evaluated", postSubmissionReview.rulesEvaluated],
    ["Rules Passed", postSubmissionReview.rulesPassed],
    ["Rules Failed", postSubmissionReview.rulesFailed],
    ["Review Date", "13 Aug 2026"],
    ["Reviewer", "Clinical Reviewer"],
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-card">
      <SectionHeader
        icon={<UserCheck size={18} />}
        title="Review Information"
      />

      <div className="divide-y divide-border">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="px-5 py-3"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {label}
            </p>

            <p className="mt-1 text-xs font-semibold text-text-primary">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   DECISION OPTION
========================================================================= */

function DecisionOption({
  outcome,
  selected,
  onSelect,
}) {
  const config = outcomeConfig[outcome];
  const Icon = config.icon;

  return (
    <label
      className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
        selected
          ? `${config.borderClass} ${config.bgClass}`
          : "border-border bg-surface hover:bg-surface-secondary"
      }`}
    >
      <input
        type="radio"
        name="final-review-decision"
        value={outcome}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-primary bg-primary text-white"
            : "border-border text-transparent"
        }`}
        aria-hidden="true"
      >
        {selected && <CheckCircle2 size={15} />}
      </div>

      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Icon
          size={19}
          className={`mt-0.5 shrink-0 ${config.colorClass}`}
        />

        <div>
          <p className="text-sm font-bold text-text-primary">
            {outcome}
          </p>

          <p className="mt-1 text-xs leading-5 text-text-secondary">
            {outcome === "APPROVE" &&
              "All required criteria are supported by the submitted evidence."}

            {outcome ===
              "PEND FOR NURSE REVIEW" &&
              "Requires additional clinical review before final authorization."}

            {outcome ===
              "REQUEST MORE INFORMATION" &&
              "Evidence remains insufficient to complete the authorization evaluation."}
          </p>
        </div>
      </div>
    </label>
  );
}

/* =========================================================================
   SUCCESS STATE
========================================================================= */

function FinalDecisionSuccess({
  outcome,
  decisionReason,
  documentsReviewed,
  onViewDecision,
  onBack,
}) {
  const config = outcomeConfig[outcome];
  const Icon = config.icon;

  return (
    <div className="mx-auto flex w-full max-w-4xl items-center justify-center py-10 sm:py-16">
      <section className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div
          className={`flex flex-col items-center px-6 py-10 text-center sm:px-10 ${config.bgClass}`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${config.bgClass} ${config.colorClass}`}
          >
            <Icon size={34} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-primary">
            Decision Submitted
          </p>

          <h1
            className={`mt-2 text-2xl font-bold sm:text-3xl ${config.colorClass}`}
          >
            {config.title}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
            {config.explanation}
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <InfoCell
            label="Request ID"
            value={postSubmissionReview.requestId}
          />

          <InfoCell
            label="Final Decision"
            value={outcome}
          />

          <InfoCell
            label="Confidence"
            value={`${config.confidence} · ${config.confidenceScore}`}
          />

          <InfoCell
            label="Status"
            value={config.status}
          />

          <InfoCell
            label="Documents Reviewed"
            value={`${documentsReviewed} / ${postSubmissionReview.documentsSubmitted}`}
          />

          <InfoCell
            label="Submitted"
            value="13 Aug 2026"
          />
        </div>

        <div className="border-t border-border p-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Final Decision Reason
          </p>

          <p className="mt-2 text-sm leading-6 text-text-primary">
            {decisionReason}
          </p>

          <div className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Recommended Action
            </p>

            <p className="mt-1 text-sm font-semibold text-text-primary">
              {config.recommendedAction}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onViewDecision}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              View Decision
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   REUSABLE UI
========================================================================= */

function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-bold text-text-primary">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="px-5 py-4 sm:px-6">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-text-primary">
        {value}
      </p>
    </div>
  );
}

function ResponseCell({ label, value }) {
  return (
    <div className="bg-surface px-5 py-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-text-primary">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ label, type = "neutral" }) {
  const classes = {
    success:
      "border-success/20 bg-success/10 text-success",
    warning:
      "border-warning/20 bg-warning/10 text-warning",
    error:
      "border-error/20 bg-error/10 text-error",
    neutral:
      "border-border bg-surface-secondary text-text-secondary",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${classes[type]}`}
    >
      {label}
    </span>
  );
}

function ValidationMessage({ message }) {
  return (
    <div
      role="alert"
      className="mt-5 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
    >
      <span className="font-bold">Required: </span>
      {message}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden="true"
    />
  );
}