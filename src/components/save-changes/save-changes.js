import React from "react";
import {
    Button,
    ButtonGroup,
    Paper,
    Box
} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export default function SaveChangesBtn({ type = 'button', update = () => { }, cancel = () => { } }) {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: '200px',
                right: '50px',
            }}
        >
            <ButtonGroup sx={{ '& .MuiButtonBase-root': { borderColor: '#ccc !important', pl: 3, pr: 3 } }} variant="text" component={Paper} aria-label="outlined button group">
                <Button
                    type={type}
                    color='success'
                    onClick={update}
                >
                    <DoneIcon color='success' />
                </Button>
                <Button
                    color='error'
                    onClick={cancel}
                >
                    <CloseIcon color='error' />
                </Button>
            </ButtonGroup>
        </Box>
    );
}