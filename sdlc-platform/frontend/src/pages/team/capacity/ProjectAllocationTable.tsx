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
  Typography,
  Tooltip
} from '@mui/material';

import {
  getAvatarColor
} from '../../../data/capacityData';

interface ProjectAllocationTableProps {
  users: any[];
}

const ProjectAllocationTable: React.FC<ProjectAllocationTableProps> = ({ users }) => {
  // Aggregate projects from user allocations
  const projectsMap = new Map<string, any>();
  const projectMembersMap = new Map<string, any[]>();
  const projectTotalAllocationMap = new Map<string, number>();

  users?.forEach(user => {
    user.allocations?.forEach((alloc: any) => {
      const proj = alloc.project;
      if (!projectsMap.has(proj.id)) {
        projectsMap.set(proj.id, proj);
      }

      if (!projectMembersMap.has(proj.id)) {
        projectMembersMap.set(proj.id, []);
      }
      projectMembersMap.get(proj.id)?.push(user);

      const currentTotal = projectTotalAllocationMap.get(proj.id) || 0;
      projectTotalAllocationMap.set(proj.id, currentTotal + (alloc.allocationPercentage || 0));
    });
  });

  const projects = Array.from(projectsMap.values());

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>Team Members</TableCell>
            <TableCell>Risk Level</TableCell>
            <TableCell>Resource Allocation</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => {
            const assignedMembers = projectMembersMap.get(project.id) || [];
            const totalAllocation = projectTotalAllocationMap.get(project.id) || 0;

            // Mock risks for now
            const isCritical = totalAllocation < 50;
            const progress = 45; // Placeholder

            return (
              <TableRow key={project.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">{project.name}</Typography>
                    {isCritical && (
                      <Chip
                        label="Critical"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    {assignedMembers.map((member: any, index: number) => (
                      <Tooltip key={member.id} title={`${member.firstName} ${member.lastName}`}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: getAvatarColor(`${member.firstName} ${member.lastName}`),
                            fontSize: '0.75rem',
                            ml: index > 0 ? -0.75 : 0,
                            border: '2px solid #fff'
                          }}
                        >
                          {member.avatar || `${member.firstName?.[0]}${member.lastName?.[0]}`}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={isCritical ? 'High' : 'Low'}
                    color={isCritical ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{totalAllocation}%</TableCell>
                <TableCell>
                  <Chip
                    label={project.status ? project.status.replace('_', ' ') : 'Unknown'}
                    color="default"
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" color="text.secondary">No active project allocations</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectAllocationTable;
