import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createEpic, createTask, moveTaskStatus, WipLimitError } from './utils/store';
import { StatusTicker } from './components/StatusTicker';
import { BottomNav } from './components/BottomNav';
import { BrainDump } from './components/BrainDump';
import { ActionBoard } from './components/ActionBoard';
import { WipBlocker } from './components/WipBlocker';

export default function App() {
  const [epics, setEpics] = useLocalStorage('epics_48h', []);
  const [tasks, setTasks] = useLocalStorage('tasks_48h', []);
  const [activeTab, setActiveTab] = useState('brain-dump');
  const [wipBlocked, setWipBlocked] = useState(false);

  // --- Epic mutations ---
  const handleAddEpic = (name, colorHex) => {
    setEpics([...epics, createEpic(name, colorHex)]);
  };

  const handleUpdateEpic = (id, name, colorHex) => {
    setEpics(epics.map(e => e.id === id ? { ...e, name, colorHex } : e));
  };

  const handleDeleteEpic = (id) => {
    setEpics(epics.filter(e => e.id !== id));
    setTasks(tasks.filter(t => t.epicId !== id)); // Cascade delete tasks
  };

  // --- Task mutations ---
  const handleAddTask = (epicId, title, definitionOfDone) => {
    setTasks([...tasks, createTask(epicId, title, definitionOfDone)]);
  };

  const handleUpdateTask = (id, epicId, title, definitionOfDone) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, epicId, title, definitionOfDone } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleStatusChange = (taskId, newStatus) => {
    try {
      setTasks(moveTaskStatus(tasks, taskId, newStatus));
    } catch (error) {
      if (error.message === 'WIP_LIMIT_EXCEEDED') {
        setWipBlocked(true);
        setTimeout(() => setWipBlocked(false), 600);
      }
    }
  };

  return (
    <div className="app-root">
      <StatusTicker tasks={tasks} />

      <main className="main-content">
        {activeTab === 'brain-dump' && (
          <BrainDump
            epics={epics}
            tasks={tasks}
            onAddEpic={handleAddEpic}
            onUpdateEpic={handleUpdateEpic}
            onDeleteEpic={handleDeleteEpic}
          />
        )}
        {activeTab === 'action-board' && (
          <ActionBoard
            tasks={tasks}
            epics={epics}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      <WipBlocker visible={wipBlocked} />
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
