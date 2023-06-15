import React, { useState, Fragment } from "react";
import {
  Button,
  TableCell,
  Box,
  TableRow,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../assets";
import qs from "qs";
import noImageFound from "../../../assets/images/no-image-avalible.png";

import PageTitle from "../../../hooks/page-title";
import API from "../../../axios";

// QR code
import { QRCodeCanvas } from "qrcode.react";
import QRCodeWebcam from "./QRCodeWebcam";
import {
  SelectBox,
  InputField,
  CustomModal,
  UsePagination,
  TableWrapper,
  OrderDataBtn,
  MultiSelect,
  InfoHeading,
} from "../../../components";
import ComponentForm from "./comp-form";
import { icon1, icon2, icon3 } from "../../../assets";
import ComponentLayout from "./component-layout";
import { useDispatch, useSelector } from "react-redux";
import ApiImage from "../../../hooks/fetch-image";
import { CSVLink } from "react-csv";


//import redux filter function
import {
  openPopUp,
  setPaginationCurrent,
  clearFilters,
  setPerPage,
  setSearch,
  setStatus,
  setLanguage,
  setOrderBy,
  setIsFilterApply,
  setComponentType,
  setReduceQuantities
} from "../../../store/reducer";

export default function ComponentsPanel() {
  const {
    selectedLang,
    language,
    user,
    pagination_number,
    perPage,
    search,
    status,
    language1,
    technologies,
    orderBy,
    componentType,
    reduceQuantities
  } = useSelector((state) => state.storeReducer);

  PageTitle(language[selectedLang]?.component);
  const [isMobile, setIsMobile] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [createCompModal, setCreateCompModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dltLoading, setDltLoading] = useState(false);
  const [records, setRecords] = useState(null);
  const [ID, setID] = useState(null);
  const [openM2, setOpenM2] = useState(false);
  const [openM3, setOpenM3] = useState(false);
  const [QRData, setQRData] = useState();
  const [serial, setSerial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [addText, setAddText] = useState(false);
  // Qr code
  const [openWebCam, setOpenWebCam] = useState(false);
  const [columns, setColumns] = useState(_columns);
  const [toggler, setToggler] = useState(false);
  // const [IsFilterApply, setIsFilterApply] = React.useState(false);
  const [Quantities, setQuantities] = useState(0);
  const [AllActive, setAllActive] = useState(0);
  const [csvData, setCsvData] = useState([]);
  const [countOfImages, setCountOfImages] = useState(0);
  const [countOfComponentType, setCountOfComponentType] = useState();
  const [largestId, setLargestId] = useState();
  const [countOftechnologies, setCountOftechnologies] = useState();


  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination_number, orderBy, perPage]);

  // Get Screen Size
  React.useEffect(() => {
    setIsDesktop(window.innerWidth < 1350);
    setIsLaptop(window.innerWidth < 1125)
    setIsMobile(window.innerWidth < 550);
    const handleResizeWindow = () => {
      setIsDesktop(window.innerWidth < 1350);
      setIsLaptop(window.innerWidth < 1125)
      setIsMobile(window.innerWidth < 550);
    };
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);


  const closeModal = () => setCreateCompModal(false);

  const applyFilters = () => {
    dispatch(setPaginationCurrent(1));
    dispatch(setIsFilterApply(true));
    getData();
  };

  const clearAllFilters = () => {
    dispatch(setIsFilterApply(false));
    dispatch(setPaginationCurrent(1));
    dispatch(clearFilters());
    getData();
  };


  const getData =  async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination_number,
        per_page: perPage,
        search: search,
        componenttype: componentType,
        active: status === "active" ? 1 : 0,
        inactive: status === "disable" ? 1 : 0,
        battery_storage: technologies === "battery_storage" ? 1 : 0,
        energy_management: technologies === "energy_management" ? 1 : 0,
        photovoltaic: technologies === "photovoltaic" ? 1 : 0,
        column: orderBy.name,
        orderby: orderBy.order,
        counting: true,
      };
      let stringOfParams = qs.stringify(params);

      let { data } = await API(
        "get",
        "manager/components?" + stringOfParams
      );
      // const data = APIdata;


      makeExportData(data[2].data);
      setRecords(data[2]);

      console.log('data[2] :>> ', data[2]);
      let activeCount = 0;
      let countOfImages = 0;
      let pageTotalQuantities = 0;

      data[2].data.forEach(element => {
        pageTotalQuantities += element.quantity 
        if (element.active) {
          activeCount++;
        };
        if(element.image) {
          countOfImages++;
        }
      });

      let a = calculateCountOfComponentType(data[2].data);
      let largestId = findLargestId(data[2].data);

      setAllActive(activeCount);
      setCountOfImages(countOfImages);
      setCountOfComponentType(a);
      setLargestId(largestId);
      setQuantities(pageTotalQuantities);
      setIsLoading(false);
    } catch (error) {
      if (!!records) setRecords(null);
      setIsLoading(false);
    }
  };


  const findLargestId = (data) => {
    const ids = data.map(object => {
      return object.id;
    });
    return Math.max(...ids);
  };

  const calculateCountOfComponentType = (data) => {
      let count = new Set();
      for(let element of data){
          count.add(element.componenttypes.id);
      }
      return count.size;
  };


  const makeExportData = (data) => {
    let exportData = [];
    console.log('columns :>> ', columns);
    data.forEach(e => {
      exportData.push({
        ID: e.id,
        Name: e.name,
        ComponentType: e.componenttypes.title,
        Item_number: e.item_number,
        Active: e.componenttypes.active,
        Quantity: e.quantity,
        Min_Quantity: e.min_quantity
      })
    });
    setCsvData(exportData);
  };
  
  const findReducedQuantity = (id) => {
   reduceQuantities.forEach(element => {
     if (element.id === id) {
      setQuantity(element.quantity);
     }
   });

  };

  const handleQuantity = async () => {
    if (!quantity) return;
    setDltLoading(true);
    const form = new FormData();
    form.append("serial", serial);
    form.append("quantity", quantity);
    try {
      await API("post", `manager/add-component-quantity-logs/${ID}`, form);
      dispatch(
        openPopUp({
          message: language[selectedLang]?.compnent_alert_succes,
          type: "success",
        })
      );

      getData();

      let data = {
        id: ID,
        quantity: quantity
      };
      dispatch(setReduceQuantities(data));


      setDltLoading(false);
      setOpenM2(false);
      setAddText(false);
    } catch (error) {
      dispatch(
        openPopUp({ message: error?.response?.data?.message, type: "error" })
      );
      setOpenM2(false);
      setDltLoading(false);
      setAddText(false);
    }
  };

  const useFilters = () => {
    return (
      <Box maxWidth="900px" component='form' autoComplete='off'
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(setPaginationCurrent(1)); applyFilters();
        }}>
        <Box>
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <InputField
                size="small"
                label={language[selectedLang]?.common_search}
                handleChange={(e) => {
                  dispatch(setSearch(e.target.value));
                  dispatch(setIsFilterApply(true));
                }}
                initValue={search}
                fullWidth
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <SelectBox
                items={langOptions}
                label={language[selectedLang]?.language}
                size="small"
                initValue={language1}
                handleChange={(e) => {
                  dispatch(setLanguage(e.target.value));
                  dispatch(setIsFilterApply(true));
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <SelectBox
                items={[
                  { label: "All", value: "All" },
                  { label: "Active", value: "active" },
                  { label: "Disabled", value: "disable" },
                ]}
                label={language[selectedLang]?.status}
                size="small"
                initValue={status}
                fullWidth
                handleChange={(e) => {
                  dispatch(setStatus(e.target.value));
                  dispatch(setIsFilterApply(true));
                }}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <SelectBox
                items={componentTypeList}
                label={language[selectedLang]?.component_type}
                size="small"
                initValue={componentType}
                fullWidth
                handleChange={(e) => {
                  dispatch(setComponentType(e.target.value));
                  dispatch(setIsFilterApply(true));
                }}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <SelectBox
                label="Protocol"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              {(search || technologies || language1 || status || componentType) !== "" && (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ textTransform: "none", marginRight: 1 }}
                  onClick={() => {
                    dispatch(setPaginationCurrent(1));
                    applyFilters();
                  }}
                  disabled={isLoading}
                >{isLoading && <CircularProgress size={16} color="primary" />}
                  {language[selectedLang]?.filter}
                </Button>
              )}
              {(search || technologies || language1 || status || componentType) !== "" && (
                <Button
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    dispatch(setPaginationCurrent(1));
                    clearAllFilters();
                  }}
                >
                  {language[selectedLang]?.common_clear}
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: "15px" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="flex-start"
            spacing={3}
          >
            {!isMobile && (
              <Box sx={{ width: { xs: "100%", sm: "50%", md: "40%" } }}>
                <MultiSelect
                  columnsList={columns}
                  setColumnsList={(e) => {
                    setColumns(e);
                    setToggler(!toggler);
                  }}
                />
              </Box>
            )}
            <SelectBox
              label={language[selectedLang]?.shown}
              size="small"
              items={rowsOption}
              handleChange={(e) => {
                dispatch(setPerPage(e.target.value));
                dispatch(setIsFilterApply(true));
              }}
              initValue={perPage}
              styles={{ width: { xs: "100%", sm: "50%", md: "40%" } }}
            />
          </Stack>
        </Box>
      </Box>
    );
  };

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `gama_qr_code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const printTh = () => {
    return (
      <>
        {isMobile && <TableCell width="20px"></TableCell>}
        {columns.map((v, i) => {
          if (!v.show) return <></>;
          if (user?.role !== "stock_manager" && v.id === 12) return <></>;
          if (isDesktop && (v.id === 6 || v.id === 4)) return;
          if (isLaptop && (v.id === 0 || v.id === 10 || v.id === 11)) return;
          if (isMobile && (v.id === 3 || v.id === 12)) {
            return (
              <Fragment key={i}>
                {v.type === "simple_label" && (
                  <TableCell>{language[selectedLang]?.[v.label]}</TableCell>
                )}
                {v.type === "order_label" && (
                  <TableCell>
                    <OrderDataBtn
                      handleBtn={() => dispatch(setOrderBy)}
                      selected={orderBy.name}
                      value={v.value}
                      title={language[selectedLang]?.[v.label]}
                    />
                  </TableCell>
                )}
              </Fragment>
            );
          } else if (isMobile) return <></>;
          return (
            <Fragment key={i}>
              {v.type === "simple_label" && (
                <TableCell>{language[selectedLang]?.[v.label]}</TableCell>
              )}
              {v.type === "order_label" && (
                <TableCell>
                  <OrderDataBtn
                    handleBtn={() => dispatch(setOrderBy)}
                    selected={orderBy.name}
                    value={v.value}
                    title={language[selectedLang]?.[v.label]}
                  />
                </TableCell>
              )}
            </Fragment>
          );
        })}
      </>
    );
  };

  const footerContent = () => {
    if (isMobile) {
      return <></>;
    }
    console.log(isLaptop)
    return (
      <>
        {!isLaptop && (
          <TableCell sx={{ color: "#fff" }}>
            <Stack direction="column" alignItems="center">
              <Typography fontSize={13}> {language[selectedLang]?.common_count}</Typography>
              <Typography fontSize={13}>{records?.data.length ?? 0}</Typography>
            </Stack>
          </TableCell>
        )}
        <TableCell sx={{ color: "#fff" }}></TableCell>
        <TableCell sx={{ color: "#fff" }}>
          <Stack direction="column" alignItems="center">
              <Typography fontSize={13}> {language[selectedLang]?.countOfImages}</Typography>
              <Typography fontSize={13}> Images</Typography>
              <Typography fontSize={13}>{countOfImages ? countOfImages : 0}</Typography>
          </Stack>
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          <Stack direction="column" alignItems="center">
              {/* <Typography fontSize={13}> {language[selectedLang]?.countOfComponentType}</Typography> */}
              <Typography fontSize={13}>Component Types</Typography>
              <Typography fontSize={13}>{countOfComponentType ? countOfComponentType : 0}</Typography>
          </Stack>
        </TableCell>
        <TableCell sx={{ color: "#fff" }}>
          <Stack direction="column" alignItems="center">
              {/* <Typography fontSize={13}> {language[selectedLang]?.countOfComponentType}</Typography> */}
              <Typography fontSize={13}>largestId</Typography>
              <Typography fontSize={13}>{largestId ? largestId : ''}</Typography>
          </Stack>
        </TableCell>
        {(!isLaptop && user?.role !== 'stock_manager') && <TableCell sx={{ color: "#fff" }}></TableCell>}
        {user?.role === 'stock_manager' && <TableCell sx={{ color: "#fff" }}></TableCell>}
        {
          !isDesktop && (
            <>
              <TableCell sx={{ color: "#fff" }}></TableCell>
              <TableCell sx={{ color: "#fff" }}>
                <Stack direction="column" alignItems="center">
                </Stack>
              </TableCell>
            </>
          )
        }
        {(isLaptop && user?.role !== 'stock_manager') && <TableCell sx={{ color: "#fff" }}></TableCell>}
        <TableCell sx={{ color: "#fff" }}>
          <Stack direction="column" alignItems="center">
            <Typography fontSize={13}>{language[selectedLang]?.common_active}</Typography>
            <Typography fontSize={13}>{AllActive ?? 0}</Typography>
          </Stack>
        </TableCell>
        {
          !isLaptop && (
            <TableCell sx={{ color: "#fff" }}>
              <Stack direction="column" alignItems="center">
                <Typography fontSize={13}>{language[selectedLang]?.common_quantity}</Typography>
                <Typography fontSize={13}>{Quantities ?? 0}</Typography>
              </Stack>
            </TableCell>)
        }
        {(isLaptop && !isDesktop) && <TableCell sx={{ color: "#fff" }}></TableCell>}
        {!isLaptop && <TableCell sx={{ color: "#fff" }}></TableCell>}
        {user?.role === 'stock_manager' && <TableCell sx={{ color: "#fff" }}></TableCell>}
      </>
    );
  };

  return (
    <ComponentLayout>
      <Box>
        {useFilters()}
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          pt={2}
        >
          <Grid container>
            <Grid item md={6} sm={6} xs={12}>
              <Typography component="h6" variant="h6">
                {language[selectedLang]?.component}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              {user?.role === "stock_manager" && (
                <Stack
                  mb={1}
                  justifyContent="flex-end"
                  spacing={1}
                  direction="row"
                >
                  <Button
                    onClick={() => setOpenWebCam(true)}
                    variant="contained"
                  >
                    {language[selectedLang]?.webcam}
                  </Button>
                  <Button
                    onClick={() => setCreateCompModal(true)}
                    variant="contained"
                  >
                    {language[selectedLang]?.common_add}
                  </Button>
                  <Button
                    variant="contained"
                  >
                    <CSVLink
                      data={csvData}
                      style={{textDecoration: 'none', color: 'black'}}
                      filename={"csv.csv"}
                    >
                      EXPORT
                    </CSVLink>
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>
        </Stack>
        <Box>
          {records?.last_page > 1 && (
            <Box component="div" mb={3} mt={2}>
              <UsePagination
                total={records?.total}
                perPage={records?.per_page}
                page={records?.current_page}
                key={records?.last_page}
              />
            </Box>
          )}
          <TableWrapper
            thContent={printTh()}
            FooterContent={footerContent()}
            spanTd="11"
            isLoading={isLoading}
            isContent={records?.data.length}
          >
            {records?.data.map((v, i) => {
              return (
                <TableRow key={i}>
                  {!isLaptop && columns[0]?.show && (
                    <TableCell sx={{ textAlign: "center" }}>#{v.id}</TableCell>
                  )}
                  {columns[1]?.show && (
                    <TableCell
                      sx={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/admin/components/${v.id}`, {
                          id: v.id,
                        })
                      }
                    >
                      <MyImage id={v?.id} />
                    </TableCell>
                  )}
                  {!isMobile && columns[2]?.show && (
                    <TableCell>{v.componenttypes.title}</TableCell>
                  )}
                  {columns[3]?.show && (
                    <TableCell>
                      <Box>
                        {v.active ? (
                          v.name || "-"
                        ) : (
                          <InfoHeading
                            color="error"
                            iconColor="error"
                            infoText="The component has been archived and should not be used."
                            text={v.name}
                          />
                        )}
                      </Box>
                    </TableCell>
                  )}
                  {!isDesktop && columns[4]?.show && (
                    <TableCell>{v.item_number ?? "-"}</TableCell>
                  )}
                  {/* {!isDesktop && columns[5]?.show && <TableCell>-</TableCell>} */}
                  {!isDesktop && columns[6]?.show && (
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {v?.photovoltaic && (
                          <Tooltip title="Photovoltaic" placement="top">
                            <div className="cube">
                              <img src={icon1} alt="" />
                            </div>
                          </Tooltip>
                        )}
                        {v?.battery_storage && (
                          <Tooltip title="Battery Storage" placement="top">
                            <div className="cube">
                              <img src={icon2} alt="" />
                            </div>
                          </Tooltip>
                        )}
                        {v?.energy_management && (
                          <Tooltip title="Energy Management" placement="top">
                            <div className="cube">
                              <img src={icon3} alt="" />
                            </div>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  )}
                  {/* {!isDesktop && columns[7]?.show && <TableCell>-</TableCell>} */}
                  {!isMobile && columns[8]?.show && (
                    <TableCell>
                      {v.active ? (
                        <Chip
                          label={language[selectedLang]?.common_active}
                          color="primary"
                        />
                      ) : (
                        <Chip label={language[selectedLang]?.common_disabled} />
                      )}
                    </TableCell>
                  )}
                  {!isMobile && columns[9]?.show && <TableCell>-</TableCell>}
                  {!isLaptop && columns[10]?.show && (
                    <TableCell>
                      {v?.quantity <= v?.min_quantity ? (
                        <Chip label={v?.quantity} color="error" />
                      ) : (
                        v?.quantity ?? "-"
                      )}
                    </TableCell>
                  )}
                  {!isLaptop && columns[11]?.show && (
                    <TableCell>{v?.min_quantity ?? "-"}</TableCell>
                  )}

                  {columns[12]?.show && user?.role === "stock_manager" && (
                    <TableCell style={{ verticalAlign: "top" }}>
                      <Tooltip title="Edit" placement="top">
                        <IconButton
                          onClick={() =>
                            navigate(`/admin/components/${v.id}`, {
                              id: v.id,
                            })
                          }
                          color="primary"
                        >
                          <CreateIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="QR Code" placement="top">
                        <IconButton
                          onClick={() => {
                            setQRData([
                              v?.id,
                              localStorage.getItem("@ACCESS_TOKEN"),
                            ]);
                            setOpenM3(true);
                          }}
                          color="primary"
                        >
                          <QrCode2Icon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Decrease Quantity" placement="top">
                        <IconButton
                          onClick={() => {
                            setOpenM2(true);
                            setID(v?.id);
                            findReducedQuantity(v?.id);
                          }}
                          color="error"
                        >
                          <TextDecreaseIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableWrapper>
          {records?.last_page > 1 && (
            <Box component="div" sx={{ mt: 4 }}>
              <UsePagination
                total={records?.total}
                perPage={records?.per_page}
                page={records?.current_page}
                key={records?.last_page}
              />
            </Box>
          )}
        </Box>
      </Box>
      {createCompModal && user?.role === "stock_manager" ? (
        <CustomModal
          width="850px"
          children={<ComponentForm handleClose={closeModal} />}
          handleClose={closeModal}
        />
      ) : null}
      {openM2 ? (
        <CustomModal
          handleClose={() => setOpenM2(false)}
          children={
            <Box py={3}>
              <Typography mb={2} variant="h6" sx={{ textAlign: "center" }}>
                {language[selectedLang]?.delete_message_message}
              </Typography>
              {addText && (
                <>
                  <InputField
                    size="small"
                    label="Serial Number"
                    handleChange={(e) => setSerial(e.target.value)}
                    initValue={serial}
                    fullWidth
                    styles={{ mb: 3 }}
                  />
                  <InputField
                    type="number"
                    size="small"
                    label="Quantity"
                    required
                    handleChange={(e) => setQuantity(e.target.value)}
                    initValue={quantity}
                    fullWidth
                    styles={{ mb: 3 }}
                  />
                </>
              )}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenM2(false);
                    setAddText(false);
                  }}
                >
                  {language[selectedLang]?.common_no}
                </Button>
                {addText ? (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleQuantity()}
                    disabled={dltLoading}
                  >
                    {dltLoading && (
                      <CircularProgress size={16} color="primary" />
                    )}
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => setAddText(true)}
                    disabled={dltLoading}
                  >
                    {language[selectedLang]?.common_yes}
                  </Button>
                )}
              </Stack>
            </Box>
          }
        />
      ) : null}
      {openM3 ? (
        <CustomModal
          handleClose={() => {
            setOpenM3(false);
          }}
          children={
            <Box py={3}>
              <Typography mb={1} variant="h6" sx={{ textAlign: "center" }}>
                QR Code
              </Typography>

              <Box maxWidth="450px">
                <QRCodeCanvas
                  onClick={downloadQRCode}
                  size={512}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  value={QRData}
                  id="qr-gen"
                  level={"H"}
                  fgColor="#010000"
                  includeMargin={true}
                  imageSettings={{
                    src: Logo,
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 110,
                    excavate: true,
                  }}
                />
                {/* </button> */}
                <p
                  style={{
                    color: "#B0B0B0",
                    textAlign: "center",
                    marginTop: "1  0px",
                  }}
                >
                  {/* {qrCodeUrl} */}
                </p>
              </Box>
            </Box>
          }
        />
      ) : null}
      {openWebCam ? (
        <CustomModal
          handleClose={() => {
            setOpenWebCam(false);
          }}
          children={
            <Box py={3}>
              {openWebCam && (
                <QRCodeWebcam
                  handleClose={() => setOpenWebCam(false)}
                  getData={getData}
                />
              )}
            </Box>
          }
        />
      ) : null}
    </ComponentLayout>
  );
}

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

