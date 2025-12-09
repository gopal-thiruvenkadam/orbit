import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';

// Sample data for dropdowns
const phases = [
  { id: 1, name: 'Building Phase' },
  { id: 2, name: 'QA' },
  { id: 3, name: 'UAT' },
  { id: 4, name: 'SQA/SQCT' },
  { id: 5, name: 'Environment Record' },
];

const deliverableTypes = [
  { id: 1, name: 'Document' },
  { id: 2, name: 'Test Plan' },
  { id: 3, name: 'Specification' },
  { id: 4, name: 'Report' },
];

const NewDeliverable: React.FC = () => {
  const navigate = useNavigate();
  const [phaseId, setPhaseId] = useState<string>('');
  const [deliverableName, setDeliverableName] = useState<string>('');
  const [deliverableType, setDeliverableType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handlePhaseChange = (event: SelectChangeEvent) => {
    setPhaseId(event.target.value);
  };

  const handleDeliverableTypeChange = (event: SelectChangeEvent) => {
    setDeliverableType(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would submit to an API
    console.log({
      phaseId,
      deliverableName,
      deliverableType,
      description,
      fileName
    });
    
    setSubmitted(true);
    
    // In a real app, you would navigate after successful API response
    setTimeout(() => {
      navigate('/quality');
    }, 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/quality')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Create New Deliverable
        </Typography>
      </Box>

      {submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Deliverable created successfully! Redirecting...
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="phase-label">Phase</InputLabel>
                <Select
                  labelId="phase-label"
                  value={phaseId}
                  label="Phase"
                  onChange={handlePhaseChange}
                >
                  {phases.map((phase) => (
                    <MenuItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="deliverable-type-label">Deliverable Type</InputLabel>
                <Select
                  labelId="deliverable-type-label"
                  value={deliverableType}
                  label="Deliverable Type"
                  onChange={handleDeliverableTypeChange}
                >
                  {deliverableTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Deliverable Name"
                value={deliverableName}
                onChange={(e) => setDeliverableName(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Upload Document
              </Typography>
              <Box sx={{ mb: 2 }}>
                <input
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  style={{ display: 'none' }}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<FileUploadIcon />}
                  >
                    Choose File
                  </Button>
                </label>
                {fileName && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {fileName}
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/quality')}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={submitted}
                >
                  Save Deliverable
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default NewDeliverable;
