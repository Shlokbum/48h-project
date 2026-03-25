import { useState, useEffect, useRef } from 'react';
import { createEpic, createTask, moveTaskStatus, WipLimitError } from './utils/store';
import { StatusTicker } from './components/StatusTicker';
import { BottomNav } from './components/BottomNav';
import { BrainDump } from './components/BrainDump';
import { ActionBoard } from './components/ActionBoard';
import { WipBlocker } from './components/WipBlocker';

export default function App() {
  const [activeTab, setActiveTab] = useState('brain-dump');
  const [epics, setEpics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [wipBlocked, setWipBlocked] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Cloud Sync ---
  const syncToCloud = async (currentEpics, currentTasks) => {
    setIsSyncing(true);
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epics: currentEpics, tasks: currentTasks })
      });
    } catch (e) { console.error('Sync failed', e); }
    finally { setIsSyncing(false); }
  };

  const syncTimeout = useRef(null);
  useEffect(() => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => {
      syncToCloud(epics, tasks);
    }, 1500);
  }, [epics, tasks]);

  const loadFromCloud = async () => {
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const data = await res.json();
        
        const localEpics = JSON.parse(localStorage.getItem('epics_48h') || '[]');
        const localTasks = JSON.parse(localStorage.getItem('tasks_48h') || '[]');
        
        if (data.epics.length === 0 && localEpics.length > 0) {
          setEpics(localEpics);
          setTasks(localTasks);
          await syncToCloud(localEpics, localTasks);
        } else {
          setEpics(data.epics);
          setTasks(data.tasks);
        }
      }
    } catch (e) { console.error('Initial load failed', e); }
  };

  useEffect(() => {
    loadFromCloud();
  }, []);

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
      <StatusTicker tasks={tasks} isSyncing={isSyncing} />

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
