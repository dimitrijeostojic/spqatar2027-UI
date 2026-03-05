import { useEffect, useState, useCallback } from 'react';
import { Team, Group } from '../types';
import { teamsApi, groupsApi } from '../api';
import { Spinner, ErrorMsg, Button, Table, Th, Td, EmptyState, Badge } from '../components/common';
import DeleteTeamModal from '../components/DeleteTeamModal';
import TeamModal from '../components/TeamModal';

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [deleteTeam, setDeleteTeam] = useState<Team | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, g] = await Promise.all([teamsApi.getAll(), groupsApi.getAll()]);
      setTeams(t);
      setGroups(g);
    } catch {
      setError('Greška pri učitavanju.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Grupiši timove po groupName koji dolazi direktno iz team objekta
  const byGroup: Record<string, Team[]> = {};
  for (const t of teams) {
    const key = (t as any).groupName ?? 'Bez grupe';
    if (!byGroup[key]) byGroup[key] = [];
    byGroup[key].push(t);
  }

  return (
    <div className="fade-in" style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--maroon)' }}>Timovi</h1>
          <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 4 }}>Evidencija nacionalnih selekcija</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Novi tim</Button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg message={error} />}
      {!loading && teams.length === 0 && <EmptyState message="Nema evidentiranih timova." />}

      {Object.entries(byGroup).sort(([a], [b]) => a.localeCompare(b)).map(([groupName, gt]) => (
        <div key={groupName} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '.75rem' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--maroon)' }}>Grupa {groupName}</h2>
            <Badge color="gray">{gt.length} tim(ova)</Badge>
          </div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--sand-dark)', borderRadius: 6, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <Table>
              <thead><tr><Th>Zastava</Th><Th>Država</Th><Th>Akcije</Th></tr></thead>
              <tbody>
                {gt.map(t => (
                  <tr key={t.publicId}>
                    <Td>
                      {(t.flagIcon ?? '').startsWith('http') ? (
                        <img src={t.flagIcon} alt={t.teamName} style={{ height: 20, borderRadius: 2 }} />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>{t.flagIcon || '🏳'}</span>
                      )}
                    </Td>
                    <Td>{t.teamName}</Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button variant="ghost" size="sm" onClick={() => setEditTeam(t)}>Izmeni</Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleteTeam(t)}>Obriši</Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      ))}

      {showCreate && <TeamModal groups={groups} onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); load(); }} />}
      {editTeam && <TeamModal team={editTeam} groups={groups} onClose={() => setEditTeam(null)} onSaved={() => { setEditTeam(null); load(); }} />}
      {deleteTeam && <DeleteTeamModal team={deleteTeam} onClose={() => setDeleteTeam(null)} onDeleted={() => { setDeleteTeam(null); load(); }} />}
    </div>
  );
}