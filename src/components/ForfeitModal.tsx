import React, { useState } from 'react'
import {  } from '../types/entities/entities';
import { matchesApi } from '../api';
import { Button, ErrorMsg, FormField, Modal, Select } from './common';
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

const ForfeitModal = ({ match, onClose, onSaved }: { match: MatchDto; onClose: () => void; onSaved: () => void }) => {
    const [loser, setLoser] = useState<ForfeitSide>(0 as ForfeitSide);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async () => {
        setLoading(true);
        try {
            await matchesApi.forfeit(match.publicId, { forfeitLoser: loser });
            onSaved();
        } catch (err: any) {
            setError(err.message || 'Greška.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Predaja meča" onClose={onClose} width={400}>
            {error && <ErrorMsg message={error} />}
            <FormField label="Koji tim predaje meč?">
               <Select value={loser} onChange={e => setLoser(Number(e.target.value) as ForfeitSide)}>
  <option value={1}>{match.homeTeam} (domaćin)</option>
  <option value={2}>{match.awayTeam} (gost)</option>
</Select>
            </FormField>
            <div style={{ background: 'var(--sand)', border: '1px solid var(--sand-dark)', borderRadius: 4, padding: '.75rem 1rem', fontSize: '.78rem', color: 'var(--ink-soft)', marginBottom: '1rem' }}>
                Pobednik automatski dobija 20 poena, gubitnik 0 poena.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={onClose}>Otkaži</Button>
                <Button variant="danger" loading={loading} onClick={submit}>Potvrdi predaju</Button>
            </div>
        </Modal>
    );
}

export default ForfeitModal