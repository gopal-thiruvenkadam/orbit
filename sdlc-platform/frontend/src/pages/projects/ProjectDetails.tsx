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
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  RocketLaunch as RocketIcon,
  BugReport as BugIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  VerifiedUser as VerifiedIcon,
  AccountTree as WorkflowIcon,
  Link as LinkIcon,
  Groups as TeamIcon
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
      lead {
        id
        firstName
        lastName
        email
      }
      objective {
        id
        title
      }
      dvfId
      dvf {
        id
        title
        status
      }
      workflowPhases {
        id
        phaseType
        status
        startDate
        endDate
        tasks {
          id
          title
          status
          priority
          resourceLink
        }
      }
      qualityManagement {
        id
        phase
        status
        deliverables
        resourceLink
      }

      allocations {
        id
        allocationPercentage
        role
        startDate
        endDate
        user {
          id
          firstName
          lastName
          email
          position
        }
      }

    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: String!, $data: UpdateProjectInput!) {
    updateProject(id: $id, data: $data) {
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

const INITIALIZE_WORKFLOW = gql`
  mutation InitializeWorkflow($projectId: ID!) {
    initializeWorkflow(projectId: $projectId) {
      id
      phaseType
      status
    }
  }
`;

const INITIALIZE_QUALITY = gql`
  mutation InitializeQualityGates($projectId: ID!) {
    initializeQualityGates(projectId: $projectId) {
      id
      phase
      status
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($projectId: ID!, $phaseId: ID!, $title: String!, $taskType: String!, $priority: String!, $status: String!, $resourceLink: String) {
    createTask(projectId: $projectId, phaseId: $phaseId, title: $title, taskType: $taskType, priority: $priority, status: $status, resourceLink: $resourceLink) {
      id
      title
      status
      priority
      resourceLink
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $status: String, $title: String, $priority: String, $resourceLink: String) {
    updateTask(id: $id, status: $status, title: $title, priority: $priority, resourceLink: $resourceLink) {
      id
      title
      status
      priority
      resourceLink
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const UPDATE_QUALITY_GATE = gql`
  mutation UpdateQualityGate($id: ID!, $status: String, $deliverablesJSON: String, $resourceLink: String) {
    updateQualityGate(id: $id, status: $status, deliverablesJSON: $deliverablesJSON, resourceLink: $resourceLink) {
      id
      status
      deliverables
      resourceLink
    }
  }
`;

const CREATE_ALLOCATION = gql`
  mutation CreateAllocation($userId: ID!, $projectId: ID!, $allocationPercentage: Int!, $startDate: String!, $endDate: String!, $role: String) {
    createAllocation(userId: $userId, projectId: $projectId, allocationPercentage: $allocationPercentage, startDate: $startDate, endDate: $endDate, role: $role) {
      id
      allocationPercentage
      role
    }
  }
`;

const UPDATE_ALLOCATION = gql`
  mutation UpdateAllocation($id: ID!, $allocationPercentage: Int, $role: String, $startDate: String, $endDate: String) {
    updateAllocation(id: $id, allocationPercentage: $allocationPercentage, role: $role, startDate: $startDate, endDate: $endDate) {
      id
      allocationPercentage
      role
    }
  }
`;



const DELETE_ALLOCATION = gql`
  mutation DeleteAllocation($id: ID!) {
    deleteAllocation(id: $id)
  }
`;

const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      position
    }
  }
`;

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // State for Workflow Stepper
  const [activeStep, setActiveStep] = useState(0);

  // State for Task Management
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'medium', status: 'todo', id: '', resourceLink: '' });

  // State for Allocation Management
  const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
  const [allocationForm, setAllocationForm] = useState<any>({ userId: '', allocationPercentage: 50, role: '', startDate: '', endDate: '' });
  const [editingAllocationId, setEditingAllocationId] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_PROJECT, {
    variables: { id },
    skip: !id,
  });

  const { data: objectivesData } = useQuery(GET_OBJECTIVES);
  const { data: usersData } = useQuery(GET_USERS);
  const { data: dvfsData } = useQuery(gql`query GetDVFs { getDVFs { id title } }`);

  const [updateProject] = useMutation(UPDATE_PROJECT, { onCompleted: () => { setOpenEditDialog(false); refetch(); } });

  const [initWorkflow] = useMutation(INITIALIZE_WORKFLOW, { onCompleted: () => refetch() });
  const [initQuality] = useMutation(INITIALIZE_QUALITY, { onCompleted: () => refetch() });

  const [createTask] = useMutation(CREATE_TASK, { onCompleted: () => { setNewTaskOpen(false); refetch(); } });
  const [updateTask] = useMutation(UPDATE_TASK, { onCompleted: () => { setEditTaskOpen(false); refetch(); } });
  const [deleteTask] = useMutation(DELETE_TASK, { onCompleted: () => refetch() });

  const [updateQuality] = useMutation(UPDATE_QUALITY_GATE, { onCompleted: () => refetch() });

  const [createAllocation] = useMutation(CREATE_ALLOCATION, { onCompleted: () => { setAllocationDialogOpen(false); refetch(); } });
  const [updateAllocation] = useMutation(UPDATE_ALLOCATION, { onCompleted: () => { setAllocationDialogOpen(false); refetch(); } });
  const [deleteAllocation] = useMutation(DELETE_ALLOCATION, { onCompleted: () => refetch() });


  if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>Error: {error.message}</Alert>;
  if (!data?.project) return <Alert severity="warning" sx={{ m: 4 }}>Project not found</Alert>;

  const project = data.project;

  // Enhance Workflow Data logic
  // Typically phases are ordered. Let's assume backend returns them, but we might want to map them to a standard order if they are incomplete
  const PHASE_ORDER = ['planning', 'architecture', 'implementation', 'testing', 'deployment'];
  const sortedPhases = project.workflowPhases
    ? [...project.workflowPhases].sort((a: any, b: any) => PHASE_ORDER.indexOf(a.phaseType) - PHASE_ORDER.indexOf(b.phaseType))
    : [];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditForm({
      name: project.name,
      description: project.description,
      status: project.status.toLowerCase(),
      progress: project.progress,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      targetEndDate: project.targetEndDate ? project.targetEndDate.split('T')[0] : '',
      objectiveId: project.objective?.id || '',
      dvfId: project.dvf?.id || '',
      ownerId: project.owner?.id || '',
      leadId: project.lead?.id || '',
    });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = () => {
    const progressVal = parseInt(editForm.progress, 10);

    const safeDate = (dateStr: string) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    updateProject({
      variables: {
        id: project.id,
        data: {
          name: editForm.name,
          description: editForm.description,
          status: editForm.status,
          progress: isNaN(progressVal) ? 0 : progressVal,
          startDate: safeDate(editForm.startDate),
          targetEndDate: safeDate(editForm.targetEndDate),
          objectiveId: editForm.objectiveId || null,
          dvfId: editForm.dvfId || null,
          ownerId: editForm.ownerId || null,
          leadId: editForm.leadId || null
        }
      }
    });
  };

  const StatusChip = ({ status }: { status: string }) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    const s = status.toLowerCase();
    switch (s) {
      case 'completed': color = 'success'; break;
      case 'in_progress': color = 'primary'; break;
      case 'planning': color = 'info'; break;
      case 'on_hold': color = 'warning'; break;
      case 'cancelled': color = 'error'; break;
    }
    return <Chip label={status.replace('_', ' ').toUpperCase()} color={color} variant="filled" sx={{ borderRadius: 1, fontWeight: 600 }} />;
  };

  const getPhaseLabel = (type: string) => {
    switch (type) {
      case 'planning': return 'Planning & Inception';
      case 'architecture': return 'Architecture & Design';
      case 'implementation': return 'Implementation';
      case 'testing': return 'Testing & Validation';
      case 'deployment': return 'Deployment';
      default: return type;
    }
  };

  const handleAddTaskClick = (phaseId: string) => {
    setCurrentPhaseId(phaseId);
    setTaskForm({ title: '', priority: 'medium', status: 'todo', id: '', resourceLink: '' });
    setNewTaskOpen(true);
  };

  const handleEditTaskClick = (task: any) => {
    setTaskForm({ title: task.title, priority: task.priority, status: task.status, id: task.id, resourceLink: task.resourceLink || '' });
    setEditTaskOpen(true);
  };

  const handleSubmitTask = () => {
    if (newTaskOpen && currentPhaseId) {
      createTask({
        variables: {
          projectId: project.id,
          phaseId: currentPhaseId,
          title: taskForm.title,
          taskType: 'custom',
          priority: taskForm.priority,
          status: 'todo',
          resourceLink: taskForm.resourceLink
        }
      });
    } else if (editTaskOpen) {
      updateTask({
        variables: {
          id: taskForm.id,
          title: taskForm.title,
          priority: taskForm.priority,
          status: taskForm.status,
          resourceLink: taskForm.resourceLink
        }
      });
    }
  };

  const handleTaskToggle = (task: any) => {
    const newStatus = task.status.toLowerCase() === 'completed' ? 'todo' : 'completed';
    updateTask({ variables: { id: task.id, status: newStatus } });
  };

  const handleTaskDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask({ variables: { id } });
    }
  };

  const handleDeliverableToggle = (qm: any, key: string) => {
    let deliverables = {};
    try {
      if (typeof qm.deliverables === 'string') deliverables = JSON.parse(qm.deliverables);
      else deliverables = { ...qm.deliverables };
    } catch (e) {
      deliverables = {};
    }

    const current = deliverables[key] || { completed: false, link: '' };
    deliverables[key] = { ...current, completed: !current.completed };

    updateQuality({
      variables: {
        id: qm.id,
        deliverablesJSON: JSON.stringify(deliverables)
      }
    });
  };

  const handleQualityStatusChange = (qmId: string, newStatus: string) => {
    updateQuality({ variables: { id: qmId, status: newStatus } });
  };

  const handleAddAllocation = () => {
    setEditingAllocationId(null);
    setAllocationForm({
      userId: '',
      allocationPercentage: 50,
      role: '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.targetEndDate ? project.targetEndDate.split('T')[0] : ''
    });
    setAllocationDialogOpen(true);
  };

  const handleEditAllocation = (alloc: any) => {
    setEditingAllocationId(alloc.id);
    setAllocationForm({
      userId: alloc.user.id,
      allocationPercentage: alloc.allocationPercentage,
      role: alloc.role || '',
      startDate: alloc.startDate ? alloc.startDate.split('T')[0] : '',
      endDate: alloc.endDate ? alloc.endDate.split('T')[0] : ''
    });
    setAllocationDialogOpen(true);
  };



  // ... (code continues) ...

  const handleSaveAllocation = () => {
    // Basic validation
    if (!editingAllocationId && !allocationForm.userId) {
      alert("Please select a user");
      return;
    }
    if (!allocationForm.startDate || !allocationForm.endDate) {
      alert("Please select start and end dates");
      return;
    }

    const percentage = parseInt(allocationForm.allocationPercentage, 10);
    const validPercentage = isNaN(percentage) ? 0 : percentage;

    // Ensure dates are compatible with GraphQL DateTime scalar (ISO 8601)
    // Input type="date" returns "YYYY-MM-DD". We append time to make it a valid ISO string.
    const toISO = (dateStr: string) => {
      if (!dateStr) return new Date().toISOString();
      if (dateStr.includes('T')) return dateStr; // Already has time
      return `${dateStr}T00:00:00.000Z`;
    };

    const vars = {
      allocationPercentage: validPercentage,
      role: allocationForm.role,
      startDate: toISO(allocationForm.startDate),
      endDate: toISO(allocationForm.endDate)
    };

    if (editingAllocationId) {
      updateAllocation({ variables: { id: editingAllocationId, ...vars } });
    } else {
      createAllocation({ variables: { projectId: project.id, userId: allocationForm.userId, ...vars } });
    }
  };

  const handleDeleteAllocation = (id: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      deleteAllocation({ variables: { id } });
    }
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
                  <Typography variant="caption" display="block" color="text.secondary">DVF</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {project.dvf ? project.dvf.title : 'None Linked'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Project Owner</Typography>
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
                    {(() => {
                      if (!project.targetEndDate) return 'TBD';
                      const d = new Date(project.targetEndDate);
                      return isNaN(d.getTime()) ? 'Invalid Date' : format(d, 'MMM d, yyyy');
                    })()}
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
          <Tab label="Workflow" icon={<WorkflowIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Quality Gates" icon={<VerifiedIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Team & Allocations" icon={<TeamIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* ... (Overview widgets can be expanded, keeping simple for now) ... */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>Select "Workflow" or "Quality Gates" tabs to view detailed engineering progress.</Alert>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button variant="outlined" startIcon={<WorkflowIcon />} onClick={() => setTabValue(1)}>
                  Update Workflow
                </Button>
                <Button variant="outlined" startIcon={<TeamIcon />} onClick={() => setTabValue(3)}>
                  Manage Team
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Workflow Tab */}
      {/* Workflow Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6">Engineering Workflow</Typography>
              <Typography variant="body2" color="text.secondary">
                Track high-level phases and granular tasks.
              </Typography>
            </Box>
            {sortedPhases.length === 0 && (
              <Button
                variant="contained"
                onClick={() => initWorkflow({ variables: { projectId: project.id } })}
              >
                Initialize Workflow
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 4 }} />

          {sortedPhases.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No workflow phases initialized for this project.</Typography>
            </Box>
          ) : (
            <Box>
              <Stepper nonLinear activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
                {sortedPhases.map((phase: any, index: number) => (
                  <Step key={phase.id}>
                    <StepButton onClick={() => setActiveStep(index)}>
                      {getPhaseLabel(phase.phaseType)}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                {sortedPhases[activeStep] && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{getPhaseLabel(sortedPhases[activeStep].phaseType)}</Typography>
                        <Typography variant="caption" color="text.secondary">Phase Status: {sortedPhases[activeStep].status}</Typography>
                      </Box>
                      <Button
                        startIcon={<AssignmentIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() => handleAddTaskClick(sortedPhases[activeStep].id)}
                      >
                        Add Task
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      {sortedPhases[activeStep].tasks && sortedPhases[activeStep].tasks.map((task: any) => (
                        <Grid item xs={12} sm={6} key={task.id}>
                          <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Checkbox
                                checked={task.status.toLowerCase() === 'completed'}
                                color="success"
                                onChange={() => handleTaskToggle(task)}
                              />
                              <Box>
                                <Typography variant="subtitle2" sx={{ textDecoration: task.status.toLowerCase() === 'completed' ? 'line-through' : 'none', color: task.status.toLowerCase() === 'completed' ? 'text.secondary' : 'text.primary' }}>
                                  {task.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                                  <Chip
                                    label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    size="small"
                                    color={task.priority.toLowerCase() === 'critical' ? 'error' : task.priority.toLowerCase() === 'high' ? 'warning' : 'default'}
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                  <Chip
                                    label={task.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                  {task.resourceLink && (
                                    <IconButton size="small" component="a" href={task.resourceLink} target="_blank" color="primary" sx={{ p: 0.5 }}>
                                      <LinkIcon style={{ fontSize: 16 }} />
                                    </IconButton>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              <IconButton size="small" onClick={() => handleEditTaskClick(task)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleTaskDelete(task.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                      {(!sortedPhases[activeStep].tasks || sortedPhases[activeStep].tasks.length === 0) && (
                        <Typography variant="body2" sx={{ p: 2, fontStyle: 'italic', color: 'text.secondary' }}>No tasks in this phase.</Typography>
                      )}
                    </Grid>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* Quality Gates Tab */}
      {/* Quality Gates Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6">Quality Management & Gates</Typography>
              <Typography variant="body2" color="text.secondary">
                Review deliverables and quality checks.
              </Typography>
            </Box>
            {(!project.qualityManagement || project.qualityManagement.length === 0) && (
              <Button variant="contained" onClick={() => initQuality({ variables: { projectId: project.id } })}>
                Initialize Quality Gates
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />

          {(!project.qualityManagement || project.qualityManagement.length === 0) ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No quality gates initialized for this project.</Typography>
            </Box>
          ) : (
            <Box>
              {[...project.qualityManagement]
                .sort((a: any, b: any) => {
                  const order = ['building_phase', 'qa', 'uat', 'sqa_sqct', 'environment_record'];
                  return order.indexOf(a.phase) - order.indexOf(b.phase);
                })
                .map((qm: any) => {
                  let deliverablesObj = {};
                  try {
                    deliverablesObj = typeof qm.deliverables === 'string' ? JSON.parse(qm.deliverables) : (qm.deliverables || {});
                  } catch (e) {
                    // console.error("Failed to parse deliverables", e);
                  }

                  return (
                    <Accordion key={qm.id} defaultExpanded={qm.status === 'in_progress'}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                          <Typography sx={{ width: '40%', flexShrink: 0, fontWeight: 600 }}>
                            {qm.phase.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', mr: 2 }}>
                            Status:
                          </Typography>
                          <Chip
                            label={qm.status}
                            color={qm.status === 'completed' ? 'success' : qm.status === 'in_progress' ? 'primary' : 'default'}
                            size="small"
                          />
                          {qm.resourceLink && (
                            <IconButton
                              size="small"
                              component="a"
                              href={qm.resourceLink}
                              target="_blank"
                              color="primary"
                              onClick={(e) => e.stopPropagation()}
                              sx={{ ml: 2 }}
                            >
                              <LinkIcon />
                            </IconButton>
                          )}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">Update Status:</Typography>
                            <TextField
                              select
                              size="small"
                              value={qm.status}
                              onChange={(e) => handleQualityStatusChange(qm.id, e.target.value)}
                              sx={{ width: 150 }}
                            >
                              <MenuItem value="not_started">Not Started</MenuItem>
                              <MenuItem value="in_progress">In Progress</MenuItem>
                              <MenuItem value="blocked">Blocked</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </TextField>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, ml: 2 }}>
                            <Typography variant="subtitle2">Resource Link:</Typography>
                            <TextField
                              size="small"
                              defaultValue={qm.resourceLink || ''}
                              onBlur={(e) => updateQuality({ variables: { id: qm.id, resourceLink: e.target.value } })}
                              placeholder="e.g., https://jira.com/..."
                              fullWidth
                            />
                          </Box>
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>Deliverables:</Typography>
                        <List dense>
                          {Object.entries(deliverablesObj).map(([key, val]: [string, any]) => (
                            <ListItem
                              key={key}
                              button
                              onClick={() => handleDeliverableToggle(qm, key)}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={val.completed === true}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={key.replace(/_/g, ' ')}
                                secondary={val.link ? <a href={val.link} onClick={(e) => e.stopPropagation()}>View Document</a> : 'No document linked'}
                              />
                            </ListItem>
                          ))}
                          {Object.keys(deliverablesObj).length === 0 && (
                            <Typography variant="caption" color="text.secondary">No specific deliverables defined.</Typography>
                          )}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
            </Box>
          )}
        </Paper>
      )}

      {/* Team & Allocations Tab */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6">Team Allocations</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage team members allocated to this project.
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<TeamIcon />} onClick={handleAddAllocation}>
              Add Member
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {project.allocations && project.allocations.map((alloc: any) => (
              <Grid item xs={12} md={6} key={alloc.id}>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {alloc.user.firstName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {alloc.user.firstName} {alloc.user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {alloc.role || alloc.user.position || 'Member'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Chip
                          label={`${alloc.allocationPercentage}%`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {(() => {
                            const start = new Date(alloc.startDate);
                            const end = new Date(alloc.endDate);
                            const sStr = isNaN(start.getTime()) ? '?' : format(start, 'MMM d');
                            const eStr = isNaN(end.getTime()) ? '?' : format(end, 'MMM d, yyyy');
                            return `${sStr} - ${eStr}`;
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditAllocation(alloc)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteAllocation(alloc.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
            {(!project.allocations || project.allocations.length === 0) && (
              <Grid item xs={12}>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                  No team members allocated to this project yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Allocation Dialog */}
      <Dialog open={allocationDialogOpen} onClose={() => setAllocationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAllocationId ? 'Edit Allocation' : 'Add Team Member'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {!editingAllocationId && (
              <TextField
                select
                label="Select User"
                value={allocationForm.userId}
                onChange={(e) => setAllocationForm({ ...allocationForm, userId: e.target.value })}
                fullWidth
              >
                {usersData?.users.map((user: any) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="Role in Project"
              value={allocationForm.role}
              onChange={(e) => setAllocationForm({ ...allocationForm, role: e.target.value })}
              fullWidth
              placeholder="e.g. Lead Developer"
            />

            <Box>
              <Typography gutterBottom>Allocation Percentage: {allocationForm.allocationPercentage}%</Typography>
              <TextField
                type="number"
                value={allocationForm.allocationPercentage}
                onChange={(e) => setAllocationForm({ ...allocationForm, allocationPercentage: e.target.value })}
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={allocationForm.startDate}
                onChange={(e) => setAllocationForm({ ...allocationForm, startDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={allocationForm.endDate}
                onChange={(e) => setAllocationForm({ ...allocationForm, endDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAllocationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAllocation} variant="contained">Save Allocation</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
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
              value={editForm.status || 'planning'}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              fullWidth
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
              value={editForm.progress}
              onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={editForm.startDate || ''}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Target End Date"
                type="date"
                value={editForm.targetEndDate || ''}
                onChange={(e) => setEditForm({ ...editForm, targetEndDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              select
              label="Strategic Objective"
              value={editForm.objectiveId || ''}
              onChange={(e) => setEditForm({ ...editForm, objectiveId: e.target.value })}
              fullWidth
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {objectivesData && objectivesData.objectives.map((obj: any) => (
                <MenuItem key={obj.id} value={obj.id}>{obj.title}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Associated DVF"
              value={editForm.dvfId || ''}
              onChange={(e) => setEditForm({ ...editForm, dvfId: e.target.value })}
              fullWidth
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {dvfsData && dvfsData.getDVFs.map((dvf: any) => (
                <MenuItem key={dvf.id} value={dvf.id}>{dvf.title}</MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Project Owner"
                value={editForm.ownerId || ''}
                onChange={(e) => setEditForm({ ...editForm, ownerId: e.target.value })}
                fullWidth
              >
                {usersData && usersData.users.map((user: any) => (
                  <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Project Lead"
                value={editForm.leadId || ''}
                onChange={(e) => setEditForm({ ...editForm, leadId: e.target.value })}
                fullWidth
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {usersData && usersData.users.map((user: any) => (
                  <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={newTaskOpen} onClose={() => setNewTaskOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Task Title"
              fullWidth
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            />
            <TextField
              select
              label="Priority"
              fullWidth
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
            <TextField
              label="Resource Link (Optional)"
              fullWidth
              value={taskForm.resourceLink || ''}
              onChange={(e) => setTaskForm({ ...taskForm, resourceLink: e.target.value })}
              placeholder="https://..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTaskOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitTask} disabled={!taskForm.title}>Create Task</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editTaskOpen} onClose={() => setEditTaskOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Task Title"
              fullWidth
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            />
            <TextField
              select
              label="Status"
              fullWidth
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="in_review">In Review</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </TextField>
            <TextField
              select
              label="Priority"
              fullWidth
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
            <TextField
              label="Resource Link (Optional)"
              fullWidth
              value={taskForm.resourceLink || ''}
              onChange={(e) => setTaskForm({ ...taskForm, resourceLink: e.target.value })}
              placeholder="https://..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTaskOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitTask}>Update Task</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;
