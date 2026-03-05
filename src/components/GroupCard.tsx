import React from 'react'
import { Group } from '../types';
import { Button } from './common';
import StandingsTable from './StandingsTable';

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


const GroupCard = ({ group, standings, onEdit, onDelete }: {
  group: Group;
  standings: StandingRow[];
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--sand-dark)', borderRadius: 6, marginBottom: '1.5rem', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ padding: '1rem 1.25rem', background: 'var(--sand)', borderBottom: '1px solid var(--sand-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--maroon)' }}>Grupa {group.groupName}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={onEdit}>Izmeni</Button>
          <Button variant="danger" size="sm" onClick={onDelete}>Obriši</Button>
        </div>
      </div>
      <StandingsTable rows={standings} />
    </div>
  );
}

export default GroupCard