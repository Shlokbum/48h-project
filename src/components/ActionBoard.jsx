import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskModal } from './AddTaskModal';

const STATUSES = ['TO_BE_PICKED', 'WIP', 'DONE'];

export function ActionBoard({ tasks, epics, onStatusChange, onAddTask }) {
  const [showModal, setShowModal] = useState(false);

  const getTasksForStatus = (status) => tasks.filter((t) => t.status === status);

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
            tasks={getTasksForStatus(status)}
            epics={epics}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <button
        className="fab"
        onClick={() => setShowModal(true)}
        id="add-task-fab"
        aria-label="Add Task"
      >
        +
      </button>

      {showModal && (
        <AddTaskModal
          epics={epics}
          onClose={() => setShowModal(false)}
          onAdd={onAddTask}
        />
      )}
    </div>
  );
}
