import { ReactNode, useEffect } from 'react';

/* ─── Button ─── */
type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
}
export function Button({ variant = 'primary', size = 'md', loading, children, disabled, style, ...rest }: BtnProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    borderRadius: 'var(--radius)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase',
    fontSize: size === 'sm' ? '.7rem' : '.78rem',
    padding: size === 'sm' ? '5px 12px' : '9px 20px',
    transition: 'var(--transition)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? .6 : 1,
  };
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: 'var(--maroon)', color: 'var(--sand-light)', border: '1px solid var(--maroon-dark)' },
    secondary: { background: 'transparent', color: 'var(--maroon)', border: '1px solid var(--maroon)' },
    danger: { background: 'var(--danger)', color: '#fff', border: '1px solid #7a1b1e' },
    ghost: { background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--sand-dark)' },
  };
  return (
    <button disabled={disabled || loading} style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {loading && <span style={{ width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />}
      {children}
    </button>
  );
}

/* ─── Spinner ─── */
export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{ width: size, height: size, border: '3px solid var(--sand-dark)', borderTopColor: 'var(--maroon)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    </div>
  );
}

/* ─── Badge ─── */
type BadgeColor = 'gold' | 'green' | 'red' | 'gray' | 'blue';
export function Badge({ color = 'gray', children }: { color?: BadgeColor; children: ReactNode }) {
  const colors: Record<BadgeColor, React.CSSProperties> = {
    gold: { background: '#fdf0d0', color: '#7a5a10', border: '1px solid var(--gold-light)' },
    green: { background: '#d8f3dc', color: '#1b4332', border: '1px solid #95d5b2' },
    red: { background: '#ffe5e5', color: '#7a1b1e', border: '1px solid #f5a3a5' },
    gray: { background: 'var(--sand)', color: 'var(--ink-soft)', border: '1px solid var(--sand-dark)' },
    blue: { background: '#dff3f7', color: '#14495e', border: '1px solid #90d4e2' },
  };
  return <span style={{ ...colors[color], borderRadius: 2, padding: '2px 8px', fontSize: '.68rem', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{children}</span>;
}

/* ─── Modal ─── */
interface ModalProps { title: string; onClose: () => void; children: ReactNode; width?: number; }
export function Modal({ title, onClose, children, width = 520 }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,17,8,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)', padding: '1rem' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="fade-in" style={{ background: 'var(--white)', border: '1px solid var(--sand-dark)', borderRadius: 6, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--sand)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--maroon)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1.3rem', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── FormField ─── */
interface FieldProps { label: string; error?: string; children: ReactNode; }
export function FormField({ label, error, children }: FieldProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '.72rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 5, fontWeight: 500 }}>{label}</label>
      {children}
      {error && <p style={{ color: 'var(--danger)', fontSize: '.72rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

/* ─── Input ─── */
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--sand-dark)', borderRadius: 'var(--radius)', background: 'var(--white)', color: 'var(--ink)', fontSize: '.875rem', outline: 'none', transition: 'var(--transition)' }} {...props} />
  );
}

/* ─── Select ─── */
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--sand-dark)', borderRadius: 'var(--radius)', background: 'var(--white)', color: 'var(--ink)', fontSize: '.875rem', outline: 'none', appearance: 'none', cursor: 'pointer' }} {...props} />
  );
}

/* ─── EmptyState ─── */
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>◈</div>
      <p style={{ fontSize: '.85rem', letterSpacing: '.05em' }}>{message}</p>
    </div>
  );
}

/* ─── ErrorMessage ─── */
export function ErrorMsg({ message }: { message: string }) {
  return (
    <div style={{ padding: '.75rem 1rem', background: '#ffe5e5', border: '1px solid #f5a3a5', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '.82rem', marginBottom: '1rem' }}>
      ⚠ {message}
    </div>
  );
}

/* ─── Table ─── */
export function Table({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>{children}</table>
    </div>
  );
}
export function Th({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th style={{ padding: '8px 12px', textAlign: align, fontSize: '.68rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500, borderBottom: '2px solid var(--sand-dark)', background: 'var(--sand)' }}>{children}</th>;
}
export function Td({ children, align = 'left', bold }: { children: ReactNode; align?: 'left' | 'right' | 'center'; bold?: boolean }) {
  return <td style={{ padding: '9px 12px', textAlign: align, borderBottom: '1px solid var(--sand)', fontWeight: bold ? 600 : 400 }}>{children}</td>;
}
