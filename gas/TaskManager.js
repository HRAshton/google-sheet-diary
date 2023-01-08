class TaskManager {
  static runNewTask() {
    const taskId = Math.trunc(Math.random() * 10e+9).toString();

    Logger.log('Regitering new task #' + taskId);
    PropertiesService.getDocumentProperties().setProperty('current_task_id', taskId);

    return { taskId }
  }

  static ensureNotCancelled(task) {
    const currentTaskId = PropertiesService.getDocumentProperties().getProperty('current_task_id');
    const cancelled = currentTaskId !== task.taskId;
    if (cancelled) {
      Logger.log('Cancelled by task #' + currentTaskId);
      throw new Error('Task was cancelled.');
    }
  }
}