import React from 'react';
import WebAssetOffIcon from '@mui/icons-material/WebAssetOff';
import { Link } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

export default function Page404() {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box sx={{
                opacity: '0.5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <WebAssetOffIcon sx={{ fontSize: '120px' }} />
                <Typography
                    variant='h4'
                    component='h4'
                >Page Not Found</Typography>
                <Link to='/'>Goto Home</Link>
            </Box>
        </Box>
    );
}