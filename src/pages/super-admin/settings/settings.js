import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Stack,
    Button,
    CircularProgress,
    Typography
} from '@mui/material';
import { InputField } from '../../../components';
import API from '../../../axios';
import { openPopUp } from '../../../store/reducer';
import { useDispatch } from 'react-redux';

import { useSelector } from "react-redux";

export default function Settings() {
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoad, setPageLoad] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        body: "",
    });
    const { selectedLang, language } = useSelector((state) => state.storeReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        getAccountCreation();
    }, []);

    const getAccountCreation = async () => {
        setPageLoad(true)
        try {
            let { data } = await API('get', 'manager/get-email-texts/update_component_quantity');
            let _data = JSON.parse(data?.value);
            setFormData({
                subject: _data?.subject,
                body: _data?.body,
            })
            setPageLoad(false);
        } catch (error) {
            console.log('ERR =>', error)
            setPageLoad(false);
        }
    }

    const handleForm = async () => {
        setIsLoading(true)
        try {
            let { data } = await API('post', 'manager/update-email-texts/update_component_quantity', {
                "subject": formData?.subject,
                "body": formData?.body,
            });
            if (data) {
                dispatch(openPopUp({ message: language[selectedLang]?.common_updated_successfuly, type: "success" }));
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            dispatch(
                openPopUp({
                    message: "Error occurred. While updating the component.",
                    type: "error",
                })
            );
        }
    }

    const handleChange = (e) => {
        var { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Container maxWidth="false" sx={{ pt: 3, pb: 3 }}>
            {
                pageLoad ?
                    <Box component='div' sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={28} color="primary" />
                    </Box>
                    :
                    <Box>
                        <Box sx={{ pb: 3 }}>
                            <Typography
                                variant="h5"
                                component="h5"
                                sx={{
                                    fontWeight: "bold",
                                    textAlign: 'center'
                                }}
                            >
                                {language[selectedLang]?.super_admin_account_creation}
                            </Typography>
                            <Typography
                                variant="h6"
                                component="h6"
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                {language[selectedLang]?.common_variables}
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                sx={{
                                    pl: 2,
                                    pb: 0.5
                                }}
                            >
                                Client Name : {`{client-name}`}
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                sx={{
                                    pl: 2,
                                    pb: 0.5
                                }}
                            >
                                Client ID: {`{client-id}`}
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                sx={{
                                    pl: 2,
                                    pb: 0.5
                                }}
                            >
                                Component Name: {`{component-name}`}
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                sx={{
                                    pl: 2,
                                    pb: 0.5
                                }}
                            >
                                Component ID: {`{component-id}`}
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                sx={{
                                    pl: 2,
                                    pb: 0.5
                                }}
                            >
                                Previous Quantity: {`{previous-quantity}`}
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                sx={{
                                    pl: 2,
                                    pb: 0.5
                                }}
                            >
                                Current Quantity: {`{current-quantity}`}
                            </Typography>
                        </Box>
                        <Stack spacing={2}>
                            <InputField
                                type='text'
                                label={language[selectedLang]?.common_subject}
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                required
                                onChange={handleChange}
                            />
                            <InputField
                                type='text'
                                label={language[selectedLang]?.common_body}
                                name="body"
                                placeholder="Body"
                                multiline
                                value={formData.body}
                                required
                                onChange={handleChange}
                            />
                            <Box>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={handleForm}
                                >
                                    {isLoading && (
                                        <CircularProgress size={16} color="primary" />
                                    )}
                                    {language[selectedLang]?.common_update}
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
            }
        </Container>
    )
}
