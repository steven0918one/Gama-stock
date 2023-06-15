import React from 'react';
import {
    IconButton,
    InputAdornment,
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function PasswordInputField({
    label = '',
    error = '',
    secureEntry = true,
    setSecureEntry = () => { },
    ...props }) {

    const _id = 'input_' + Math.floor(Math.random())
    return (
        <FormControl sx={{ width: "100%" }} variant="standard">
            <InputLabel htmlFor={_id}>
                {label}
            </InputLabel>
            <Input
                id={_id}
                type={secureEntry ? "password" : "text"}
                error={error !== ''}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setSecureEntry(!secureEntry)}
                        >
                            {secureEntry ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                {...props}
            />
            {error !== '' && <FormHelperText sx={{ color: 'primary.main' }} >{error}</FormHelperText>}
        </FormControl>
    );
}