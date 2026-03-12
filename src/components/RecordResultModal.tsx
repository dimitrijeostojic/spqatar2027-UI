import React, { useState } from 'react'
import {  } from '../types/entities/entities';
import { matchesApi } from '../api';
import { Button, ErrorMsg, FormField, Input, Modal } from './common';
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

const RecordResultModal = ({ match, onClose, onSaved }: { match: MatchDto; onClose: () => void; onSaved: () => void }) => {

    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hp = parseInt(home);
        const ap = parseInt(away);
        if (isNaN(hp) || isNaN(ap) || hp < 0 || ap < 0) return setError('Unesite validne poene.');
        setLoading(true);
        try {
            await matchesApi.recordResult(match.publicId, { homePoints: hp, awayPoints: ap });
            onSaved();
        } catch (err: any) {
            setError(err.message || 'Greška pri upisu rezultata.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Unesi rezultat" onClose={onClose} width={400}>
            <form onSubmit={submit}>
                {error && <ErrorMsg message={error} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: 8 }}>Domaćin</div>
                        <strong>{match.homeTeam}</strong>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>vs</span>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: 8 }}>Gost</div>
                        <strong>{match.awayTeam}</strong>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <FormField label="Poeni domaćina">
                        <Input type="number" min="0" value={home} onChange={e => setHome(e.target.value)} placeholder="0" />
                    </FormField>
                    <FormField label="Poeni gosta">
                        <Input type="number" min="0" value={away} onChange={e => setAway(e.target.value)} placeholder="0" />
                    </FormField>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button variant="ghost" onClick={onClose} type="button">Otkaži</Button>
                    <Button loading={loading} type="submit">Potvrdi rezultat</Button>
                </div>
            </form>
        </Modal>
    );
}

export default RecordResultModal