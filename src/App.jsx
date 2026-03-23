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

  // --- Task mutations ---
  const handleAddTask = (epicId, title, dod) => {
    setTasks([...tasks, createTask(epicId, title, dod)]);
  };

  const handleStatusChange = (taskId, newStatus) => {
    try {
      const updated = moveTaskStatus(tasks, taskId, newStatus);
      setTasks(updated);
    } catch (err) {
      if (err instanceof WipLimitError) {
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
          />
        )}
        {activeTab === 'action-board' && (
          <ActionBoard
            tasks={tasks}
            epics={epics}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTask}
          />
        )}
      </main>

      <WipBlocker visible={wipBlocked} />
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