const rowsOption = [
  { label: "25 Rows", value: "25" },
  { label: "50 Rows", value: "50" },
  { label: "75 Rows", value: "75" },
  { label: "100 Rows", value: "100" },
];

const langOptions = [
  { label: "Deutsch (CH)", value: "dutch" },
  { label: "English", value: "english" },
];

const componentTypeList = [
  {
    id: 0,
    label: "Optimizer",
    value: "Optimizer"
  },
  {
    id: 1,
    label: "Montagebus",
    value: "Montagebus"
  },
  {
    id: 2,
    label: "Dachsicherung",
    value: "Dachsicherung"
  },
  {
    id: 3,
    label: "Werkzeug",
    value: "Werkzeug"
  },
  {
    id: 4,
    label: "Unterhaltsarbeiten",
    value: "Unterhaltsarbeiten"
  },
  {
    id: 5,
    label: "Elektrikerzubehör",
    value: "Elektrikerzubehör"
  },
  {
    id: 6,
    label: "Andere Komponente",
    value: "Andere Komponente"
  },
  {
    id: 7,
    label: "Wechselrichter",
    value: "Wechselrichter"
  },
  {
    id: 8,
    label: "Photovoltaik Modul",
    value: "Photovoltaik Modul"
  },
  {
    id: 9,
    label: "Batteriespeicher",
    value: "Batteriespeicher"
  }
]
const _columns = [
  {
    id: 0,
    label: "org_component_id",
    value: "id",
    show: true,
    type: "order_label",
  },
  {
    id: 1,
    label: "org_component_image",
    value: "component_image",
    show: true,
    type: "order_label",
  },
  {
    id: 2,
    label: "component_type",
    value: "component_type",
    show: true,
    type: "order_label",
  },
  {
    id: 3,
    label: "common_name",
    value: "name",
    show: true,
    type: "order_label",
  },
  {
    id: 4,
    label: "item_number",
    value: "item_number",
    show: true,
    type: "order_label",
  },
  {
    id: 5,
    label: "unit",
    value: "fourth_col",
    show: false,
    type: "simple_label",
  },
  {
    id: 6,
    label: "technologies",
    value: "fifth_col",
    show: true,
    type: "simple_label",
  },
  {
    id: 7,
    label: "language",
    value: "sixth_col",
    show: false,
    type: "simple_label",
  },
  {
    id: 8,
    label: "status",
    value: "seventh_col",
    show: true,
    type: "simple_label",
  },
  {
    id: 9,
    label: "tags",
    value: "eight_col",
    show: false,
    type: "simple_label",
  },
  {
    id: 10,
    label: "quantity",
    value: "quantity",
    show: true,
    type: "order_label",
  },
  {
    id: 11,
    label: "org_min_quantity",
    value: "min_quantity",
    show: true,
    type: "order_label",
  },
  {
    id: 12,
    label: "common_action",
    value: "eleventh_col",
    show: true,
    type: "simple_label",
  },
  {
    id: 13,
    label: "Min_order_quantity",
    value: "min_order_quantity",
    show: true,
    type: "simple_label",
  }
];