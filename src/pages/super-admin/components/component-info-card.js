import React from "react";
import {
    Box,
    Stack,
    Typography,
    Tooltip,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

function ComponentInfoCard({ data }) {

    return (
        <div>
            <Typography
                variant="h6"
                sx={{ textAlign: 'center', fontSize: '14px' }}
            >
                {data[0]}
            </Typography>
            {data[1].map((_v, _i) => {
                return <Stack
                    key={_i}
                    direction='row'
                    alignItems='flex-start'
                    justifyContent='space-between'
                    spacing={1}
                    sx={{ mt: 1 }}
                >
                    <Box>
                        <p>{_v.label}</p>
                    </Box>
                    <Stack
                        key={_i}
                        direction='row'
                        alignItems='flex-center'
                        justifyContent='space-between'
                        spacing='5px'
                        sx={{ mt: 1 }}>
                        {!!_v.description ? <Tooltip title={_v.description} placement='top'>
                            <InfoIcon sx={{ color: '#969696' }} fontSize="small" />
                        </Tooltip> : null}
                        <small style={{ color: '#969696' }}>{_v.value}</small>
                    </Stack>
                </Stack>
            })}
        </div>
    );
}

export default ComponentInfoCard;