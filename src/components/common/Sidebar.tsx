import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/', label: 'Početna', icon: '◈' },
  { to: '/groups', label: 'Grupe', icon: '⊞' },
  { to: '/teams', label: 'Timovi', icon: '⬡' },
  { to: '/matches', label: 'Utakmice', icon: '◷' },
  { to: '/stadiums', label: 'Stadioni', icon: '⌂' },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--maroon-dark)',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid rgba(245,230,200,.1)' }}>
        <div style={{ fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 6 }}>FIBA</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--sand-light)', lineHeight: 1.1 }}>Qatar<br />2027</div>
        <div style={{ width: 32, height: 2, background: 'var(--gold)', marginTop: 8 }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 1.5rem',
            color: isActive ? 'var(--gold-light)' : 'rgba(245,230,200,.6)',
            background: isActive ? 'rgba(201,150,42,.15)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
            fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: isActive ? 500 : 400,
            transition: 'var(--transition)',
          })}>
            <span style={{ fontSize: '.95rem', width: 18 }}>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(245,230,200,.1)' }}>
        <button onClick={logout} style={{
          width: '100%', padding: '8px', background: 'transparent',
          border: '1px solid rgba(245,230,200,.2)', color: 'rgba(245,230,200,.5)',
          borderRadius: 'var(--radius)', fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase',
          cursor: 'pointer', transition: 'var(--transition)',
        }}>
          Odjava
        </button>
      </div>
    </aside>
  );
}
