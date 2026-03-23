import { useState } from 'react';
import { EPIC_COLORS } from '../constants/colors';

export function AddEpicModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(EPIC_COLORS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Epic name is required.');
      return;
    }
    onAdd(name.trim(), color);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="add-epic-modal">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-tag">NEW EPIC</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-subtitle">48H — Maximum Sprint Duration</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field-label">EPIC NAME</label>
          <input
            autoFocus
            className={`field-input ${error ? 'field-input--error' : ''}`}
            type="text"
            placeholder="e.g. Build MVP"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            id="epic-name-input"
          />
          {error && <span className="field-error">{error}</span>}

          <label className="field-label" style={{ marginTop: '1.5rem' }}>COLOUR</label>
          <div className="color-swatches">
            {EPIC_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch ${color === c ? 'swatch--selected' : ''}`}
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
            ADD EPIC
          </button>
        </form>
      </div>
    </div>
  );
}
