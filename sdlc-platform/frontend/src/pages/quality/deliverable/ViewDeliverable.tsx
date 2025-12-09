import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SendIcon from '@mui/icons-material/Send';

// Sample deliverable data
const sampleDeliverables = [
  {
    id: 1, 
    name: 'Design Inputs', 
    phase: 'Building Phase',
    type: 'Document',
    status: 'completed', 
    description: 'Comprehensive design input documentation for the project. Contains detailed specifications and requirements.',
    documentUrl: '/docs/design-inputs.pdf',
    createdBy: 'John Smith',
    createdDate: '2025-11-10',
    lastUpdated: '2025-11-15',
    version: '1.2',
    comments: [
      { id: 1, user: 'Emily Johnson', date: '2025-11-11', text: 'Please add more details to the API section.' },
      { id: 2, user: 'John Smith', date: '2025-11-12', text: 'Updated the API section with requested details.' },
      { id: 3, user: 'Sarah Williams', date: '2025-11-15', text: 'Approved the final version.' }
    ],
    revisionHistory: [
      { version: '1.0', date: '2025-11-10', author: 'John Smith', changes: 'Initial document creation' },
      { version: '1.1', date: '2025-11-12', author: 'John Smith', changes: 'Updated API section based on feedback' },
      { version: '1.2', date: '2025-11-15', author: 'John Smith', changes: 'Final review changes implemented' }
    ]
  },
  {
    id: 2, 
    name: 'Trace', 
    phase: 'Building Phase',
    type: 'Document',
    status: 'completed', 
    description: 'End-to-end traceability document for project requirements.',
    documentUrl: '/docs/trace-document.pdf',
    createdBy: 'Emily Johnson',
    createdDate: '2025-11-05',
    lastUpdated: '2025-11-10',
    version: '1.0',
    comments: [
      { id: 1, user: 'Robert Chen', date: '2025-11-08', text: 'Make sure all requirements are included.' },
      { id: 2, user: 'Emily Johnson', date: '2025-11-10', text: 'All requirements have been mapped and verified.' }
    ],
    revisionHistory: [
      { version: '0.5', date: '2025-11-05', author: 'Emily Johnson', changes: 'Initial draft' },
      { version: '1.0', date: '2025-11-10', author: 'Emily Johnson', changes: 'Completed mapping of all requirements' }
    ]
  },
  {
    id: 3, 
    name: 'Architecture and Patterns Spec', 
    phase: 'QA',
    type: 'Specification',
    status: 'completed', 
    description: 'Detailed architecture specification including design patterns used in the project.',
    documentUrl: '/docs/architecture-spec.pdf',
    createdBy: 'Michael Lee',
    createdDate: '2025-11-01',
    lastUpdated: '2025-11-20',
    version: '2.1',
    comments: [
      { id: 1, user: 'David Wilson', date: '2025-11-05', text: 'Need more details on the scalability approach.' },
      { id: 2, user: 'Michael Lee', date: '2025-11-10', text: 'Added scalability section with AWS architecture details.' },
      { id: 3, user: 'Sarah Williams', date: '2025-11-18', text: 'Security concerns addressed, looking good.' }
    ],
    revisionHistory: [
      { version: '1.0', date: '2025-11-01', author: 'Michael Lee', changes: 'Initial architecture document' },
      { version: '2.0', date: '2025-11-10', author: 'Michael Lee', changes: 'Added scalability section' },
      { version: '2.1', date: '2025-11-20', author: 'Michael Lee', changes: 'Updated security architecture' }
    ]
  },
  {
    id: 4, 
    name: 'Integration Document', 
    phase: 'QA',
    type: 'Document',
    status: 'in_progress', 
    description: 'Documentation of integration points and interfaces between system components.',
    documentUrl: '/docs/integration-doc.pdf',
    createdBy: 'Robert Chen',
    createdDate: '2025-11-15',
    lastUpdated: '2025-11-25',
    version: '0.8',
    comments: [
      { id: 1, user: 'Michael Lee', date: '2025-11-20', text: 'Need to clarify the OAuth flow between services.' },
      { id: 2, user: 'Robert Chen', date: '2025-11-25', text: 'Working on the OAuth flow diagrams.' }
    ],
    revisionHistory: [
      { version: '0.5', date: '2025-11-15', author: 'Robert Chen', changes: 'Initial integration outline' },
      { version: '0.8', date: '2025-11-25', author: 'Robert Chen', changes: 'Added API endpoints and authentication flows' }
    ]
  }
];

// Status to color and icon mapping
const statusConfig = {
  completed: { color: 'success', icon: <CheckCircleIcon color="success" /> },
  in_progress: { color: 'info', icon: <PendingIcon color="info" /> },
  not_started: { color: 'default', icon: <PendingIcon color="disabled" /> },
  blocked: { color: 'error', icon: <PendingIcon color="error" /> }
} as const;

const ViewDeliverable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deliverable, setDeliverable] = useState<any>(null);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    // In a real app, you would fetch from an API
    const foundDeliverable = sampleDeliverables.find(
      (item) => item.id === Number(id)
    );
    
    if (foundDeliverable) {
      setDeliverable(foundDeliverable);
    } else {
      // If no deliverable found, navigate to NotFound page
      navigate('/not-found');
    }
  }, [id, navigate]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, you would submit to an API
    console.log('Adding comment:', newComment);
    
    // Mock adding a comment
    const updatedDeliverable = { ...deliverable };
    updatedDeliverable.comments.push({
      id: updatedDeliverable.comments.length + 1,
      user: 'Current User',
      date: new Date().toISOString().split('T')[0],
      text: newComment
    });
    
    setDeliverable(updatedDeliverable);
    setNewComment('');
  };

  if (!deliverable) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/quality')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {deliverable.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">{deliverable.name}</Typography>
                <Chip
                  label={deliverable.status.replace('_', ' ')}
                  color={statusConfig[deliverable.status as keyof typeof statusConfig].color as any}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
              <Box>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />} 
                  sx={{ mr: 2 }}
                  href={deliverable.documentUrl}
                >
                  Download
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/quality/deliverable/${id}/edit`)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Phase" secondary={deliverable.phase} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Type" secondary={deliverable.type} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Created By" secondary={deliverable.createdBy} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText primary="Created Date" secondary={deliverable.createdDate} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText primary="Last Updated" secondary={deliverable.lastUpdated} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Version" secondary={deliverable.version} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {deliverable.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Revision History
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Version</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Changes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliverable.revisionHistory.map((revision: any) => (
                    <TableRow key={revision.version}>
                      <TableCell>{revision.version}</TableCell>
                      <TableCell>{revision.date}</TableCell>
                      <TableCell>{revision.author}</TableCell>
                      <TableCell>{revision.changes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {deliverable.comments.map((comment: any) => (
                <Box 
                  key={comment.id} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 1,
                    bgcolor: 'background.default' 
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">{comment.user}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {comment.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Add Comment
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                placeholder="Type your comment here..."
                multiline
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mr: 1 }}
              />
              <IconButton 
                color="primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewDeliverable;
