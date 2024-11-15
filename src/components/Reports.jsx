import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from '@mui/material';
import { Task, CheckCircle, Pending, Book } from '@mui/icons-material';
import db from '../db/db';

const Reports = ({ selectedProjectId }) => {
  const [reportData, setReportData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      const [tasks, journals] = await Promise.all([
        db.getTasksByProjectId(selectedProjectId),
        db.getJournalsByProjectId(selectedProjectId),
      ]);

      const completedTasks = tasks.filter((task) => task.status === 'Completed');
      const pendingTasks = tasks.filter((task) => task.status !== 'Completed');

      setReportData([
        {
          label: 'Total Tasks',
          value: tasks.length,
          icon: <Task />,
          color: '#1E88E5',
        },
        {
          label: 'Completed Tasks',
          value: completedTasks.length,
          icon: <CheckCircle />,
          color: '#43A047',
        },
        {
          label: 'Pending Tasks',
          value: pendingTasks.length,
          icon: <Pending />,
          color: '#FB8C00',
        },
        {
          label: 'Total Journals',
          value: journals.length,
          icon: <Book />,
          color: '#8E24AA',
        },
      ]);
    } catch (error) {
      console.error('Error generating report:', error);
      setSnackbar({ open: true, message: 'Failed to generate report.', severity: 'error' });
    }
    setLoading(false);
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      generateReport();
    } else {
      setReportData([]);
    }
  }, [selectedProjectId, generateReport]);

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h5" align="center" gutterBottom>
          Project Reports
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {reportData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={3} style={{ borderLeft: `5px solid ${item.color}` }}>
                <CardHeader
                  avatar={
                    <Avatar style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </Avatar>
                  }
                  title={item.label}
                  titleTypographyProps={{
                    variant: 'h6',
                    style: { fontWeight: 'bold', color: item.color },
                  }}
                />
                <CardContent>
                  <Typography variant="h4" align="center" style={{ fontWeight: 'bold' }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports;
