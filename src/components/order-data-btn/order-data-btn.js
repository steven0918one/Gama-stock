import React, { memo, useState } from "react";
import {
    Box,
    Stack,
    Button,
} from "@mui/material";

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { setOrderBy } from "../../store/reducer";
import { useDispatch } from "react-redux";

function OrderDataBtn({ title, selected, value, handleBtn }) {
    // console.log("🚀 ~ file: order-data-btn.js:12 ~ OrderDataBtn ~ handleBtn:", handleBtn())
    // return null;
    const dispatch = useDispatch();
    const [active, setActive] = useState('');
    return (
        <Box
            sx={{
                position: 'relative',
                paddingRight: '25px'
            }}
        >
            {title}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 0,
                    transform: 'translateY(-50%)',
                }}
            >
                <Stack
                    direction='column'
                    width='25px'
                >
                    <Button
                        variant="text"
                        sx={{
                            minWidth: '10px',
                            height: '10px',
                            '&:hover path': {
                                color: '#40b92d'
                            }
                        }}
                        onClick={() => {
                            setActive('asc');
                            dispatch(setOrderBy({ name: value, order: 'asc' }));
                        }}
                    >
                        <ArrowDropUpIcon sx={{ color: selected === value && active === 'asc' ? '#fff' : 'Gray' }} />
                    </Button>
                    <Button
                        variant="text"
                        sx={{
                            minWidth: '10px',
                            height: '10px',
                            '&:hover path': {
                                color: '#40b92d'
                            }
                        }}
                        onClick={() => {
                            setActive('desc');
                            dispatch(setOrderBy({ name: value, order: 'desc' }))
                        }}
                    >
                        <ArrowDropDownIcon sx={{ color: selected === value && active === 'desc' ? '#fff' : 'Gray' }} />
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}

OrderDataBtn.defaultProps = {
    handleBtn: () => { },
    title: 'label',
    value: '',
}
export default memo(OrderDataBtn);