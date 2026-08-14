import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  FileText,
  Info,
  Send,
  ShieldCheck,
  UserRound,
  CalendarDays,
} from "lucide-react";

/* =========================================================
   MOCK AUTHORIZATION REQUEST
   Keep this separate so it can later be replaced by API data.
========================================================= */

const informationRequest = {
  requestId: "PA-10025",
  patient: "John Smith",
  patientId: "P10025",
  age: 47,
  gender: "Male",
  diagnosis: "Chronic Knee Pain",
  diagnosisCode: "M25.561",
  requestedService: "MRI — Knee",
  insurance: "HealthPlus PPO",
  policy: "Knee MRI Policy",
  policyVersion: "v2.1",
  status: "More Information Required",
  priority: "High",
  submitted: "13 Aug 2026",
};

/* =========================================================
   MISSING INFORMATION
========================================================= */

const missingInformation = [
  {
    id: "imaging",
    name: "Recent imaging results",
    description:
      "Recent X-ray, MRI, or other relevant imaging report.",
    reason: "Required to evaluate current clinical status.",
    priority: "High",
  },
  {
    id: "physical-therapy",
    name: "Physical therapy treatment records",
    description:
      "Documentation showing the course and outcome of physical therapy.",
    reason:
      "Required to verify completion of conservative treatment.",
    priority: "High",
  },
  {
    id: "progress-notes",
    name: "Latest clinical progress notes",
    description:
      "Most recent provider documentation describing current symptoms.",
    reason:
      "Required to verify the current clinical indication.",
    priority: "Medium",
  },
  {
    id: "medication-history",
    name: "Relevant medication history",
    description:
      "Current and recently attempted medications for the condition.",
    reason:
      "Required to understand prior pharmacological management.",
    priority: "Medium",
  },
];

/* =========================================================
   DOCUMENTATION OPTIONS
========================================================= */

const documentationOptions = [
  {
    id: "clinical-notes",
    label: "Clinical Notes",
  },
  {
    id: "imaging-report",
    label: "Imaging Report",
  },
  {
    id: "laboratory-results",
    label: "Laboratory Results",
  },
  {
    id: "treatment-records",
    label: "Treatment Records",
  },
  {
    id: "medication-history",
    label: "Medication History",
  },
  {
    id: "specialist-consultation",
    label: "Specialist Consultation",
  },
  {
    id: "other",
    label: "Other",
  },
];

/* =========================================================
   POLICY CRITERIA
========================================================= */

