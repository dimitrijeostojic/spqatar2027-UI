import { useEffect, useState, useCallback } from 'react';
import { Team, Stadium, Group, ForfeitSide } from '../types';
import { matchesApi, teamsApi, stadiumsApi, groupsApi } from '../api';
import { Spinner, ErrorMsg, Button, Select, Table, Th, EmptyState } from '../components/common';
import MatchRow from '../components/MatchRow';
import ScheduleMatchModal from '../components/ScheduleMatchModal';
import RecordResultModal from '../components/RecordResultModal';
import ForfeitModal from '../components/ForfeitModal';

interface MatchDto {
  publicId: string;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  startTime: string;
  homePoints?: number;
  awayPoints?: number;
  isForfeit?: boolean;
  forfeitLoser?: ForfeitSide;
  status: number;
}

export function MatchesPage() {
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [resultMatch, setResultMatch] = useState<MatchDto | null>(null);
  const [forfeitMatch, setForfeitMatch] = useState<MatchDto | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, t, s, g] = await Promise.all([
        matchesApi.getAll({ groupPublicId: filterGroup || undefined, status: (filterStatus as any) || undefined }),
        teamsApi.getAll(),
        stadiumsApi.getAll(),
        groupsApi.getAll(),
      ]);
      setMatches(m as unknown as MatchDto[]);
      console.log('Match status:', (m as any)[0]?.status);
      setTeams(t);
      setStadiums(s);
      setGroups(g);
    } catch {
      setError('Greška pri učitavanju utakmica.');
    } finally {
      setLoading(false);
    }
  }, [filterGroup, filterStatus]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fade-in" style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--maroon)' }}>Utakmice</h1>
          <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 4 }}>Raspored i rezultati</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Zakaži utakmicu</Button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 180 }}>
          <Select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
            <option value="">Sve grupe</option>
            {groups.map(g => <option key={g.publicId} value={g.publicId}>Grupa {g.groupName}</option>)}
          </Select>
        </div>
        <div style={{ minWidth: 160 }}>
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Svi statusi</option>
            <option value="Scheduled">Zakazane</option>
            <option value="Completed">Završene</option>
            <option value="Cancelled">Otkazane</option>
          </Select>
        </div>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg message={error} />}
      {!loading && matches.length === 0 && <EmptyState message="Nema utakmica." />}

      {!loading && matches.length > 0 && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--sand-dark)', borderRadius: 6, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <Table>
            <thead>
              <tr>
                <Th>Datum i vreme</Th>
                <Th>Domaćin</Th>
                <Th align="center">Rezultat</Th>
                <Th>Gost</Th>
                <Th>Stadion</Th>
                <Th align="center">Status</Th>
                <Th align="center">Akcije</Th>
              </tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <MatchRow
                  key={m.publicId}
                  match={m}
                  onResult={() => setResultMatch(m)}
                  onForfeit={() => setForfeitMatch(m)}
                />
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {showCreate && (
        <ScheduleMatchModal teams={teams} stadiums={stadiums} groups={groups} onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); load(); }} />
      )}
      {resultMatch && (
        <RecordResultModal match={resultMatch} onClose={() => setResultMatch(null)} onSaved={() => { setResultMatch(null); load(); }} />
      )}
      {forfeitMatch && (
        <ForfeitModal match={forfeitMatch} onClose={() => setForfeitMatch(null)} onSaved={() => { setForfeitMatch(null); load(); }} />
      )}
    </div>
  );
}
