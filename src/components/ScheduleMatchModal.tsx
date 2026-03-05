import React, { useState } from 'react'
import { Group, Stadium, Team } from '../types';
import { matchesApi } from '../api';
import { Button, ErrorMsg, FormField, Input, Modal, Select } from './common';

const ScheduleMatchModal = ({ teams, stadiums, groups, onClose, onSaved }: {
    teams: Team[];
    stadiums: Stadium[];
    groups: Group[];
    onClose: () => void;
    onSaved: () => void
}) => {

    const [selectedGroup, setSelectedGroup] = useState('');
    const [homeId, setHomeId] = useState('');
    const [awayId, setAwayId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [stadiumId, setStadiumId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Filtriraj timove po izabranoj grupi
    const groupTeams = selectedGroup
        ? teams.filter((t: any) => t.groupName === groups.find(g => g.publicId === selectedGroup)?.groupName)
        : [];

    // Reset home/away kada se promijeni grupa
    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroup(e.target.value);
        setHomeId('');
        setAwayId('');
    };

    const submit = async (e: React.FormEvent) => {
        console.log('Create match payload:', {
            homeTeamPublicId: homeId,
            awayTeamPublicId: awayId,
            startTime: new Date(startTime).toISOString(),
            stadiumPublicId: stadiumId,
        });
        e.preventDefault();
        if (!selectedGroup || !homeId || !awayId || !startTime || !stadiumId) return setError('Sva polja su obavezna.');
        if (homeId === awayId) return setError('Domaćin i gost moraju biti različiti timovi.');
        setLoading(true);
        try {
            await matchesApi.create({
                homeTeamPublicId: homeId,
                awayTeamPublicId: awayId,
                startTime: new Date(startTime).toISOString(),
                stadiumPublicId: stadiumId,
            });
            onSaved();
        } catch (err: any) {
            setError(err.message || 'Greška pri zakazivanju.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Zakaži utakmicu" onClose={onClose}>
            <form onSubmit={submit}>
                {error && <ErrorMsg message={error} />}
                <FormField label="Grupa">
                    <Select value={selectedGroup} onChange={handleGroupChange}>
                        <option value="">— Izaberite grupu —</option>
                        {groups.map(g => <option key={g.publicId} value={g.publicId}>Grupa {g.groupName}</option>)}
                    </Select>
                </FormField>
                <FormField label="Domaćin">
                    <Select value={homeId} onChange={e => setHomeId(e.target.value)} disabled={!selectedGroup}>
                        <option value="">— Izaberite domaćina —</option>
                        {groupTeams.map(t => <option key={t.publicId} value={t.publicId}>{t.teamName}</option>)}
                    </Select>
                </FormField>
                <FormField label="Gost">
                    <Select value={awayId} onChange={e => setAwayId(e.target.value)} disabled={!selectedGroup}>
                        <option value="">— Izaberite gosta —</option>
                        {groupTeams.filter(t => t.publicId !== homeId).map(t => <option key={t.publicId} value={t.publicId}>{t.teamName}</option>)}
                    </Select>
                </FormField>
                <FormField label="Datum i vreme">
                    <Input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </FormField>
                <FormField label="Stadion">
                    <Select value={stadiumId} onChange={e => setStadiumId(e.target.value)}>
                        <option value="">— Izaberite stadion —</option>
                        {stadiums.map(s => <option key={s.publicId} value={s.publicId}>{s.stadiumName} ({s.city})</option>)}
                    </Select>
                </FormField>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button variant="ghost" onClick={onClose} type="button">Otkaži</Button>
                    <Button loading={loading} type="submit">Zakaži</Button>
                </div>
            </form>
        </Modal>
    );
}

export default ScheduleMatchModal