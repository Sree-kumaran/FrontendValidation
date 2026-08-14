import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

const MOCK_POLICY = {
  name: "Knee MRI Policy",
  version: "v2.1",
  status: "Evaluation Complete",
};

const MOCK_PATIENT = {
  patient: "John Smith",
  patientId: "P10025",
  diagnosis: "Chronic Knee Pain",
  requestedService: "MRI — Knee",
  insurance: "HealthPlus PPO",
};

const MOCK_RULES = [
  {
    id: "01",
    name: "Diagnosis documented",
    evidence: "Chronic Knee Pain",
    status: "PASS",
  },
  {
    id: "02",
    name: "Symptoms ≥ 6 weeks",
    evidence: "Symptoms present for 6 months",
    status: "PASS",
  },
  {
    id: "03",
    name: "Conservative treatment completed",
    evidence: "Physical Therapy — 8 weeks",
    status: "PASS",
  },
  {
    id: "04",
    name: "Clinical indication documented",
    evidence: "Persistent right knee pain despite treatment",
    status: "PASS",
  },
  {
    id: "05",
    name: "Plan coverage",
    evidence: "HealthPlus PPO — MRI Knee covered",
    status: "PASS",
  },
];

function WorkflowProgress() {
  const steps = [
    { number: "1", label: "Request", state: "complete" },
    { number: "2", label: "AI Extraction", state: "complete" },
    { number: "3", label: "Policy Evaluation", state: "current" },
    { number: "4", label: "Decision", state: "upcoming" },
  ];

  return (
    <div className="mb-7 rounded-2xl border border-border bg-surface px-5 py-4 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                  step.state === "complete"
                    ? "border-primary bg-primary text-white"
                    : step.state === "current"
                    ? "border-primary bg-primary/10 text-primary ring-4 ring-primary/10"
                    : "border-border bg-surface-secondary text-text-muted"
                }`}
              >
                {step.state === "complete" ? (
                  <Check size={15} strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>

              <div className="min-w-0">
                <p
                  className={`truncate text-xs font-semibold ${
                    step.state === "current"
                      ? "text-primary"
                      : step.state === "complete"
                      ? "text-text-primary"
                      : "text-text-muted"
                  }`}
                >
                  {step.label}
                </p>

                {step.state === "current" && (
                  <p className="mt-0.5 text-[10px] text-text-secondary">
                    In progress
                  </p>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-4 hidden h-px flex-1 bg-border md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PolicyHeader() {
  return (
    <header className="mb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Policy Evaluation
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
              Clinical information is being evaluated against the applicable
              authorization policy.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-border bg-surface px-4 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Policy
            </p>
            <p className="mt-0.5 text-sm font-semibold text-text-primary">
              {MOCK_POLICY.name}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface px-4 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Version
            </p>
            <p className="mt-0.5 text-sm font-semibold text-text-primary">
              {MOCK_POLICY.version}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-success/20 bg-success-bg px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-sm font-semibold text-success">
              {MOCK_POLICY.status}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function PatientRequestSummary({ data }) {
  const items = [
    ["Patient", data.patient],
    ["Patient ID", data.patientId],
    ["Diagnosis", data.diagnosis],
    ["Requested Service", data.requestedService],
    ["Insurance", data.insurance],
  ];

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ClipboardCheck size={17} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-text-primary">
            Patient / Request Summary
          </h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            Clinical request currently under evaluation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="px-5 py-4 transition hover:bg-surface-secondary"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {label}
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-5 text-text-primary">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RuleStatus({ status }) {
  const config = {
    PASS: {
      text: "PASS",
      className: "border-success/20 bg-success/10 text-success",
      dot: "bg-success",
      icon: <Check size={13} strokeWidth={3} />,
    },
    FAIL: {
      text: "FAIL",
      className: "border-danger/20 bg-danger/10 text-danger",
      dot: "bg-danger",
      icon: null,
    },
    MISSING: {
      text: "MISSING",
      className: "border-warning/20 bg-warning/10 text-warning",
      dot: "bg-warning",
      icon: null,
    },
  };

  const current = config[status] || config.MISSING;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wide ${current.className}`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${current.dot} text-white`}
      >
        {current.icon}
      </span>
      {current.text}
    </span>
  );
}

function PolicyRule({ rule }) {
  return (
    <article className="group rounded-xl border border-border bg-surface-secondary/40 p-4 transition hover:border-primary/25 hover:bg-surface-secondary sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-xs font-bold text-primary">
            {rule.id}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Rule {rule.id}
            </p>

            <h3 className="mt-1 text-sm font-bold text-text-primary sm:text-base">
              {rule.name}
            </h3>
          </div>
        </div>

        <RuleStatus status={rule.status} />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Evidence
        </p>

        <p className="mt-1.5 text-sm leading-5 text-text-secondary">
          "{rule.evidence}"
        </p>
      </div>
    </article>
  );
}

function PolicyRules({ rules }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              {MOCK_POLICY.name} — {MOCK_POLICY.version}
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              Explicit authorization criteria evaluated against extracted
              clinical evidence.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            <FileCheck2 size={14} />
            {rules.length} Rules Evaluated
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {rules.map((rule) => (
          <PolicyRule key={rule.id} rule={rule} />
        ))}
      </div>
    </section>
  );
}

function EvaluationSummary({ rules }) {
  const passed = rules.filter((rule) => rule.status === "PASS").length;
  const failed = rules.filter((rule) => rule.status === "FAIL").length;
  const missing = rules.filter((rule) => rule.status === "MISSING").length;
  const percentage =
    rules.length === 0 ? 0 : Math.round((passed / rules.length) * 100);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Evaluation Summary
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Overall policy rule evaluation
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CheckCircle2 size={18} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Rules Evaluated" value={rules.length} />
        <Metric label="Passed" value={passed} positive />
        <Metric label="Failed" value={failed} />
        <Metric label="Missing" value={missing} />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary">
            Evaluation Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {percentage}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-surface-secondary"
          role="progressbar"
          aria-label="Policy evaluation progress"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-3 text-sm font-medium text-text-primary">
          All required policy conditions satisfied.
        </p>
      </div>
    </section>
  );
}

function Metric({ label, value, positive = false }) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary px-3 py-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          positive ? "text-success" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function RecommendationCard({ onDecision }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-card">
      <div className="border-b border-primary/10 bg-primary/[0.04] px-5 py-5 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Final Recommendation
        </p>

        <h2 className="mt-1 text-lg font-bold text-text-primary">
          Policy Recommendation
        </h2>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 size={28} />
            </div>

            <div>
              <p className="text-3xl font-black tracking-tight text-success">
                APPROVE
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-xs font-semibold text-text-secondary">
                  Confidence: High
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-secondary px-4 py-3 sm:max-w-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Reason
            </p>

            <p className="mt-1.5 text-sm font-medium leading-6 text-text-primary">
              All required clinical and coverage criteria are satisfied.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDecision}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface sm:w-auto"
          >
            View Decision Trace
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function PolicyEvaluation() {
  const navigate = useNavigate();
  const location = useLocation();

  const extractionData = location.state?.extractedData;

  const patientData = {
    patient:
      extractionData?.patient?.patientName || MOCK_PATIENT.patient,
    patientId:
      extractionData?.patient?.patientId || MOCK_PATIENT.patientId,
    diagnosis:
      extractionData?.clinical?.diagnosis || MOCK_PATIENT.diagnosis,
    requestedService:
      extractionData?.requestedService?.service ||
      MOCK_PATIENT.requestedService,
    insurance:
      extractionData?.patient?.insurance || MOCK_PATIENT.insurance,
  };

  const evaluationData = {
    policy: MOCK_POLICY,
    patient: patientData,
    rules: MOCK_RULES,
    recommendation: {
      decision: "APPROVE",
      confidence: "High",
      reason:
        "All required clinical and coverage criteria are satisfied.",
    },
  };

  const handleDecisionTrace = () => {
    navigate("/decision", {
      state: {
        source: "Policy Evaluation",
        evaluation: evaluationData,
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <PolicyHeader />

      <WorkflowProgress />

      <PatientRequestSummary data={patientData} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <PolicyRules rules={MOCK_RULES} />

        <aside className="space-y-6 xl:sticky xl:top-6">
          <EvaluationSummary rules={MOCK_RULES} />

          <RecommendationCard onDecision={handleDecisionTrace} />
        </aside>
      </div>
    </div>
  );
}