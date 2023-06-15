
import {
    Stack,
    Typography,
    Tooltip
} from "@mui/material";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

function InfoHeading({ containerSx, variant, iconColor, iconSize, infoText, text, ...props }) {
    return (
        <Stack
            direction="row"
            alignItems='center'
            spacing={1}
            sx={containerSx}
        >
            <Typography
                variant={variant}
                {...props}
            >
                {text}
            </Typography>
            <Tooltip title={infoText} color={iconColor} placement='top'>
                <InfoRoundedIcon fontSize={iconSize} />
            </Tooltip>
        </Stack>
    );
}

InfoHeading.defaultProps = {
    infoText: 'info',
    text: 'heading',
    containerSx: {},
    variant: 'p',
    iconSize: '12px',
    iconColor: 'default'
}

export default InfoHeading;