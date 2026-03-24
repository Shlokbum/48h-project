export default function EpicCard({ epic, taskCount, onClick }) {
  return (
    <div className="epic-card" role="button" tabIndex="0" id={`epic-${epic.id}`} onClick={() => onClick(epic)}>
      <div className="epic-color-dot" style={{ backgroundColor: epic.colorHex }} />
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
