import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Book } from '@mui/icons-material';
import db from '../db/db';
import JournalEditor from './JournalEditor';

const JournalList = ({ selectedProjectId }) => {
  const [journals, setJournals] = useState([]);
  const [openEditor, setOpenEditor] = useState(false);
  const [currentJournalId, setCurrentJournalId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, journalId: null });
  const [loading, setLoading] = useState(false);

  const fetchJournals = useCallback(async () => {
    setLoading(true);
    try {
      const allJournals = await db.getJournalsByProjectId(selectedProjectId);
      setJournals(allJournals);
    } catch (error) {
      console.error('Error fetching journals:', error);
      setSnackbar({ open: true, message: 'Failed to fetch journals.', severity: 'error' });
    }
    setLoading(false);
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchJournals();
    } else {
      setJournals([]);
    }
  }, [selectedProjectId, fetchJournals]);

  const handleAddJournal = () => {
    setCurrentJournalId(null);
    setOpenEditor(true);
  };

  const handleEditJournal = (journalId) => {
    setCurrentJournalId(journalId);
    setOpenEditor(true);
  };

  const handleDeleteJournal = (id) => {
    setConfirmDelete({ open: true, journalId: id });
  };

  const confirmDeleteJournal = async () => {
    const { journalId } = confirmDelete;
    try {
      await db.deleteJournal(journalId);
      fetchJournals();
      setSnackbar({ open: true, message: 'Journal deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting journal:', error);
      setSnackbar({ open: true, message: 'Failed to delete journal.', severity: 'error' });
    }
    setConfirmDelete({ open: false, journalId: null });
  };

  const cancelDeleteJournal = () => {
    setConfirmDelete({ open: false, journalId: null });
  };

  const handleEditorClose = () => {
    setOpenEditor(false);
    setCurrentJournalId(null);
  };

  const handleEditorSave = () => {
    fetchJournals();
  };

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Journals
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddJournal}>
          Add Journal
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : journals.length === 0 ? (
        <Typography variant="body1">No journals available. Please add a new journal.</Typography>
      ) : (
        <Grid container spacing={3}>
          {journals.map((journal) => (
            <Grid item xs={12} sm={6} md={4} key={journal.id}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Book color="primary" style={{ marginRight: 8 }} />
                    <Typography variant="h6" noWrap>
                      {journal.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {journal.content.substring(0, 100) + (journal.content.length > 100 ? '...' : '')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditJournal(journal.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteJournal(journal.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <JournalEditor
        open={openEditor}
        onClose={handleEditorClose}
        journalId={currentJournalId}
        projectId={selectedProjectId}
        onSave={handleEditorSave}
      />

      <Dialog open={confirmDelete.open} onClose={cancelDeleteJournal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this journal? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteJournal} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteJournal} color="error" variant="contained">
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
    </Paper>
  );
};

export default JournalList;
