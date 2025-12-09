import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  Stack,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  RocketLaunch as RocketIcon,
  BugReport as BugIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// GraphQL
const GET_PROJECT = gql`
  query GetProject($id: String!) {
    project(id: $id) {
      id
      name
      description
      status
      progress
      startDate
      targetEndDate
      actualEndDate
      owner {
        id
        firstName
        lastName
        email
      }
      objective {
        id
        title
      }
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: String!, $name: String, $description: String, $status: ProjectStatus, $progress: Float, $startDate: DateTime, $targetEndDate: DateTime, $objectiveId: String) {
    updateProject(id: $id, name: $name, description: $description, status: $status, progress: $progress, startDate: $startDate, targetEndDate: $targetEndDate, objectiveId: $objectiveId) {
      id
      name
      description
      status
      progress
      startDate
      targetEndDate
      objective {
        id
        title
      }
    }
  }
`;

const GET_OBJECTIVES = gql`
  query GetObjectives {
    objectives {
      id
      title
    }
  }
`;

const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const { loading, error, data, refetch } = useQuery(GET_PROJECT, {
    variables: { id },
    skip: !id,
  });

  const { data: objectivesData } = useQuery(GET_OBJECTIVES);

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      setOpenEditDialog(false);
      refetch();
    }
  });

  if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>Error: {error.message}</Alert>;
  if (!data?.project) return <Alert severity="warning" sx={{ m: 4 }}>Project not found</Alert>;

  const project = data.project;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // In a real app, you might want to switch URL routes here instead of simple state
    // But for now, we can use state to show different content
  };

  const handleEditClick = () => {
    setEditForm({
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      targetEndDate: project.targetEndDate ? project.targetEndDate.split('T')[0] : '',
      objectiveId: project.objective?.id || '',
    });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = () => {
    updateProject({
      variables: {
        id: project.id,
        ...editForm,
        startDate: editForm.startDate ? new Date(editForm.startDate) : null,
        targetEndDate: editForm.targetEndDate ? new Date(editForm.targetEndDate) : null,
        progress: parseFloat(editForm.progress),
        objectiveId: editForm.objectiveId || null
      }
    });
  };

  const StatusChip = ({ status }: { status: string }) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    switch (status) {
      case 'completed': color = 'success'; break;
      case 'in_progress': color = 'primary'; break;
      case 'planning': color = 'info'; break;
      case 'on_hold': color = 'warning'; break;
      case 'cancelled': color = 'error'; break;
    }
    return <Chip label={status.replace('_', ' ').toUpperCase()} color={color} variant="filled" sx={{ borderRadius: 1, fontWeight: 600 }} />;
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')} sx={{ mb: 2 }}>
        Back to Projects
      </Button>

      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                {project.name}
              </Typography>
              <StatusChip status={project.status} />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
              {project.description}
            </Typography>
          </Box>
          <Box>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditClick} sx={{ mr: 1 }}>
              Edit
            </Button>
            {/* Delete typically goes here, but maybe guarded */}
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Overall Progress</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" fontWeight={600}>{project.progress}%</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Owner</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'Unassigned'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                  <CalendarIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Target Date</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {project.targetEndDate ? format(new Date(project.targetEndDate), 'MMM d, yyyy') : 'TBD'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                  <RocketIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Strategic Objective</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {project.objective ? project.objective.title : 'None Linked'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project tabs">
          <Tab label="Overview" />
          <Tab label="Requirements" icon={<AssignmentIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Test Cases" icon={<BugIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Deployments" icon={<RocketIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Jump to key management areas for this project.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<AssignmentIcon />} onClick={() => navigate('/requirements')}>
                  View Requirements
                </Button>
                <Button variant="outlined" startIcon={<BugIcon />} onClick={() => navigate('/test-cases')}>
                  View Test Cases
                </Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Team Members</Typography>
              <Typography variant="body2" color="text.secondary">
                No team members assigned yet.
              </Typography>
              <Button size="small" sx={{ mt: 1 }}>Manage Team</Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && <Box sx={{ p: 2 }}>Requirements List would go here. <Button onClick={() => navigate('/requirements')}>Go to Requirements</Button></Box>}
      {tabValue === 2 && <Box sx={{ p: 2 }}>Test Cases would go here. <Button onClick={() => navigate('/test-cases')}>Go to Test Cases</Button></Box>}
      {tabValue === 3 && <Box sx={{ p: 2 }}>Deployment History would go here. <Button onClick={() => navigate('/deployments')}>Go to Deployments</Button></Box>}

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <TextField
              select
              label="Status"
              fullWidth
              value={editForm.status || 'planning'}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            >
              {PROJECT_STATUSES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Progress (%)"
              type="number"
              fullWidth
              value={editForm.progress ?? 0}
              onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editForm.startDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Target End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editForm.targetEndDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, targetEndDate: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              select
              label="Strategic Objective"
              fullWidth
              value={editForm.objectiveId || ''}
              onChange={(e) => setEditForm({ ...editForm, objectiveId: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {objectivesData?.objectives.map((obj: any) => (
                <MenuItem key={obj.id} value={obj.id}>
                  {obj.title}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;
