export default function StatCard({ label, value, accentClass = 'text-text-primary' }) {
  return (
    <div className="flex-1 bg-surface border border-border rounded-xl p-5 shadow-card">
      <div className="text-xs text-text-secondary mb-2">{label}</div>
      <div className={`text-2xl font-bold ${accentClass}`}>{value}</div>
    </div>
  );
}