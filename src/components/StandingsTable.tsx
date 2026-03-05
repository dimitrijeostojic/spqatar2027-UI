import React from 'react'
import { Table, Td, Th } from './common';


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

const StandingsTable = ({ rows }: { rows: StandingRow[] }) => {
  if (rows.length === 0)
    return <div style={{ padding: '1rem 1.25rem', color: 'var(--muted)', fontSize: '.8rem' }}>Nema odigranih mečeva.</div>;
  return (
    <Table>
      <thead>
        <tr>
          <Th>#</Th><Th>Tim</Th>
          <Th align="center">OU</Th><Th align="center">P</Th>
          <Th align="center">N</Th><Th align="center">I</Th>
          <Th align="center">+/-</Th><Th align="center">Razlika</Th>
          <Th align="center">Bod.</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t, i) => (
          <tr key={t.teamPublicId} style={{ background: i === 0 ? 'rgba(201,150,42,.06)' : i === 1 ? 'rgba(201,150,42,.03)' : 'transparent' }}>
            <Td><span style={{ color: i < 2 ? 'var(--gold)' : 'var(--muted)', fontWeight: i < 2 ? 600 : 400 }}>{i + 1}</span></Td>
            <Td>{t.teamName}</Td>
            <Td align="center">{t.played}</Td>
            <Td align="center">{t.wins}</Td>
            <Td align="center">{t.draws}</Td>
            <Td align="center">{t.losses}</Td>
            <Td align="center">{t.pointsFor}:{t.pointsAgainst}</Td>
            <Td align="center">{t.pointsFor - t.pointsAgainst > 0 ? '+' : ''}{t.pointsFor - t.pointsAgainst}</Td>
            <Td align="center" bold>{t.standingPoints}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default StandingsTable