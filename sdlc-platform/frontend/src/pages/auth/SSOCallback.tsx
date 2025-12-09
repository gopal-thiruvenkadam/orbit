import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const SSOCallback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { ssoLogin } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // @ts-ignore - ssoLogin exists but might be missing in some type def if not updated correctly hot reload
            ssoLogin(token);
        } else {
            console.error('No token found in SSO callback');
            navigate('/login');
        }
    }, [location, navigate, ssoLogin]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>Authenticating...</Typography>
        </Box>
    );
};

export default SSOCallback;
