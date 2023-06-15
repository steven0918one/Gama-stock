import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  TableFooter,
} from "@mui/material";
import { useSelector } from "react-redux";

function TableWrapper({
  tableStyle,
  containerStyle,
  spanTd,
  message,
  isLoading,
  isContent,
  children,
  thContent,
  FooterContent,
  ...props
}) {
  const { language, selectedLang } = useSelector((state) => state.storeReducer);
  return (
    <TableContainer sx={containerStyle}>
      <Table
        sx={[
          tableStyle,
          {
            "& .MuiTableCell-root": {
              paddingTop: "10px",
              paddingBottom: "10px",
            },
          },
        ]}
      >
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#333",
              "& th": {
                paddingTop: "15px !important",
                paddingBottom: "15px !important",
              },
            }}
          >
            {thContent}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={spanTd} align="center">
                <CircularProgress size={22} />
              </TableCell>
            </TableRow>
          ) : isContent ? (
            children
          ) : (
            <TableRow>
              <TableCell colSpan={spanTd} align="center">
                <Typography variant="caption1">
                  {!!message
                    ? message
                    : language[selectedLang]?.common_no_record}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {FooterContent && (
          <TableFooter>
            <TableRow
              sx={{
                backgroundColor: "#333",
                "& td": {
                  paddingTop: "15px !important",
                  paddingBottom: "15px !important",
                },
              }}
            >
              {FooterContent}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
}
TableWrapper.defaultProps = {
  tableStyle: {},
  spanTd: "1",
  message: null,
  isContent: false,
  isLoading: false,
};
export default TableWrapper;
