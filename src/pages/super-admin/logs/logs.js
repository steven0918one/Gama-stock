import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Container,
  Grid,
  TableCell,
  TableRow,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import PageTitle from "../../../hooks/page-title";
import { InputField, TableWrapper, UsePagination } from "../../../components";
import API from "../../../axios";
import { useSelector } from "react-redux";
import qs from "qs";

export default function Logs() {
  const { language, selectedLang } = useSelector((state) => state.storeReducer);
  PageTitle(language[selectedLang]?.logs);
  const [isLoading, setIsLoading] = useState(false);
  const [IsFilterApply, setIsFilterApply] = useState(false);
  const [serial, setSerial] = useState('');
  const [userName, setUserName] = useState('');
  const [componentName, setComponentName] = useState('');
  const [record, setRecord] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getRecord();
    // eslint-disable-next-line
  }, [page]);

  const applyFilters = () => {
    setIsFilterApply(true);
    getRecord();
  }

  const clearFilters = async () => {
    setIsFilterApply(false);
    setSerial("");
    setUserName("");
    setComponentName("");
    getRecord();
  }

  const getRecord = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: page,
        serial: serial,
        user_name: userName,
        component_name: componentName

      }
      let { data } = await API(
        "get", "manager/get-component-quantity-logs?" + qs.stringify(params)
      );
      setRecord(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const logsFilter = () => {
    return (
      <Box mt={4} ml={2}>
        <Grid container spacing={2}>
          <Grid item md={6} sm={6} xs={12}>
            <InputField
              size="small"
              initValue={serial}
              label={language[selectedLang]?.serial}
              handleChange={(e) => setSerial(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <InputField
              size="small"
              initValue={userName}
              label={language[selectedLang]?.user_name}
              handleChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <InputField
              size="small"
              initValue={componentName}
              label={language[selectedLang]?.component}
              handleChange={(e) => setComponentName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {(serial || userName || componentName) !== "" &&
              <Button
                variant="contained"
                sx={{ textTransform: "none", ml: 1 }}
                onClick={applyFilters}
              >
                {language[selectedLang]?.filter}
              </Button>
            }
            {IsFilterApply && (
              <Button
                variant="contained"
                sx={{ textTransform: "none", ml: 1 }}
                onClick={clearFilters}
              >
                {language[selectedLang]?.common_clear}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Container maxWidth="false" sx={{ pt: 3, pb: 3 }}>
      <Grid container spacing={2}>
        {logsFilter()}
        <Grid item xs={12}>
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="h6" variant="h6">
              {language[selectedLang]?.logs}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sx={{ overflow: "auto" }}>
          <TableWrapper
            thContent={
              <Fragment>
                <TableCell>{language[selectedLang]?.serial}</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: "table-cell" } }}>
                  {language[selectedLang]?.new_quantity}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: "table-cell" } }}>
                  {language[selectedLang]?.old_quantity}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: "table-cell" } }}>
                  {language[selectedLang]?.user_name}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {language[selectedLang]?.component}
                </TableCell>
                <TableCell>{language[selectedLang]?.date}</TableCell>
              </Fragment>
            }
            spanTd={6}
            isLoading={isLoading}
            isContent={record?.data.length}
          >
            {record?.data?.map((v, i) => (
              <TableRow key={i}>
                <TableCell>{v?.serial ? v?.serial : "-"}</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: "table-cell" } }}>
                  {v?.new_quantity ? v?.new_quantity : "-"}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: "table-cell" } }}>
                  {v?.old_quantity ? v?.old_quantity : "-"}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: "table-cell" } }}>
                  {v?.user?.first_name + " " + v?.user?.last_name}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {v?.component?.name ? v?.component?.name : "-"}
                </TableCell>
                <TableCell>{v?.created_date}</TableCell>
              </TableRow>
            ))}
          </TableWrapper>
        </Grid>
        <Grid item xs={12}>
          {!!record && record?.last_page > 1 && (
            <Box component="div" sx={{ mt: 2 }}>
              <UsePagination
                total={record?.total}
                perPage={record?.per_page}
                page={page}
                setPage={setPage}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}
