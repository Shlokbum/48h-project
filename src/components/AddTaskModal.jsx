import { useState } from 'react';

export default function AddTaskModal({ epics, editItem, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(editItem ? editItem.title : '');
  const [dod, setDod] = useState(editItem ? editItem.definitionOfDone : '');
  const [epicId, setEpicId] = useState(editItem ? editItem.epicId : (epics.length > 0 ? epics[0].id : ''));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Task title is required.';
    if (!dod.trim()) errs.dod = 'Definition of Done is mandatory.';
    if (!epicId) errs.epic = 'Please select an epic.';
    return errs;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave(epicId, title.trim(), dod.trim());
    onClose();
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="add-task-modal">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-tag">{editItem ? 'EDIT TASK' : 'NEW TASK'}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-subtitle">Tasks without concrete DoD will be flagged for review.</p>

        <form onSubmit={submit} className="modal-form">
          <label className="field-label">TASK TITLE</label>
          <input
            autoFocus
            className={`field-input${errors.title ? ' error' : ''}`}
            type="text"
            placeholder="e.g. Refactor state hydration"
            value={title}
            id="task-title-input"
            onChange={e => { setTitle(e.target.value); clearError('title'); }}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}

          <label className="field-label field-mt">DEFINITION OF DONE</label>
          <textarea
            className={`field-input${errors.dod ? ' error' : ''}`}
            placeholder="e.g. Zero latency re-render, unit tests passing"
            value={dod}
            rows={3}
            id="task-dod-input"
            onChange={e => { setDod(e.target.value); clearError('dod'); }}
          />
          {errors.dod && <span className="field-error">{errors.dod}</span>}

          <label className="field-label field-mt">EPIC</label>
          {epics.length === 0 ? (
            <p className="field-error">No epics yet — add an epic first from Brain Dump.</p>
          ) : (
            <select
              className={`field-input${errors.epic ? ' error' : ''}`}
              value={epicId}
              id="task-epic-select"
              onChange={e => { setEpicId(e.target.value); clearError('epic'); }}
            >
              <option value="" disabled>Select an epic...</option>
              {epics.map((ep) => (
                <option key={ep.id} value={ep.id}>{ep.name}</option>
              ))}
            </select>
          )}
          {errors.epic && <span className="field-error">{errors.epic}</span>}

          <button
            type="submit"
            className="btn-primary"
            disabled={epics.length === 0}
            id="add-task-submit"
          >
            {editItem ? 'SAVE CHANGES' : 'ADD TASK'}
          </button>
          {editItem && (
            <button
              type="button"
              className="btn-danger"
              onClick={onDelete}
              id="delete-task-submit"
            >
              DELETE TASK
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
