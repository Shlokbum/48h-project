const STATUS_SEQUENCE = {
  TO_BE_PICKED: 'WIP',
  WIP: 'DONE',
  DONE: null,
};

const STATUS_LABEL = {
  TO_BE_PICKED: 'TO PICK',
  WIP: 'WIP',
  DONE: 'DONE',
};

export function TaskCard({ task, epic, onStatusChange }) {
  const nextStatus = STATUS_SEQUENCE[task.status];
  const isDone = task.status === 'DONE';

  return (
    <div className={`task-card ${isDone ? 'task-card--done' : ''}`} id={`task-${task.id}`}>
      <div className="task-card__header">
        {epic && (
          <span
            className="task-epic-dot"
            style={{ backgroundColor: epic.colorHex }}
            title={epic.name}
          />
        )}
        <span className="task-epic-name">{epic?.name ?? 'No Epic'}</span>
        <span className={`task-status-pill task-status-pill--${task.status.toLowerCase().replace('_', '-')}`}>
          {STATUS_LABEL[task.status]}
        </span>
      </div>

      <p className={`task-title ${isDone ? 'task-title--done' : ''}`}>{task.title}</p>

      <p className="task-dod">
        <span className="task-dod-label">DOD —</span> {task.definitionOfDone}
      </p>

      {task.dateStarted && (
        <p className="task-date">
          STARTED {new Date(task.dateStarted).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        </p>
      )}

      {nextStatus && (
        <button
          className="task-advance-btn"
          onClick={() => onStatusChange(task.id, nextStatus)}
          id={`advance-${task.id}`}
        >
          MOVE TO {STATUS_LABEL[nextStatus]} →
        </button>
      )}
    </div>
  );
}
