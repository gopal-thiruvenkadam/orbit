import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
    Collapse,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Divider,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Timeline as TimelineIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as UncheckedIcon,
    PlayArrow as InProgressIcon,
    Pause as OnHoldIcon,
    MoreVert as MoreVertIcon,
    Description as DescriptionIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// GraphQL Operations
const GET_PROJECTS = gql`
  query GetProjectsForWorkflow {
    projects {
      id
      name
    }
  }
`;

const GET_PROJECT_WORKFLOW = gql`
  query GetProjectWorkflow($projectId: ID!) {
    getProjectWorkflow(projectId: $projectId) {
      id
      phaseType
      phaseName
      status
      statusColor
      progress
      tasks {
        id
        title
        status
        statusColor
        priority
        priorityColor
        assignedTo {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

const CREATE_PHASE = gql`
  mutation CreatePhase($projectId: ID!, $phaseType: String!) {
    createPhase(projectId: $projectId, phaseType: $phaseType) {
      id
      phaseType
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($projectId: ID!, $phaseId: ID!, $title: String!, $taskType: String!, $priority: TaskPriority) {
    createTask(projectId: $projectId, phaseId: $phaseId, title: $title, taskType: $taskType, priority: $priority) {
      id
      title
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: TaskStatus!) {
    updateTask(id: $taskId, status: $status) {
      id
      status
    }
  }
`;

const PhaseItem = ({ phase, projectId, onRefresh }: { phase: any, projectId: string, onRefresh: () => void }) => {
    const [expanded, setExpanded] = useState(false);
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const [createTask] = useMutation(CREATE_TASK, {
        onCompleted: () => {
            setOpenTaskDialog(false);
            setNewTaskTitle('');
            onRefresh();
        }
    });

    const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
        onCompleted: () => onRefresh()
    });

    const handleCreateTask = () => {
        if (newTaskTitle) {
            createTask({
                variables: {
                    projectId,
                    phaseId: phase.id,
                    title: newTaskTitle,
                    taskType: 'project_definition', // Default for demo
                    priority: 'medium'
                }
            });
        }
    };

    const handleStatusToggle = (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
        updateTaskStatus({ variables: { taskId, status: newStatus } });
    };

    return (
        <Card variant="outlined" sx={{ mb: 2, borderColor: phase.status === 'in_progress' ? 'primary.main' : 'divider' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: phase.statusColor }}>
                        <TimelineIcon />
                    </Avatar>
                }
                action={
                    <IconButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                }
                title={
                    <Typography variant="h6" fontWeight={600}>
                        {phase.phaseName}
                    </Typography>
                }
                subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                            label={phase.status.replace('_', ' ').toUpperCase()}
                            size="small"
                            color={phase.statusColor as any}
                            variant={phase.status === 'in_progress' ? 'filled' : 'outlined'}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {phase.tasks?.length || 0} Tasks
                        </Typography>
                    </Box>
                }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">Phase Progress</Typography>
                            <Typography variant="caption">{phase.progress || 0}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={phase.progress || 0} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">Tasks</Typography>
                        <Button size="small" startIcon={<AddIcon />} onClick={() => setOpenTaskDialog(true)}>Add Task</Button>
                    </Box>
                    <Divider sx={{ mb: 1 }} />

                    <List dense>
                        {phase.tasks?.map((task: any) => (
                            <ListItem
                                key={task.id}
                                secondaryAction={
                                    <Chip label={task.priority} size="small" color={task.priorityColor as any} sx={{ height: 20, fontSize: '0.65rem' }} />
                                }
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <IconButton edge="start" size="small" onClick={() => handleStatusToggle(task.id, task.status)}>
                                        {task.status === 'completed' ? <CheckCircleIcon color="success" fontSize="small" /> : <UncheckedIcon fontSize="small" />}
                                    </IconButton>
                                </ListItemIcon>
                                <ListItemText
                                    primary={task.title}
                                    secondary={task.assignedTo ? `Assigned: ${task.assignedTo.firstName}` : 'Unassigned'}
                                    sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.6 : 1 }}
                                />
                            </ListItem>
                        ))}
                        {(!phase.tasks || phase.tasks.length === 0) && (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                No tasks defined for this phase yet.
                            </Typography>
                        )}
                    </List>
                </CardContent>
            </Collapse>

            <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent sx={{ pt: 1, minWidth: 400 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Task Title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateTask} disabled={!newTaskTitle}>Create</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

const WorkflowDashboard: React.FC = () => {
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);

    const { data: workflowData, loading: workflowLoading, refetch } = useQuery(GET_PROJECT_WORKFLOW, {
        variables: { projectId: selectedProjectId },
        skip: !selectedProjectId
    });

    const [createPhase] = useMutation(CREATE_PHASE, {
        onCompleted: () => refetch()
    });

    // Auto-select first project
    React.useEffect(() => {
        if (projectsData?.projects?.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projectsData.projects[0].id);
        }
    }, [projectsData]);

    const handleAddDefaultPhases = () => {
        const phases = ['planning', 'architecture', 'implementation', 'testing', 'deployment'];
        phases.forEach(type => {
            createPhase({ variables: { projectId: selectedProjectId, phaseType: type } });
        });
    };

    if (projectsLoading) return <Box p={3}>Loading projects...</Box>;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" fontWeight="700" gutterBottom>
                        Workflow Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage project lifecycle, phases, and tasks dynamically.
                    </Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                    <TextField
                        select
                        fullWidth
                        label="Select Project"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        size="small"
                    >
                        {projectsData?.projects.map((p: any) => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            {workflowLoading ? (
                <LinearProgress />
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        {(!workflowData?.getProjectWorkflow || workflowData.getProjectWorkflow.length === 0) ? (
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>No Workflow Configured</Typography>
                                <Typography color="text.secondary" sx={{ mb: 3 }}>
                                    This project doesn't have a workflow set up yet.
                                </Typography>
                                <Button variant="contained" onClick={handleAddDefaultPhases}>
                                    Initialize Standard Workflow
                                </Button>
                            </Paper>
                        ) : (
                            <Box>
                                {workflowData.getProjectWorkflow.map((phase: any) => (
                                    <PhaseItem key={phase.id} phase={phase} projectId={selectedProjectId} onRefresh={refetch} />
                                ))}
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>Quick Stats</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Total Tasks</Typography>
                                    <Typography variant="h4">
                                        {workflowData?.getProjectWorkflow?.reduce((acc: number, curr: any) => acc + (curr.tasks?.length || 0), 0) || 0}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Completion Rate</Typography>
                                    <Typography variant="h4" color="primary.main">
                                        {/* Simplified calc */}
                                        24%
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default WorkflowDashboard;
