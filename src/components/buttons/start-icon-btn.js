import { Button, Box } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

export default function StartIconBtn({ title, icon = <AddIcon />, styles, handleClick = () => { }, ...props }) {

    return (
        <Button
            variant='contained'
            startIcon={<Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2E2E2E',
                    px: '7px',
                    py: '7px',
                }}
            >{icon}</Box>}
            onClick={handleClick}
            sx={{
                justifyContent: 'flex-start',
                backgroundColor: '#000',
                color: '#fff',
                fontSize: '11px',
                paddingLeft: '4px',
                textTransform: 'capitalize',
                p: 0,
                pr: 1,
                overflow: 'hidden',
                ...styles
            }}
            {...props}
        >
            {title}
        </Button >
    )
}