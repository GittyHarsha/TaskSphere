import React, { useEffect, useState, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Chip,
} from '@mui/material';
import { Alarm, Event } from '@mui/icons-material';
import db from '../db/db';

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllPendingTasks = useCallback(async () => {
    setLoading(true);
    try {
      const projects = await db.getProjects();
      const allTasks = [];

      for (const project of projects) {
        const projectTasks = await db.getTasksByProjectId(project.id);
        projectTasks.forEach((task) => {
          if (task.status !== 'Completed') {
            allTasks.push({ ...task, projectName: project.name });
          }
        });
      }

      const expandedTasks = expandRecurringTasks(allTasks);
      expandedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(expandedTasks);
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
    }
    setLoading(false);
  }, []);

  const expandRecurringTasks = (tasks) => {
    const expandedTasks = [];
    tasks.forEach((task) => {
      if (task.recurrence && task.recurrence.frequency !== 'None') {
        let currentDate = new Date(task.dueDate);
        const endDate = task.recurrence.endDate ? new Date(task.recurrence.endDate) : null;
        const interval = parseInt(task.recurrence.interval, 10) || 1;
        const frequency = task.recurrence.frequency;

        while (true) {
          const newTask = { ...task, dueDate: currentDate.toISOString().split('T')[0] };
          expandedTasks.push(newTask);

          if (frequency === 'Daily') {
            currentDate.setDate(currentDate.getDate() + interval);
          } else if (frequency === 'Weekly') {
            currentDate.setDate(currentDate.getDate() + 7 * interval);
          } else {
            currentDate.setDate(currentDate.getDate() + interval);
          }

          if (endDate && currentDate > endDate) {
            break;
          }

          if (!endDate && expandedTasks.length > 100) {
            console.warn('Recurring task expansion limit reached.');
            break;
          }
        }
      } else {
        expandedTasks.push(task);
      }
    });
    return expandedTasks;
  };

  const getDueDateColor = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    if (dueDate < today) return 'error.main';
    if (dueDate === today) return 'warning.main';
    if (dueDate === tomorrowDate) return 'info.main';
    return 'success.main';
  };

  useEffect(() => {
    fetchAllPendingTasks();
  }, [fetchAllPendingTasks]);

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h5" gutterBottom>
        Upcoming Pending Tasks
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography>No pending tasks.</Typography>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={`${task.id}-${task.dueDate}`}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div" color="text.primary">
                      {task.title}
                    </Typography>
                    <Chip label={task.projectName} color="primary" size="small" />
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Event style={{ marginRight: '8px', color: '#1976d2' }} />
                    <Typography
                      variant="body2"
                      color={getDueDateColor(task.dueDate)}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Due: {task.dueDate}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Alarm style={{ marginRight: '8px', color: '#ff5722' }} />
                    <Typography variant="body2" color="text.secondary">
                      Status: {task.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default UpcomingTasks;
