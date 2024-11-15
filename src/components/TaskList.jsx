import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import db from '../db/db';
import TaskForm from './TaskForm';

const TaskList = ({ selectedProjectId }) => {
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks();
    }
  }, [selectedProjectId]);

  const fetchTasks = async () => {
    try {
      const projectTasks = await db.getTasksByProjectId(selectedProjectId);
      setTasks(projectTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = () => {
    setEditTask(null);
    setOpenForm(true);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setOpenForm(true);
  };

  const handleDeleteTask = async (id) => {
    try {
      await db.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await db.updateTask(task.id, { status: updatedStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    fetchTasks();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Tasks</Typography>
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </Box>

      {tasks.length === 0 ? (
        <Typography>No tasks available. Click "Add Task" to create one.</Typography>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                mb: 1,
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                </Box>

                <Chip
                  label={task.priority}
                  color={
                    task.priority === 'High'
                      ? 'error'
                      : task.priority === 'Normal'
                      ? 'warning'
                      : 'default'
                  }
                  size="small"
                />
              </Box>

              <Box sx={{ mt: 1 }}>
                <IconButton
                  onClick={() => handleToggleStatus(task)}
                  aria-label="toggle status"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {task.status === 'Completed' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </IconButton>

                <IconButton
                  onClick={() => handleEditTask(task)}
                  aria-label="edit task"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label="delete task"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {/* Task Form Dialog */}
      <Dialog open={openForm} onClose={handleFormClose} fullWidth maxWidth="sm">
        <DialogTitle>{editTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <TaskForm
            open={openForm}
            onClose={handleFormClose}
            task={editTask}
            projectId={selectedProjectId}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TaskList;
