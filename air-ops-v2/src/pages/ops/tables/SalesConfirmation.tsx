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
import {
  CREATE_TRIP,
  CREATE_TRIP_DETAILS,
} from "../../../lib/graphql/queries/trip-detail";
import moment from "moment";

export const SalesConfirmationList = ({
  quoteList,
  totalCount,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
  selectedTab,
}) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [showTripConfirmationPreview, setShowTripConfirmationPreview] =
    useState(false);

  const [saleConfirmationPreviewTemplate, setSaleConfirmationPreviewTemplate] =
    useState(null);

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

  const handelPreview = async (row) => {
    setSelectedRowData(row);

    console.log("row.status:::", row.status);

    if (row.status == QuotationStatus.SALE_CONFIRMED) {
      setSaleConfirmationPreviewTemplate(row.confirmationTemplate);
      setShowTripConfirmationPreview(true);
    }
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

  // const onHandelCreateTrip = async (row) => {
  //   const data = await useGql({
  //     query: CREATE_TRIP_DETAILS,
  //     queryName: "createOneTripDetail",
  //     queryType: "mutation",
  //     variables: {
  //       input: {
  //         tripDetail: {
  //           operatorId,
  //           quotation: row.id,
  //           quotationNo: row.quotationNo,
  //           sectors: row.sectors.map((sector) => ({
  //             source: sector.source,
  //             destination: sector.destination,
  //             depatureDate: sector.depatureDate,
  //             depatureTime: sector.depatureTime,
  //             arrivalTime: sector.arrivalTime,
  //             arrivalDate: sector.arrivalDate,
  //             pax: sector.paxNumber || 0,
  //             flightTime: calculateFlightTime(
  //               sector.depatureDate,
  //               sector.depatureTime,
  //               sector.arrivalDate,
  //               sector.arrivalTime
  //             ),
  //           })),
  //         },
  //       },
  //     },
  //   });

  //   if (data?.errors) {
  //     throw new Error(data.errors[0]?.message || "Something went wrong.");
  //   } else {
  //     navigate(`/trip-detail/${data.id}`, { state: row });
  //   }

  //   // navigate(`/trip-detail/${row.id}`, { state: row });
  // };

  const onHandelCreateTrip = async (row) => {
    const data = await useGql({
      query: CREATE_TRIP,
      queryName: "createTrip",
      queryType: "mutation",
      variables: {
        input: {
          tripDetail: {
            operatorId,
            quotation: row.id,
            quotationNo: row.quotationNo,
            sectors: row.sectors.map((sector) => ({
              source: sector.source,
              destination: sector.destination,
              depatureDate: sector.depatureDate,
              depatureTime: sector.depatureTime,
              arrivalTime: sector.arrivalTime,
              arrivalDate: sector.arrivalDate,
              pax: sector.paxNumber || 0,
              flightTime: calculateFlightTime(
                sector.depatureDate,
                sector.depatureTime,
                sector.arrivalDate,
                sector.arrivalTime
              ),
            })),
          },
        },
      },
    });

    if (data?.errors) {
      throw new Error(data.errors[0]?.message || "Something went wrong.");
    } else {
      navigate(`/trip-detail/${data.id}`, { state: row });
    }

    // navigate(`/trip-detail/${row.id}`, { state: row });
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
              <TableCell sx={headerStyle}>Category</TableCell>
              <TableCell sx={headerStyle}>Aircraft</TableCell>
              <TableCell sx={headerStyle}>Enquiry From</TableCell>
              <TableCell sx={headerStyle}>Sectors</TableCell>
              <TableCell sx={headerStyle}>Created On</TableCell>
              <TableCell sx={headerStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quoteList?.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: !row.isLatest ? "#f9f9f9" : "inherit",
                  opacity: !row.isLatest ? 0.6 : 1,
                  cursor: "pointer",
                }}
                onClick={() => handelPreview(row)}
              >
                <TableCell component="th" scope="row">
                  {row.operator?.companyName ?? "AirOps"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>
                <TableCell component="th" scope="row">
                  {FlightCategoryEnum[row.category]}
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${row?.aircraft?.name} (${row?.aircraft?.code})`}
                </TableCell>

                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>

                {/* <TableCell
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
                        handelPreview(selectedRow);
                      }}
                    >
                      Preview Invoice
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        onHandelCreateTrip(selectedRow);
                      }}
                    >
                      Generate Trip
                    </MenuItem>
                  </Menu>
                </TableCell> */}

                <TableCell onClick={(e) => e.stopPropagation()}>
                  {/* If the quote is a charter AND it's a new quote */}
                  {row.status === QuotationStatus.SALE_CONFIRMED && (
                    <Button className="generate_pi12"
                      variant="outlined"
                      onClick={() => onHandelCreateTrip(row)}
                    >
                      Generate Trip
                    </Button>
                  )}

                  {row.status === QuotationStatus.TRIP_GENERATED && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {QuotationStatus.TRIP_GENERATED}
                    </span>
                  )}
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

      <CustomDialog
        open={showTripConfirmationPreview}
        onClose={() => setShowTripConfirmationPreview(false)}
        title="Sale Confirmation Preview"
        width="900px"
        maxWidth="md"
      >
        <SaleConfirmationPreview
          htmlContent={saleConfirmationPreviewTemplate}
          currentQuotation={selectedRowData?.quotationNo}
          showGenerateTI={false}
        />
      </CustomDialog>
    </>
  );
};

export default SalesConfirmationList;
