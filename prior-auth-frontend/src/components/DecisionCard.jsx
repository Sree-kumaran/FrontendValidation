import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileWarning,
} from "lucide-react";

const OUTCOME_STYLES = {
  APPROVE: {
    color: "#22C55E",
    icon: CheckCircle2,
    label: "APPROVE",
  },

  "PEND FOR NURSE REVIEW": {
    color: "#F59E0B",
    icon: Clock3,
    label: "PEND FOR NURSE REVIEW",
  },

  "REQUEST MORE INFORMATION": {
    color: "#F43F5E",
    icon: FileWarning,
    label: "REQUEST MORE INFORMATION",
  },
};

function getConfidenceWidth(confidence) {
  if (confidence === "HIGH") return "95%";
  if (confidence === "MEDIUM") return "82%";
  return "68%";
}

export default function DecisionCard({
  decision,
  onTrace,
}) {
  const config =
    OUTCOME_STYLES[decision.outcome] ||
    OUTCOME_STYLES.APPROVE;

  const Icon = config.icon;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border bg-surface shadow-card"
      style={{
        borderColor: `${config.color}33`,
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-1"
        style={{ backgroundColor: config.color }}
      />

      <div className="px-5 py-9 text-center sm:px-8 sm:py-12">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: `${config.color}18`,
            color: config.color,
          }}
        >
          <Icon size={42} strokeWidth={2.2} />
        </div>

        <p
          className="mt-6 text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: config.color }}
        >
          Final Recommendation
        </p>

        <h2
          className="mx-auto mt-2 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl"
          style={{ color: config.color }}
        >
          {config.label}
        </h2>

        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-4 py-2">
          <span className="text-xs font-semibold text-text-secondary">
            Confidence:
          </span>

          <span className="text-xs font-bold text-text-primary">
            {decision.confidence}
          </span>
        </div>

        <div className="mx-auto mt-8 max-w-xl text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              Confidence
            </span>

            <span className="text-sm font-bold text-text-primary">
              {decision.confidencePercent}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: getConfidenceWidth(decision.confidence),
                backgroundColor: config.color,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onTrace}
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <AlertCircle size={17} />
          Why this decision?
        </button>
      </div>
    </section>
  );
}