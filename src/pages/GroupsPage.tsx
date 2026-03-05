import { useEffect, useState, useCallback } from 'react';
import { Group } from '../types';
import { groupsApi } from '../api';
import { Spinner, ErrorMsg, Button, EmptyState } from '../components/common';
import GroupCard from '../components/GroupCard';
import GroupModal from '../components/GroupModal';
import DeleteGroupModal from '../components/DeleteGroupModal';

interface StandingRow {
  teamPublicId: string;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  standingPoints: number;
}

export function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [standings, setStandings] = useState<Record<string, StandingRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const gs = await groupsApi.getAll();
      setGroups(gs);

      const results = await Promise.allSettled(gs.map(g => groupsApi.getStandings(g.publicId)));
      const map: Record<string, StandingRow[]> = {};
      results.forEach((r, i) => {
        map[gs[i].publicId] = r.status === 'fulfilled'
          ? (Array.isArray(r.value) ? r.value : (r.value as any).items ?? [])
          : [];
      });
      setStandings(map);
    } catch {
      setError('Greška pri učitavanju grupa.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fade-in" style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--maroon)' }}>Grupe</h1>
          <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 4 }}>Grupna faza — rang liste</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Nova grupa</Button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg message={error} />}
      {!loading && groups.length === 0 && <EmptyState message="Nema evidentiranih grupa." />}

      {groups.map(g => (
        <GroupCard
          key={g.publicId}
          group={g}
          standings={standings[g.publicId] ?? []}
          onEdit={() => setEditGroup(g)}
          onDelete={() => setDeleteGroup(g)}
        />
      ))}

      {showCreate && <GroupModal onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); load(); }} />}
      {editGroup && <GroupModal group={editGroup} onClose={() => setEditGroup(null)} onSaved={() => { setEditGroup(null); load(); }} />}
      {deleteGroup && <DeleteGroupModal group={deleteGroup} onClose={() => setDeleteGroup(null)} onDeleted={() => { setDeleteGroup(null); load(); }} />}
    </div>
  );
}