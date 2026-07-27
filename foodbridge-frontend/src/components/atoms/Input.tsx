interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '6px',
            color: 'var(--ink-soft)',
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          border: error ? '1px solid var(--red-soft)' : '1px solid var(--line)',
          backgroundColor: 'var(--white)',
          color: 'var(--ink)',
          outline: 'none',
        }}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--red-soft)', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
};
