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
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChecklistIcon from '@mui/icons-material/Checklist';

const SQASQCT: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Quality Management: SQA/SQCT
      </Typography>
      
      <Typography variant="body1" paragraph>
        Software Quality Assurance (SQA) and Software Quality Control Testing (SQCT) focus on ensuring the software meets industry quality standards and regulatory requirements.
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
        This phase will begin after the UAT phase is completed. Estimated start date: July 1, 2025.
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              SQA/SQCT Requirements
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Security Assessment" 
                  secondary="Vulnerability scanning and penetration testing" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Compliance Verification" 
                  secondary="ISO 27001, GDPR, and industry-specific regulations" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <ChecklistIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Performance Benchmarking" 
                  secondary="Load testing, stress testing, and performance metrics" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Quality Certification" 
                  secondary="Final certification of software quality" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              SQA/SQCT Preparation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WarningIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Quality Metrics Definition
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Key quality indicators and metrics need to be defined and baselines established.
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
                        Testing Tools Setup
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Advanced testing tools for security, performance, and compliance testing need to be configured.
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
                        SQA Team Assignment
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Specialized quality assurance team with domain expertise needs to be assigned to the project.
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

export default SQASQCT;
