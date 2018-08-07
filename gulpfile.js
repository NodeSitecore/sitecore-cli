const tasks = require('require-dir')('./tasks/gulp');
const loadTasks = require('./tasks/gulp/utils/loadTasks');

loadTasks(tasks);
