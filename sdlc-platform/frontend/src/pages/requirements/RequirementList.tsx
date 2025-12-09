import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  useTheme,
  Stack
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// GraphQL
const GET_DATA = gql`
  query GetRequirementsData {
    requirements {
      id
      title
      description
      status
      type
      priority
      project {
        id
        name
      }
      assignedTo {
        id
        firstName
        lastName
      }
    }
    projects {
      id
      name
    }
    users {
      id
      firstName
      lastName
      email
    }
  }
`;

const CREATE_REQUIREMENT = gql`
  mutation CreateRequirement($title: String!, $description: String!, $projectId: String!, $createdById: String!, $type: RequirementType, $priority: String, $assignedToId: String) {
    createRequirement(title: $title, description: $description, projectId: $projectId, createdById: $createdById, type: $type, priority: $priority, assignedToId: $assignedToId) {
      id
      title
    }
  }
`;

const DELETE_REQUIREMENT = gql`
  mutation DeleteRequirement($id: String!) {
    deleteRequirement(id: $id)
  }
`;

const REQUIREMENT_TYPES = ['functional', 'non_functional', 'technical', 'business', 'user', 'system'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

const RequirementList: React.FC = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    createdById: '',
    type: 'functional',
    priority: 'medium',
    assignedToId: ''
  });

  const { loading, error, data, refetch } = useQuery(GET_DATA);

  // Auto-select first user as creator for simplicity in this demo if not selected
  // In real app, this would be the logged-in user
  React.useEffect(() => {
    if (data?.users?.length > 0 && !formData.createdById) {
      setFormData(prev => ({ ...prev, createdById: data.users[0].id }));
    }
  }, [data]);

  const [createRequirement] = useMutation(CREATE_REQUIREMENT, {
    onCompleted: () => {
      setOpenDialog(false);
      setFormData(prev => ({ ...prev, title: '', description: '' }));
      refetch();
    }
  });

  const [deleteRequirement] = useMutation(DELETE_REQUIREMENT, {
    onCompleted: () => refetch()
  });

  const handleSubmit = () => {
    if (formData.title && formData.projectId) {
      // Clean up empty strings to undefined or null if needed, but GraphQL might accept null if defined nullable
      const variables: any = { ...formData };
      if (!variables.assignedToId) delete variables.assignedToId;

      createRequirement({ variables });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete requirement?')) {
      deleteRequirement({ variables: { id } });
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1.5, minWidth: 200 },
    { field: 'type', headerName: 'Type', width: 130, renderCell: (params) => <Chip label={params.value} size="small" variant="outlined" /> },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      renderCell: (params) => {
        let color: any = 'default';
        if (params.value === 'high') color = 'warning';
        if (params.value === 'critical') color = 'error';
        if (params.value === 'low') color = 'success';
        return <Chip label={params.value} color={color} size="small" />;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <Chip label={params.value?.replace('_', ' ')} size="small" variant="filled" color={params.value === 'approved' ? 'success' : 'default'} />
    },
    { field: 'project', headerName: 'Project', flex: 1, valueGetter: (params) => params.row.project?.name || '-' },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1, valueGetter: (params) => params.row.assignedTo ? `${params.row.assignedTo.firstName} ${params.row.assignedTo.lastName}` : 'Unassigned' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem icon={<DeleteIcon color="error" />} label="Delete" onClick={() => handleDelete(params.id as string)} />,
      ]
    }
  ];

  if (loading) return <Box p={3}>Loading...</Box>;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Requirements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage functional and non-functional requirements.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          New Requirement
        </Button>
      </Box>

      <Paper elevation={0} sx={{ height: 600, width: '100%', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
        <DataGrid
          rows={data?.requirements || []}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: theme.palette.grey[50] } }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Requirement</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" fullWidth value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            <TextField label="Description" fullWidth multiline rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

            <Stack direction="row" spacing={2}>
              <TextField select label="Type" fullWidth value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                {REQUIREMENT_TYPES.map(t => <MenuItem key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</MenuItem>)}
              </TextField>
              <TextField select label="Priority" fullWidth value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                {PRIORITIES.map(p => <MenuItem key={p} value={p}>{p.toUpperCase()}</MenuItem>)}
              </TextField>
            </Stack>

            <TextField select label="Project" fullWidth value={formData.projectId} onChange={e => setFormData({ ...formData, projectId: e.target.value })}>
              {data.projects.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </TextField>

            <TextField select label="Assign To" fullWidth value={formData.assignedToId} onChange={e => setFormData({ ...formData, assignedToId: e.target.value })}>
              <MenuItem value=""><em>Unassigned</em></MenuItem>
              {data.users.map((u: any) => <MenuItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!formData.title || !formData.projectId}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequirementList;
