import { useState } from 'react';
import { EpicCard } from './EpicCard';
import { AddEpicModal } from './AddEpicModal';

export default function BrainDump({ epics, tasks, onAddEpic, onUpdateEpic, onDeleteEpic }) {
  const [editingEpic, setEditingEpic] = useState(null);

  const getTaskCount = (epicId) => {
    return tasks.filter((t) => t.epicId === epicId).length;
  };

  const getDoneTaskCount = (epicId) => {
    return tasks.filter((t) => t.epicId === epicId && t.status === 'DONE').length;
  };

  return (
    <div className="view" id="brain-dump-view">
      <div className="view-header">
        <h1 className="view-title">EPICS</h1>
        <span className="view-count">{epics.length} epics</span>
      </div>

      {epics.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">NO EPICS YET</p>
          <p className="empty-state__sub">
            Add your first epic to start organising work into themes.
          </p>
        </div>
      )}

      <div className="epic-list">
        {epics.map((epic) => (
          <EpicCard
            key={epic.id}
            epic={epic}
            taskCount={getTaskCount(epic.id)}
            doneTasks={getDoneTaskCount(epic.id)}
            onClick={setEditingEpic}
          />
        ))}
      </div>

      <button
        className="fab"
        onClick={() => setEditingEpic('new')}
        id="add-epic-fab"
        aria-label="Add Epic"
      >
        +
      </button>

      {editingEpic && (
        <AddEpicModal
          editItem={editingEpic !== 'new' ? editingEpic : null}
          onClose={() => setEditingEpic(null)}
          onSave={(name, colorHex) => {
            if (editingEpic === 'new') onAddEpic(name, colorHex);
            else onUpdateEpic(editingEpic.id, name, colorHex);
          }}
          onDelete={editingEpic !== 'new' ? () => { onDeleteEpic(editingEpic.id); setEditingEpic(null); } : null}
        />
      )}
    </div>
  );
}
