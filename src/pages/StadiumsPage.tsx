import { useEffect, useState } from 'react';
import { Stadium } from '../types';
import { stadiumsApi } from '../api';
import { Spinner, ErrorMsg, EmptyState, Badge } from '../components/common';

export function StadiumsPage() {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    stadiumsApi.getAll()
      .then(setStadiums)
      .catch(() => setError('Greška pri učitavanju stadiona.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in" style={{ padding: '2rem 2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--maroon)' }}>Stadioni</h1>
        <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 4 }}>Lokacije i kapaciteti</p>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg message={error} />}

      {!loading && stadiums.length === 0 && <EmptyState message="Nema evidentiranih stadiona." />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {stadiums.map((s, i) => (
          <div key={s.publicId} className="fade-in" style={{ animationDelay: `${i * 60}ms`, background: 'var(--white)', border: '1px solid var(--sand-dark)', borderRadius: 6, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ height: 5, background: `linear-gradient(90deg, var(--maroon) ${i * 12}%, var(--gold))` }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--ink)' }}>{s.stadiumName}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', width: 60 }}>Grad</span>
                  <Badge color="gray">📍 {s.city}</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', width: 60 }}>Kapacitet</span>
                  <Badge color="gold">⚡ {s.capacity.toLocaleString()} mesta</Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
