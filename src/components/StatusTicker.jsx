import { getWipCount, WIP_LIMIT } from '../utils/store';

export function StatusTicker({ tasks }) {
  const wipCount = getWipCount(tasks);
  const isFull = wipCount >= WIP_LIMIT;

  return (
    <div className="status-ticker">
      <span className="ticker-label">48H TRACKER</span>
      <span className={`ticker-wip ${isFull ? 'ticker-wip--full' : ''}`}>
        WIP {wipCount}/{WIP_LIMIT}
        {isFull && <span className="ticker-full-badge">FULL</span>}
      </span>
    </div>
  );
}
