import store from 'store';

class Database {
  constructor() {
    if (!store.get('tasks')) {
      store.set('tasks', {});
    }
  }

  newProject(projectId, project) {
    const oldProjects = store.get('projects');
    store.set('projects', { ...oldProjects, [projectId]: project });
  }

  newTaks(projectId, tasks) {
    const allTasks = store.get('tasks');
    const currentTasks = allTasks[projectId] ? allTasks[projectId] : {}; 
    store.set('tasks', { ...allTasks, [projectId]: { ...currentTasks, tasks } });
  }
}

const db = new Database();
export default db;