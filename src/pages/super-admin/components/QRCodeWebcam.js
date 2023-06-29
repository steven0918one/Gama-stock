import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import QrReader from "react-qr-reader";
import { useDispatch } from "react-redux";
import { InputField } from "../../../components";
import { openPopUp } from "../../../store/reducer";
import API from "../../../axios";


function QRCodeWebcam({ handleClose, getData }) {
  const dispatch = new useDispatch();
  const [IsLoading, setIsLoading] = useState(false);
  const [IsLoading1, setIsLoading1] = useState(false);
  const [serial, setSerial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState();
  const [webcamResult, setWebcamResult] = useState(null);

  const webcamError = (error) => {
    console.log("error: ", error.DOMException);
    if (error) {
      setWebcamResult(error);
    }
  };
  const webcamScan = (result) => {
    if (result) {
      setIsLoading1(true);
      setResult(result);
    }
  };
  console.log("webcamResult: ", webcamResult);
  const handleSubmit = () => {
    if (!quantity) return;
    setIsLoading(true);
    var array = result.split(",");
    const api = process.env.REACT_APP_API_KEY;
    const HEADER = { headers: { Authorization: `Bearer ${array[1]}` } };
    const form = new FormData();
    form.append("serial", serial);
    form.append("quantity", quantity);
    axios
      .post(
        api + `manager/add-component-quantity-logs/${array[0]}`,
        form,
        HEADER
      )
      .then((response) => {
        handleClose();
        setIsLoading(false);
        getData();
        dispatch(
          openPopUp({
            message: "Quantity Decrease Successfully!",
            type: "success",
          })
        );
      })
      .catch((error) => {
        handleClose();
        setIsLoading(false);
        if(error.response.status === 401) {
          console.log('error.response.status :>> ', error.response.status);
          dispatch(
            openPopUp({
              message: "It's not authorized!",
              type: "error",
            })
          );
        } else {
          dispatch(
            openPopUp({
              message: error?.response?.data?.message,
              type: "error",
            })
          );
        }
      });
  };
  return (
    <Box className="card col-sm-4">
      <Box className="card-body text-center">
        {IsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress
              size={30}
              color="primary"
              sx={{ textAlign: "center" }}
            />
          </Box>
        ) : IsLoading1 ? (
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
              size="small"
              label="Quantity"
              handleChange={(e) => setQuantity(e.target.value)}
              initValue={quantity}
              fullWidth
              styles={{ mb: 3 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="info"
                onClick={() => handleSubmit()}
                disabled={IsLoading}
              >
                {IsLoading && <CircularProgress size={16} color="primary" />}
                Submit
              </Button>
            </Box>
          </>
        ) : (
          <QrReader
            delay={300}
            onError={webcamError}
            onScan={webcamScan(
              "243,MmI5NDIyNTEyYTA2NjBiMDk4ZTcyMzMwMWVlZDc1OGE=")}
            legacyMode={false}
            facingMode={"environment"}
          />
        )}
      </Box>
      <Box className="card-footer rounded mb-1">
        {webcamResult && <h6>{webcamResult.toString()}</h6>}
      </Box>
    </Box>
  );
}

export default QRCodeWebcam;
