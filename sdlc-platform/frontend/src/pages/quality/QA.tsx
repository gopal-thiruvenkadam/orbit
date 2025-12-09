import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import BugReportIcon from '@mui/icons-material/BugReport';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const QA: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Quality Management: QA
      </Typography>
      
      <Typography variant="body1" paragraph>
        The QA phase involves comprehensive quality assurance testing to identify and resolve defects, ensure compliance with requirements, and verify system functionality.
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Chip 
          label="In Progress" 
          color="info" 
          icon={<HourglassTopIcon />} 
          sx={{ mr: 2, px: 2, py: 2.5, fontSize: '1rem' }}
        />
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>Overall Progress:</Typography>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={45} />
          </Box>
          <Typography variant="body2">45%</Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              QA Phase Requirements
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Test Plan Document" 
                  secondary="Completed and approved" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Test Case Development" 
                  secondary="Created and reviewed" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <HourglassTopIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Functional Testing" 
                  secondary="In progress - 60% complete" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <HourglassTopIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Integration Testing" 
                  secondary="In progress - 30% complete" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Current QA Activities
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    avatar={<DescriptionIcon color="primary" />}
                    title="Architecture and Patterns Spec"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Review of architecture implementation against specification and quality standards.
                    </Typography>
                    <Chip label="In Review" color="info" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    avatar={<BugReportIcon color="warning" />}
                    title="Defect Management"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Current open defects: 12 (3 high, 5 medium, 4 low)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resolved defects: 8
                    </Typography>
                    <Chip label="Active" color="warning" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    avatar={<AssignmentTurnedInIcon color="primary" />}
                    title="Test Execution Report"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Test cases executed: 87/150 (58%)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pass rate: 92%
                    </Typography>
                    <Chip label="In Progress" color="info" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QA;
