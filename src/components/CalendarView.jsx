import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import db from '../db/db';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ selectedProjectId }) => {
  const [events, setEvents] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const tasks = await db.getTasksByProjectId(selectedProjectId);

      // Format tasks as calendar events
      const taskEvents = tasks.map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
        type: 'task',
      }));

      setEvents(taskEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSnackbar({ open: true, message: 'Failed to fetch events.', severity: 'error' });
    }
    setLoading(false);
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [selectedProjectId, fetchEvents]);

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#3174ad',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return { style };
  };

  if (!selectedProjectId) {
    return (
      <Typography variant="body1">Please select a project to view its calendar.</Typography>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Calendar View</Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => {
            console.log('Selected event:', event);
          }}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CalendarView;
