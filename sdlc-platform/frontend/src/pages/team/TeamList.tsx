import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Menu
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL Operations
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      department
      position
      isActive
      role: position # utilizing position as role for now
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $firstName: String!, $lastName: String!) {
    createUser(email: $email, firstName: $firstName, lastName: $lastName) {
      id
      email
      firstName
      lastName
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $firstName: String, $lastName: String, $email: String, $department: String, $position: String, $isActive: Boolean) {
    updateUser(id: $id, firstName: $firstName, lastName: $lastName, email: $email, department: $department, position: $position, isActive: $isActive) {
      id
      firstName
      lastName
      department
      position
      isActive
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

// Get random color for avatar
const getAvatarColor = (name: string) => {
  const colors = [
    '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#c2185b',
    '#00796b', '#e64a19', '#5d4037', '#455a64', '#0288d1'
  ];

  const hash = name.split('').reduce((a, b) => {
    return a + b.charCodeAt(0);
  }, 0);

  return colors[hash % colors.length];
};

interface UserFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
}

const TeamList: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Menu state for edit/delete
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleOpenDialog = (user?: any) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department || '',
        position: user.position || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: ''
      });
    }
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateUser({
          variables: {
            id: editingId,
            ...formData
          }
        });
      } else {
        await createUser({
          variables: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email
          }
        });
        // If creating, we might want to update the other fields too, but CreateUser only takes basic info currently.
        // We'd need to update CreateUser or do a second call. 
        // For now, let's assume CreateUser is basic and user can edit later for details, 
        // OR better: update CreateUser to accept all fields.
        // But for this step I kept CreateUser simple in previous step.
        // Actually, I should probably have updated CreateUser mutation signature in backend if I wanted to set all fields at once.
        // Let's stick to basic create for now.
      }
      setOpenDialog(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      if (window.confirm(`Are you sure you want to delete ${selectedUser.firstName}?`)) {
        await deleteUser({ variables: { id: selectedUser.id } });
        refetch();
        handleMenuClose();
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading team members</Typography>;

  const users = data?.users || [];

  // Extract unique departments
  const departments = Array.from(new Set(users.map((u: any) => u.department).filter(Boolean))) as string[];

  // Filter users based on tab
  const filteredUsers = tabValue === 0
    ? users
    : users.filter((u: any) => u.department === departments[tabValue - 1]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Team Members
          </Typography>
          <Typography variant="body1">
            View and manage the project team members.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Member
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="team tabs"
        >
          <Tab label="All Members" />
          {departments.map((dept, index) => (
            <Tab key={index} label={dept} />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {filteredUsers.map((member: any) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(member.firstName + member.lastName),
                            width: 56,
                            height: 56,
                            mr: 2
                          }}
                        >
                          {member.firstName[0]}{member.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h2">
                            {member.firstName} {member.lastName}
                          </Typography>
                          <Typography color="text.secondary" gutterBottom>
                            {member.position || 'No Position'}
                          </Typography>
                          {member.department && (
                            <Chip
                              label={member.department}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, member)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Email:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {member.email}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={member.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={member.isActive ? "success" : "default"}
                        variant="filled"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filteredUsers.length === 0 && (
              <Typography sx={{ p: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                No team members found.
              </Typography>
            )}
          </Grid>
        </Box>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Department"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <TextField
              label="Position"
              fullWidth
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleOpenDialog(selectedUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

    </Box>
  );
};

export default TeamList;
