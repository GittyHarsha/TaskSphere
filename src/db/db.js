const DB_NAME = 'ProjectManagementDB';
const DB_VERSION = 1;
let db;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      if (!db.objectStoreNames.contains('projects')) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
        projectStore.createIndex('name', 'name', { unique: false });
      }

      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        taskStore.createIndex('projectId', 'projectId', { unique: false });
      }

      if (!db.objectStoreNames.contains('journals')) {
        const journalStore = db.createObjectStore('journals', { keyPath: 'id', autoIncrement: true });
        journalStore.createIndex('projectId', 'projectId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Error opening database:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
};

const dbWrapper = {
  getProjects: async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  addProject: async (project) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.add(project);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  updateProject: async (id, updatedProject) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.put({ id, ...updatedProject });

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  deleteProject: async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  getTasksByProjectId: async (projectId) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const index = store.index('projectId');
      const request = index.getAll(IDBKeyRange.only(projectId));

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  addTask: async (task) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.add(task);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  updateTask: async (id, updatedTask) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.put({ id, ...updatedTask });

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  deleteTask: async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  getJournalsByProjectId: async (projectId) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['journals'], 'readonly');
      const store = transaction.objectStore('journals');
      const index = store.index('projectId');
      const request = index.getAll(IDBKeyRange.only(projectId));

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  addJournal: async (journal) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['journals'], 'readwrite');
      const store = transaction.objectStore('journals');
      const request = store.add(journal);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  updateJournal: async (id, updatedJournal) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['journals'], 'readwrite');
      const store = transaction.objectStore('journals');
      const request = store.put({ id, ...updatedJournal });

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },

  deleteJournal: async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['journals'], 'readwrite');
      const store = transaction.objectStore('journals');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.errorCode);
    });
  },
};

const deleteAllTasksByProjectId = async (projectId) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');
    const index = store.index('projectId');
    const request = index.getAllKeys(IDBKeyRange.only(projectId));

    request.onsuccess = async (event) => {
      const keys = event.target.result;
      keys.forEach((key) => store.delete(key));
      transaction.oncomplete = () => resolve();
      transaction.onerror = (error) => reject(error);
    };

    request.onerror = (event) => reject(event.target.errorCode);
  });
};

dbWrapper.deleteAllTasksByProjectId = deleteAllTasksByProjectId;

export default dbWrapper;
