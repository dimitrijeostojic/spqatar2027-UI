import React, { useState } from 'react'
import { Group, Team } from '../types';
import { teamsApi } from '../api';
import { Button, ErrorMsg, FormField, Input, Modal, Select } from './common';

const TeamModal = ({ team, groups, onClose, onSaved }: { team?: Team; groups: Group[]; onClose: () => void; onSaved: () => void }) => {

  const [name, setName] = useState(team?.teamName ?? '');
  const [flag, setFlag] = useState(team?.flagIcon ?? '');
  const [groupPublicId, setGroupPublicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Naziv tima je obavezan.');
    setLoading(true);
    try {
      if (team) {
        await teamsApi.update(team.publicId, { teamName: name, flagIcon: flag || undefined, groupPublicId: groupPublicId || undefined });
      } else {
        if (!groupPublicId) return setError('Molimo izaberite grupu.');
        await teamsApi.create({ teamName: name, flagIcon: flag || undefined, groupPublicId });
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Greška pri čuvanju.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={team ? 'Izmeni tim' : 'Novi tim'} onClose={onClose}>
      <form onSubmit={submit}>
        {error && <ErrorMsg message={error} />}
        <FormField label="Naziv države">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="npr. Srbija" autoFocus />
        </FormField>
        <FormField label="URL zastave ili emoji">
          <Input value={flag} onChange={e => setFlag(e.target.value)} placeholder="npr. https://flagcdn.com/w320/rs.png" />
        </FormField>
        <FormField label="Grupa">
          <Select value={groupPublicId} onChange={e => setGroupPublicId(e.target.value)}>
            <option value="">— Izaberite grupu —</option>
            {groups.map(g => <option key={g.publicId} value={g.publicId}>Grupa {g.groupName}</option>)}
          </Select>
        </FormField>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="ghost" onClick={onClose} type="button">Otkaži</Button>
          <Button loading={loading} type="submit">Sačuvaj</Button>
        </div>
      </form>
    </Modal>
  );
}

export default TeamModal