import React, { useState } from "react";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import API from "../../../axios";
import { InputField, SearchComboBox, SelectBox } from "../../../components";
import { openPopUp } from "../../../store/reducer";
import { errorsSetter } from "../../../helpers/errors-setter";
import { FileUploader } from "react-drag-drop-files";
import { NoImg } from "../../../assets";

function ComponentForm({ handleClose }) {
  const fileTypes = ["jpg", "png", "jpeg"];
  const { selectedLang, language } = useSelector((state) => state.storeReducer);
  const { user } = useSelector((state) => state.storeReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);
  const [formData, setFormData] = useState({
    type: null,
    component: null,
    manufacturer: null,
    modal: null,
    organization_id: user?.organization_id,
    name: "",
    item_number: "",
    description: "",
    battery_storage: 0,
    energy_management: 0,
    photovoltaic: 0,
    quantity: 0,
    image: null,
    min_quantity: 0,
  });
  const [manufacturerItems, setManufacturerItems] = useState([]);
  const [modalItems, setModalItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleComponent = (item) => {
    setFormData({ ...formData, type: item, component: item });
    let _manufacturer = [];
    if (Boolean(item?.manufacturers?.length)) {
      item?.manufacturers.forEach((x, _) => {
        return _manufacturer.push({ label: x.manufacturer, value: x.id });
      });
      setManufacturerItems(_manufacturer);
    } else {
      setManufacturerItems([{ label: "no items" }]);
      dispatch(
        openPopUp({
          message: "Manufacturers are not present in this component.",
          type: "warning",
        })
      );
    }
  };

  const handleModal = (e) => {
    const _id = e.target.value;
    setFormData({ ...formData, manufacturer: _id });
    let _index = formData.component.manufacturers.findIndex(
      (x) => x.id === _id
    );
    let _obj = formData?.component?.manufacturers[_index];
    let _modalItems = [];
    if (Boolean(_obj.modals?.length)) {
      _obj?.modals.forEach((x, _) => {
        return _modalItems.push({ label: x.title, value: x.id });
      });
      setModalItems(_modalItems);
    } else {
      setModalItems([{ label: "no items" }]);
      dispatch(
        openPopUp({
          message: "Modals are not present in this Manufacturer.",
          type: "warning",
        })
      );
    }
    return;
  };

  const handleForm = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    let _data = new FormData();
    if (formData.type?.is_custom) {
      _data.append("component_type_id", formData.type?.id);
      _data.append("organization_id", formData?.organization_id);
      _data.append("name", formData.name);
      _data.append("item_number", formData.item_number ?? "");
      _data.append("description", formData.description ?? "");
      _data.append("battery_storage", formData.battery_storage ? "1" : "0");
      _data.append("energy_management", formData.energy_management ? "1" : "0");
      _data.append("photovoltaic", formData.photovoltaic ? "1" : "0");
      _data.append("type", "custom");
      _data.append("quantity", formData?.quantity);
      _data.append("min_quantity", formData?.min_quantity);
      if (file !== null) {
        _data.append("image", file);
      }
    } else {
      _data.append("component_type_id", formData.type?.id);
      _data.append("organization_id", formData?.organization_id);
      _data.append("manufacturer_id", formData.manufacturer);
      _data.append("modal_id", formData.modal);
      _data.append("item_number", formData.item_number ?? "");
      _data.append("quantity", formData?.quantity);
      _data.append("min_quantity", formData?.min_quantity);
      if (file !== null) {
        _data.append("image", file);
      }
    }
    setFormErrors({});
    try {
      let { data } = await API("post", `manager/components`, _data);
      dispatch(
        openPopUp({
          message: "Component has been created successfully.",
          type: "success",
        })
      );
      navigate(`/admin/components/${data.id}`, { id: data.id });
    } catch (error) {
      setIsLoading(false);
      setFormErrors(errorsSetter(error));
      dispatch(
        openPopUp({
          message: "Error Occurred. While creating component.",
          type: "error",
        })
      );
    }
  };

  const handleImage = (file) => {
    setFile(file);
    let blob = URL.createObjectURL(file);
    setImageBlob(blob);
  };

  return (
    <>
      <Box
        component="form"
        autoCapitalize="off"
        autoComplete="off"
        onSubmit={handleForm}
        sx={{
          pb: 4,
          px: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              component="h5"
              sx={{ textTransform: "uppercase" }}
            >
              {language[selectedLang]?.add_new_components}
            </Typography>
            <Box component="small" sx={{ color: "#969696" }}>
              {
                language[selectedLang]
                  ?.select_the_manufacturer_and_type_of_component_you_want
              }
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <SearchComboBox
              fullWidth
              url={`manager/component-types?active=1&`}
              objLabel="title"
              label={language[selectedLang]?.component_type}
              required
              size="small"
              handleChange={handleComponent}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            {!!formData.type && !formData.type?.is_custom ? (
              <SelectBox
                items={manufacturerItems}
                label="Manufacturer"
                disabled={Boolean(!manufacturerItems.length)}
                required
                fullWidth
                size="small"
                handleChange={handleModal}
                error={formErrors?.manufacturer}
              />
            ) : (
              <InputField
                size="small"
                fullWidth
                required
                label="Name"
                name="name"
                handleChange={handleChange}
                error={formErrors?.name}
              />
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            {!!formData.type && !formData.type?.is_custom ? (
              <SelectBox
                items={modalItems}
                label="Modal"
                disabled={Boolean(!modalItems.length)}
                required
                fullWidth
                size="small"
                handleChange={(e) =>
                  setFormData({ ...formData, modal: e.target.value })
                }
                error={formErrors?.modal}
              />
            ) : (
              <InputField
                size="small"
                fullWidth
                label={`${language[selectedLang]?.item_number} (${language[selectedLang]?.common_optional})`}
                type="number"
                inputProps={{
                  min: "0",
                }}
                name="item_number"
                handleChange={handleChange}
                error={formErrors?.item_number}
              />
            )}
          </Grid>
          {!!formData.type && !formData.type?.is_custom ? (
            <>
              <Grid item md={6} xs={12}>
                <InputField
                  size="small"
                  fullWidth
                  label={`${language[selectedLang]?.item_number} (${language[selectedLang]?.common_optional})`}
                  type="number"
                  inputProps={{
                    min: "0",
                  }}
                  handleChange={handleChange}
                  name="item_number"
                  error={formErrors?.item_number}
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
                />
              </Grid>
            </>
          ) : null}
          {!!formData.type && !formData.type?.is_custom ? null : (
            <>
              <Grid item md={6} xs={12}>
                <InputField
                  type="number"
                  size="small"
                  fullWidth
                  label={`${language[selectedLang]?.quantity}`}
                  name="quantity"
                  handleChange={handleChange}
                  error={formErrors?.quantity}
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
                  error={formErrors?.min_quantity}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  size="small"
                  fullWidth
                  label={`${language[selectedLang]?.common_description} (${language[selectedLang]?.common_optional})`}
                  name="description"
                  multiline
                  handleChange={handleChange}
                  error={formErrors?.description}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <FileUploader
                  handleChange={(e) => handleImage(e)}
                  name="file"
                  required
                  multiple={false}
                  maxSize={100}
                  types={fileTypes}
                />
                <Box width="100%" height="100%" marginTop={3}>
                  <img
                    src={imageBlob ? imageBlob : NoImg}
                    alt="ImagePreview"
                    width="auto"
                    style={{ maxWidth: "100%" }}
                    height="auto"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="h6"
                    component="h5"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {language[selectedLang]?.technology_affiliation}
                  </Typography>
                  <Tooltip title="Info">
                    <InfoIcon />
                  </Tooltip>
                </Stack>
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
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={() => {}}
                sx={
                  {
                    // backgroundColor: '#000',
                    // '&:hover': {
                    //     backgroundColor: '#000'
                    // }
                  }
                }
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: "#fff", mr: 1, size: "12px" }}
                  />
                ) : null}
                {language[selectedLang]?.common_add}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleClose}
              >
                {language[selectedLang]?.common_abort}
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Typography
              variant="h6"
              component="h6"
              mt={3}
              style={{ textTransform: "uppercase" }}
            >
              {language[selectedLang]?.cant_find}
            </Typography>
            <Box component="small" sx={{ color: "#969696" }}>
              {language[selectedLang]?.comp_form_typo}{" "}
              <a href="/#">support@gama-portal.ch</a>{" "}
              {language[selectedLang]?.comp_form_typo_send}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
ComponentForm.defaultProps = {
  handleClose: () => {},
};
export default ComponentForm;
