import { getWipCount, WIP_LIMIT } from '../utils/store';

export default function StatusTicker({ tasks, isSyncing }) {
  const wipCount = tasks.filter(t => t.status === 'WIP').length;
  return (
    <header className="status-ticker">
      <div className="status-ticker__left">
        <span className="ticker-label">WIP LIMIT</span>
        <span className={`ticker-value${wipCount >= 2 ? ' critical' : ''}`}>{wipCount}/2</span>
      </div>
      <div className="status-ticker__right">
        {isSyncing ? (
          <span className="sync-status active">SYNCING...</span>
        ) : (
          <span className="sync-status">CLOUD SYNCED</span>
        )}
        <span className="ticker-time">48H</span>
      </div>
    </header>
  );
}
