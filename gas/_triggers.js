function refreshAll() {
  const task = TaskManager.runNewTask();

  try {
    TaskManager.ensureNotCancelled(task);
    Refreshers.refreshAll(task);

    TaskManager.ensureNotCancelled(task);
    Statistics.refresh(task);
  } catch (e) {
    if (e.toString().includes('Task was cancelled.')) {
      return;
    }

    throw e;
  }
}

function copyAll() {
  Copiers.copyAll();
  refreshAll();
}