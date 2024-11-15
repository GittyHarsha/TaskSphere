# TaskSphere

![image](https://github.com/user-attachments/assets/a809e229-12f2-4a0d-a120-0e566cf2d986)

![image](https://github.com/user-attachments/assets/d6fe6682-2a81-4230-8931-440132677992)

![image](https://github.com/user-attachments/assets/c307ac28-a028-4d5a-a2a7-194fd541e498)

# Project Management Dashboard Chrome Extension

A feature-rich Project Management Dashboard designed to help you manage tasks, projects, journals, calendars, and reports effectively—all accessible as a Chrome Extension.

---

## 🔥 **Features**

- **Task Management**  
  - Create, edit, delete, and mark tasks as completed.
  - Supports task recurrence (daily, weekly, custom).
  - Prioritize tasks with Low, Normal, or High priority levels.

- **Project Management**  
  - Add, edit, delete, and view projects.
  - Highlight the currently selected project for better focus.

- **Journals and Reports**  
  - Maintain journals and generate insightful reports for each project.

- **Calendar Integration**  
  - Visualize tasks on a calendar view.

- **Upcoming Tasks Overview**  
  - Quickly view pending and upcoming tasks sorted by due date.

---

## 🚀 **How to Install**

1. **Clone or Download the Repository**
   - Clone the repository:
     ```bash
     git clone https://github.com/yourusername/project-management-dashboard.git
     ```
   - Or, download it as a ZIP file and extract it.

2. **Build the Extension**
   - Install dependencies:
     ```bash
     npm install
     ```
   - Build the project:
     ```bash
     npm run build
     ```
   - A `build` folder will be generated in the project root.

3. **Add to Chrome**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top right corner).
   - Click **Load unpacked** and select the `build` folder.

---

## 🛠️ **Usage Instructions**

1. **Launch the Dashboard**
   - Click on the extension icon in the Chrome toolbar.
   - The dashboard opens in a new tab.

2. **Add and Manage Projects**
   - Use the left sidebar to add, select, edit, or delete projects.
   - The selected project is highlighted.

3. **Task Management**
   - Switch to the "Tasks" tab to manage tasks for the selected project.
   - Click "Add Task" to create new tasks with priority, status, and recurrence options.

4. **Calendar View**
   - Switch to the "Calendar" tab to view tasks by due dates.

5. **Journals and Reports**
   - Use the respective tabs to manage journals and generate reports.

6. **Upcoming Tasks**
   - View all pending tasks across projects in the "Upcoming Tasks" tab.

---

## 🎨 **Customization**

You can customize the extension by modifying:

- **Icons:** Replace the default icons in the `public/icons` folder.
- **Theme:** Edit the theme configuration in `App.js`.
- **Styles:** Modify the CSS styles in `src/styles.css`.

---

## 🤝 **Contributing**

Contributions are welcome! If you find a bug or want to add a feature:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
