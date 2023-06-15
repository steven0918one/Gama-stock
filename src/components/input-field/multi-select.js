import React, { useState } from "react";
import {
    Button,
    Box,
    MenuList,
    Paper,
    Typography,
    ClickAwayListener,
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSelector } from "react-redux";

function MultiSelect({ columnsList, setColumnsList }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { language, selectedLang } = useSelector((state) => state.storeReducer);
    const handleSelected = (item) => {
        let _cat = columnsList;
        let objIndex = _cat.findIndex(x => x.id === item.id);
        _cat[objIndex].show = !columnsList[objIndex].show;
        setColumnsList(_cat);
    }

    return (
        <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
            <Box
                sx={{
                    position: 'relative',
                    zIndex: "200"
                }}
            >
                <Button
                    variant="text"
                    endIcon={
                        menuOpen ?
                            <ExpandLessIcon />
                            :
                            <ExpandMoreIcon />
                    }
                    onClick={() => setMenuOpen(!menuOpen)}
                    sx={{
                        textTransform: 'none',
                        mt: 0.8,
                        color: '#000',
                        width: '100%',
                        display: 'flex',
                        fontWeight: 'normal',
                        borderRadius: '0',
                        justifyContent: 'space-between',
                        borderBottom: '2px solid #ccc',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            borderColor: '#333',
                        },
                        '&:focus-within': {
                            borderColor: '#ffbb00',
                        }
                    }}
                >
                    {language[selectedLang]?.selected_column}
                </Button>
                {menuOpen &&
                    <Box component={Paper}
                        sx={{
                            position: 'absolute',
                            top: '40px',
                            left: 0,
                            width: 'fit-content'
                        }}
                    >
                        <MenuList>
                            {columnsList.length && columnsList.map((_v, _i) => {
                                return <Item key={_i} data={_v} handleSelected={handleSelected} />
                            })}
                        </MenuList>
                    </Box>
                }
            </Box>
        </ClickAwayListener>
    );
}
const Item = ({ data, handleSelected }) => {
    const { language, selectedLang, user } = useSelector((state) => state.storeReducer);
    const [active, setActive] = useState(data?.show);
    if (user?.role !== 'stock_manager' && data?.id === 10) return;
    return <MenuItem
        onClick={() => {
            setActive(!active);
            handleSelected(data)
        }}
    >
        {active ? <CheckBoxIcon sx={{ fontSize: '14px', color: "#ffbf00" }} /> : <CheckBoxOutlineBlankIcon sx={{ fontSize: '14px' }} />}
        <Typography pl="3px" sx={{ fontSize: '12px' }}>{language[selectedLang]?.[data?.label]}</Typography>
    </MenuItem>
}
MultiSelect.defaultProps = {
    columnsList: [],
    setColumnsList: e => { },
}
export default MultiSelect;
