import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Sample metrics data
const qualityMetrics = {
  title: 'Quality Metrics',
  lastUpdated: '2025-11-28',
  periods: ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Year to Date'],
  summary: {
    testCoverage: { current: 84, target: 80, previous: 82, trend: 'improving' },
    defectDensity: { current: 2.3, target: 5, previous: 2.7, trend: 'improving' },
    passRate: { current: 91, target: 90, previous: 89, trend: 'improving' },
    technicalDebt: { current: 120, target: 100, previous: 150, trend: 'improving' },
    documentationCoverage: { current: 76, target: 85, previous: 70, trend: 'improving' },
    securityVulnerabilities: { current: 3, target: 0, previous: 5, trend: 'improving' }
  },
  detailedMetrics: {
    testMetrics: [
      { metric: 'Unit Test Coverage', value: '84%', target: '80%', status: 'above_target' },
      { metric: 'Integration Test Coverage', value: '72%', target: '70%', status: 'above_target' },
      { metric: 'UI Test Coverage', value: '65%', target: '70%', status: 'below_target' },
      { metric: 'Test Pass Rate', value: '91%', target: '90%', status: 'above_target' },
      { metric: 'Test Execution Time', value: '15 min', target: '20 min', status: 'above_target' }
    ],
    defectMetrics: [
      { metric: 'Critical Defects', value: '0', target: '0', status: 'at_target' },
      { metric: 'High Priority Defects', value: '3', target: '2', status: 'below_target' },
      { metric: 'Medium Priority Defects', value: '12', target: '15', status: 'above_target' },
      { metric: 'Low Priority Defects', value: '24', target: '30', status: 'above_target' },
      { metric: 'Defect Resolution Time', value: '2.5 days', target: '3 days', status: 'above_target' }
    ],
    codeQualityMetrics: [
      { metric: 'Code Complexity', value: '12', target: '15', status: 'above_target' },
      { metric: 'Code Duplication', value: '4.2%', target: '5%', status: 'above_target' },
      { metric: 'Static Analysis Issues', value: '25', target: '30', status: 'above_target' },
      { metric: 'Technical Debt (person-days)', value: '120', target: '100', status: 'below_target' },
      { metric: 'Documentation Coverage', value: '76%', target: '85%', status: 'below_target' }
    ],
    performanceMetrics: [
      { metric: 'API Response Time', value: '250ms', target: '300ms', status: 'above_target' },
      { metric: 'Page Load Time', value: '1.8s', target: '2s', status: 'above_target' },
      { metric: 'Database Query Time', value: '85ms', target: '100ms', status: 'above_target' },
      { metric: 'Memory Usage', value: '65%', target: '70%', status: 'above_target' },
      { metric: 'CPU Utilization', value: '62%', target: '75%', status: 'above_target' }
    ],
    securityMetrics: [
      { metric: 'Critical Vulnerabilities', value: '0', target: '0', status: 'at_target' },
      { metric: 'High Vulnerabilities', value: '1', target: '0', status: 'below_target' },
      { metric: 'Medium Vulnerabilities', value: '2', target: '3', status: 'above_target' },
      { metric: 'Low Vulnerabilities', value: '8', target: '10', status: 'above_target' },
      { metric: 'OWASP Compliance', value: '94%', target: '90%', status: 'above_target' }
    ]
  },
  trendData: {
    testCoverage: [78, 79, 80, 82, 83, 84, 84],
    defectDensity: [3.2, 3.0, 2.8, 2.6, 2.5, 2.4, 2.3],
    passRate: [86, 87, 88, 89, 90, 91, 91],
    technicalDebt: [180, 170, 160, 150, 140, 130, 120],
    securityVulnerabilities: [8, 7, 6, 5, 4, 3, 3]
  }
};

// Status configuration
const statusConfig = {
  above_target: { color: 'success', icon: <CheckCircleIcon color="success" /> },
  at_target: { color: 'success', icon: <CheckCircleIcon color="success" /> },
  below_target: { color: 'error', icon: <PriorityHighIcon color="error" /> },
  improving: { color: 'success', icon: <TrendingUpIcon color="success" /> },
  declining: { color: 'error', icon: <TrendingDownIcon color="error" /> }
} as const;

