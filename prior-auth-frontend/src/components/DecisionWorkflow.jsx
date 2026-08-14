import { Check } from "lucide-react";

export default function DecisionWorkflow() {
  const steps = [
    {
      number: "1",
      label: "Request",
      status: "complete",
    },
    {
      number: "2",
      label: "AI Extraction",
      status: "complete",
    },
    {
      number: "3",
      label: "Policy Evaluation",
      status: "complete",
    },
    {
      number: "4",
      label: "Decision",
      status: "current",
    },
  ];

  return (
    <section
      aria-label="Authorization workflow"
      className="mb-7 rounded-2xl border border-border bg-surface px-5 py-4 shadow-card"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  step.status === "complete"
                    ? "border-primary bg-primary text-white"
                    : "border-primary bg-primary/10 text-primary ring-4 ring-primary/10"
                }`}
              >
                {step.status === "complete" ? (
                  <Check size={15} strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>

              <div className="min-w-0">
                <p
                  className={`truncate text-xs font-semibold ${
                    step.status === "current"
                      ? "text-primary"
                      : "text-text-primary"
                  }`}
                >
                  {step.label}
                </p>

                <p className="mt-0.5 text-[10px] text-text-muted">
                  {step.status === "current" ? "Current step" : "Complete"}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-4 hidden h-px flex-1 bg-border md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}