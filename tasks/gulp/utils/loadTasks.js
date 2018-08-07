/* eslint-disable no-shadow */
const gulp = require('gulp');

module.exports = (tasks) => {
  /**
   *
   * @param taskName
   * @param task
   * @returns {*}
   */
  const addTask = (taskName, task) => gulp.task(taskName, (cb) => {
    const r = task(gulp, cb);
    if (task.length <= 1 && !r) {
      cb();
    }

    return r;
  });
  /**
   *
   * @param tasks
   * @param parent
   */
  const loadTasks = (tasks, parent = '') => Object.keys(tasks).forEach((taskName) => {
    const current = tasks[taskName];
    if (typeof current === 'function') {
      addTask(parent + taskName, current);
    } else if (current instanceof Array) {
      gulp.task(parent + taskName, gulp.series(...current));
    } else {
      loadTasks(current, `${taskName}:`);
    }
  });

  return loadTasks(tasks);
};
