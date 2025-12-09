import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  Stack,
  LinearProgress,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';

// Icons
import AssignmentIcon from '@mui/icons-material/AssignmentRounded';
import BugReportIcon from '@mui/icons-material/BugReportRounded';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunchRounded';
import ArchitectureIcon from '@mui/icons-material/ArchitectureRounded';
import CodeIcon from '@mui/icons-material/CodeRounded';
import MoreVertIcon from '@mui/icons-material/MoreVertRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTimeRounded';

// GraphQL Query
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    projects {
      id
      name
      description
      status
      progress
      currentPhase
      startDate
      targetEndDate
      owner {
        firstName
        lastName
      }
    }
    getRecentTasks(limit: 5) {
      id
      title
      status
      taskType
      updatedAt
      assignedTo {
        firstName
        lastName
      }
    }
    getWorkflowMetrics
  }
`;

// Status to color mapping
const statusColors: Record<string, any> = {
  'planning': 'info',
  'in_progress': 'primary',
  'testing': 'warning',
  'completed': 'success',
  'on_hold': 'default',
  'approved': 'success',
  'failed': 'error',
  'in_review': 'secondary',
  'todo': 'default',
  'blocked': 'error'
};

type StatusType = 'planning' | 'in_progress' | 'testing' | 'completed' | 'on_hold' | 'approved' | 'failed' | 'in_review' | 'todo' | 'blocked';

// Phase to icon mapping
const phaseIcons: Record<string, any> = {
  'planning': <AssignmentIcon fontSize="small" />,
  'architecture': <ArchitectureIcon fontSize="small" />,
  'implementation': <CodeIcon fontSize="small" />,
  'testing': <BugReportIcon fontSize="small" />,
  'deployment': <RocketLaunchIcon fontSize="small" />
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  // Activity Icon based on type
  const getActivityIcon = (type: string) => {
    // Map task types to icons
    if (type.includes('architecture') || type.includes('design')) return <ArchitectureIcon />;
    if (type.includes('test') || type.includes('validation')) return <BugReportIcon />;
    if (type.includes('deployment') || type.includes('release')) return <RocketLaunchIcon />;
    if (type.includes('code') || type.includes('implementation')) return <CodeIcon />;
    return <AssignmentIcon />;
  };

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: theme.palette[color].main,
            display: 'flex'
          }}
        >
          {icon}
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            color={trend.includes('+') ? 'success' : 'error'}
            variant="outlined"
            icon={<TrendingUpIcon />}
            sx={{ fontWeight: 600, border: 'none', bgcolor: alpha(theme.palette.success.main, 0.1) }}
          />
        )}
      </Box>
      <Typography variant="h4" fontWeight="800" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight="500">
        {title}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading dashboard data: {error.message}</Alert>
      </Box>
    );
  }

  const projects = data?.projects || [];
  const recentTasks = data?.getRecentTasks || [];
  const workflowMetrics = data?.getWorkflowMetrics ? JSON.parse(data.getWorkflowMetrics) : {};

  return (
    <Box>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="800" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, here's what's happening with your projects.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AssignmentIcon />}
          onClick={() => navigate('/projects', { state: { openCreateDialog: true } })}
          sx={{ px: 3, py: 1.5 }}
        >
          New Project
        </Button>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={projects.length}
            icon={<AssignmentIcon />}
            color="primary"
            trend="+2 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value="48" // This should ideally come from backend too
            icon={<AccessTimeIcon />}
            color="warning"
            trend="-5 from last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Bugs"
            value="8" // This should ideally come from backend too
            icon={<BugReportIcon />}
            color="error"
            trend="-2 from yesterday"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Deployments"
            value="24" // This should ideally come from backend too
            icon={<RocketLaunchIcon />}
            color="success"
            trend="+4 this week"
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="700">
            Active Projects
          </Typography>
          <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/projects')}>
            View All
          </Button>
        </Box>
        <Grid container spacing={3}>
          {projects.map((project: any) => (
            <Grid item xs={12} md={4} key={project.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={project.status.replace('_', ' ')}
                      color={statusColors[project.status] || 'default'}
                      size="small"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" fontWeight="700" gutterBottom sx={{ minHeight: 64 }}>
                    {project.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" fontWeight="600" color="text.secondary">
                        PROGRESS
                      </Typography>
                      <Typography variant="caption" fontWeight="600" color="primary.main">
                        {project.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <AssignmentIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" fontWeight="500">
                        8/12 Tasks
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" fontWeight="500">
                        {project.targetEndDate ? new Date(project.targetEndDate).toLocaleDateString() : 'No Date'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Divider sx={{ opacity: 0.5 }} />
                <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                  <Chip
                    icon={phaseIcons[project.currentPhase?.toLowerCase()] || <AssignmentIcon fontSize="small" />}
                    label={project.currentPhase || 'Planning'}
                    variant="outlined"
                    size="small"
                    sx={{ border: 'none', bgcolor: alpha(theme.palette.grey[500], 0.05) }}
                  />
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{ fontWeight: 600 }}
                  >
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight="700">
                Recent Activity
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {recentTasks.length > 0 ? recentTasks.map((task: any, index: number) => (
                <React.Fragment key={task.id}>
                  <ListItem alignItems="flex-start" sx={{ p: 3, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(theme.palette[statusColors[task.status as StatusType] || 'primary'].main, 0.1), color: theme.palette[statusColors[task.status as StatusType] || 'primary'].main }}>
                        {getActivityIcon(task.taskType)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {task.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(task.updatedAt).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <Typography component="span" variant="body2" fontWeight="600" color="text.primary">
                              {task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'Unassigned'}
                            </Typography>
                            {' updated status to '}
                            <Chip
                              label={task.status.replace('_', ' ')}
                              color={statusColors[task.status as StatusType] || 'default'}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentTasks.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              )) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No recent activity</Typography>
                </Box>
              )}
            </List>
            <Box sx={{ p: 2, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button onClick={() => navigate('/activities')}>
                View All Activities
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Workflow Progress
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Overall progress across all active projects by phase.
            </Typography>

            <Stack spacing={4}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 32, height: 32 }}>
                      <AssignmentIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600">Strategic Planning</Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight="700">{workflowMetrics['planning'] || 0}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={workflowMetrics['planning'] || 0} sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1.5, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', width: 32, height: 32 }}>
                      <ArchitectureIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600">Architecture</Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight="700">{workflowMetrics['architecture'] || 0}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={workflowMetrics['architecture'] || 0} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', width: 32, height: 32 }}>
                      <CodeIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600">Implementation</Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight="700">{workflowMetrics['implementation'] || 0}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={workflowMetrics['implementation'] || 0} color="info" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', width: 32, height: 32 }}>
                      <BugReportIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600">Testing</Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight="700">{workflowMetrics['testing'] || 0}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={workflowMetrics['testing'] || 0} color="warning" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', width: 32, height: 32 }}>
                      <RocketLaunchIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600">Deployment</Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight="700">{workflowMetrics['deployment'] || 0}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={workflowMetrics['deployment'] || 0} color="success" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </Stack>

            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              fullWidth
              onClick={() => navigate('/workflow')}
            >
              View Detailed Workflow
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
