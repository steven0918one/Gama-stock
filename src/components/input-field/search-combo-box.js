import React, { useState } from "react";
import {
  Box,
  InputLabel,
  FormHelperText,
  TextField,
  MenuItem,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import API from "../../axios";

function SearchComboBox({
  labelTop,
  initValue,
  url,
  handleChange,
  styles,
  objLabel,
  record,
  addBtn,
  addBtnEvent,
  placement,
  placementValue,
  ...props
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [listItems, setListItems] = useState(null);

  React.useEffect(() => {
    if (!!initValue) {
      setSelectedValue(initValue);
    }
    if (!!record) {
      setListItems([record]);
      setSelectedValue(record[objLabel]);
      setSelectedIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initValue, record]);

  const getRecord = async (_search) => {
    setIsLoading(true);
    try {
      let { data } = await API("get", url + `search=${_search}`, );
      setListItems(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleSearchInput = (v) => {
    setSelectedValue(v);
    getRecord(v);
    if (!openList) setOpenList(true);
  };

  const handleItem = (v, i) => {
    setOpenList(false);
    setSelectedValue(v[objLabel]);
    handleChange(v);
    setSelectedIndex(i);
  };

  const inputID = `input-${Math.ceil(Math.random())}`;

  return (
    <Box sx={[styles, { position: "relative" }]}>
      {labelTop && (
        <InputLabel
          htmlFor={inputID}
          sx={{
            marginBottom: "5px",
            color: "#000",
          }}
        >
          {labelTop}
        </InputLabel>
      )}
      <TextField
        type="text"
        value={selectedValue}
        id={inputID}
        sx={{ backgroundColor: '#fff', color: '#fff' }}
        onChange={(event) => handleSearchInput(event.target.value)}
        onFocus={(e) => {
          if (selectedValue === "") {
            getRecord(e.target.value);
          }
          setOpenList(true);
        }}
        InputProps={
          !!listItems && listItems.length
            ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setOpenList(!openList)}
                  >
                    {openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }
            : {}
        }
        {...props}
      />
      <Box
        component={Paper}
        sx={[
          dropDownMenu(placement, placementValue),
          {
            visibility: openList ? "visible" : "hidden",
            zIndex: openList ? 25 : -1000,
          },
        ]}
      >
        {addBtn ?
          <MenuItem
            onClick={addBtnEvent}
          >
            Add New
          </MenuItem>
          :
          null
        }
        {isLoading ? (
          <Box px={2} py={1}>
            <FormHelperText sx={{ textAlign: "center", mt: "0 !important" }}>
              ...Loading
            </FormHelperText>
          </Box>
        ) : !!listItems && listItems.length ? (
          listItems.map((v, i) => (
            <MenuItem
              key={i}
              selected={selectedIndex === i ? true : false}
              onClick={() => handleItem(v, i)}
            >
              {v[objLabel]}
            </MenuItem>
          ))
        ) : (
          <Box px={2} py={1}>
            <FormHelperText sx={{ textAlign: "center", mt: "0 !important" }}>
              Does not match any record!
            </FormHelperText>
          </Box>
        )}
      </Box>
    </Box>
  );
}
const dropDownMenu = (placement, placementValue) => {
  return {
    position: "absolute",
    width: "100%",
    backgroundColor: "#fff",
    maxHeight: '200px',
    overflowY: 'auto',
    bottom: placement === 'top' ? placementValue : 'unset'
  }
};

SearchComboBox.defaultProps = {
  labelTop: "",
  initValue: "",
  handleChange: (e) => { },
  styles: {},
  record: null,
  addBtn: false,
  addBtnEvent: (e) => { },
  objLabel: "title",
  placement: 'bottom',
  placementValue: '42px',
};
export default SearchComboBox;
