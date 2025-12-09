import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupIcon from '@mui/icons-material/Group';

const UAT: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Quality Management: User Acceptance Testing
      </Typography>
      
      <Typography variant="body1" paragraph>
        User Acceptance Testing (UAT) is the final testing phase where end-users verify that the system works as expected in real-world scenarios and meets business requirements.
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Chip 
          label="Not Started" 
          color="default" 
          icon={<PendingIcon />} 
          sx={{ px: 2, py: 2.5, fontSize: '1rem' }}
        />
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This phase will begin after the QA phase is completed. Estimated start date: June 15, 2025.
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              UAT Planning Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="UAT Duration" 
                  secondary="2 weeks (planned)" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="UAT Participants" 
                  secondary="8 business users (Finance, Operations, Management)" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="UAT Scenarios" 
                  secondary="24 business scenarios to be tested" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="UAT Coordinator" 
                  secondary="Jane Smith (Product Manager)" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              UAT Preparation Checklist
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WarningIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        UAT Test Scenarios
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Business scenarios and test cases need to be documented and approved by stakeholders.
                    </Typography>
                    <Chip label="Not Started" color="default" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WarningIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        UAT Environment
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Dedicated testing environment needs to be set up with production-like data and configurations.
                    </Typography>
                    <Chip label="Not Started" color="default" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WarningIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        UAT Training
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Training sessions for UAT participants need to be scheduled and materials prepared.
                    </Typography>
                    <Chip label="Not Started" color="default" size="small" sx={{ mt: 1 }} />
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

export default UAT;
