import { TaskCard } from './TaskCard';
import { WIP_LIMIT } from '../utils/store';

const COLUMN_META = {
  TO_BE_PICKED: { label: 'TO BE PICKED', shortLabel: 'TO PICK' },
  WIP: { label: 'IN PROGRESS', shortLabel: 'WIP' },
  DONE: { label: 'DONE', shortLabel: 'DONE' },
};

export function KanbanColumn({ status, tasks, epics, onStatusChange }) {
  const meta = COLUMN_META[status];
  const isFull = status === 'WIP' && tasks.length >= WIP_LIMIT;

  return (
    <div className={`kanban-col ${isFull ? 'kanban-col--full' : ''}`} id={`col-${status.toLowerCase()}`}>
      <div className="kanban-col__header">
        <span className="kanban-col__label">{meta.label}</span>
        <span className="kanban-col__count">
          {tasks.length}
          {status === 'WIP' && `/${WIP_LIMIT}`}
        </span>
        {isFull && <span className="kanban-full-badge">FULL</span>}
      </div>

      {tasks.length === 0 && (
        <div className="kanban-empty">
          <span>NO TASKS</span>
        </div>
      )}

      <div className="task-list">
        {tasks.map((task) => {
          const epic = epics.find((e) => e.id === task.epicId);
          return (
            <TaskCard
              key={task.id}
              task={task}
              epic={epic}
              onStatusChange={onStatusChange}
              onClick={onStatusChange.onEditTask}
            />
          );
        })}
      </div>
    </div>
  );
}
