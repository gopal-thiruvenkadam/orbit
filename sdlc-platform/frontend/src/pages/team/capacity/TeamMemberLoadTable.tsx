import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

import {
  getAvatarColor,
  getCapacityColor
} from '../../../data/capacityData';

interface TeamMemberLoadTableProps {
  users: any[];
  departmentFilter: string;
}

const TeamMemberLoadTable: React.FC<TeamMemberLoadTableProps> = ({ users, departmentFilter }) => {
  // Filter team members by department
  const filteredUsers = departmentFilter === 'All'
    ? users
    : users.filter(user => user.department === departmentFilter);

  const calculateTotalAllocation = (allocations: any[]): number => {
    return allocations?.reduce((sum, alloc) => sum + (alloc.allocationPercentage || 0), 0) || 0;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team Member</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Current Capacity</TableCell>
            <TableCell>Projects</TableCell>
            <TableCell>Critical Tasks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => {
            const allocations = user.allocations || [];
            const totalAllocation = calculateTotalAllocation(allocations);
            // Mocking critical for now as we don't have task level criticality on user yet
            const criticalProjects = allocations.filter((a: any) => a.project?.status === 'critical' || a.allocationPercentage > 50);

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(`${user.firstName} ${user.lastName}`),
                        mr: 2
                      }}
                    >
                      {user.avatar || `${user.firstName?.[0]}${user.lastName?.[0]}`}
                    </Avatar>
                    <Typography variant="body1">{`${user.firstName} ${user.lastName}`}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.position || 'N/A'}</TableCell>
                <TableCell>{user.department || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ width: '70%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(totalAllocation, 100)}
                        color={getCapacityColor(totalAllocation)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 35 }}>
                      {totalAllocation}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {allocations.map((alloc: any) => (
                      <Chip
                        key={alloc.id}
                        label={`${alloc.project?.name} (${alloc.allocationPercentage}%)`}
                        color={alloc.allocationPercentage > 50 ? 'warning' : 'default'}
                        size="small"
                      />
                    ))}
                    {allocations.length === 0 && <Typography variant="caption" color="text.secondary">No projects</Typography>}
                  </Box>
                </TableCell>
                <TableCell>
                  {criticalProjects.length > 0 ?
                    <Chip
                      icon={<WarningIcon />}
                      label={`${criticalProjects.length} critical ${criticalProjects.length === 1 ? 'project' : 'projects'}`}
                      color="warning"
                      size="small"
                    /> :
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="None"
                      color="success"
                      size="small"
                    />
                  }
                </TableCell>
              </TableRow>
            );
          })}
          {filteredUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary">No team members found</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamMemberLoadTable;
