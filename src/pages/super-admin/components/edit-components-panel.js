import React, { useState } from "react";
import {
  Box,
  Stack,
  Divider,
  Button,
  Typography,
  Grid,
  TableCell,
  Paper,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";

import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";

import noImageFound from "../../../assets/images/no-image-avalible.png";
import {
  InputField,
  MyLoader,
  SaveChangesBtn,
  StartIconBtn,
  TableWrapper,
  InfoHeading,
  SelectBox,
} from "../../../components";
import API from "../../../axios";
import PriceTableRow from "./price-table-row";
import { openPopUp } from "../../../store/reducer";
import ComponentLayout from "./component-layout";
import ApiImage from "../../../hooks/fetch-image";
import ComponentInfoCard from "./component-info-card";
import { errorsSetter } from "../../../helpers/errors-setter";
import { FileUploader } from "react-drag-drop-files";
import { NoImg } from "../../../assets";

function EditComponentsPanel() {
  const fileTypes = ["jpg", "png", "jpeg"];
  const [record, setRecord] = useState(null);
  const { language, selectedLang } = useSelector((state) => state.storeReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [toggler, setToggler] = useState(false);
  const [file, setFile] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    item_number: "",
    description: "",
    tags: "",
    battery_storage: "",
    energy_management: "",
    photovoltaic: "",
    quantity: "",
    min_quantity: "",
    image: null,
  });

  const [url, setUrl] = useState("");

  const [pricesTable, setPricesTable] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const recordID = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    getData();
    setTimeout(() => {
      myComUrl();
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      let { data } = await API("get", `manager/components/${recordID.id}`);
      setRecord(data);
      setFormData({
        name: data.name ?? "",
        item_number: data.item_number ?? "",
        description: data.description ?? "",
        battery_storage: data.battery_storage ?? "0",
        energy_management: data.energy_management ?? "0",
        photovoltaic: data.photovoltaic ?? "0",
        tags: "",
        quantity: data.quantity ?? "",
        image: data.id ?? "",
        min_quantity: data.min_quantity ?? "",
      });
      setPricesTable(data?.componentprice || []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    return;
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setShowUpdateBtn(true);
  };

  const printTh = () => {
    return (
      <>
        <td></td>
        <TableCell sx={{ color: "#fff" }}>
          {language[selectedLang]?.price_level}
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          {language[selectedLang]?.cost_price}
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          {language[selectedLang]?.calculation_surcharge}
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          {language[selectedLang]?.installation_coasts}
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          {language[selectedLang]?.selling_price}
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          {language[selectedLang]?.stock_value}
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          {language[selectedLang]?.common_actions}
        </TableCell>
      </>
    );
  };

  const removeRow = (index) => {
    let arr = pricesTable;
    arr.splice(index, 1);
    setPricesTable(arr);
    setToggler(!toggler);
  };

  const newRecord = () => {
    setPricesTable([
      ...pricesTable,
      {
        price_level: "",
        cost_price: "",
        calculation_surcharge: "",
        installation_cost: "",
        selling_price: "",
        editable: true,
        id: Math.random() * 100000,
      },
    ]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setShowUpdateBtn(true);
  };

  const updateComponent = async () => {
    setIsLoading(true);
    let _fd = new FormData();
    _fd.append("name", formData.name);
    _fd.append("item_number", formData.item_number);
    _fd.append("description", formData.description);
    _fd.append("tags", formData.tags);
    _fd.append("quantity", formData.quantity);
    _fd.append("min_quantity", formData.min_quantity);
    _fd.append("battery_storage", formData.battery_storage ? "1" : "0");
    _fd.append("energy_management", formData.energy_management ? "1" : "0");
    _fd.append("photovoltaic", formData.photovoltaic ? "1" : "0");
    _fd.append("component_type_id", Number(record.component_type_id));
    _fd.append("organization_id", Number(record.organization_id));
    if (file !== null) {
      _fd.append("image", file);
    }
    _fd.append("_method", "patch");
    setFormErrors({});
    try {
      let { data } = await API(
        "post",
        `manager/components/${recordID.id}`,
        _fd
      );
      dispatch(
        openPopUp({
          message: language[selectedLang]?.component_edit_alert_success,
          type: "success",
        })
      );
      if (record.name !== data?.name) {
        setRecord({ ...record, name: data?.name });
      }
      setIsLoading(false);
      setShowUpdateBtn(false);
    } catch (error) {
      setIsLoading(false);
      setFormErrors(errorsSetter(error));
      dispatch(
        openPopUp({
          message: language[selectedLang]?.component_edit_alert_error,
          type: "error",
        })
      );
    }
  };

  const printModals = (data = []) => {
    if (data.length === 0) return;
    let obj = _.groupBy(
      record?.manufacturer_modal?.modal?.information,
      "group"
    );
    return Object.entries(obj).map((v, i) => {
      return (
        <Grid item md={3} sm={6} xs={12} key={i}>
          <Box
            component={Paper}
            sx={{
              p: 2,
              height: "100%",
            }}
          >
            <ComponentInfoCard data={v} />
          </Box>
        </Grid>
      );
    });
  };

  const updateStatus = async () => {
    setIsLoading(true);
    let _fd = {
      status: record?.active ? 0 : 1,
      component_type_id: Number(record?.component_type_id),
      organization_id: Number(record.organization_id),
      _method: "patch",
    };
    try {
      let { data } = await API(
        "post",
        `manager/components/${recordID.id}`,
        _fd
      );
      dispatch(
        openPopUp({
          message: language[selectedLang]?.component_edit_status_alert_success,
          type: "success",
        })
      );
      setRecord({ ...record, active: data?.active });
    } catch (error) {
      dispatch(
        openPopUp({
          message: language[selectedLang]?.component_edit_status_alert_error,
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImage = (file) => {
    setFile(file);
    let blob = URL.createObjectURL(file);
    setImageBlob(blob);
  };

  const myComUrl = () => {
    const TOKEN = localStorage.getItem("@ACCESS_TOKEN");
    const api = process.env.REACT_APP_API_KEY;
    const HEADER = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    fetch(api + `component-image/${recordID?.id}`, HEADER)
      .then(async (res) => {
        if (res.status === 404 || res.status === 500) {
          setUrl(null);
        } else {
          const imageBlob = await res.blob();
          setUrl(URL.createObjectURL(imageBlob));
        }
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: edit-components-panel.js:292 ~ myComUrl ~ err",
          err
        );
      });
  };

  return (
    <ComponentLayout>
      <>
        {isLoading && <MyLoader />}
        <Box sx={{ pt: 2, pb: 2 }}>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <Tooltip title="Back" placement="top">
                <IconButton onClick={() => navigate(-1)}>
                  <KeyboardReturnRoundedIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="p" component="p" sx={{ fontSize: "13px" }}>
                {record?.name ?? "-"}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  opacity: record?.active ? 1 : 0.4,
                }}
                onClick={updateStatus}
              >
                {record?.active
                  ? language[selectedLang]?.archive
                  : language[selectedLang]?.restore}
              </Button>
            </Stack>
          </Box>
          <Typography variant="h6" component="h6" sx={{ mt: 3 }}>
            {record?.componenttypes?.title}
          </Typography>
          <Box sx={{ borderBottom: "1px solid #ccc", mt: 2 }}>
            <Typography
              variant="p"
              component="p"
              sx={{
                borderBottom: "1px solid",
                pb: 1,
                borderColor: "primary.main",
                width: "fit-content",
              }}
            >
              DEUTCH (CH)
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item md={4} xs={12}>
              <InputField
                size="small"
                label={language[selectedLang]?.common_name}
                name="name"
                initValue={formData.name}
                error={formErrors?.name}
                fullWidth
                handleChange={handleChange}
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <InputField
                size="small"
                label={language[selectedLang]?.item_number}
                fullWidth
                initValue={formData.item_number}
                error={formErrors?.item_number}
                name="item_number"
                handleChange={handleChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputField
                placeholder="Manual input"
                size="small"
                label={language[selectedLang]?.tags}
                fullWidth
                initValue={formData?.tags}
                name="tags"
                error={formErrors?.tags}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InputField
                type="number"
                size="small"
                fullWidth
                label={`${language[selectedLang]?.quantity}`}
                name="quantity"
                handleChange={handleChange}
                error={formErrors?.quantity}
                initValue={formData?.quantity}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InputField
                type="number"
                size="small"
                fullWidth
                label={`${language[selectedLang]?.org_min_quantity}`}
                name="min_quantity"
                handleChange={handleChange}
                initValue={formData?.min_quantity}
                error={formErrors?.min_quantity}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                placeholder="Description"
                size="small"
                label={language[selectedLang]?.common_description}
                fullWidth
                multiline
                initValue={formData.description}
                // rows={4}
                name="description"
                error={formErrors?.description}
                handleChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 2 }}>
            <FileUploader
              handleChange={(_file) => {
                handleImage(_file);
                setShowUpdateBtn(true);
              }}
              name="file"
              required
              multiple={false}
              maxSize={100}
              types={fileTypes}
            />
            {url || imageBlob ? (
              <Box width="100%" height="100%" marginTop={3}>
                <img
                  src={imageBlob ? imageBlob : url}
                  alt="ImagePreview"
                  width="auto"
                  style={{ maxWidth: "50%" }}
                  height="auto"
                />
              </Box>
            ) : (
              <Box width="100%" height="100%" marginTop={3}>
                <img
                  src={NoImg}
                  alt="ImagePreview"
                  width="auto"
                  style={{ maxWidth: "50%" }}
                  height="auto"
                />
              </Box>
            )}
          </Grid>
          <Grid container spacing={2}>
            {!record?.is_custom && (
              <Grid item xs={12}>
                <Box mt={2} width="fit-content">
                  <InfoHeading
                    variant="h6"
                    text={language[selectedLang]?.technology_affiliation}
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(formData.energy_management)}
                          name="energy_management"
                          onChange={handleSwitchChange}
                          size="small"
                        />
                      }
                      label={language[selectedLang]?.energy_management}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(formData.battery_storage)}
                          name="battery_storage"
                          onChange={handleSwitchChange}
                          size="small"
                        />
                      }
                      label={language[selectedLang]?.battery_storage}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(formData.photovoltaic)}
                          name="photovoltaic"
                          onChange={handleSwitchChange}
                          size="small"
                        />
                      }
                      label={language[selectedLang]?.photovoltaic}
                    />
                  </FormGroup>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h6" component="h6" sx={{ mt: 3 }}>
                {language[selectedLang]?.price_parameter}
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <InfoHeading text="Price dependency" containerSx={{ mb: 1 }} />
              <SelectBox
                initValue="stuck"
                items={[
                  { label: "Stuck", value: "stuck" },
                  { label: "Other", value: "other" },
                ]}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InfoHeading
                text={language[selectedLang]?.price_type}
                containerSx={{ mb: 1 }}
              />
              <SelectBox
                initValue="proportional"
                items={[
                  { label: "Proportional", value: "proportional" },
                  { label: "Other", value: "other" },
                ]}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
          <Typography variant="h6" component="h6" sx={{ mt: 3 }}>
            {language[selectedLang]?.price_heading}
          </Typography>
          <Box component="div" sx={{ mt: 3 }}>
            <TableWrapper
              thContent={printTh()}
              isContent={pricesTable.length}
              spanTd={7}
            >
              {pricesTable.map((v, i) => {
                return (
                  <PriceTableRow
                    key={i}
                    item={v}
                    index={i}
                    typeID={record?.component_type_id}
                    orgID={record.organization_id}
                    recID={record.id}
                    removeRow={removeRow}
                  />
                );
              })}
            </TableWrapper>
          </Box>
          <StartIconBtn
            title={language[selectedLang]?.add_price}
            variant="contained"
            size="small"
            fullWidth
            styles={{ maxWidth: "150px", mt: 4 }}
            handleClick={newRecord}
            icon={<AddIcon />}
          />
          {record?.manufacturer_modal && (
            <Typography variant="h6" component="h6" sx={{ mt: 3 }}>
              {language[selectedLang]?.component_info}
            </Typography>
          )}
          {record?.manufacturer_modal && (
            <Grid container spacing={2} sx={{ mt: 3, alignItems: "stretch" }}>
              <Grid item md={3} sm={6} xs={12}>
                <Box
                  component={Paper}
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                  }}
                >
                  <MyImage
                    size="large"
                    id={record?.manufacturer_modal?.modal?.id}
                  />
                </Box>
              </Grid>
              {record?.manufacturer_modal?.modal?.information.length
                ? printModals(record?.manufacturer_modal?.modal?.information)
                : null}
            </Grid>
          )}
        </Box>
        {showUpdateBtn && (
          <SaveChangesBtn
            update={() => updateComponent()}
            cancel={() => setShowUpdateBtn(false)}
          />
        )}
      </>
    </ComponentLayout>
  );
}

export default EditComponentsPanel;

const MyImage = ({ id }) => {
  const image = ApiImage(`component-image/${id}`);

  return (
    <>
      {image ? (
        <img alt="..." src={image} width="50" height="50" />
      ) : (
        <img alt="..." src={noImageFound} width="50" height="50" />
      )}
    </>
  );
};
