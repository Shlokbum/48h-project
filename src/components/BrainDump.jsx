import { useState } from 'react';
import { EpicCard } from './EpicCard';
import { AddEpicModal } from './AddEpicModal';

export function BrainDump({ epics, tasks, onAddEpic }) {
  const [showModal, setShowModal] = useState(false);

  const getTaskCount = (epicId) => tasks.filter((t) => t.epicId === epicId).length;

  return (
    <div className="view" id="brain-dump-view">
      <div className="view-header">
        <h1 className="view-title">EPICS</h1>
        <span className="view-count">{epics.length} epics</span>
      </div>

      {epics.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">NO EPICS YET</p>
          <p className="empty-state__sub">Add your first epic to start organising work into themes.</p>
        </div>
      )}

      <div className="epic-list">
        {epics.map((epic) => (
          <EpicCard
            key={epic.id}
            epic={epic}
            taskCount={getTaskCount(epic.id)}
          />
        ))}
      </div>

      <button
        className="fab"
        onClick={() => setShowModal(true)}
        id="add-epic-fab"
        aria-label="Add Epic"
      >
        +
      </button>

      {showModal && (
        <AddEpicModal
          onClose={() => setShowModal(false)}
          onAdd={onAddEpic}
        />
      )}
    </div>
  );
}
