export function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-tab ${activeTab === 'brain-dump' ? 'nav-tab--active' : ''}`}
        onClick={() => onChange('brain-dump')}
        id="nav-brain-dump"
      >
        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
        </svg>
        <span className="nav-label">Brain Dump</span>
      </button>
      <button
        className={`nav-tab ${activeTab === 'action-board' ? 'nav-tab--active' : ''}`}
        onClick={() => onChange('action-board')}
        id="nav-action-board"
      >
        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
        <span className="nav-label">Action Board</span>
      </button>
    </nav>
  );
}
