import { useState } from 'react';

export function AddTaskModal({ epics, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [dod, setDod] = useState('');
  const [epicId, setEpicId] = useState(epics[0]?.id ?? '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Task title is required.';
    if (!dod.trim()) errs.dod = 'Definition of Done is mandatory.';
    if (!epicId) errs.epicId = 'Select an epic.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd(epicId, title.trim(), dod.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="add-task-modal">
      <div className="modal-sheet modal-sheet--tall" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-tag">NEW TASK</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-subtitle">Tasks without concrete DoD will be flagged for review.</p>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field-label">TASK TITLE</label>
          <input
            autoFocus
            className={`field-input ${errors.title ? 'field-input--error' : ''}`}
            type="text"
            placeholder="e.g. Refactor state hydration"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({...p, title: ''})); }}
            id="task-title-input"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}

          <label className="field-label" style={{ marginTop: '1.25rem' }}>DEFINITION OF DONE</label>
          <textarea
            className={`field-input field-textarea ${errors.dod ? 'field-input--error' : ''}`}
            placeholder="e.g. Zero latency re-render, unit tests passing"
            value={dod}
            onChange={(e) => { setDod(e.target.value); setErrors((p) => ({...p, dod: ''})); }}
            rows={3}
            id="task-dod-input"
          />
          {errors.dod && <span className="field-error">{errors.dod}</span>}

          <label className="field-label" style={{ marginTop: '1.25rem' }}>EPIC</label>
          {epics.length === 0 ? (
            <p className="field-error">No epics yet — add an epic first from Brain Dump.</p>
          ) : (
            <select
              className={`field-input field-select ${errors.epicId ? 'field-input--error' : ''}`}
              value={epicId}
              onChange={(e) => { setEpicId(e.target.value); setErrors((p) => ({...p, epicId: ''})); }}
              id="task-epic-select"
            >
              {epics.map((ep) => (
                <option key={ep.id} value={ep.id}>{ep.name}</option>
              ))}
            </select>
          )}
          {errors.epicId && <span className="field-error">{errors.epicId}</span>}

          <button
            type="submit"
            className="btn-primary"
            disabled={epics.length === 0}
            id="add-task-submit"
          >
            ADD TASK
          </button>
        </form>
      </div>
    </div>
  );
}
