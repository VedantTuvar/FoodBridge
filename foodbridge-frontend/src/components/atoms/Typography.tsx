interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, children, className = '' }) => {
  const sizes: Record<number, string> = {
    1: '36px',
    2: '28px',
    3: '22px',
    4: '18px',
  };
  return (
    <div
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: sizes[level] || '24px',
        color: 'var(--ink)',
        fontWeight: 600,
        marginBottom: '12px',
      }}
    >
      {children}
    </div>
  );
};

interface TextProps {
  children: React.ReactNode;
  muted?: boolean;
  size?: string;
}

export const Text: React.FC<TextProps> = ({ children, muted = false, size = '16px' }) => {
  return (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: size,
        color: muted ? 'var(--ink-soft)' : 'var(--ink)',
        lineHeight: 1.65,
        marginBottom: '8px',
      }}
    >
      {children}
    </p>
  );
};