const policyCriteria = [
  {
    id: 1,
    condition: "Conservative treatment documentation",
    status: "Missing Evidence",
    evidence: "Physical therapy treatment records",
  },
  {
    id: 2,
    condition: "Clinical indication",
    status: "Insufficient Evidence",
    evidence: "Latest clinical progress notes",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function RequestMoreInformation() {
  const navigate = useNavigate();

  /* -------------------------
     FORM STATE
  ------------------------- */

  const [selectedMissing, setSelectedMissing] = useState([]);

  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [otherInformation, setOtherInformation] = useState("");

  const [providerMessage, setProviderMessage] = useState("");

  const [responseDeadline, setResponseDeadline] =
    useState("2026-08-20");

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  /* =========================================================
     SELECT / UNSELECT MISSING INFORMATION
  ========================================================= */

  const toggleMissingInformation = (id) => {
    setSelectedMissing((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      return [...previous, id];
    });

    setErrors((previous) => ({
      ...previous,
      missing: "",
    }));
  };

  /* =========================================================
     SELECT / UNSELECT DOCUMENTATION
  ========================================================= */

  const toggleDocumentation = (id) => {
    setSelectedDocuments((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      return [...previous, id];
    });

    setErrors((previous) => ({
      ...previous,
      documents: "",
      other: "",
    }));
  };

  /* =========================================================
     CHARACTER COUNTER
  ========================================================= */

  const messageCharacterCount = providerMessage.length;

  /* =========================================================
     SELECTED REQUEST ITEMS COUNT
  ========================================================= */

  const selectedRequestCount = useMemo(() => {
    return selectedMissing.length;
  }, [selectedMissing]);

  /* =========================================================
     FORM VALIDATION
  ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    if (selectedMissing.length === 0) {
      newErrors.missing =
        "Select at least one item of missing information.";
    }

    if (selectedDocuments.length === 0) {
      newErrors.documents =
        "Select at least one type of requested documentation.";
    }

    if (
      selectedDocuments.includes("other") &&
      !otherInformation.trim()
    ) {
      newErrors.other =
        "Please specify the additional information required.";
    }

    if (!providerMessage.trim()) {
      newErrors.message =
        "Please enter a message to the provider.";
    }

    if (!responseDeadline) {
      newErrors.deadline =
        "Please select a response deadline.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    /*
      Mock submission.
      Replace this later with an API call.
    */

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  /* =========================================================
     SUCCESS STATE
  ========================================================= */

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-[1100px]">
        <button
          type="button"
          onClick={() => navigate("/requests")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <ArrowLeft size={17} />
          Back to Requests
        </button>

        <section className="rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={36} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-success">
              Request Submitted
            </p>

            <h1 className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
              Information Request Sent
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-text-secondary">
              The provider has been notified that additional
              documentation is required to continue the
              authorization review.
            </p>

            <div className="mt-8 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3">
              <SuccessInfo
                label="Request ID"
                value={informationRequest.requestId}
              />

              <SuccessInfo
                label="Status"
                value="Awaiting Provider Information"
              />

              <SuccessInfo
                label="Requested Items"
                value={selectedRequestCount}
              />

              <SuccessInfo
                label="Response Due"
                value={formatDate(responseDeadline)}
              />
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate("/requests")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Back to Requests
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/requests")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                View Authorization
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* =========================================================
     MAIN FORM
  ========================================================= */

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/requests")}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <ArrowLeft size={17} />
          Back to Review Queue
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Request More Information
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
                Request additional clinical documentation required
                to complete the authorization evaluation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge
              label="More Information Required"
              type="danger"
            />

            <StatusBadge
              label="High Priority"
              type="warning"
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          REQUEST META
      ===================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetaCard
          label="Request ID"
          value={informationRequest.requestId}
        />

        <MetaCard
          label="Patient"
          value={informationRequest.patient}
        />

        <MetaCard
          label="Requested Service"
          value={informationRequest.requestedService}
        />

        <MetaCard
          label="Current Status"
          value={informationRequest.status}
        />

        <MetaCard
          label="Submitted"
          value={informationRequest.submitted}
        />
      </section>

      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-bold text-text-primary">
            Authorization Workflow
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Current request processing stage
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-[720px] items-center px-5 py-5 sm:px-6">
            {[
              "Request",
              "AI Extraction",
              "Policy Evaluation",
              "Decision",
              "Additional Information",
            ].map((step, index, array) => {
              const current = index === array.length - 1;

              return (
                <React.Fragment key={step}>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        current
                          ? "bg-primary text-white ring-4 ring-primary/10"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {current ? (
                        <span>5</span>
                      ) : (
                        <Check size={16} />
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

                  {index < array.length - 1 && (
                    <div className="mx-2 h-px flex-1 bg-border" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN TWO COLUMN LAYOUT
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <main className="min-w-0 space-y-6">
          {/* REQUEST INFORMATION */}

          <section className="rounded-2xl border border-border bg-surface shadow-card">
            <SectionHeader
              icon={<UserRound size={18} />}
              title="Authorization Request"
              description="Patient and authorization request information"
            />

            <div className="grid grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-3">
              <InfoCell
                label="Patient"
                value={informationRequest.patient}
              />

              <InfoCell
                label="Patient ID"
                value={informationRequest.patientId}
              />

              <InfoCell
                label="Age"
                value={informationRequest.age}
              />

              <InfoCell
                label="Gender"
                value={informationRequest.gender}
              />

              <InfoCell
                label="Insurance"
                value={informationRequest.insurance}
              />

              <InfoCell
                label="Requested Service"
                value={informationRequest.requestedService}
              />

              <InfoCell
                label="Diagnosis"
                value={informationRequest.diagnosis}
              />

              <InfoCell
                label="Diagnosis Code"
                value={informationRequest.diagnosisCode}
              />

              <InfoCell
                label="Urgency"
                value={informationRequest.priority}
              />
            </div>
          </section>

          {/* WHY INFORMATION IS REQUIRED */}

          <section className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 shadow-card sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Info size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Why is more information required?
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  The submitted request does not contain sufficient
                  documentation to verify all applicable
                  authorization criteria.
                </p>

                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Missing Information
                  </p>

                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="mt-1 text-primary">•</span>
                      Recent imaging results
                    </li>

                    <li className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="mt-1 text-primary">•</span>
                      Previous conservative treatment documentation
                    </li>

                    <li className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="mt-1 text-primary">•</span>
                      Clinical progress notes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* MISSING INFORMATION */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <SectionTitle
              title="Required Information"
              description="Select the information that must be provided before the authorization can continue."
            />

            <div className="mt-5 space-y-3">
              {missingInformation.map((item) => {
                const selected = selectedMissing.includes(item.id);

                return (
                  <label
                    key={item.id}
                    className={`block cursor-pointer rounded-xl border p-4 transition ${
                      selected
                        ? "border-primary bg-primary/[0.05] ring-1 ring-primary/20"
                        : "border-border bg-surface-secondary hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleMissingInformation(item.id)
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-primary focus:ring-primary"
                        aria-label={`Select ${item.name}`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-text-primary">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-text-secondary">
                              {item.description}
                            </p>
                          </div>

                          <PriorityBadge
                            priority={item.priority}
                          />
                        </div>

                        <div className="mt-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                            Reason Required
                          </p>

                          <p className="mt-1 text-xs leading-5 text-text-secondary">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {errors.missing && (
              <FieldError message={errors.missing} />
            )}
          </section>

          {/* REQUESTED DOCUMENTATION */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <SectionTitle
              title="Requested Documentation"
              description="Specify the types of documentation the provider should submit."
            />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documentationOptions.map((option) => {
                const selected = selectedDocuments.includes(
                  option.id
                );

                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      selected
                        ? "border-primary bg-primary/[0.05]"
                        : "border-border bg-surface-secondary hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleDocumentation(option.id)
                      }
                      className="h-4 w-4 accent-primary focus:ring-primary"
                      aria-label={option.label}
                    />

                    <span className="text-sm font-semibold text-text-primary">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {errors.documents && (
              <FieldError message={errors.documents} />
            )}

            {selectedDocuments.includes("other") && (
              <div className="mt-4">
                <label
                  htmlFor="otherInformation"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Specify Other Information
                </label>

                <input
                  id="otherInformation"
                  type="text"
                  value={otherInformation}
                  onChange={(event) => {
                    setOtherInformation(event.target.value);

                    setErrors((previous) => ({
                      ...previous,
                      other: "",
                    }));
                  }}
                  placeholder="Specify the additional information required"
                  className="min-h-11 w-full rounded-xl border border-border bg-surface-secondary px-4 text-sm text-text-primary outline-none placeholder:text-text-muted transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.other && (
                  <FieldError message={errors.other} />
                )}
              </div>
            )}
          </section>

          {/* PROVIDER MESSAGE */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <SectionTitle
              title="Message to Provider"
              description="Provide a clear explanation of the documentation required."
            />

            <div className="mt-5">
              <label
                htmlFor="providerMessage"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Provider Message
              </label>

              <textarea
                id="providerMessage"
                value={providerMessage}
                maxLength={1000}
                onChange={(event) => {
                  setProviderMessage(event.target.value);

                  setErrors((previous) => ({
                    ...previous,
                    message: "",
                  }));
                }}
                placeholder="Please provide the requested clinical documentation so that the authorization request can be completed."
                rows={7}
                className="w-full resize-y rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <div className="mt-2 flex justify-between text-xs text-text-muted">
                <span>Maximum 1000 characters</span>

                <span
                  className={
                    messageCharacterCount >= 1000
                      ? "font-semibold text-danger"
                      : ""
                  }
                >
                  {messageCharacterCount} / 1000
                </span>
              </div>

              {errors.message && (
                <FieldError message={errors.message} />
              )}
            </div>
          </section>

          {/* SUBMIT ACTIONS */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Send Information Request
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  The selected documentation requirements will be
                  included in the request to the provider.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/requests")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Send Information Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <aside className="min-w-0 space-y-6">
          {/* RESPONSE DEADLINE */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <SectionTitle
              title="Response Required By"
              description="Set the deadline for provider documentation."
            />

            <div className="mt-5">
              <label
                htmlFor="responseDeadline"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Response Deadline
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  id="responseDeadline"
                  type="date"
                  value={responseDeadline}
                  min="2026-08-14"
                  onChange={(event) => {
                    setResponseDeadline(event.target.value);

                    setErrors((previous) => ({
                      ...previous,
                      deadline: "",
                    }));
                  }}
                  className="min-h-11 w-full rounded-xl border border-border bg-surface-secondary pl-10 pr-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {errors.deadline && (
                <FieldError message={errors.deadline} />
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniInfo
                label="Requested By"
                value="Clinical Reviewer"
              />

              <MiniInfo
                label="Request Date"
                value="13 Aug 2026"
              />
            </div>
          </section>

          {/* REQUEST SUMMARY */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <SectionHeader
              icon={<FileText size={18} />}
              title="Request Summary"
              description="Authorization request details"
            />

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Patient"
                value={informationRequest.patient}
              />

              <SummaryRow
                label="Patient ID"
                value={informationRequest.patientId}
              />

              <SummaryRow
                label="Diagnosis"
                value={informationRequest.diagnosis}
              />

              <SummaryRow
                label="Requested Service"
                value={informationRequest.requestedService}
              />

              <SummaryRow
                label="Insurance"
                value={informationRequest.insurance}
              />

              <SummaryRow
                label="Policy"
                value={informationRequest.policy}
              />

              <SummaryRow
                label="Policy Version"
                value={informationRequest.policyVersion}
              />

              <div className="border-t border-border pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Status
                </span>

                <div className="mt-2">
                  <StatusBadge
                    label={informationRequest.status}
                    type="danger"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* POLICY CRITERIA */}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <SectionHeader
              icon={<ShieldCheck size={18} />}
              title="Policy Criteria Affected"
              description="Criteria that cannot currently be verified"
            />

            <div className="mt-5 space-y-3">
              {policyCriteria.map((criteria) => (
                <div
                  key={criteria.id}
                  className="rounded-xl border border-border bg-surface-secondary p-4"
                >
                  <div className="flex items-start gap-2">
                    <CircleAlert
                      size={17}
                      className="mt-0.5 shrink-0 text-warning"
                    />

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-text-primary">
                        {criteria.condition}
                      </h3>

                      <span className="mt-2 inline-flex rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-bold text-warning">
                        {criteria.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-border pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Required Evidence
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      {criteria.evidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate("/decision-trace")}
              className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              View Decision Trace
              <ArrowRight size={16} />
            </button>
          </section>

          {/* NOTICE */}

          <section className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
            <div className="flex items-start gap-3">
              <Info
                size={17}
                className="mt-0.5 shrink-0 text-primary"
              />

              <p className="text-xs leading-5 text-text-secondary">
                Additional information is requested when required
                clinical or administrative evidence is not available
                to complete the authorization evaluation.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE LOCAL COMPONENTS
========================================================= */

function SectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-text-primary">
          {title}
        </h2>

        <p className="mt-0.5 text-xs leading-5 text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h2 className="text-base font-bold text-text-primary">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-xs leading-5 text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}

function MetaCard({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-bold leading-5 text-text-primary">
        {value}
      </p>
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="bg-surface px-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold leading-5 text-text-primary">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-5 text-text-primary">
        {value}
      </p>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold leading-5 text-text-primary">
        {value}
      </p>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const isHigh = priority === "High";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${
        isHigh
          ? "bg-danger/10 text-danger"
          : "bg-warning/10 text-warning"
      }`}
    >
      Priority: {priority}
    </span>
  );
}

function StatusBadge({ label, type }) {
  const styles = {
    danger: "bg-danger/10 text-danger",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-bold ${
        styles[type] || styles.warning
      }`}
    >
      {label}
    </span>
  );
}

function FieldError({ message }) {
  return (
    <p
      role="alert"
      className="mt-2 text-xs font-semibold text-danger"
    >
      {message}
    </p>
  );
}

function SuccessInfo({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-bold leading-5 text-text-primary">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}