import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CapacityMetricsCardsProps {
  users: any[];
}

const CapacityMetricsCards: React.FC<CapacityMetricsCardsProps> = ({ users }) => {
  // Calculate metrics from data
  const totalAllocation = users.reduce((sum, user) => {
    const userAllocation = user.allocations?.reduce(
      (total: number, alloc: any) => total + (alloc.allocationPercentage || 0),
      0
    ) || 0;
    return sum + userAllocation;
  }, 0);

  const overallCapacity = users.length > 0 ? Math.round(totalAllocation / users.length) : 0;

  const criticalResources = users.filter(user => {
    return user.allocations?.some((alloc: any) => alloc.allocationPercentage > 80);
  }).length;

  const forecastedBottlenecks = users.filter(user => {
    const userTotal = user.allocations?.reduce((t: number, a: any) => t + (a.allocationPercentage || 0), 0) || 0;
    return userTotal > 100;
  }).length;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">Overall Capacity</Typography>
              <PersonIcon color="primary" />
            </Box>
            <Typography variant="h4">{overallCapacity}%</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {overallCapacity > 100 ? (
                <>
                  <TrendingUpIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="error">Overallocated</Typography>
                </>
              ) : (
                <>
                  <TrendingDownIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="success">Healthy</Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">High Load Resources</Typography>
              <WarningIcon color="warning" />
            </Box>
            <Typography variant="h4">{criticalResources}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2">
                Users with &gt; 80% allocation
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">Team Utilization</Typography>
              <GroupsIcon color="primary" />
            </Box>
            <Typography variant="h4">{Math.min(overallCapacity, 100)}%</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="success">Optimal (75-90%)</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">Bottlenecks</Typography>
              <AccessTimeIcon color="error" />
            </Box>
            <Typography variant="h4">{forecastedBottlenecks}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2">Users &gt; 100% load</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CapacityMetricsCards;
