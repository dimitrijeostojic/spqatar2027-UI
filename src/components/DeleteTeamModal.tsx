import React, { useState } from 'react'
import { Team } from '../types/entities/entities';
import { teamsApi } from '../api';
import { Button, ErrorMsg, Modal } from './common';

const DeleteTeamModal = ({ team, onClose, onDeleted }: { team: Team; onClose: () => void; onDeleted: () => void }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setLoading(true);
    try { await teamsApi.delete(team.publicId); onDeleted(); }
    catch (err: any) { setError(err.message || 'Greška pri brisanju.'); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="Obriši tim" onClose={onClose} width={400}>
      {error && <ErrorMsg message={error} />}
      <p style={{ marginBottom: '1.5rem' }}>Obrisati tim <strong>{team.teamName}</strong>?</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Otkaži</Button>
        <Button variant="danger" loading={loading} onClick={confirm}>Obriši</Button>
      </div>
    </Modal>
  );
}

export default DeleteTeamModal