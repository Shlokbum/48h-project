import { useEffect } from 'react';

export function WipBlocker({ visible }) {
  useEffect(() => {
    if (visible) {
      document.body.classList.add('wip-flash');
      const t = setTimeout(() => document.body.classList.remove('wip-flash'), 600);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="wip-blocker" role="alert" aria-live="assertive">
      <div className="wip-blocker__inner">
        <span className="wip-blocker__title">WIP FULL</span>
        <span className="wip-blocker__subtitle">MAX 2 ACTIVE TASKS ALLOWED</span>
        <span className="wip-blocker__rule">FINISH OR DEPRIORITIZE BEFORE ADDING MORE</span>
      </div>
    </div>
  );
}
