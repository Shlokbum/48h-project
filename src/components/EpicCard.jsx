export default function EpicCard({ epic, taskCount, doneTasks = 0, onClick }) {
  const progress = taskCount === 0 ? 0 : Math.round((doneTasks / taskCount) * 10) * 10;
  return (
    <div className="epic-card" role="button" tabIndex="0" id={`epic-${epic.id}`} onClick={() => onClick(epic)} style={{ borderLeftColor: epic.colorHex }}>
      <div className="epic-card__content">
        <span className="epic-card__name">{epic.name}</span>
        <div className="epic-progress-track">
          <div
            className="epic-progress-fill"
            style={{ width: `${progress}%`, background: epic.colorHex }}
          />
        </div>
      </div>
      <div className="epic-card__badge">
        <span className="epic-badge">{taskCount}</span>
        <span className="epic-badge-label">tasks</span>
      </div>
    </div>
  );
}
