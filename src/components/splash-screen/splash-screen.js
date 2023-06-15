import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function SplashScreen() {
    return (
        <Box maxWidth='100%'
            sx={{
                backgroundColor: 'primary.dark',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Stack
                flexDirection='row'
                alignItems='center'
                justifyContent='center'
            >
                <Typography
                    sx={{ marginRight: 2, color: '#fff' }}
                    component='h5'
                    variant="h5"
                >
                    Loading
                </Typography>
                <CircularProgress sx={{ color: "#fff" }} />
            </Stack>
        </Box>
    );
}