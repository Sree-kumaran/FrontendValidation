const statusStyles = {
  Approved: { bg: 'var(--color-success-bg)', text: 'var(--color-success)' },
  Pending: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)' },
  'More Info': { bg: 'var(--color-danger-bg)', text: 'var(--color-danger)' },
};

export default function RequestTable({ requests }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            {['Request ID', 'Patient', 'Service', 'Status'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => {
            const s = statusStyles[r.status];
            return (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{r.id}</td>
                <td style={{ padding: '14px 16px', color: 'var(--color-text-primary)' }}>{r.patientName}</td>
                <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)' }}>{r.service}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      background: s.bg,
                      color: s.text,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}