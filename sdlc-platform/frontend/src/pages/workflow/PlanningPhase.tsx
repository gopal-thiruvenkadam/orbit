import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import WarningIcon from '@mui/icons-material/Warning';

// GraphQL Queries
const GET_PROJECTS = gql`
  query GetProjects {
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
      status
      tasks {
        id
        title
        status
      }
    }
  }
`;

// Task status mapping
const statusConfig = {
  completed: { color: 'success', icon: <CheckCircleIcon color="success" /> },
  in_progress: { color: 'info', icon: <HourglassTopIcon color="info" /> },
  not_started: { color: 'default', icon: <WarningIcon color="action" /> },
  todo: { color: 'action', icon: <WarningIcon color="action" /> }, // Mapping todo to not_started style
  blocked: { color: 'error', icon: <WarningIcon color="error" /> }
} as const;

const PlanningPhase: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    onCompleted: (data) => {
      if (data.projects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data.projects[0].id);
      }
    }
  });

  const { data: workflowData, loading: workflowLoading } = useQuery(GET_PROJECT_WORKFLOW, {
    variables: { projectId: selectedProjectId },
    skip: !selectedProjectId
  });

  // Handle Project Change
  const handleProjectChange = (event: any) => {
    setSelectedProjectId(event.target.value);
  };

  if (projectsLoading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;

  const workflowPhases = workflowData?.getProjectWorkflow || [];
  const planningPhase = workflowPhases.find((p: any) => p.phaseType === 'planning' || p.phaseType === 'PLANNING');
  // Map tasks or use empty array
  const tasks = planningPhase ? planningPhase.tasks.map((t: any) => ({
    id: t.id,
    name: t.title,
    status: t.status === 'todo' ? 'not_started' : t.status // Map todo to match UI expectation if needed, or update config
  })) : [];

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
  const notStartedTasks = tasks.filter((t: any) => ['not_started', 'todo'].includes(t.status)).length;

  // Progress calculation
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Phase 1: Strategic Planning and Inception
        </Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Project</InputLabel>
          <Select
            value={selectedProjectId}
            label="Project"
            onChange={handleProjectChange}
          >
            {projectsData?.projects.map((p: any) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body1" paragraph>
        This phase focuses on defining the project scope, identifying risks, requirements engineering, and establishing the initial project strategy.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 2 }}>Overall Progress:</Typography>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
          </Box>
          <Typography variant="body1">{progress}%</Typography>
        </Box>
        <Chip
          label={progress === 100 ? "Completed" : (progress > 0 ? "In Progress" : "Not Started")}
          color={progress === 100 ? "success" : (progress > 0 ? "primary" : "default")}
        />
      </Box>

      <Typography variant="h5" gutterBottom>
        Tasks & Deliverables
      </Typography>

      {workflowLoading ? <LinearProgress /> : (
        <Grid container spacing={3}>
          {tasks.length > 0 ? tasks.map((task: any) => (
            <Grid item xs={12} md={6} key={task.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {statusConfig[task.status as keyof typeof statusConfig]?.icon || <WarningIcon color="action" />}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {task.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={task.status.replace('_', ' ')}
                    size="small"
                    color={statusConfig[task.status as keyof typeof statusConfig]?.color as any || 'default'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">No tasks found for planning phase in this project.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Phase Summary</Typography>
        <List>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Completed Tasks" secondary={`${completedTasks} of ${totalTasks} tasks (${totalTasks ? Math.round(completedTasks / totalTasks * 100) : 0}%)`} />
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTopIcon color="info" /></ListItemIcon>
            <ListItemText primary="In Progress Tasks" secondary={`${inProgressTasks} of ${totalTasks} tasks (${totalTasks ? Math.round(inProgressTasks / totalTasks * 100) : 0}%)`} />
          </ListItem>
          <ListItem>
            <ListItemIcon><WarningIcon color="action" /></ListItemIcon>
            <ListItemText primary="Not Started Tasks" secondary={`${notStartedTasks} of ${totalTasks} tasks (${totalTasks ? Math.round(notStartedTasks / totalTasks * 100) : 0}%)`} />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default PlanningPhase;
