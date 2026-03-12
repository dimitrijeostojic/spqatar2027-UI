import React from 'react'
import { Badge, Button, Td } from './common';
import {  } from '../types/entities/entities';
import { ForfeitSide } from '../types/enums/enums';

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

function StatusBadge({ status }: { status: number }) {
    if (status === 2) return <Badge color="green">Completed</Badge>;
    if (status === 3) return <Badge color="red">Cancelled</Badge>;
    return <Badge color="blue">Scheduled</Badge>;
}

const MatchRow = ({ match, onResult, onForfeit }: { match: MatchDto; onResult: () => void; onForfeit: () => void }) => {
    const dt = new Date(match.startTime);
    const past = new Date() >= dt;
    return (
        <tr>
            <Td>
                <div style={{ fontSize: '.82rem' }}>{dt.toLocaleDateString('sr-RS')}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{dt.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}</div>
            </Td>
            <Td><span style={{ fontWeight: 500 }}>{match.homeTeam}</span></Td>
            <Td align="center">
                {match.homePoints !== undefined && match.awayPoints !== undefined
                    ? <strong style={{ fontSize: '1rem', letterSpacing: '.05em' }}>{match.homePoints} : {match.awayPoints}</strong>
                    : <span style={{ color: 'var(--muted)' }}>— : —</span>}
                {match.isForfeit && <div style={{ fontSize: '.65rem', color: 'var(--danger)', marginTop: 2 }}>predaja</div>}
            </Td>
            <Td><span style={{ fontWeight: 500 }}>{match.awayTeam}</span></Td>
            <Td><span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>{match.stadium}</span></Td>
            <Td align="center"><StatusBadge status={match.status} /></Td>
            <Td align="center">

                {match.status === 1 && (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <Button variant="secondary" size="sm" onClick={onResult} disabled={!past}>Rezultat</Button>
                        <Button variant="ghost" size="sm" onClick={onForfeit}>Predaja</Button>
                    </div>
                )}
            </Td>
        </tr>
    );
}

export default MatchRow