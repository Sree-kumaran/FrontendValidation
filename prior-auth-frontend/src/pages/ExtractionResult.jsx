import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  Pill,
  ScanLine,
  UserRound,
} from "lucide-react";

const MOCK_EXTRACTION = {
  requestId: "PA-10025",

  patient: {
    patientId: "P10025",
    patientName: "John Smith",
    age: 47,
    gender: "Male",
    insurance: "HealthPlus PPO",
  },

  clinical: {
    diagnosis: "Chronic Knee Pain",
    diagnosisCode: "M25.561",
    symptoms: "Persistent right knee pain",
    symptomDuration: "6 months",
  },

  previousTreatment: {
    treatment: "Physical Therapy",
    duration: "8 weeks",
    outcome: "Insufficient improvement",
  },

  medication: {
    medication: "NSAIDs",
    duration: "6 weeks",
  },

  requestedService: {
    service: "MRI — Knee",
    category: "Diagnostic Imaging",
  },

  confidence: 94,

  keyFacts: [
    "Diagnosis identified",
    "Requested service identified",
    "Symptom duration identified",
    "Previous treatment identified",
    "Medication history identified",
    "Clinical indication identified",
  ],
};

export default function ExtractionResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const request = location.state?.request;

  const data = {
    ...MOCK_EXTRACTION,
    patient: {
      ...MOCK_EXTRACTION.patient,
      patientId: request?.patientId || MOCK_EXTRACTION.patient.patientId,
      patientName: request?.patientName || MOCK_EXTRACTION.patient.patientName,
      age: request?.age || MOCK_EXTRACTION.patient.age,
      gender: request?.gender || MOCK_EXTRACTION.patient.gender,
      insurance:
        request?.insurancePlan || MOCK_EXTRACTION.patient.insurance,
    },
    clinical: {
      ...MOCK_EXTRACTION.clinical,
      diagnosis:
        request?.primaryDiagnosis || MOCK_EXTRACTION.clinical.diagnosis,
      diagnosisCode:
        request?.diagnosisCode || MOCK_EXTRACTION.clinical.diagnosisCode,
      symptoms: request?.symptoms || MOCK_EXTRACTION.clinical.symptoms,
      symptomDuration:
        request?.symptomDuration || MOCK_EXTRACTION.clinical.symptomDuration,
    },
    previousTreatment: {
      ...MOCK_EXTRACTION.previousTreatment,
      treatment:
        request?.previousTreatment ||
        MOCK_EXTRACTION.previousTreatment.treatment,
      duration:
        request?.treatmentDuration ||
        MOCK_EXTRACTION.previousTreatment.duration,
    },
    medication: {
      ...MOCK_EXTRACTION.medication,
      medication:
        request?.currentMedications ||
        MOCK_EXTRACTION.medication.medication,
    },
    requestedService: {
      ...MOCK_EXTRACTION.requestedService,
      service:
        request?.requestedService ||
        MOCK_EXTRACTION.requestedService.service,
      category:
        request?.serviceCategory ||
        MOCK_EXTRACTION.requestedService.category,
    },
  };

  const policyEvaluationData = {
    requestId: data.requestId,
    source: "AI Extraction Result",
    status: "Extraction Complete",
    extractedData: data,
    originalRequest: request || null,
  };

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      {/* Header */}
      <header className="mb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BrainCircuit size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                AI Extraction Results
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
                Review the clinical information extracted from the submitted
                request before policy evaluation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success-bg px-3 py-1.5 text-xs font-semibold text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              Extraction Complete
            </div>

            <div className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary">
              Request ID:{" "}
              <span className="font-semibold text-text-primary">
                {data.requestId}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        {/* LEFT */}
        <main className="min-w-0 space-y-5">
          <div className="mb-1 flex items-center gap-2">
            <ClipboardCheck size={17} className="text-primary" />
            <h2 className="text-sm font-bold text-text-primary">
              Extracted Clinical Information
            </h2>
          </div>

          <InformationCard
            icon={UserRound}
            title="Patient Information"
            items={[
              ["Patient ID", data.patient.patientId],
              ["Patient Name", data.patient.patientName],
              ["Age", data.patient.age],
              ["Gender", data.patient.gender],
              ["Insurance", data.patient.insurance],
            ]}
          />

          <InformationCard
            icon={FileText}
            title="Clinical Information"
            items={[
              ["Diagnosis", data.clinical.diagnosis],
              ["Diagnosis Code", data.clinical.diagnosisCode],
              ["Symptoms", data.clinical.symptoms],
              ["Symptom Duration", data.clinical.symptomDuration],
            ]}
          />

          <InformationCard
            icon={ClipboardCheck}
            title="Previous Treatment"
            items={[
              ["Treatment", data.previousTreatment.treatment],
              ["Duration", data.previousTreatment.duration],
              ["Outcome", data.previousTreatment.outcome],
            ]}
          />

          <InformationCard
            icon={Pill}
            title="Medication"
            items={[
              ["Medication", data.medication.medication],
              ["Duration", data.medication.duration],
            ]}
          />

          {/* Mobile / lower requested service */}
          <RequestedServiceCard data={data} />
        </main>

        {/* RIGHT */}
        <aside className="space-y-5 xl:sticky xl:top-6">
          {/* AI Summary */}
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="border-b border-border p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BrainCircuit size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-text-primary">
                    AI Extraction Summary
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    Automated clinical data extraction
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                <p className="text-sm font-medium leading-6 text-text-primary">
                  The request contains sufficient clinical information for
                  policy evaluation.
                </p>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
                  Extracted Key Facts
                </p>

                <div className="space-y-3">
                  {data.keyFacts.map((fact) => (
                    <div
                      key={fact}
                      className="flex items-start gap-3 rounded-lg px-2 py-1.5 transition hover:bg-surface-secondary"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check size={12} strokeWidth={3} />
                      </span>

                      <span className="text-sm leading-5 text-text-primary">
                        {fact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Confidence */}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Extraction Confidence
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Confidence in extracted clinical data
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Gauge size={18} />
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <span className="text-3xl font-bold tracking-tight text-text-primary">
                {data.confidence}%
              </span>

              <span className="pb-1 text-xs font-medium text-text-muted">
                High confidence
              </span>
            </div>

            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-surface-secondary"
              role="progressbar"
              aria-label="Extraction confidence"
              aria-valuenow={data.confidence}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${data.confidence}%` }}
              />
            </div>
          </section>

          {/* Desktop requested service */}
          <div className="hidden xl:block">
            <RequestedServiceCard data={data} />
          </div>
        </aside>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/new-authorization")}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
        >
          <ArrowLeft size={17} />
          Back to Request
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/policy-evaluation", {
              state: policyEvaluationData,
            })
          }
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background sm:w-auto"
        >
          Continue to Policy Evaluation
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

function InformationCard({ icon: Icon, title, items }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:border-primary/20">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={17} />
        </div>

        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {items.map(([label, value], index) => (
          <div
            key={label}
            className={`px-5 py-4 transition hover:bg-surface-secondary sm:px-6 ${
              index >= 2 ? "sm:border-t sm:border-border" : ""
            }`}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
              {label}
            </p>

            <p className="mt-1.5 text-sm font-semibold leading-5 text-text-primary">
              {value || "Not identified"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RequestedServiceCard({ data }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04] shadow-card">
      <div className="flex items-center gap-3 border-b border-primary/10 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ScanLine size={18} />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Requested Service
          </p>
          <h3 className="mt-0.5 text-base font-bold text-text-primary">
            {data.requestedService.service}
          </h3>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
          Category
        </p>

        <p className="mt-1 text-sm font-semibold text-text-primary">
          {data.requestedService.category}
        </p>
      </div>
    </section>
  );
}