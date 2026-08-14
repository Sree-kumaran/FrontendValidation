import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Loader2,
  Save,
  UserRound,
} from "lucide-react";

const initialForm = {
  patientId: "",
  patientName: "",
  dateOfBirth: "",
  age: "",
  gender: "",
  insurancePlan: "",
  memberId: "",
  primaryDiagnosis: "",
  diagnosisCode: "",
  symptoms: "",
  symptomDuration: "",
  previousTreatment: "",
  treatmentDuration: "",
  currentMedications: "",
  clinicalIndication: "",
  requestedService: "",
  serviceCategory: "",
  provider: "",
  facility: "",
  urgency: "Routine",
  requestedDate: "",
  clinicalNotes: "",
};

const requiredFields = {
  patientId: "Patient ID",
  patientName: "Patient Name",
  primaryDiagnosis: "Diagnosis",
  requestedService: "Requested Service",
  insurancePlan: "Insurance Plan",
  clinicalNotes: "Clinical Notes",
};

function NewAuthorization() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });

    setSaved(false);
  };

  const validate = () => {
    const nextErrors = {};

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!String(form[field] || "").trim()) {
        nextErrors[field] = `${label} is required.`;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const characterCount = form.clinicalNotes.length;

  const summary = useMemo(
    () => ({
      patient: form.patientName || "Not provided",
      diagnosis: form.primaryDiagnosis || "Not provided",
      requestedService: form.requestedService || "Not provided",
      insurance: form.insurancePlan || "Not provided",
      urgency: form.urgency || "Routine",
    }),
    [form]
  );

  const handleSaveDraft = () => {
    setSaved(true);
  };

  const handleEvaluate = async () => {
    if (!validate()) {
      setTimeout(() => {
        document
          .querySelector("[aria-invalid='true']")
          ?.focus();
      }, 0);
      return;
    }

    setIsEvaluating(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const requestData = {
      ...form,
      status: "Ready for Evaluation",
      submittedAt: new Date().toISOString(),
      evaluationType: "AI-powered prior authorization evaluation",
    };

    navigate("/extraction-result", {
      state: {
        request: requestData,
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="mb-7">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              New Authorization
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Submit a clinical request for AI-powered prior authorization
              evaluation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleEvaluate();
          }}
          className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
        >
          <section className="border-b border-border p-5 sm:p-6">
            <SectionHeader
              number="01"
              title="Patient Information"
              description="Enter the member's demographic and insurance information."
              icon={UserRound}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                label="Patient ID"
                required
                value={form.patientId}
                error={errors.patientId}
                onChange={(value) => updateField("patientId", value)}
                placeholder="e.g. PT-10482"
              />

              <Field
                label="Patient Name"
                required
                value={form.patientName}
                error={errors.patientName}
                onChange={(value) => updateField("patientName", value)}
                placeholder="Enter patient name"
              />

              <Field
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(value) => updateField("dateOfBirth", value)}
              />

              <Field
                label="Age"
                type="number"
                min="0"
                max="120"
                value={form.age}
                onChange={(value) => updateField("age", value)}
                placeholder="Age"
              />

              <SelectField
                label="Gender"
                value={form.gender}
                onChange={(value) => updateField("gender", value)}
                options={["Male", "Female", "Non-binary", "Prefer not to say"]}
                placeholder="Select gender"
              />

              <Field
                label="Insurance Plan"
                required
                value={form.insurancePlan}
                error={errors.insurancePlan}
                onChange={(value) => updateField("insurancePlan", value)}
                placeholder="Enter insurance plan"
              />

              <Field
                label="Member ID"
                value={form.memberId}
                onChange={(value) => updateField("memberId", value)}
                placeholder="Enter member ID"
              />
            </div>
          </section>

          <section className="border-b border-border p-5 sm:p-6">
            <SectionHeader
              number="02"
              title="Clinical Information"
              description="Provide the clinical details supporting the authorization request."
              icon={FileText}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                label="Primary Diagnosis"
                required
                value={form.primaryDiagnosis}
                error={errors.primaryDiagnosis}
                onChange={(value) => updateField("primaryDiagnosis", value)}
                placeholder="Enter primary diagnosis"
              />

              <Field
                label="Diagnosis Code"
                value={form.diagnosisCode}
                onChange={(value) => updateField("diagnosisCode", value)}
                placeholder="e.g. M54.5"
              />

              <Field
                label="Symptoms"
                value={form.symptoms}
                onChange={(value) => updateField("symptoms", value)}
                placeholder="Describe relevant symptoms"
              />

              <Field
                label="Symptom Duration"
                value={form.symptomDuration}
                onChange={(value) => updateField("symptomDuration", value)}
                placeholder="e.g. 6 weeks"
              />

              <Field
                label="Previous Treatment"
                value={form.previousTreatment}
                onChange={(value) => updateField("previousTreatment", value)}
                placeholder="Previous treatment or therapy"
              />

              <Field
                label="Treatment Duration"
                value={form.treatmentDuration}
                onChange={(value) => updateField("treatmentDuration", value)}
                placeholder="e.g. 8 weeks"
              />

              <Field
                label="Current Medications"
                value={form.currentMedications}
                onChange={(value) => updateField("currentMedications", value)}
                placeholder="List current medications"
              />

              <Field
                label="Clinical Indication"
                value={form.clinicalIndication}
                onChange={(value) => updateField("clinicalIndication", value)}
                placeholder="Reason for requested treatment"
              />
            </div>
          </section>

          <section className="border-b border-border p-5 sm:p-6">
            <SectionHeader
              number="03"
              title="Request Details"
              description="Specify the service being requested and provider information."
              icon={ClipboardCheck}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                label="Requested Service"
                required
                value={form.requestedService}
                error={errors.requestedService}
                onChange={(value) => updateField("requestedService", value)}
                placeholder="Enter requested service"
              />

              <SelectField
                label="Service Category"
                value={form.serviceCategory}
                onChange={(value) => updateField("serviceCategory", value)}
                options={[
                  "Diagnostic Imaging",
                  "Surgery",
                  "Medication",
                  "Therapy",
                  "Specialist Consultation",
                  "Laboratory",
                  "Other",
                ]}
                placeholder="Select category"
              />

              <Field
                label="Provider"
                value={form.provider}
                onChange={(value) => updateField("provider", value)}
                placeholder="Provider name"
              />

              <Field
                label="Facility"
                value={form.facility}
                onChange={(value) => updateField("facility", value)}
                placeholder="Facility name"
              />

              <SelectField
                label="Urgency"
                value={form.urgency}
                onChange={(value) => updateField("urgency", value)}
                options={["Routine", "Urgent", "Expedited"]}
              />

              <Field
                label="Requested Date"
                type="date"
                value={form.requestedDate}
                onChange={(value) => updateField("requestedDate", value)}
              />
            </div>
          </section>

          <section className="p-5 sm:p-6">
            <SectionHeader
              number="04"
              title="Clinical Notes"
              description="Add supporting documentation and medical justification."
              icon={FileText}
            />

            <div>
              <label
                htmlFor="clinical-notes"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Clinical Notes <span className="text-danger">*</span>
              </label>

              <textarea
                id="clinical-notes"
                value={form.clinicalNotes}
                onChange={(event) =>
                  updateField("clinicalNotes", event.target.value)
                }
                aria-invalid={Boolean(errors.clinicalNotes)}
                aria-describedby={
                  errors.clinicalNotes ? "clinical-notes-error" : undefined
                }
                rows={7}
                placeholder="Enter relevant clinical documentation, medical history, previous treatment details, and justification for the requested service..."
                className={`w-full resize-y rounded-xl border px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 focus:ring-primary/25 ${
                  errors.clinicalNotes
                    ? "border-danger focus:border-danger"
                    : "border-border focus:border-primary"
                }`}
              />

              <div className="mt-2 flex items-center justify-between gap-4">
                {errors.clinicalNotes ? (
                  <p
                    id="clinical-notes-error"
                    className="text-xs font-medium text-danger"
                  >
                    {errors.clinicalNotes}
                  </p>
                ) : (
                  <span className="text-xs text-text-muted">
                    Required for clinical evaluation
                  </span>
                )}

                <span className="ml-auto shrink-0 text-xs text-text-muted">
                  {characterCount} characters
                </span>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-border bg-surface-secondary/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-h-5">
              {saved && (
                <div className="flex items-center gap-2 text-sm font-medium text-success">
                  <CheckCircle2 size={16} />
                  Draft saved successfully.
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isEvaluating}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:border-primary/50 hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Save size={17} />
                Save Draft
              </button>

              <button
                type="submit"
                disabled={isEvaluating}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <ClipboardCheck size={17} />
                    Evaluate Request
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <aside className="h-fit xl:sticky xl:top-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="border-b border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-text-primary">
                    Request Summary
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    Live request overview
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ClipboardCheck size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-0 p-2">
              <SummaryRow label="Patient" value={summary.patient} />
              <SummaryRow label="Diagnosis" value={summary.diagnosis} />
              <SummaryRow
                label="Requested Service"
                value={summary.requestedService}
              />
              <SummaryRow label="Insurance" value={summary.insurance} />
              <SummaryRow label="Urgency" value={summary.urgency} />
            </div>

            <div className="m-4 rounded-xl border border-success/20 bg-success-bg p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 size={15} />
                </div>

                <div>
                  <p className="text-xs font-medium text-text-secondary">
                    Status
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-success">
                    Ready for Evaluation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionHeader({ number, title, description, icon: Icon }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold tracking-widest text-primary">
            {number}
          </span>
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
        </div>

        <p className="mt-1 text-xs leading-5 text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  min,
  max,
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-text-primary"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <div className="relative">
        {type === "date" && (
          <Calendar
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
        )}

        <input
          id={id}
          type={type}
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`min-h-11 w-full rounded-xl border bg-surface-secondary px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 focus:ring-primary/25 ${
            type === "date" ? "pl-10" : ""
          } ${
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-primary"
          }`}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  required = false,
  value,
  onChange,
  error,
  options,
  placeholder = "Select an option",
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-text-primary"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-11 w-full cursor-pointer rounded-xl border bg-surface-secondary px-4 text-sm text-text-primary outline-none transition focus:ring-2 focus:ring-primary/25 ${
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-primary"
        }`}
      >
        {placeholder && (
          <option value="" className="bg-surface text-text-primary">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-surface text-text-primary"
          >
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="rounded-xl px-3 py-3 transition hover:bg-surface-secondary">
      <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p
        className={`mt-1 truncate text-sm font-semibold ${
          value === "Not provided" ? "text-text-muted" : "text-text-primary"
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

export default NewAuthorization;