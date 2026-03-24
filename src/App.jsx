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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPass, setMasterPass] = useState(localStorage.getItem('48h_master_pass') || '');
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Cloud Sync ---
  const syncToCloud = async (currentEpics, currentTasks) => {
    if (!masterPass) return;
    setIsSyncing(true);
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': masterPass
        },
        body: JSON.stringify({ epics: currentEpics, tasks: currentTasks })
      });
    } catch (e) { console.error('Sync failed', e); }
    finally { setIsSyncing(false); }
  };

  const syncTimeout = useRef(null);
  useEffect(() => {
    if (!isAuthenticated) return;
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => {
      syncToCloud(epics, tasks);
    }, 1500);
  }, [epics, tasks]);

  const handleLogin = async (password) => {
    const res = await fetch('/api/sync', {
      headers: { 'Authorization': password }
    });
    if (res.ok) {
      const data = await res.json();
      setMasterPass(password);
      localStorage.setItem('48h_master_pass', password);
      
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
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid');
    }
  };

  useEffect(() => {
    if (masterPass) handleLogin(masterPass).catch(() => setMasterPass(''));
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="modal-overlay" style={{ zIndex: 100, backgroundColor: '#131313' }}>
        <div className="modal-sheet" style={{ maxWidth: '400px', transform: 'none' }}>
          <div className="modal-header">
            <span className="modal-tag">SECURE ACCESS</span>
          </div>
          <p className="modal-subtitle">48H Project — Restricted to Master User</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const pass = e.target.password.value;
            handleLogin(pass).catch(() => alert('Access Denied'));
          }} className="modal-form">
            <label className="field-label">MASTER PASSWORD</label>
            <input
              name="password"
              autoFocus
              type="password"
              className="field-input"
              placeholder="••••••••"
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }}>UNLOCK APP</button>
          </form>
        </div>
      </div>
    );
  }

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
