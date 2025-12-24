import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    LinearProgress,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
    alpha,
    useTheme,
    Tooltip,
    Avatar,
    AvatarGroup,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Slider
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
    EmojiEvents as GoalIcon,
    TrackChanges as ObjectiveIcon,
    ShowChart as KeyResultIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

// GraphQL Operations
const GET_OKR_DATA = gql`
  query GetOKRData {
    users {
      id
      firstName
      lastName
    }
    strategicGoals {
      id
      title
      description
      status
      targetAchievement
      owners {
        id
        firstName
        lastName
      }
    }
    objectives {
      id
      title
      description
      cycle
      strategicGoalId
      progress
      status
      owners {
        id
        firstName
        lastName
      }
      projects {
        id
        name
      }
      keyResults {
        id
        title
        startValue
        targetValue
        currentValue
        metricType
        progress
      }
    }
  }
`;

const CREATE_GOAL = gql`
  mutation CreateStrategicGoal($title: String!, $description: String, $ownerIds: [String!], $targetAchievement: Float) {
    createStrategicGoal(title: $title, description: $description, ownerIds: $ownerIds, targetAchievement: $targetAchievement) {
      id
      title
      owners {
        id
        firstName
        lastName
      }
      targetAchievement
    }
  }
`;

const UPDATE_GOAL = gql`
  mutation UpdateStrategicGoal($id: String!, $title: String, $description: String, $status: String, $ownerIds: [String!], $targetAchievement: Float) {
    updateStrategicGoal(id: $id, title: $title, description: $description, status: $status, ownerIds: $ownerIds, targetAchievement: $targetAchievement) {
      id
      title
      description
      status
      targetAchievement
      owners {
        id
        firstName
        lastName
      }
    }
  }
`;

const DELETE_GOAL = gql`
  mutation DeleteStrategicGoal($id: String!) {
    deleteStrategicGoal(id: $id)
  }
`;

const CREATE_OBJECTIVE = gql`
  mutation CreateObjective($title: String!, $strategicGoalId: String!, $description: String, $cycle: String, $ownerIds: [String!], $status: String) {
    createObjective(title: $title, strategicGoalId: $strategicGoalId, description: $description, cycle: $cycle, ownerIds: $ownerIds, status: $status) {
      id
      title
      owners {
        id
      }
    }
  }
`;

const UPDATE_OBJECTIVE = gql`
  mutation UpdateObjective($id: String!, $title: String, $description: String, $cycle: String, $ownerIds: [String!], $status: String) {
    updateObjective(id: $id, title: $title, description: $description, cycle: $cycle, ownerIds: $ownerIds, status: $status) {
      id
      title
      description
      cycle
      status
      owners {
        id
        firstName
        lastName
      }
    }
  }
`;

const DELETE_OBJECTIVE = gql`
  mutation DeleteObjective($id: String!) {
    deleteObjective(id: $id)
  }
`;

const CREATE_KEY_RESULT = gql`
  mutation CreateKeyResult($title: String!, $objectiveId: String!, $targetValue: Float!, $startValue: Float, $metricType: String) {
    createKeyResult(title: $title, objectiveId: $objectiveId, targetValue: $targetValue, startValue: $startValue, metricType: $metricType) {
      id
      title
      targetValue
      startValue
      currentValue
      metricType
      progress
    }
  }
`;

const UPDATE_KEY_RESULT = gql`
  mutation UpdateKeyResult($id: String!, $title: String, $targetValue: Float, $startValue: Float, $currentValue: Float, $metricType: String) {
    updateKeyResult(id: $id, title: $title, targetValue: $targetValue, startValue: $startValue, currentValue: $currentValue, metricType: $metricType) {
      id
      title
      targetValue
      startValue
      currentValue
      metricType
      progress
    }
  }
`;

const DELETE_KEY_RESULT = gql`
  mutation DeleteKeyResult($id: String!) {
    deleteKeyResult(id: $id)
  }
`;

