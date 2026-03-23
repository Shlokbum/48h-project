export function EpicCard({ epic, taskCount, onClick }) {
  return (
    <div className="epic-card" onClick={onClick} id={`epic-${epic.id}`}>
      <div className="epic-card__color-dot" style={{ backgroundColor: epic.colorHex }} />
      <div className="epic-card__content">
        <span className="epic-card__name">{epic.name}</span>
        <span className="epic-card__meta">EPIC</span>
      </div>
      <div className="epic-card__badge">
        <span className="epic-badge">{taskCount}</span>
        <span className="epic-badge-label">tasks</span>
      </div>
    </div>
  );
}
