import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Paper,
  Box,
  CssBaseline,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import JournalList from './components/JournalList';
import CalendarView from './components/CalendarView';
import Reports from './components/Reports';
import UpcomingTasks from './components/UpcomingTasks';
import db from './db/db';
import './styles.css';

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch projects from the database
  const fetchProjects = useCallback(async () => {
    try {
      const allProjects = await db.getProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Theme configuration
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#ff5722',
      },
      background: {
        default: '#ffffff',
        paper: '#f4f6f8',
      },
      text: {
        primary: '#000000',
        secondary: '#4f4f4f',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App Header */}
      <AppBar position="static" sx={{ height: 48, justifyContent: 'center' }}>
        <Toolbar sx={{ minHeight: 'auto', padding: '0 16px' }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500 }}>
            Project Management Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ marginTop: 1 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
              <ProjectList
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
                projects={projects}
                setProjects={setProjects}
                fetchProjects={fetchProjects}
              />
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                sx={{ marginBottom: 2 }}
              >
                <Tab label="Calendar" disabled={!selectedProjectId} />
                <Tab label="Tasks" disabled={!selectedProjectId} />
                <Tab label="Journals" disabled={!selectedProjectId} />
                <Tab label="Reports" disabled={!selectedProjectId} />
                <Tab label="Upcoming Tasks" />
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ marginTop: 2 }}>
                {activeTab === 0 && selectedProjectId ? (
                  <CalendarView selectedProjectId={selectedProjectId} />
                ) : activeTab === 1 && selectedProjectId ? (
                  <TaskList selectedProjectId={selectedProjectId} />
                ) : activeTab === 2 && selectedProjectId ? (
                  <JournalList selectedProjectId={selectedProjectId} />
                ) : activeTab === 3 && selectedProjectId ? (
                  <Reports selectedProjectId={selectedProjectId} />
                ) : activeTab === 4 ? (
                  <UpcomingTasks />
                ) : (
                  <Typography align="center" color="textSecondary">
                    {selectedProjectId
                      ? 'Select a tab to view its content.'
                      : 'Please select a project to view its details.'}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