const GOAL_STATUSES = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'on_track', label: 'On Track' },
    { value: 'at_risk', label: 'At Risk' },
    { value: 'off_track', label: 'Off Track' },
    { value: 'completed', label: 'Completed' }
];

// Helper Component for Multi-User Select
// Helper Component for Multi-User Select

const MultiSelectOwner = ({ label, users, selectedIds, onChange }: any) => {
    // Ensure users is always an array
    const safeUsers = Array.isArray(users) ? users : [];

    return (
        <Box sx={{ minWidth: 120 }}>
            <InputLabel id={`${label}-label`} sx={{ mb: 1, fontSize: '0.75rem' }}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                multiple
                fullWidth
                value={selectedIds || []}
                onChange={(e) => onChange(e.target.value)}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => {
                    const ids = selected as string[];
                    return ids.map(id => {
                        const u = safeUsers.find((user: any) => user.id === id);
                        return u ? `${u.firstName} ${u.lastName}` : id;
                    }).join(', ');
                }}
            >
                {safeUsers.map((user: any) => (
                    <MenuItem key={user.id} value={user.id}>
                        <Checkbox checked={(selectedIds || []).indexOf(user.id) > -1} />
                        <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

// Main Dashboard Component
const OKRDashboard: React.FC = () => {
    const theme = useTheme();

    // Dialog States
    const [openGoalDialog, setOpenGoalDialog] = useState(false);
    const [openObjDialog, setOpenObjDialog] = useState(false);
    const [openKRDialog, setOpenKRDialog] = useState(false);

    // Editing States
    const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
    const [editingObjId, setEditingObjId] = useState<string | null>(null);
    const [editingKRId, setEditingKRId] = useState<string | null>(null);

    // Form States
    const [goalForm, setGoalForm] = useState<{ title: string; description: string; status: string; ownerIds: string[]; targetAchievement: number }>({ title: '', description: '', status: 'not_started', ownerIds: [], targetAchievement: 100 });
    const [objForm, setObjForm] = useState<{ title: string; description: string; strategicGoalId: string; cycle: string; status: string; ownerIds: string[] }>({ title: '', description: '', strategicGoalId: '', cycle: 'Q4 2024', status: 'not_started', ownerIds: [] });
    const [krForm, setKRForm] = useState<{ title: string; objectiveId: string; startValue: number; targetValue: number; currentValue: number; metricType: string }>({ title: '', objectiveId: '', startValue: 0, targetValue: 100, currentValue: 0, metricType: 'number' });

    // Data
    const { loading, error, data, refetch } = useQuery(GET_OKR_DATA);

    // Mutations
    const [createGoal] = useMutation(CREATE_GOAL, { onCompleted: () => { handleCloseGoalDialog(); refetch(); } });
    const [updateGoal] = useMutation(UPDATE_GOAL, { onCompleted: () => { handleCloseGoalDialog(); refetch(); } });
    const [deleteGoal] = useMutation(DELETE_GOAL, { onCompleted: () => refetch() });

    const [createObjective] = useMutation(CREATE_OBJECTIVE, { onCompleted: () => { handleCloseObjDialog(); refetch(); } });
    const [updateObjective] = useMutation(UPDATE_OBJECTIVE, { onCompleted: () => { handleCloseObjDialog(); refetch(); } });
    const [deleteObjective] = useMutation(DELETE_OBJECTIVE, { onCompleted: () => refetch() });

    const [createKeyResult] = useMutation(CREATE_KEY_RESULT, { onCompleted: () => { handleCloseKRDialog(); refetch(); } });
    const [updateKeyResult] = useMutation(UPDATE_KEY_RESULT, { onCompleted: () => { handleCloseKRDialog(); refetch(); } });
    const [deleteKeyResult] = useMutation(DELETE_KEY_RESULT, { onCompleted: () => refetch() });


    // --- Handlers ---
    const allUsers = data?.users || [];

    const handleOpenGoalDialog = (goal?: any) => {
        if (goal) {
            setEditingGoalId(goal.id);
            setGoalForm({
                title: goal.title,
                description: goal.description,
                status: (goal.status || 'not_started').toLowerCase(),
                ownerIds: goal.owners ? goal.owners.map((o: any) => o.id) : [],
                targetAchievement: goal.targetAchievement || 100
            });
        } else {
            setEditingGoalId(null);
            setGoalForm({ title: '', description: '', status: 'not_started', ownerIds: [], targetAchievement: 100 });
        }
        setOpenGoalDialog(true);
    };

    const handleCloseGoalDialog = () => {
        setOpenGoalDialog(false);
        setEditingGoalId(null);
        setGoalForm({ title: '', description: '', status: 'not_started', ownerIds: [], targetAchievement: 100 });
    };

    const handleSaveGoal = () => {
        if (editingGoalId) {
            updateGoal({ variables: { id: editingGoalId, ...goalForm } });
        } else {
            createGoal({ variables: goalForm });
        }
    };

    const handleDeleteGoal = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Strategic Goal? All associated Objectives will be deleted.')) {
            deleteGoal({ variables: { id } });
        }
    };

    const handleOpenObjDialog = (obj?: any, defaultGoalId?: string) => {
        if (obj) {
            setEditingObjId(obj.id);
            setObjForm({
                title: obj.title,
                description: obj.description,
                strategicGoalId: obj.strategicGoalId,
                cycle: obj.cycle || '',
                status: obj.status || 'not_started',
                ownerIds: obj.owners ? obj.owners.map((o: any) => o.id) : []
            });
        } else {
            setEditingObjId(null);
            setObjForm({
                title: '',
                description: '',
                strategicGoalId: defaultGoalId || (goals.length > 0 ? goals[0].id : ''),
                cycle: 'Q1 2025',
                status: 'not_started',
                ownerIds: []
            });
        }
        setOpenObjDialog(true);
    };

    const handleCloseObjDialog = () => {
        setOpenObjDialog(false);
        setEditingObjId(null);
        setObjForm({ title: '', description: '', strategicGoalId: '', cycle: '', status: 'not_started', ownerIds: [] });
    };

    const handleSaveObjective = () => {
        if (editingObjId) {
            updateObjective({
                variables: {
                    id: editingObjId,
                    title: objForm.title,
                    description: objForm.description,
                    cycle: objForm.cycle,
                    status: objForm.status,
                    ownerIds: objForm.ownerIds
                }
            });
        } else {
            createObjective({ variables: objForm });
        }
    };

    const handleDeleteObjective = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Objective?')) {
            deleteObjective({ variables: { id } });
        }
    };

    const handleOpenKRDialog = (kr?: any, objectiveId?: string) => {
        if (kr) {
            setEditingKRId(kr.id);
            setKRForm({
                title: kr.title,
                objectiveId: kr.objectiveId,
                startValue: kr.startValue || 0,
                targetValue: kr.targetValue,
                currentValue: kr.currentValue || 0,
                metricType: kr.metricType || 'number'
            });
        } else {
            setEditingKRId(null);
            setKRForm({
                title: '',
                objectiveId: objectiveId || '',
                startValue: 0,
                targetValue: 100,
                currentValue: 0,
                metricType: 'number'
            });
        }
        setOpenKRDialog(true);
    };

    const handleCloseKRDialog = () => {
        setOpenKRDialog(false);
        setEditingKRId(null);
        setKRForm({ title: '', objectiveId: '', startValue: 0, targetValue: 100, currentValue: 0, metricType: 'number' });
    };

    const handleSaveKR = () => {
        if (editingKRId) {
            updateKeyResult({
                variables: {
                    id: editingKRId,
                    ...krForm,
                    targetValue: parseFloat(krForm.targetValue as any),
                    startValue: parseFloat(krForm.startValue as any),
                    currentValue: parseFloat(krForm.currentValue as any)
                }
            });
        } else {
            createKeyResult({
                variables: {
                    ...krForm,
                    targetValue: parseFloat(krForm.targetValue as any),
                    startValue: parseFloat(krForm.startValue as any)
                }
            });
        }
    };

    const handleDeleteKR = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Key Result?')) {
            deleteKeyResult({ variables: { id } });
        }
    };


    const statusColors: any = {
        'not_started': 'default',
        'on_track': 'success',
        'at_risk': 'warning',
        'off_track': 'error',
        'completed': 'primary'
    };

    if (loading) return <Box sx={{ p: 4 }}>Loading CIP...</Box>;
    if (error) return <Box sx={{ p: 4 }}>Error: {error.message}</Box>;

    const goals = data?.strategicGoals || [];
    const allObjectives = data?.objectives || [];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        CIP Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track Strategic Goals, Objectives, and Key Results.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenGoalDialog()}>
                        New Strategic Goal
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenObjDialog()} disabled={goals.length === 0}>
                        New Objective
                    </Button>
                </Stack>
            </Box>

            {/* Goals List */}
            <Stack spacing={4}>
                {goals.map((goal: any) => {
                    const goalObjectives = allObjectives.filter((obj: any) => obj.strategicGoalId === goal.id);

                    return (
                        <Paper key={goal.id} sx={{ p: 0, overflow: 'hidden', borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: 'white',
                                            color: 'primary.main',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}>
                                            <GoalIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="primary" fontWeight="700" sx={{ mb: 0.5, letterSpacing: 1 }}>
                                                STRATEGIC GOAL
                                            </Typography>
                                            <Typography variant="h5" fontWeight="700" gutterBottom>
                                                {goal.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 800 }}>
                                                {goal.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        {/* Owners */}
                                        {goal.owners && goal.owners.length > 0 && (
                                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                                                {goal.owners.map((o: any) => (
                                                    <Tooltip key={o.id} title={`${o.firstName} ${o.lastName}`}>
                                                        <Avatar>{o.firstName[0]}{o.lastName[0]}</Avatar>
                                                    </Tooltip>
                                                ))}
                                            </AvatarGroup>
                                        )}
                                        <Chip
                                            label={goal.status.replace('_', ' ').toUpperCase()}
                                            color={statusColors[goal.status]}
                                            size="small"
                                            sx={{ fontWeight: 700, borderRadius: 1 }}
                                        />
                                        <Chip
                                            label={`Target: ${goal.targetAchievement || 100}%`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ fontWeight: 600, borderRadius: 1, borderColor: alpha(theme.palette.text.primary, 0.2) }}
                                        />
                                        <Tooltip title="Edit Goal">
                                            <IconButton size="small" onClick={() => handleOpenGoalDialog(goal)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Goal">
                                            <IconButton size="small" color="error" onClick={() => handleDeleteGoal(goal.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ObjectiveIcon color="action" /> Objectives
                                    </Typography>
                                    <Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenObjDialog(null, goal.id)}>
                                        Add Objective
                                    </Button>
                                </Box>

                                {goalObjectives.length > 0 ? (
                                    <Stack spacing={2}>
                                        {goalObjectives.map((obj: any) => (
                                            <Accordion key={obj.id} disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Box sx={{ width: '100%', mr: 2 }}>
                                                        <Grid container alignItems="center" spacing={2}>
                                                            <Grid item xs={12} md={5}>
                                                                <Typography fontWeight="600">{obj.title}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{obj.cycle}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={4}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    <LinearProgress variant="determinate" value={obj.progress} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} />
                                                                    <Typography variant="body2" fontWeight="700">{Math.round(obj.progress)}%</Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={3}>
                                                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" onClick={(e) => e.stopPropagation()}>
                                                                    {/* Objective Owners */}
                                                                    {obj.owners && obj.owners.length > 0 && (
                                                                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                                                                            {obj.owners.map((o: any) => (
                                                                                <Tooltip key={o.id} title={`${o.firstName} ${o.lastName}`}>
                                                                                    <Avatar>{o.firstName[0]}{o.lastName[0]}</Avatar>
                                                                                </Tooltip>
                                                                            ))}
                                                                        </AvatarGroup>
                                                                    )}
                                                                    <Chip size="small" label={`${obj.keyResults?.length || 0} KRs`} variant="outlined" />
                                                                    <Tooltip title="Edit Objective">
                                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenObjDialog(obj); }}>
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Objective">
                                                                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteObjective(obj.id); }}>
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ bgcolor: alpha(theme.palette.action.hover, 0.05) }}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={6}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <KeyResultIcon fontSize="small" /> Key Results
                                                                </Typography>
                                                                <Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenKRDialog(null, obj.id)}>
                                                                    Add
                                                                </Button>
                                                            </Box>
                                                            {obj.keyResults?.length > 0 ? (
                                                                <Stack spacing={1}>
                                                                    {obj.keyResults.map((kr: any) => (
                                                                        <Paper key={kr.id} variant="outlined" sx={{ p: 1.5, position: 'relative', '&:hover .kr-actions': { opacity: 1 } }}>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, pr: 6 }}>
                                                                                <Typography variant="body2" fontWeight="500">{kr.title}</Typography>
                                                                                <Box className="kr-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', position: 'absolute', right: 4, top: 4, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                                                                                    <IconButton size="small" onClick={() => handleOpenKRDialog(kr)}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                                                                                    <IconButton size="small" color="error" onClick={() => handleDeleteKR(kr.id)}><DeleteIcon sx={{ fontSize: 14 }} /></IconButton>
                                                                                </Box>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                                                <LinearProgress variant="determinate" value={Math.min(kr.progress, 100)} sx={{ flexGrow: 1, mr: 2, height: 4, borderRadius: 2 }} color={kr.progress >= 100 ? "success" : "primary"} />
                                                                                <Typography variant="caption" noWrap>
                                                                                    {kr.currentValue} / {kr.targetValue} ({Math.round(kr.progress)}%)
                                                                                </Typography>
                                                                            </Box>
                                                                        </Paper>
                                                                    ))}
                                                                </Stack>
                                                            ) : (
                                                                <Typography variant="caption" color="text.secondary">No Key Results defined.</Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle2" gutterBottom>Linked Projects</Typography>
                                                            {obj.projects?.length > 0 ? (
                                                                <Stack spacing={1}>
                                                                    {obj.projects.map((proj: any) => (
                                                                        <Chip key={proj.id} label={proj.name} onClick={() => { }} sx={{ width: 'fit-content' }} />
                                                                    ))}
                                                                </Stack>
                                                            ) : (
                                                                <Typography variant="caption" color="text.secondary">No projects linked.</Typography>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography color="text.secondary" fontStyle="italic">No objectives set for this goal yet.</Typography>
                                )}
                            </Box>
                        </Paper>
                    );
                })}
            </Stack>

            {/* Create/Edit Goal Dialog */}
            <Dialog open={openGoalDialog} onClose={handleCloseGoalDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingGoalId ? 'Edit Strategic Goal' : 'Create Strategic Goal'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Goal Title"
                            fullWidth
                            value={goalForm.title}
                            onChange={e => setGoalForm({ ...goalForm, title: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={goalForm.description}
                            onChange={e => setGoalForm({ ...goalForm, description: e.target.value })}
                        />
                        <MultiSelectOwner
                            label="Owners"
                            users={allUsers}
                            selectedIds={goalForm.ownerIds}
                            onChange={(ids: string[]) => setGoalForm({ ...goalForm, ownerIds: ids })}
                        />

                        <Box sx={{ px: 1, py: 1 }}>
                            <Typography gutterBottom variant="caption" color="text.secondary">Target Achievement Percentile</Typography>
                            <Slider
                                value={goalForm.targetAchievement}
                                onChange={(_, value) => setGoalForm({ ...goalForm, targetAchievement: value as number })}
                                step={5}
                                marks={[
                                    { value: 80, label: '80%' },
                                    { value: 100, label: '100%' },
                                    { value: 125, label: '125%' }
                                ]}
                                min={50}
                                max={125}
                                valueLabelDisplay="auto"
                            />
                        </Box>

                        <TextField
                            select
                            label="Status"
                            fullWidth
                            value={goalForm.status || 'not_started'}
                            onChange={e => setGoalForm({ ...goalForm, status: e.target.value })}
                        >
                            {GOAL_STATUSES.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseGoalDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveGoal} disabled={!goalForm.title}>
                        {editingGoalId ? 'Save Changes' : 'Create Goal'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create/Edit Objective Dialog */}
            <Dialog open={openObjDialog} onClose={handleCloseObjDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingObjId ? 'Edit Objective' : 'Create Objective'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {!editingObjId && (
                            <TextField
                                select
                                label="Strategic Goal"
                                fullWidth
                                value={objForm.strategicGoalId}
                                onChange={e => setObjForm({ ...objForm, strategicGoalId: e.target.value })}
                            >
                                {goals.map((g: any) => (
                                    <MenuItem key={g.id} value={g.id}>{g.title}</MenuItem>
                                ))}
                            </TextField>
                        )}
                        <TextField
                            label="Objective Title"
                            fullWidth
                            value={objForm.title}
                            onChange={e => setObjForm({ ...objForm, title: e.target.value })}
                        />
                        <MultiSelectOwner
                            label="Owners"
                            users={allUsers}
                            selectedIds={objForm.ownerIds}
                            onChange={(ids: string[]) => setObjForm({ ...objForm, ownerIds: ids })}
                        />
                        <TextField
                            label="Cycle (e.g., Q1 2025)"
                            fullWidth
                            value={objForm.cycle}
                            onChange={e => setObjForm({ ...objForm, cycle: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={objForm.description}
                            onChange={e => setObjForm({ ...objForm, description: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseObjDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveObjective}
                        disabled={!objForm.title || (!editingObjId && !objForm.strategicGoalId)}
                    >
                        {editingObjId ? 'Save Changes' : 'Create Objective'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create/Edit Key Result Dialog */}
            <Dialog open={openKRDialog} onClose={handleCloseKRDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingKRId ? 'Edit Key Result' : 'Create Key Result'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Key Result Title"
                            fullWidth
                            value={krForm.title}
                            onChange={e => setKRForm({ ...krForm, title: e.target.value })}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Start Value"
                                type="number"
                                fullWidth
                                value={krForm.startValue}
                                onChange={e => setKRForm({ ...krForm, startValue: parseFloat(e.target.value) })}
                            />
                            <TextField
                                label="Target Value"
                                type="number"
                                fullWidth
                                value={krForm.targetValue}
                                onChange={e => setKRForm({ ...krForm, targetValue: parseFloat(e.target.value) })}
                            />
                        </Stack>
                        <TextField
                            label="Current Value"
                            type="number"
                            fullWidth
                            value={krForm.currentValue}
                            onChange={e => setKRForm({ ...krForm, currentValue: parseFloat(e.target.value) })}
                            helperText={krForm.targetValue !== krForm.startValue ? `Progress: ${Math.round(((krForm.currentValue - krForm.startValue) / (krForm.targetValue - krForm.startValue)) * 100)}%` : ''}
                        />
                        <TextField
                            select
                            label="Metric Type"
                            fullWidth
                            value={krForm.metricType}
                            onChange={e => setKRForm({ ...krForm, metricType: e.target.value })}
                        >
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="percentage">Percentage (%)</MenuItem>
                            <MenuItem value="currency">Currency ($)</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseKRDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveKR} disabled={!krForm.title}>
                        {editingKRId ? 'Save Changes' : 'Create Key Result'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default OKRDashboard;
