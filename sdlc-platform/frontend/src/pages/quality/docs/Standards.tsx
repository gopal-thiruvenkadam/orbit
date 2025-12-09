import React, { useState } from 'react';
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
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeIcon from '@mui/icons-material/Code';
import BuildIcon from '@mui/icons-material/Build';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Sample data
const qualityStandards = {
  title: 'Quality Standards',
  version: '3.2',
  lastUpdated: '2025-10-30',
  categories: [
    {
      id: 'coding',
      name: 'Coding Standards',
      icon: <CodeIcon />,
      standards: [
        { id: 1, name: 'Code Style and Formatting', description: 'All code must follow the established style guide. Use ESLint/Prettier for JavaScript/TypeScript, and language-specific formatters for other languages.' },
        { id: 2, name: 'Code Documentation', description: 'All classes, methods, and functions must be documented with JSDoc, docstrings, or similar tools. Include purpose, parameters, return values, and exceptions.' },
        { id: 3, name: 'Unit Testing', description: 'Minimum 80% unit test coverage for all new code. Tests must validate normal, edge cases, and error handling.' },
        { id: 4, name: 'Code Complexity', description: 'Maintain cyclomatic complexity below 15 per function. Class methods should not exceed 50 lines.' },
        { id: 5, name: 'Code Reviews', description: 'All code changes require at least one peer review. Address all review comments before merging.' }
      ]
    },
    {
      id: 'security',
      name: 'Security Standards',
      icon: <SecurityIcon />,
      standards: [
        { id: 6, name: 'Authentication & Authorization', description: 'Implement OAuth 2.0 with OpenID Connect for authentication. Use role-based access control for authorization.' },
        { id: 7, name: 'Data Protection', description: 'Encrypt all sensitive data at rest (AES-256) and in transit (TLS 1.3). Apply data minimization principles.' },
        { id: 8, name: 'Input Validation', description: 'Validate all inputs on both client and server sides. Use parameterized queries for database operations.' },
        { id: 9, name: 'Security Testing', description: 'Conduct regular security testing including SAST, DAST, and penetration testing. Remediate all high and critical findings before release.' },
        { id: 10, name: 'Dependency Management', description: 'Regularly update dependencies. Block releases with known high or critical vulnerabilities.' }
      ]
    },
    {
      id: 'performance',
      name: 'Performance Standards',
      icon: <SpeedIcon />,
      standards: [
        { id: 11, name: 'Response Time', description: 'API endpoints must respond within 300ms (p95) under normal load. UI interactions must complete within 100ms.' },
        { id: 12, name: 'Scalability', description: 'System must support 1000 concurrent users with less than 10% degradation in performance.' },
        { id: 13, name: 'Resource Utilization', description: 'Memory usage must not increase by more than 5% over 24 hours of operation. CPU utilization should remain below 70% during peak loads.' },
        { id: 14, name: 'Caching', description: 'Implement appropriate caching strategies for static content and frequently accessed data. Cache hit ratio should exceed 80%.' },
        { id: 15, name: 'Performance Testing', description: 'Conduct load and stress testing before each major release. Document baseline performance metrics and track over time.' }
      ]
    },
    {
      id: 'architecture',
      name: 'Architecture Standards',
      icon: <BuildIcon />,
      standards: [
        { id: 16, name: 'Architectural Patterns', description: 'Follow microservices architecture for backend services. Implement layered architecture within services.' },
        { id: 17, name: 'API Design', description: 'APIs must follow REST principles. Use OpenAPI/Swagger for documentation. Support versioning.' },
        { id: 18, name: 'Error Handling', description: 'Implement consistent error handling across the system. Include proper logging and monitoring of errors.' },
        { id: 19, name: 'Configuration Management', description: 'Externalize configuration from code. Support environment-specific configuration.' },
        { id: 20, name: 'Monitoring and Observability', description: 'Implement comprehensive logging, metrics collection, and tracing. Use structured logging format.' }
      ]
    },
    {
      id: 'integration',
      name: 'Integration Standards',
      icon: <IntegrationInstructionsIcon />,
      standards: [
        { id: 21, name: 'CI/CD Pipeline', description: 'All code must pass through automated CI/CD pipeline. Pipeline must include build, test, security scan, and deployment stages.' },
        { id: 22, name: 'Environment Management', description: 'Maintain separate development, testing, staging, and production environments. Environments should be as similar as possible.' },
        { id: 23, name: 'Deployment Strategies', description: 'Use blue-green or canary deployments for production releases. Support rollback capabilities.' },
        { id: 24, name: 'Integration Testing', description: 'Implement comprehensive integration tests covering all service interactions. Tests must run in the CI/CD pipeline.' },
        { id: 25, name: 'API Versioning', description: 'Follow semantic versioning. Support at least one previous API version for backward compatibility.' }
      ]
    }
  ]
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`standards-tabpanel-${index}`}
      aria-labelledby={`standards-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Standards: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
            {qualityStandards.title}
          </Typography>
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

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">Version</Typography>
              <Typography variant="body1">{qualityStandards.version}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
              <Typography variant="body1">{qualityStandards.lastUpdated}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography variant="body1">
                Comprehensive quality standards for the Intuitive Digital SDLC Platform
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              variant="scrollable"
              scrollButtons="auto"
              aria-label="standards tabs"
            >
              {qualityStandards.categories.map((category, index) => (
                <Tab 
                  key={category.id} 
                  icon={category.icon} 
                  label={category.name} 
                  id={`standards-tab-${index}`}
                  aria-controls={`standards-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>
          
          {qualityStandards.categories.map((category, index) => (
            <TabPanel key={category.id} value={value} index={index}>
              <Typography variant="h5" gutterBottom>
                {category.name}
              </Typography>
              
              {category.standards.map((standard) => (
                <Card key={standard.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {standard.name}
                    </Typography>
                    <Typography variant="body1">
                      {standard.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Chip
                        icon={<CheckIcon />}
                        label="Required"
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </TabPanel>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Standards;
