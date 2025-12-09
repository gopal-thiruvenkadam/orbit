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
    useTheme
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
    strategicGoals {
      id
      title
      description
      status
    }
    objectives {
      id
      title
      description
      cycle
      strategicGoalId
      progress
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
  mutation CreateStrategicGoal($title: String!, $description: String) {
    createStrategicGoal(title: $title, description: $description) {
      id
      title
    }
  }
`;

const CREATE_OBJECTIVE = gql`
  mutation CreateObjective($title: String!, $strategicGoalId: String!, $description: String, $cycle: String) {
    createObjective(title: $title, strategicGoalId: $strategicGoalId, description: $description, cycle: $cycle) {
      id
      title
    }
  }
`;

// Dashboard Component
const OKRDashboard: React.FC = () => {
    const theme = useTheme();

    // Dialog States
    const [openGoalDialog, setOpenGoalDialog] = useState(false);
    const [openObjDialog, setOpenObjDialog] = useState(false);

    // Form States
    const [goalForm, setGoalForm] = useState({ title: '', description: '' });
    const [objForm, setObjForm] = useState({ title: '', description: '', strategicGoalId: '', cycle: 'Q4 2024' });

    // Data
    const { loading, error, data, refetch } = useQuery(GET_OKR_DATA);
    const [createGoal] = useMutation(CREATE_GOAL, { onCompleted: () => { setOpenGoalDialog(false); refetch(); } });
    const [createObjective] = useMutation(CREATE_OBJECTIVE, { onCompleted: () => { setOpenObjDialog(false); refetch(); } });

    const handleCreateGoal = () => {
        if (goalForm.title) createGoal({ variables: goalForm });
    };

    const handleCreateObjective = () => {
        if (objForm.title && objForm.strategicGoalId) createObjective({ variables: objForm });
    };

    const statusColors: any = {
        'not_started': 'default',
        'on_track': 'success',
        'at_risk': 'warning',
        'off_track': 'error',
        'completed': 'primary'
    };

    if (loading) return <Box sx={{ p: 4 }}>Loading OKRs...</Box>;
    if (error) return <Box sx={{ p: 4 }}>Error: {error.message}</Box>;

    const goals = data?.strategicGoals || [];
    const allObjectives = data?.objectives || [];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        OKR Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track Strategic Goals, Objectives, and Key Results.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenGoalDialog(true)}>
                        New Strategic Goal
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenObjDialog(true)} disabled={goals.length === 0}>
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
                                    <Chip
                                        label={goal.status.replace('_', ' ').toUpperCase()}
                                        color={statusColors[goal.status]}
                                        size="small"
                                        sx={{ fontWeight: 700, borderRadius: 1 }}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ObjectiveIcon color="action" /> Objectives
                                </Typography>

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
                                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                                    <Chip size="small" label={`${obj.keyResults?.length || 0} KRs`} variant="outlined" />
                                                                    <Chip size="small" label={`${obj.projects?.length || 0} Projects`} variant="outlined" />
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ bgcolor: alpha(theme.palette.action.hover, 0.05) }}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <KeyResultIcon fontSize="small" /> Key Results
                                                            </Typography>
                                                            {obj.keyResults?.length > 0 ? (
                                                                <Stack spacing={1}>
                                                                    {obj.keyResults.map((kr: any) => (
                                                                        <Paper key={kr.id} variant="outlined" sx={{ p: 1.5 }}>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                <Typography variant="body2" fontWeight="500">{kr.title}</Typography>
                                                                                <Typography variant="caption">
                                                                                    {kr.currentValue} / {kr.targetValue}
                                                                                </Typography>
                                                                            </Box>
                                                                            <LinearProgress variant="determinate" value={kr.progress} sx={{ height: 4, borderRadius: 2 }} color={kr.progress >= 100 ? "success" : "primary"} />
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

            {/* Create Goal Dialog */}
            <Dialog open={openGoalDialog} onClose={() => setOpenGoalDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Strategic Goal</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="Goal Title" fullWidth value={goalForm.title} onChange={e => setGoalForm({ ...goalForm, title: e.target.value })} />
                        <TextField label="Description" fullWidth multiline rows={3} value={goalForm.description} onChange={e => setGoalForm({ ...goalForm, description: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGoalDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateGoal} disabled={!goalForm.title}>Create Goal</Button>
                </DialogActions>
            </Dialog>

            {/* Create Objective Dialog */}
            <Dialog open={openObjDialog} onClose={() => setOpenObjDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Objective</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
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
                        <TextField label="Objective Title" fullWidth value={objForm.title} onChange={e => setObjForm({ ...objForm, title: e.target.value })} />
                        <TextField label="Cycle (e.g., Q1 2025)" fullWidth value={objForm.cycle} onChange={e => setObjForm({ ...objForm, cycle: e.target.value })} />
                        <TextField label="Description" fullWidth multiline rows={2} value={objForm.description} onChange={e => setObjForm({ ...objForm, description: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenObjDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateObjective} disabled={!objForm.title || !objForm.strategicGoalId}>Create Objective</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OKRDashboard;
