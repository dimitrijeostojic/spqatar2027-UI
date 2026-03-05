import React, { useState } from 'react'
import { Group } from '../types';
import { groupsApi } from '../api';
import { Button, ErrorMsg, Modal } from './common';

const DeleteGroupModal = ({ group, onClose, onDeleted }: { group: Group; onClose: () => void; onDeleted: () => void }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setLoading(true);
    try {
      await groupsApi.delete(group.publicId);
      onDeleted();
    } catch {
      setError('Greška pri brisanju.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Obriši grupu" onClose={onClose} width={400}>
      {error && <ErrorMsg message={error} />}
      <p style={{ marginBottom: '1.5rem', fontSize: '.9rem' }}>Obrisati grupu <strong>{group.groupName}</strong>?</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Otkaži</Button>
        <Button variant="danger" loading={loading} onClick={confirm}>Obriši</Button>
      </div>
    </Modal>
  );
}

export default DeleteGroupModal