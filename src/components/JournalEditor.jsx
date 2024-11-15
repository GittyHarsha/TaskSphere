import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import db from '../db/db';

const JournalEditor = ({ open, onClose, journalId, projectId, onSave }) => {
  const [journalDate, setJournalDate] = useState(() => {
    // Set default date to today's date in 'YYYY-MM-DD' format
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [journalContent, setJournalContent] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchJournal = useCallback(async () => {
    try {
      const journals = await db.getJournalsByProjectId(projectId);
      const journal = journals.find((j) => j.id === journalId);
      if (journal) {
        setJournalDate(journal.date);
        setJournalContent(journal.content);
      }
    } catch (error) {
      console.error('Error fetching journal:', error);
      setSnackbar({ open: true, message: 'Failed to fetch journal.', severity: 'error' });
    }
  }, [journalId, projectId]);

  useEffect(() => {
    if (journalId) {
      fetchJournal();
    } else {
      // Reset content but keep default date to today's date
      setJournalContent('');
    }
  }, [journalId, fetchJournal]);

  const handleSave = async () => {
    if (!journalDate || !journalContent) {
      setSnackbar({ open: true, message: 'Please fill in all fields.', severity: 'warning' });
      return;
    }

    const journalData = {
      projectId,
      date: journalDate,
      content: journalContent,
    };

    try {
      if (journalId) {
        await db.updateJournal(journalId, journalData);
      } else {
        await db.addJournal(journalData);
      }
      onSave();
      onClose();
      setSnackbar({ open: true, message: 'Journal saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving journal:', error);
      setSnackbar({ open: true, message: 'Failed to save journal.', severity: 'error' });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{journalId ? 'Edit Journal' : 'Add Journal'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Journal Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={journalDate}
            onChange={(e) => setJournalDate(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Journal Content"
            multiline
            minRows={5}
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            inputProps={{ maxLength: 2000 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {journalId ? 'Update' : 'Add'}
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
    </div>
  );
};

export default JournalEditor;
