import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TablePagination,
  Typography,
  Autocomplete,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useSession } from "../../../SessionContext";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../../SnackbarContext";
import SaleConfirmationPreview from "../../../components/SaleConfirmationPreview";
import { CustomDialog } from "../../../components/CustomeDialog";
import {
  calculateFlightTime,
  FlightCategoryEnum,
  QuotationStatus,
  SalesCategoryLabels,
} from "../../../lib/utils";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useGql from "../../../lib/graphql/gql";
import { CREATE_TRIP_DETAILS } from "../../../lib/graphql/queries/trip-detail";
import moment from "moment";

export const TripDetailList = ({
  tripDetailList,
  totalCount,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
  selectedTab,
}) => {
  const { session, setSession, loading } = useSession();

  console.log("tripDetailList::", tripDetailList);

  const operatorId = session?.user.operator?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row); // store the row for later use
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const onUpdateCreateTrip = async (row) => {
    console.log("trrrrrr::", row, row.id);
    navigate(`/trip-detail/${row.id}`, { state: row });
  };

  const headerStyle = {
    backgroundColor: "#f5f5f5",
    fontWeight: 700,
    borderBottom: "2px solid #ccc",
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table crew-table-v1">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Operator</TableCell>
              <TableCell sx={headerStyle}>Quotation No</TableCell>
              <TableCell sx={headerStyle}>TripId</TableCell>
              <TableCell sx={headerStyle}>Aircraft</TableCell>
              <TableCell sx={headerStyle}>Sectors</TableCell>
              <TableCell sx={headerStyle}>Created On</TableCell>
              <TableCell sx={headerStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tripDetailList?.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: !row.isLatest ? "#f9f9f9" : "inherit",
                  opacity: !row.isLatest ? 0.6 : 1,
                  cursor: "pointer",
                }}
              >
                <TableCell component="th" scope="row">
                  {row.operator?.companyName ?? "AirOps"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>

                <TableCell component="th" scope="row">
                  {row?.tripId}
                </TableCell>

                <TableCell component="th" scope="row">
                  {`${row?.quotation?.aircraft?.name} (${row?.quotation?.aircraft?.code})`}
                </TableCell>

                <TableCell align="right">
                  {row.sectors.map(
                    (sector) => `${sector.source}-${sector.destination}`
                  )}
                </TableCell>
                <TableCell align="right">
                  {moment(row.createdAt).format("DD-MM-YYYY HH:mm")}
                </TableCell>

                <TableCell
                  align="right"
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, row)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        onUpdateCreateTrip(selectedRow);
                      }}
                    >
                      Edit Trip
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </>
  );
};

export default TripDetailList;
