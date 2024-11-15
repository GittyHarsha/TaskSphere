import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from '@mui/material';
import db from '../db/db';

const TaskForm = ({ open, onClose, task, projectId }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('Normal');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [recurrenceFrequency, setRecurrenceFrequency] = useState('None');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || '');
      setTaskDescription(task.description || '');
      setTaskDueDate(task.dueDate || '');
      setTaskPriority(task.priority || 'Normal');
      setTaskStatus(task.status || 'Pending');
      setRecurrenceFrequency(task.recurrence?.frequency || 'None');
      setRecurrenceInterval(task.recurrence?.interval || 1);
      setRecurrenceEndDate(task.recurrence?.endDate || '');
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setTaskPriority('Normal');
    setTaskStatus('Pending');
    setRecurrenceFrequency('None');
    setRecurrenceInterval(1);
    setRecurrenceEndDate('');
  };

  const handleSave = async () => {
    if (!taskTitle || !taskDueDate) {
      setSnackbar({ open: true, message: 'Title and due date are required.', severity: 'warning' });
      return;
    }

    const taskData = {
      projectId,
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      dueDate: taskDueDate,
      priority: taskPriority,
      status: taskStatus,
      recurrence: {
        frequency: recurrenceFrequency,
        interval: recurrenceFrequency === 'Custom' ? parseInt(recurrenceInterval, 10) : 1,
        endDate: recurrenceFrequency !== 'None' ? recurrenceEndDate || null : null,
      },
    };

    try {
      if (task?.id) {
        await db.updateTask(task.id, taskData);
      } else {
        await db.addTask(taskData);
      }
      onClose();
      setSnackbar({ open: true, message: 'Task saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving task:', error);
      setSnackbar({ open: true, message: 'Failed to save task.', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Task Description"
            multiline
            minRows={3}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Due Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
          <TextField
            margin="normal"
            select
            fullWidth
            label="Priority"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            select
            fullWidth
            label="Status"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          {/* Recurrence Fields */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Recurrence</InputLabel>
            <Select
              value={recurrenceFrequency}
              onChange={(e) => setRecurrenceFrequency(e.target.value)}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {recurrenceFrequency === 'Custom' && (
            <TextField
              margin="normal"
              fullWidth
              label="Interval (Days)"
              type="number"
              value={recurrenceInterval}
              onChange={(e) => setRecurrenceInterval(e.target.value)}
            />
          )}
          {recurrenceFrequency !== 'None' && (
            <TextField
              margin="normal"
              fullWidth
              label="Recurrence End Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={recurrenceEndDate}
              onChange={(e) => setRecurrenceEndDate(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {task ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskForm;
