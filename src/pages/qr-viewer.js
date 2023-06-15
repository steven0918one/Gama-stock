import { Box, Stack } from "@mui/material";
import { Logo } from "../assets";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect } from "react";

function QrViewer() {
  var querystring = window.location.href;
  var querystrings = querystring.split("?", 2);
  console.log("🚀 ~ file: qr-viewer.js:9 ~ QrViewer ~ querystrings", querystrings)
  var qrCodeUrl = querystrings[1];

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

  useEffect(() => {
    document.title = "GAMA - QR-CODE - " + qrCodeUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      <div style={{ margin: "12px 24px" }}>
        <img src={Logo} alt="logo" width="150px" />
        <div>
          <h1
            onClick={downloadQRCode}
            className="qr-download"
            style={{ maxWidth: 600 }}
          >
            Download QR-Code
          </h1>
        </div>
        {/* <a href={URL.createObjectURL(<QRCodeSVG value={qrCodeUrl} />)}>ddd</a> */}
      </div>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Box maxWidth="450px">
          <QRCodeCanvas
            onClick={downloadQRCode}
            size={512}
            style={{ height: "auto", maxWidth: "100%", width: "100%", cursor: 'pointer' }}
            value={qrCodeUrl}
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
            {qrCodeUrl}
          </p>
        </Box>
      </Box>
    </Stack>
  );
}

export default QrViewer;
