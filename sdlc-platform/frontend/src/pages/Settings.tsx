import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Avatar,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Alert,
  LinearProgress,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  CreditCard as BillingIcon,
  IntegrationInstructions as IntegrationsIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  GitHub,
  Storage,
  Email
} from '@mui/icons-material';

// GraphQL for Members
const GET_USERS = gql`
  query GetUsersForSettings {
    users {
      id
      firstName
      lastName
      email
      role
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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { data: userData, loading: userLoading } = useQuery(GET_USERS);

  // Mock Organization State
  const [orgSettings, setOrgSettings] = useState({
    name: 'Acme Corp',
    domain: 'acme.com',
    supportEmail: 'support@acme.com',
    technicalContact: 'admin@acme.com'
  });

  // Mock Integrations State
  const [integrations, setIntegrations] = useState({
    github: true,
    jira: false,
    slack: true,
    aws: false
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOrgChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrgSettings({ ...orgSettings, [prop]: event.target.value });
  };

  const handleIntegrationToggle = (key: string) => {
    setIntegrations((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  if (userLoading) return <Box p={3}>Loading settings...</Box>;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your organization profile, team members, and preferences.
          </Typography>
        </Box>
        {/* Save Changes Button (Global) or specific to tabs */}
      </Box>

      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          minHeight: 600,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Settings tabs"
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            minWidth: 240,
            '& .MuiTab-root': { alignItems: 'flex-start', textAlign: 'left', pl: 3, py: 2 }
          }}
        >
          <Tab icon={<BusinessIcon sx={{ mr: 1 }} />} iconPosition="start" label="General" />
          <Tab icon={<GroupIcon sx={{ mr: 1 }} />} iconPosition="start" label="Team Members" />
          <Tab icon={<IntegrationsIcon sx={{ mr: 1 }} />} iconPosition="start" label="Integrations" />
          <Tab icon={<BillingIcon sx={{ mr: 1 }} />} iconPosition="start" label="Billing & Usage" />
          <Tab icon={<SecurityIcon sx={{ mr: 1 }} />} iconPosition="start" label="Security" />
          <Tab icon={<NotificationsIcon sx={{ mr: 1 }} />} iconPosition="start" label="Notifications" />
        </Tabs>

        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>

          {/* General Settings */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>Organization Profile</Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <TextField
                    label="Organization Name"
                    fullWidth
                    value={orgSettings.name}
                    onChange={handleOrgChange('name')}
                  />
                  <TextField
                    label="Custom Domain"
                    fullWidth
                    value={orgSettings.domain}
                    onChange={handleOrgChange('domain')}
                    InputProps={{ startAdornment: <InputAdornment position="start">https://</InputAdornment> }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Support Email"
                        fullWidth
                        value={orgSettings.supportEmail}
                        onChange={handleOrgChange('supportEmail')}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Technical Contact"
                        fullWidth
                        value={orgSettings.technicalContact}
                        onChange={handleOrgChange('technicalContact')}
                      />
                    </Grid>
                  </Grid>
                  <Box>
                    <Button variant="contained" startIcon={<SaveIcon />}>Save Changes</Button>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{ width: 80, height: 80, margin: '0 auto', bgcolor: 'primary.main', fontSize: 32 }}
                    >
                      {orgSettings.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ mt: 2 }}>Organization Logo</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      This logo will appear on your reports and dashboard.
                    </Typography>
                    <Button variant="outlined" size="small" component="label">
                      Upload New
                      <input type="file" hidden />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Team Members */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Team Members</Typography>
              <Button variant="contained" size="small" startIcon={<AddIcon />}>Invite Member</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <List>
              {userData?.users.map((user: any) => (
                <ListItem key={user.id} divider>
                  <ListItemAvatar>
                    <Avatar>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName} ${user.id === '1' ? '(You)' : ''}`} // Assuming mock ID check
                    secondary={user.email}
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={user.role || 'MEMBER'}
                      size="small"
                      color={user.role === 'ADMIN' ? 'primary' : 'default'}
                      variant={user.role === 'ADMIN' ? 'filled' : 'outlined'}
                    />
                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </TabPanel>

          {/* Integrations */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Connected Apps</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connect your workspace with third-party tools to automate your workflow.
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={<GitHub fontSize="large" />}
                    action={<Switch checked={integrations.github} onChange={() => handleIntegrationToggle('github')} />}
                    title="GitHub"
                    subheader="Sync repositories, commits, and pull requests."
                  />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={<Storage fontSize="large" sx={{ color: '#0052CC' }} />} // Mock Jira blue
                    action={<Switch checked={integrations.jira} onChange={() => handleIntegrationToggle('jira')} />}
                    title="Jira Software"
                    subheader="Import issues and sync status updates bi-directionally."
                  />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={<Box component="span" sx={{ fontSize: 30, fontWeight: 'bold' }}>#</Box>} // Slack
                    action={<Switch checked={integrations.slack} onChange={() => handleIntegrationToggle('slack')} />}
                    title="Slack"
                    subheader="Receive notifications and alerts in your team channels."
                  />
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Billing */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Subscription & Usage</Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.50', borderColor: 'primary.200' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="primary" gutterBottom>CURRENT PLAN</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h4" fontWeight="bold">Enterprise</Typography>
                      <Typography variant="h5">$99<Typography component="span" variant="body2" color="text.secondary">/mo</Typography></Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                      Next billing date: January 1, 2026
                    </Typography>
                    <Button variant="contained" color="primary">Manage Subscription</Button>
                  </CardContent>
                </Card>

                <Typography variant="subtitle2" gutterBottom>Usage Limits</Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Projects</Typography>
                    <Typography variant="body2" fontWeight="bold">8 / 20</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Storage</Typography>
                    <Typography variant="body2" fontWeight="bold">45GB / 1TB</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={4.5} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>Security Settings</Typography>
            <Divider sx={{ mb: 3 }} />

            <List>
              <ListItem divider>
                <ListItemText primary="Two-Factor Authentication (2FA)" secondary="Require all users to use 2FA." />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem divider>
                <ListItemText primary="Single Sign-On (SSO)" secondary="Enable SAML/OIDC authentication." />
                <Button variant="outlined" size="small">Configure</Button>
              </ListItem>
              <ListItem>
                <ListItemText primary="Password Policy" secondary="Enforce strong passwords for local accounts." />
                <Button variant="outlined" size="small">Edit Policy</Button>
              </ListItem>
            </List>
          </TabPanel>

          {/* Notifications */}
          <TabPanel value={tabValue} index={5}>
            <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
            <Divider sx={{ mb: 3 }} />

            <FormControlLabel control={<Switch defaultChecked />} label="Email me for failed deployments" sx={{ display: 'block', mb: 2 }} />
            <FormControlLabel control={<Switch defaultChecked />} label="Email me for critical bug reports" sx={{ display: 'block', mb: 2 }} />
            <FormControlLabel control={<Switch />} label="Weekly Summary Reports" sx={{ display: 'block', mb: 2 }} />
          </TabPanel>

        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
