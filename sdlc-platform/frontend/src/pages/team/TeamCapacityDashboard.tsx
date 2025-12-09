import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert
} from '@mui/material';
import TeamMemberLoadTable from './capacity/TeamMemberLoadTable';
import ProjectAllocationTable from './capacity/ProjectAllocationTable';
import CriticalPathTable from './capacity/CriticalPathTable';
import CapacityMetricsCards from './capacity/CapacityMetricsCards';
import { departments } from '../../data/capacityData'; // Keep departments for filter or fetch relevant departments

// GraphQL Query
const GET_TEAM_CAPACITY = gql`
  query GetTeamCapacity {
    users {
      id
      firstName
      lastName
      position
      department
      avatar
      allocations {
        id
        allocationPercentage
        role
        project {
          id
          name
          status
        }
      }
    }
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`capacity-tabpanel-${index}`}
      aria-labelledby={`capacity-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TeamCapacityDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const { loading, error, data } = useQuery(GET_TEAM_CAPACITY);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDepartmentFilterChange = (event: SelectChangeEvent) => {
    setDepartmentFilter(event.target.value);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">Error loading team capacity: {error.message}</Alert>;

  const users = data?.users || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Team Capacity Planning
        </Typography>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="department-filter-label">Department</InputLabel>
          <Select
            labelId="department-filter-label"
            id="department-filter"
            value={departmentFilter}
            label="Department"
            onChange={handleDepartmentFilterChange}
          >
            <MenuItem value="All">All Departments</MenuItem>
            {departments.map((department) => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <CapacityMetricsCards users={users} />

      {/* Tabs for different views */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="capacity planning tabs"
        >
          <Tab label="Team Member Load" />
          <Tab label="Project Allocation" />
          <Tab label="Critical Path Analysis" />
        </Tabs>

        {/* Team Member Load Tab */}
        <TabPanel value={tabValue} index={0}>
          <TeamMemberLoadTable users={users} departmentFilter={departmentFilter} />
        </TabPanel>

        {/* Project Allocation Tab */}
        <TabPanel value={tabValue} index={1}>
          <ProjectAllocationTable users={users} />
        </TabPanel>

        {/* Critical Path Analysis Tab */}
        <TabPanel value={tabValue} index={2}>
          <CriticalPathTable />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default TeamCapacityDashboard;
