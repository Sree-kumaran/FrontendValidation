import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import DecisionCard from "../components/DecisionCard";
import DecisionWorkflow from "../components/DecisionWorkflow";
import { decisionData } from "../data/mockDecision";

export default function Decision() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Policy Evaluation can pass evaluation data through router state.
   * We keep mock data as the fallback so /decision also works directly.
   */
  const evaluation = location.state?.evaluation;

  const decision = {
    ...decisionData,
    requestId:
      evaluation?.patient?.requestId ||
      evaluation?.requestId ||
      decisionData.requestId,
    patient:
      evaluation?.patient?.patient ||
      decisionData.patient,
    requestedService:
      evaluation?.patient?.requestedService ||
      decisionData.requestedService,
    policy:
      evaluation?.policy?.name ||
      decisionData.policy,
    policyVersion:
      evaluation?.policy?.version ||
      decisionData.policyVersion,
    rulesEvaluated:
      evaluation?.rules?.length ??
      decisionData.rulesEvaluated,
  };

  const handleTrace = () => {
    navigate("/decision-trace", {
      state: {
        decision,
        evaluation,
      },
    });
  };

  const handleNextAction = () => {
    // Mock frontend action only.
    console.log(
      `Mock action: ${decision.actionLabel}`
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* PAGE HEADER */}
      <header className="mb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                Authorization Decision
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
                Final recommendation based on clinical evidence and policy
                evaluation.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Request ID
            </p>

            <p className="mt-1 text-sm font-bold text-text-primary">
              {decision.requestId}
            </p>
          </div>
        </div>
      </header>

      {/* WORKFLOW */}
      <DecisionWorkflow />

      {/* REQUEST SUMMARY */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardCheck size={17} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-text-primary">
              Request Summary
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Authorization request reviewed by the policy engine
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          <SummaryItem
            label="Request ID"
            value={decision.requestId}
          />

          <SummaryItem
            label="Patient"
            value={decision.patient}
          />

          <SummaryItem
            label="Requested Service"
            value={decision.requestedService}
          />

          <SummaryItem
            label="Policy"
            value={decision.policy}
          />

          <SummaryItem
            label="Policy Version"
            value={decision.policyVersion}
          />
        </div>
      </section>

      {/* MAIN DECISION */}
      <div className="mx-auto w-full max-w-4xl">
        <DecisionCard
          decision={decision}
          onTrace={handleTrace}
        />

        {/* DECISION SUMMARY */}
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileCheck2 size={18} />
            </div>

            <div>
              <h2 className="text-base font-bold text-text-primary">
                Decision Summary
              </h2>

              <p className="mt-0.5 text-xs text-text-secondary">
                Reasoning based on the completed policy evaluation
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface-secondary p-4 sm:p-5">
            <p className="text-sm leading-7 text-text-primary">
              {decision.summary}
            </p>
          </div>
        </section>

        {/* EVALUATION SUMMARY */}
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-text-primary">
              Evaluation Summary
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              Results from the applicable authorization policy rules
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              label="Policy Rules Evaluated"
              value={decision.rulesEvaluated}
            />

            <ResultCard
              label="Rules Passed"
              value={decisionData.rulesPassed}
              positive
            />

            <ResultCard
              label="Rules Failed"
              value={decisionData.rulesFailed}
            />

            <ResultCard
              label="Information Missing"
              value={decisionData.informationMissing}
            />
          </div>
        </section>

        {/* RECOMMENDED ACTION */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-card">
          <div className="border-b border-primary/10 bg-primary/[0.04] px-5 py-5 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Next Step
            </p>

            <h2 className="mt-1 text-lg font-bold text-text-primary">
              Recommended Next Action
            </h2>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-sm leading-6 text-text-secondary">
              {decision.nextAction}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleNextAction}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface sm:w-auto"
              >
                {decision.actionLabel}
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={handleTrace}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
              >
                View Decision Trace
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="px-5 py-4 transition hover:bg-surface-secondary">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold leading-5 text-text-primary">
        {value}
      </p>
    </div>
  );
}

function ResultCard({ label, value, positive = false }) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary px-4 py-4 transition hover:border-primary/20">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
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