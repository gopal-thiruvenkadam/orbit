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
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BuildIcon from '@mui/icons-material/Build';

const BuildingPhase: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Quality Management: Building Phase
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Building Phase focuses on establishing quality standards during the initial development process. This phase ensures that proper quality measures are integrated from the very beginning of the project.
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Chip 
          label="Completed" 
          color="success" 
          icon={<CheckCircleIcon />} 
          sx={{ px: 2, py: 2.5, fontSize: '1rem' }}
        />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Building Phase Requirements
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Code Quality Guidelines" 
                  secondary="Established coding standards and practices" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Development Environment Setup" 
                  secondary="Configured with linting and quality checks" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Code Review Process" 
                  secondary="Documented review procedure and checklists" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Testing Framework" 
                  secondary="Unit testing configuration and guidelines" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Completed Deliverables
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    avatar={<DescriptionIcon color="primary" />}
                    title="Coding Standards Document"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Comprehensive documentation of coding standards, naming conventions, and best practices for the project.
                    </Typography>
                    <Chip label="Approved" color="success" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    avatar={<AssignmentTurnedInIcon color="primary" />}
                    title="Code Review Checklist"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Detailed checklist for code reviews covering functionality, security, performance, and maintainability.
                    </Typography>
                    <Chip label="Implemented" color="success" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    avatar={<BuildIcon color="primary" />}
                    title="CI/CD Quality Gates"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Configuration of automated quality checks in the CI/CD pipeline including code coverage, static analysis, and security scanning.
                    </Typography>
                    <Chip label="Active" color="success" size="small" sx={{ mt: 1 }} />
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

export default BuildingPhase;
