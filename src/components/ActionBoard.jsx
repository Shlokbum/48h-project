```javascript
import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskModal } from './AddTaskModal';

const STATUSES = ['TO_BE_PICKED', 'WIP', 'DONE'];

export default function ActionBoard({ tasks, epics, onStatusChange, onAddTask, onUpdateTask, onDeleteTask }) {
  const [editingTask, setEditingTask] = useState(null);
  
  // We pass the edit click handler down via the onStatusChange object to avoid prop drilling through KanbanColumn
  onStatusChange.onEditTask = setEditingTask;

  return (
    <div className="view" id="action-board-view">
      <div className="view-header">
        <h1 className="view-title">ACTION BOARD</h1>
        <span className="view-count">{tasks.length} tasks</span>
      </div>

      <div className="kanban-board">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            epics={epics}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <button
        className="fab"
        onClick={() => setEditingTask('new')}
        id="add-task-fab"
        aria-label="Add Task"
      >
        +
      </button>

      {editingTask && (
        <AddTaskModal
          epics={epics}
          editItem={editingTask !== 'new' ? editingTask : null}
          onClose={() => setEditingTask(null)}
          onSave={(epicId, title, dod) => {
            if (editingTask === 'new') onAddTask(epicId, title, dod);
            else onUpdateTask(editingTask.id, epicId, title, dod);
          }}
          onDelete={editingTask !== 'new' ? () => { onDeleteTask(editingTask.id); setEditingTask(null); } : null}
        />
      )}
    </div>
  );
}
```
