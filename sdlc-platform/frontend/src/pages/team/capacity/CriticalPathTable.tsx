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
  Typography,
  Paper
} from '@mui/material';

import {
  projectsCapacity,
  teamMembersCapacity,
  getAvatarColor,
  calculateTotalAllocation,
  getCapacityColor
} from '../../../data/capacityData';

const CriticalPathTable: React.FC = () => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Critical Path Tasks
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          These tasks are on the critical path and any delays will impact project timelines.
        </Typography>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Risk Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectsCapacity
              .filter(project => project.criticalPath.length > 0)
              .flatMap(project => 
                project.criticalPath.map((task, index) => {
                  // Find the team member assigned to this task
                  const assignee = teamMembersCapacity.find(member => member.name === task.assignee);
                  
                  // Calculate the team member's total allocation
                  const totalAllocation = assignee 
                    ? calculateTotalAllocation(assignee.projects) 
                    : 0;
                  
                  // Determine risk level based on allocation
                  const capacityRisk = totalAllocation > 100 ? 'High' : totalAllocation > 90 ? 'Medium' : 'Low';
                  
                  return (
                    <TableRow key={`${project.id}-${index}`}>
                      <TableCell>
                        <Chip 
                          label={project.name} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              bgcolor: getAvatarColor(task.assignee),
                              fontSize: '0.875rem',
                              mr: 1
                            }}
                          >
                            {assignee?.avatar}
                          </Avatar>
                          <Typography variant="body2">{task.assignee}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${totalAllocation}%`} 
                          color={getCapacityColor(totalAllocation)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(task.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={capacityRisk} 
                          color={
                            capacityRisk === 'High' ? 'error' : 
                            capacityRisk === 'Medium' ? 'warning' : 
                            'success'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CriticalPathTable;
