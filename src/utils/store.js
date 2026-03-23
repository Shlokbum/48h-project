export const WIP_LIMIT = 2;

export class WipLimitError extends Error {
  constructor() {
    super('WIP_LIMIT_EXCEEDED');
    this.name = 'WipLimitError';
  }
}

export function getWipCount(tasks) {
  return tasks.filter((t) => t.status === 'WIP').length;
}

export function canMoveToWip(tasks) {
  return getWipCount(tasks) < WIP_LIMIT;
}

export function createEpic(name, colorHex) {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    colorHex,
  };
}

export function createTask(epicId, title, definitionOfDone) {
  return {
    id: crypto.randomUUID(),
    epicId,
    title: title.trim(),
    definitionOfDone: definitionOfDone.trim(),
    status: 'TO_BE_PICKED',
    dateStarted: null,
  };
}

export function moveTaskStatus(tasks, taskId, newStatus) {
  if (newStatus === 'WIP' && !canMoveToWip(tasks)) {
    throw new WipLimitError();
  }
  return tasks.map((t) => {
    if (t.id !== taskId) return t;
    return {
      ...t,
      status: newStatus,
      dateStarted:
        newStatus === 'WIP' && !t.dateStarted
          ? new Date().toISOString()
          : t.dateStarted,
    };
  });
}
