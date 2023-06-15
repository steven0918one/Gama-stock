import React, { useState } from "react";
import {
    TableRow,
    TableCell,
    Tooltip,
    IconButton,
    CircularProgress,
    Popper,
    Box,
    Button,
    Stack
} from "@mui/material";
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch } from "react-redux";

import { openPopUp } from "../../../store/reducer";
import API from "../../../axios";
import PageTitle from "../../../hooks/page-title";

const PriceTableRow = ({ item, index, orgID, typeID, recID, removeRow }) => {
    PageTitle('Edit Component')
    const [formData, setFormData] = useState({});
    const [editable, setEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [rowID, setRowID] = useState(item.id);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    React.useEffect(() => {
        setFormData(item);
        if (item?.editable) {
            setEditable(true);
            setIsNew(true);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value });
    }
    const editRow = () => {
        setEditable(true);
    }

    const cancelChanges = () => {
        setFormData({ ...formData, item });
        setEditable(false);
    }

    const deleteRow = async () => {
        setIsDeleting(true);
        try {
            let { data } = await API('delete', `manager/components/${recID}/componentPrices/${rowID}`);
            dispatch(openPopUp({ message: data, type: 'success' }));
            removeRow(index);
            setIsDeleting(false);
        } catch (error) {
            setIsDeleting(false);
            dispatch(openPopUp({ message: 'Error occurred.', type: 'error' }));
        }
    }

    const updateRow = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let _data = {
            prices: 1,
            organization_id: orgID,
            component_type_id: typeID,
            price_level: formData.price_level,
            cost_price: formData.cost_price,
            calculation_surcharge: formData.calculation_surcharge,
            installation_cost: formData.installation_cost,
            selling_price: formData.selling_price,
            stock_value: formData.stock_value,
            _method: 'patch',
        }
        if (!isNew) {
            _data.id = rowID;
        }
        try {
            let { data } = await API('post', `manager/components/${recID}`, _data);
            dispatch(openPopUp({ message: 'Component updated successfully', type: 'success' }));
            setIsLoading(false);
            setEditable(false);
            if (isNew) {
                setIsNew(false);
                setRowID(data.id);
            }
        } catch (error) {
            setIsLoading(false);
            dispatch(openPopUp({ message: 'Error occurred. While updating the component.', type: 'error' }))
        }
    }

    return (
        <TableRow>
            <td>
                <form id={`form${rowID}`} onSubmit={updateRow}><input type="hidden" name="id" value="1" /></form>
            </td>
            <TableCell>
                {editable ?
                    <input
                        type='number'
                        value={formData?.price_level}
                        name='price_level'
                        form={`form${rowID}`}
                        required
                        pattern="[1-5][0-9-.]{1,10}"
                        style={inputStyle}
                        onChange={handleChange}
                        className='hide_arrows'
                    />
                    : formData?.price_level || '--'} St.</TableCell>
            <TableCell>{editable ?
                <input
                    type='number'
                    value={formData?.cost_price}
                    style={inputStyle}
                    form={`form${rowID}`}
                    required
                    pattern="[1-5][0-9-.]{1,10}"
                    name='cost_price'
                    onChange={handleChange}
                    className='hide_arrows'
                />
                : formData?.cost_price || '--'} CHF/St.</TableCell>
            <TableCell>{editable ?
                <input
                    type='number'
                    value={formData?.calculation_surcharge}
                    style={inputStyle}
                    form={`form${rowID}`}
                    required
                    pattern="[1-5][0-9-.]{1,10}"
                    name='calculation_surcharge'
                    onChange={handleChange}
                    className='hide_arrows'
                />
                : formData?.calculation_surcharge || '--'} %</TableCell>
            <TableCell>{editable ?
                <input
                    type='number'
                    value={formData?.installation_cost}
                    style={inputStyle}
                    form={`form${rowID}`}
                    required
                    name='installation_cost'
                    pattern="[1-5][0-9-.]{1,10}"
                    onChange={handleChange}
                    className='hide_arrows'
                />
                : formData?.installation_cost || '--'} CHF/St.</TableCell>
            <TableCell>{editable ?
                <input
                    type='number'
                    value={formData?.selling_price}
                    style={inputStyle}
                    form={`form${rowID}`}
                    required
                    name='selling_price'
                    pattern="[1-5][0-9-.]{1,10}"
                    onChange={handleChange}
                    className='hide_arrows'
                />
                : formData?.selling_price || '--'} CHF/St.</TableCell>
            <TableCell>{editable ?
                <input
                    type='number'
                    value={formData?.stock_value}
                    style={inputStyle}
                    form={`form${rowID}`}
                    required
                    name='stock_value'
                    pattern="[1-5][0-9-.]{1,10}"
                    onChange={handleChange}
                    className='hide_arrows'
                />
                : formData?.stock_value || '--'}</TableCell>
            <TableCell>
                <Stack direction='row' spacing={0.5} alignItems='center'>
                    <>
                        {editable ?
                            <>
                                <Tooltip title='Save' placement="top">
                                    <IconButton
                                        type="submit"
                                        color='success'
                                        form={`form${rowID}`}
                                    >
                                        {isLoading ?
                                            <CircularProgress color='success' size={22} />
                                            :
                                            <CheckRoundedIcon />
                                        }
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Cancel changes' placement="top">
                                    <IconButton
                                        onClick={cancelChanges}
                                        color='error'
                                        disabled={isLoading}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                            :
                            <Tooltip title='Edit' placement="top">
                                <IconButton
                                    onClick={editRow}
                                    color='info'
                                >
                                    <CreateRoundedIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        <Tooltip title='Delete' placement="top">
                            <IconButton
                                onClick={(event) => {
                                    if (isNew) {
                                        removeRow(index);
                                        return;
                                    }
                                    handleClick(event);
                                }}
                                color='error'
                                disabled={isLoading || isDeleting}
                            >
                                {isDeleting ?
                                    <CircularProgress color='error' size={22} />

                                    :
                                    <DeleteForeverRoundedIcon />
                                }
                            </IconButton>
                        </Tooltip>
                    </>
                </Stack>
                <Popper id={id} open={open} placement='left' anchorEl={anchorEl}>
                    <Box sx={modalSt}>
                        <small>Are you sure?</small>
                        <Button color="info" size="small" px={0} onClick={deleteRow}>Yes</Button>
                        <Button color="error" size="small" px={0} onClick={handleClick}>no</Button>
                    </Box>
                </Popper>
            </TableCell>
        </TableRow>
    );
}

PriceTableRow.defaultProps = {
    data: {},
    switchScreen: (e) => { },
    removeRow: (e) => { },
}
export default PriceTableRow;

const inputStyle = {
    border: 0,
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.20)',
    width: '100px',
    padding: '3px 5px',
}
const modalSt = {
    border: '1px solid #ccc',
    p: 1,
    borderRadius: '7px',
    bgcolor: '#fff',
    '& .MuiButtonBase-root': {
        minWidth: 'fit-content',
        ml: 0.5
    }
}