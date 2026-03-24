import { useState } from 'react';
import { EPIC_COLORS } from '../constants/colors';

export default function AddEpicModal({ editItem, onClose, onSave, onDelete }) {
  const [name, setName] = useState(editItem ? editItem.name : '');
  const [color, setColor] = useState(editItem ? editItem.colorHex : EPIC_COLORS[0]);
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Epic name is required.'); return; }
    onSave(name.trim(), color);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="add-epic-modal">
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-tag">{editItem ? 'EDIT EPIC' : 'NEW EPIC'}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-subtitle">48H — Maximum Sprint Duration</p>
        <form onSubmit={submit} className="modal-form">
          <label className="field-label">EPIC NAME</label>
          <input
            autoFocus
            className={`field-input${err ? ' error' : ''}`}
            type="text"
            placeholder="e.g. Build MVP"
            value={name}
            id="epic-name-input"
            onChange={e => { setName(e.target.value); setErr(''); }}
          />
          {err && <span className="field-error">{err}</span>}

          <label className="field-label field-mt">COLOUR</label>
          <div className="color-swatches">
            {EPIC_COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`swatch${color === c ? ' selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={!name.trim()}
            id="add-epic-submit"
          >
            {editItem ? 'SAVE CHANGES' : 'ADD EPIC'}
          </button>
          {editItem && (
            <button
              type="button"
              className="btn-danger"
              onClick={onDelete}
              id="delete-epic-submit"
            >
              DELETE EPIC
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
