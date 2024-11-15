import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import db from '../db/db';

const ProjectList = ({ selectedProjectId, setSelectedProjectId, projects, setProjects, fetchProjects }) => {
  const [openForm, setOpenForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, projectId: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projects.length) {
      setLoading(true);
      fetchProjects().finally(() => setLoading(false));
    }
  }, [projects.length, fetchProjects]);

  const handleAddProject = () => {
    setCurrentProject(null);
    setProjectName('');
    setProjectDescription('');
    setOpenForm(true);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setProjectName(project.name || '');
    setProjectDescription(project.description || '');
    setOpenForm(true);
  };

  const handleDeleteProject = (id) => {
    setConfirmDelete({ open: true, projectId: id });
  };

  const confirmDeleteProject = async () => {
    const { projectId } = confirmDelete;
    try {
      await db.deleteProject(projectId);
      fetchProjects();
      if (projectId === selectedProjectId) {
        setSelectedProjectId(null);
      }
      setSnackbar({ open: true, message: 'Project deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting project:', error);
      setSnackbar({ open: true, message: 'Failed to delete project.', severity: 'error' });
    }
    setConfirmDelete({ open: false, projectId: null });
  };

  const cancelDeleteProject = () => {
    setConfirmDelete({ open: false, projectId: null });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (projectName.trim() === '') {
      setSnackbar({ open: true, message: 'Project name is required.', severity: 'warning' });
      return;
    }

    const projectData = {
      name: projectName.trim(),
      description: projectDescription.trim(),
    };

    try {
      if (currentProject) {
        await db.updateProject(currentProject.id, projectData);
        setSnackbar({ open: true, message: 'Project updated successfully!', severity: 'success' });
      } else {
        const newProjectId = await db.addProject(projectData);
        setSelectedProjectId(newProjectId);
        setSnackbar({ open: true, message: 'Project added successfully!', severity: 'success' });
      }
      setOpenForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      setSnackbar({ open: true, message: 'Failed to save project.', severity: 'error' });
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Projects</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddProject}>
          Add Project
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Typography variant="body1">No projects available. Please add a new project.</Typography>
      ) : (
        <List>
          {projects.map((project) => {
            const isSelected = selectedProjectId === project.id;
            const iconColor = isSelected ? 'white' : 'inherit';

            return (
              <ListItem
                key={project.id}
                button
                selected={isSelected}
                onClick={() => {
                  setSelectedProjectId(project.id);
                }}
                sx={{
                  backgroundColor: isSelected ? 'primary.light' : 'inherit',
                  color: isSelected ? 'primary.contrastText' : 'inherit',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  borderRadius: 1,
                  mb: 1,
                }}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      sx={{ color: iconColor }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      sx={{ color: iconColor }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={project.name} secondary={project.description} />
              </ListItem>
            );
          })}
        </List>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Project Description"
              multiline
              minRows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              inputProps={{ maxLength: 500 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {currentProject ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={confirmDelete.open} onClose={cancelDeleteProject}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteProject} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProject} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default ProjectList;
