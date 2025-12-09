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
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import SettingsIcon from '@mui/icons-material/Settings';
import MonitorIcon from '@mui/icons-material/Monitor';

const EnvironmentRecord: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Quality Management: Environment Record
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Environment Record phase documents all deployment environments, their configurations, and monitoring setup to ensure consistent quality across all environments.
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
        This phase will be conducted in parallel with deployment preparation. Estimated start date: July 15, 2025.
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Environment Documentation Requirements
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Infrastructure Documentation" 
                  secondary="Servers, networks, and hardware specifications" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CloudIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Cloud Resources" 
                  secondary="Cloud services, configurations, and access controls" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Configuration Management" 
                  secondary="Environment-specific configurations and variables" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <MonitorIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Monitoring Setup" 
                  secondary="Observability tools and alert configurations" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Environment Types
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WarningIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Development Environment
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Environment for active development work. Documentation of setup and standard configurations needed.
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
                        Testing Environments
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      QA, UAT, and performance testing environments. Detailed documentation of configurations and data setup required.
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
                        Production Environment
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Final production environment. Comprehensive documentation of all aspects including security measures, backup procedures, and disaster recovery.
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

export default EnvironmentRecord;
