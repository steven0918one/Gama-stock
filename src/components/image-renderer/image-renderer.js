import React from 'react';
import {
    Avatar,
    Box,
} from '@mui/material';

import ApiImage from '../../hooks/fetch-image';

function ImageRenderer({ url, width = 276, height = 150 }) {
    const src = ApiImage(url);
    return (
        <>
            <Box position='relative' width='fit-content'>
                <Avatar
                    alt=""
                    src={src}
                    sx={{ width: width, height: height}}
                    variant='square'
                    bgcolor='transparent'
                >
                    {''}
                </Avatar>
            </Box>
        </>
    );
}

export default ImageRenderer;