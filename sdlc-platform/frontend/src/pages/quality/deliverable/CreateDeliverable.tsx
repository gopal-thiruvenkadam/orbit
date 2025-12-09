import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
const deliverableTypes = [
  { id: 1, name: 'Document' },
  { id: 2, name: 'Test Plan' },
  { id: 3, name: 'Specification' },
  { id: 4, name: 'Report' },
];

// Sample deliverable data - same as in ViewDeliverable
const sampleDeliverables = [
  {
    id: 1, 
    name: 'Design Inputs', 
    phase: 'Building Phase',
    phaseId: 1,
    typeId: 1,
    status: 'completed', 
    description: 'Comprehensive design input documentation for the project.',
    documentUrl: '/docs/design-inputs.pdf',
  },
  {
    id: 2, 
    name: 'Trace', 
    phase: 'Building Phase',
    phaseId: 1,
    typeId: 1,
    status: 'completed', 
    description: 'End-to-end traceability document for project requirements.',
    documentUrl: '/docs/trace-document.pdf',
  },
  {
    id: 3, 
    name: 'Architecture and Patterns Spec', 
    phase: 'QA',
    phaseId: 2,
    typeId: 3,
    status: 'completed', 
    description: 'Detailed architecture specification including design patterns used in the project.',
    documentUrl: '/docs/architecture-spec.pdf',
  },
  {
    id: 4, 
    name: 'Integration Document', 
    phase: 'QA',
    phaseId: 2,
    typeId: 1,
    status: 'in_progress', 
    description: 'Documentation of integration points and interfaces between system components.',
    documentUrl: '/docs/integration-doc.pdf',
  },
  {
    id: 5, 
    name: 'TTP', 
    phase: 'QA',
    phaseId: 2,
    typeId: 2,
    status: 'not_started', 
    description: 'Test plan template for quality assurance phase.',
    documentUrl: '',
  },
  {
    id: 6, 
    name: 'Acceptance Test Plan and Scripts', 
    phase: 'UAT',
    phaseId: 3,
    typeId: 2,
    status: 'not_started', 
    description: 'User acceptance testing plan and scripts.',
    documentUrl: '',
  },
  {
    id: 7, 
    name: 'Test Case', 
    phase: 'SQA/SQCT',
    phaseId: 4,
    typeId: 2,
    status: 'not_started', 
    description: 'SQA test cases.',
    documentUrl: '',
  },
  {
    id: 8, 
    name: 'Test Reports', 
    phase: 'SQA/SQCT',
    phaseId: 4,
    typeId: 4,
    status: 'not_started', 
    description: 'Test execution reports.',
    documentUrl: '',
  },
  {
    id: 9, 
    name: 'GXP', 
    phase: 'SQA/SQCT',
    phaseId: 4,
    typeId: 3,
    status: 'not_started', 
    description: 'Good practice (GxP) compliance documentation.',
    documentUrl: '',
  },
  {
    id: 10, 
    name: 'DVSRS', 
    phase: 'Environment Record',
    phaseId: 5,
    typeId: 3,
    status: 'not_started', 
    description: 'Development, Validation, and System Requirements Specification.',
    documentUrl: '',
  },
  {
    id: 11, 
    name: 'URS Records', 
    phase: 'Environment Record',
    phaseId: 5,
    typeId: 1,
    status: 'not_started', 
    description: 'User Requirement Specifications records.',
    documentUrl: '',
  }
];

const CreateDeliverable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deliverable, setDeliverable] = useState<any>(null);
  const [deliverableType, setDeliverableType] = useState<string>('');
  const [deliverableName, setDeliverableName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, you would fetch from an API
    const foundDeliverable = sampleDeliverables.find(
      (item) => item.id === Number(id)
    );
    
    if (foundDeliverable) {
      setDeliverable(foundDeliverable);
      setDeliverableType(String(foundDeliverable.typeId));
      setDeliverableName(foundDeliverable.name);
      setDescription(foundDeliverable.description);
    } else {
      // If no deliverable found, navigate to NotFound page
      navigate('/not-found');
    }
  }, [id, navigate]);

  const handleDeliverableTypeChange = (event: SelectChangeEvent) => {
    setDeliverableType(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would submit to an API
    console.log({
      id,
      deliverableName,
      deliverableType,
      description,
      fileName
    });
    
    setSubmitted(true);
    
    // In a real app, you would navigate after successful API response
    setTimeout(() => {
      navigate(`/quality/deliverable/${id}`);
    }, 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  if (!deliverable) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

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
          Create Deliverable: {deliverable.name}
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
              <TextField
                disabled
                fullWidth
                label="Phase"
                value={deliverable.phase}
              />
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
                  Create Deliverable
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateDeliverable;
