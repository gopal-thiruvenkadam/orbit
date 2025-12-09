import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';

// Sample quality plan data
const qualityPlan = {
  title: 'Quality Management Plan',
  version: '2.1',
  lastUpdated: '2025-11-15',
  approvedBy: 'Sarah Williams',
  status: 'approved',
  sections: [
    {
      id: 1,
      title: 'Introduction',
      content: 'This Quality Management Plan (QMP) establishes the quality objectives and methodologies to be used for the Intuitive Digital SDLC Platform. It defines how the project team will implement, support, and manage quality policies, processes, and procedures.'
    },
    {
      id: 2,
      title: 'Quality Objectives',
      content: 'The primary quality objectives for this project are:\n- Ensure that all deliverables meet or exceed the defined requirements\n- Minimize defects in production releases\n- Achieve a user satisfaction rating of 90% or higher\n- Maintain compliance with all regulatory requirements'
    },
    {
      id: 3,
      title: 'Quality Standards',
      content: 'The project will adhere to the following quality standards:\n- ISO 9001:2015 for Quality Management Systems\n- CMMI Level 4 processes\n- Industry best practices for software development\n- Organizational standards for code quality and documentation'
    },
    {
      id: 4,
      title: 'Quality Assurance Methodology',
      content: 'The quality assurance approach includes:\n- Continuous integration and deployment pipelines\n- Regular code reviews and static code analysis\n- Comprehensive testing at multiple levels (unit, integration, system)\n- Automated regression testing\n- Performance and security testing'
    },
    {
      id: 5,
      title: 'Quality Control Process',
      content: 'Quality control will be implemented through:\n- Peer reviews of all deliverables\n- Formal testing phases with defined entry and exit criteria\n- Defect management and tracking\n- Root cause analysis for critical defects'
    },
    {
      id: 6,
      title: 'Metrics and Reporting',
      content: 'The following metrics will be tracked and reported:\n- Defect density\n- Test coverage\n- Requirements coverage\n- Technical debt\n- System performance metrics'
    }
  ],
  qualityRoles: [
    { role: 'Quality Assurance Lead', responsibilities: 'Overall responsibility for QA activities and processes' },
    { role: 'Test Engineers', responsibilities: 'Designing and executing test cases, reporting defects' },
    { role: 'Developers', responsibilities: 'Unit testing, code reviews, fixing defects' },
    { role: 'Product Owner', responsibilities: 'Acceptance criteria definition, UAT coordination' },
    { role: 'Project Manager', responsibilities: 'Quality planning, resource allocation, reporting' }
  ],
  qualityActivities: [
    { phase: 'Planning', activities: ['Quality Management Plan creation', 'Quality metrics definition', 'Test strategy development'], status: 'completed' },
    { phase: 'Requirements', activities: ['Requirements review', 'Testability analysis', 'Acceptance criteria validation'], status: 'completed' },
    { phase: 'Design', activities: ['Design review', 'Architecture review', 'Security review'], status: 'completed' },
    { phase: 'Development', activities: ['Code reviews', 'Static code analysis', 'Unit testing'], status: 'in_progress' },
    { phase: 'Testing', activities: ['System testing', 'Performance testing', 'Security testing'], status: 'not_started' },
    { phase: 'Deployment', activities: ['Release readiness review', 'Deployment verification', 'Post-deployment testing'], status: 'not_started' }
  ]
};

// Status to color and icon mapping
const statusConfig = {
  approved: { color: 'success', icon: <CheckCircleIcon color="success" /> },
  in_review: { color: 'info', icon: <PendingIcon color="info" /> },
  draft: { color: 'default', icon: <ErrorIcon color="disabled" /> },
  rejected: { color: 'error', icon: <ErrorIcon color="error" /> },
  completed: { color: 'success', icon: <CheckCircleIcon color="success" /> },
  in_progress: { color: 'info', icon: <PendingIcon color="info" /> },
  not_started: { color: 'default', icon: <ErrorIcon color="disabled" /> }
} as const;

const QualityPlan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/quality')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            {qualityPlan.title}
          </Typography>
          <Chip
            label={qualityPlan.status}
            color={statusConfig[qualityPlan.status as keyof typeof statusConfig].color as any}
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        <Box>
          <Tooltip title="Share">
            <IconButton sx={{ mr: 1 }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">Version</Typography>
                  <Typography variant="body1">{qualityPlan.version}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">{qualityPlan.lastUpdated}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">Approved By</Typography>
                  <Typography variant="body1">{qualityPlan.approvedBy}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {statusConfig[qualityPlan.status as keyof typeof statusConfig].icon}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {qualityPlan.status.charAt(0).toUpperCase() + qualityPlan.status.slice(1)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {qualityPlan.sections.map((section) => (
              <Box key={section.id} sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {section.content}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quality Roles and Responsibilities
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Responsibilities</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qualityPlan.qualityRoles.map((role, index) => (
                    <TableRow key={index}>
                      <TableCell>{role.role}</TableCell>
                      <TableCell>{role.responsibilities}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quality Activities by Phase
            </Typography>
            {qualityPlan.qualityActivities.map((phase, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardHeader
                  title={phase.phase}
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  avatar={statusConfig[phase.status as keyof typeof statusConfig].icon}
                  action={
                    <Chip
                      label={phase.status.replace('_', ' ')}
                      color={statusConfig[phase.status as keyof typeof statusConfig].color as any}
                      size="small"
                    />
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <List dense>
                    {phase.activities.map((activity, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <AssignmentIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={activity} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QualityPlan;