const Metrics: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<string>(qualityMetrics.periods[0]);

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  // Helper function to render progress bar with color based on comparison to target
  const renderProgressBar = (current: number, target: number) => {
    const isGood = current >= target;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((current / target) * 100, 100)} 
            color={isGood ? 'success' : 'error'} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {Math.round((current / target) * 100)}%
          </Typography>
        </Box>
      </Box>
    );
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
            {qualityMetrics.title}
          </Typography>
        </Box>
        <Box>
          <FormControl size="small" sx={{ width: 150, mr: 2 }}>
            <InputLabel id="period-select-label">Time Period</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select"
              value={period}
              label="Time Period"
              onChange={handlePeriodChange}
            >
              {qualityMetrics.periods.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Share">
            <IconButton sx={{ mr: 1 }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
          >
            Export Data
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" gutterBottom>
            Key Metrics Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: {qualityMetrics.lastUpdated}
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Test Coverage */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Test Coverage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h4" component="div">
                    {qualityMetrics.summary.testCoverage.current}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {statusConfig[qualityMetrics.summary.testCoverage.trend as keyof typeof statusConfig].icon}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {qualityMetrics.summary.testCoverage.previous}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: {qualityMetrics.summary.testCoverage.target}%
                </Typography>
                {renderProgressBar(qualityMetrics.summary.testCoverage.current, qualityMetrics.summary.testCoverage.target)}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Defect Density */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Defect Density (per 1000 LOC)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h4" component="div">
                    {qualityMetrics.summary.defectDensity.current}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {statusConfig[qualityMetrics.summary.defectDensity.trend as keyof typeof statusConfig].icon}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {qualityMetrics.summary.defectDensity.previous}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: &lt; {qualityMetrics.summary.defectDensity.target}
                </Typography>
                {renderProgressBar(qualityMetrics.summary.defectDensity.target - qualityMetrics.summary.defectDensity.current, qualityMetrics.summary.defectDensity.target)}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Test Pass Rate */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Test Pass Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h4" component="div">
                    {qualityMetrics.summary.passRate.current}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {statusConfig[qualityMetrics.summary.passRate.trend as keyof typeof statusConfig].icon}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {qualityMetrics.summary.passRate.previous}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: {qualityMetrics.summary.passRate.target}%
                </Typography>
                {renderProgressBar(qualityMetrics.summary.passRate.current, qualityMetrics.summary.passRate.target)}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Technical Debt */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Technical Debt (person-days)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h4" component="div">
                    {qualityMetrics.summary.technicalDebt.current}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {statusConfig[qualityMetrics.summary.technicalDebt.trend as keyof typeof statusConfig].icon}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {qualityMetrics.summary.technicalDebt.previous}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: &lt; {qualityMetrics.summary.technicalDebt.target}
                </Typography>
                {renderProgressBar(qualityMetrics.summary.technicalDebt.target - qualityMetrics.summary.technicalDebt.current + 100, qualityMetrics.summary.technicalDebt.target)}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Documentation Coverage */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Documentation Coverage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h4" component="div">
                    {qualityMetrics.summary.documentationCoverage.current}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {statusConfig[qualityMetrics.summary.documentationCoverage.trend as keyof typeof statusConfig].icon}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {qualityMetrics.summary.documentationCoverage.previous}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: {qualityMetrics.summary.documentationCoverage.target}%
                </Typography>
                {renderProgressBar(qualityMetrics.summary.documentationCoverage.current, qualityMetrics.summary.documentationCoverage.target)}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Security Vulnerabilities */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Security Vulnerabilities
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h4" component="div">
                    {qualityMetrics.summary.securityVulnerabilities.current}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {statusConfig[qualityMetrics.summary.securityVulnerabilities.trend as keyof typeof statusConfig].icon}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {qualityMetrics.summary.securityVulnerabilities.previous}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: {qualityMetrics.summary.securityVulnerabilities.target}
                </Typography>
                {renderProgressBar(10 - qualityMetrics.summary.securityVulnerabilities.current, 10)}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Detailed Metrics
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Test Metrics
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Current</TableCell>
                  <TableCell align="right">Target</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualityMetrics.detailedMetrics.testMetrics.map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell component="th" scope="row">
                      {row.metric}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.target}</TableCell>
                    <TableCell align="right">
                      <Chip
                        icon={statusConfig[row.status as keyof typeof statusConfig].icon}
                        label={row.status.replace('_', ' ')}
                        color={statusConfig[row.status as keyof typeof statusConfig].color as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Defect Metrics
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Current</TableCell>
                  <TableCell align="right">Target</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualityMetrics.detailedMetrics.defectMetrics.map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell component="th" scope="row">
                      {row.metric}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.target}</TableCell>
                    <TableCell align="right">
                      <Chip
                        icon={statusConfig[row.status as keyof typeof statusConfig].icon}
                        label={row.status.replace('_', ' ')}
                        color={statusConfig[row.status as keyof typeof statusConfig].color as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Code Quality Metrics
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Current</TableCell>
                  <TableCell align="right">Target</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualityMetrics.detailedMetrics.codeQualityMetrics.map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell component="th" scope="row">
                      {row.metric}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.target}</TableCell>
                    <TableCell align="right">
                      <Chip
                        icon={statusConfig[row.status as keyof typeof statusConfig].icon}
                        label={row.status.replace('_', ' ')}
                        color={statusConfig[row.status as keyof typeof statusConfig].color as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default Metrics;
