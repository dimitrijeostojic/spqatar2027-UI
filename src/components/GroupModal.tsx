import React, { useState } from 'react'
import { Group } from '../types/entities/entities';
import { groupsApi } from '../api';
import { Button, ErrorMsg, FormField, Input, Modal } from './common';

const GroupModal = ({ group, onClose, onSaved }: { group?: Group; onClose: () => void; onSaved: () => void }) => {

  const [name, setName] = useState(group?.groupName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Naziv grupe je obavezan.');
    setLoading(true);
    try {
      group ? await groupsApi.update(group.publicId, { publicId: group.publicId, name: name }) : await groupsApi.create({ groupName: name });
      onSaved();
    } catch {
      setError('Greška pri čuvanju.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={group ? 'Izmeni grupu' : 'Nova grupa'} onClose={onClose}>
      <form onSubmit={submit}>
        {error && <ErrorMsg message={error} />}
        <FormField label="Naziv grupe">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="npr. A" autoFocus />
        </FormField>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="ghost" onClick={onClose} type="button">Otkaži</Button>
          <Button loading={loading} type="submit">Sačuvaj</Button>
        </div>
      </form>
    </Modal>
  );
}

export default GroupModal