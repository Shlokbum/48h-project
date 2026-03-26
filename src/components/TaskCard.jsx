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

// Assuming PILL_CLASS and STATUS_NEXT are defined elsewhere as per the provided snippet's context
// For the purpose of this edit, I will replace STATUS_SEQUENCE with STATUS_NEXT as implied.
const STATUS_NEXT = STATUS_SEQUENCE; // Placeholder, assuming STATUS_NEXT is equivalent to STATUS_SEQUENCE for now
const PILL_CLASS = { // Placeholder, as this was not provided in the original content
  TO_BE_PICKED: 'task-status-pill--to-be-picked',
  WIP: 'task-status-pill--wip',
  DONE: 'task-status-pill--done',
};


export default function TaskCard({ task, epic, onStatusChange, onClick }) {
  const next = STATUS_NEXT[task.status];
  const done = task.status === 'DONE';
  const wip = task.status === 'WIP';

  return (
    <div 
      className={`task-card${done ? ' done' : ''}${wip ? ' wip' : ''}`} 
      role="button" 
      tabIndex="0" 
      id={`task-${task.id}`} 
      onClick={() => onClick(task)}
      style={{ borderLeftColor: epic ? epic.colorHex : 'transparent' }}
    >
      <div className="task-card__header">
        <span className="task-epic-name" style={{ background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', letterSpacing: '0.08em', fontWeight: '600' }}>
          {epic?.name ?? 'No Epic'}
        </span>
        {task.status !== 'WIP' && (
          <span className={`task-status-pill ${PILL_CLASS[task.status]}`}>{STATUS_LABEL[task.status]}</span>
        )}
      </div>

      <p className={`task-title${done ? ' done' : ''}`}>{task.title}</p>

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

      {next && (
        <div
          role="button"
          tabIndex="0"
          className={`task-advance-btn${next === 'DONE' ? ' done-btn' : ''}${next === 'WIP' ? ' wip-btn' : ''}`}
          onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, next); }}
          id={`advance-${task.id}`}
        >
          MOVE TO {STATUS_LABEL[next]} →
        </div>
      )}
    </div>
  );
}
