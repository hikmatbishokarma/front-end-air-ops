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
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useSession } from "../../../SessionContext";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../../SnackbarContext";

type currentQuotationInfo = {
  id: string;
  quotationNo: string;
  status?: string;
  client: any;
  isLatest: boolean;
};

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

  const [currentQuotationInfo, setCurrentQuotationInfo] =
    useState<currentQuotationInfo>();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headerStyle = {
    backgroundColor: "#f5f5f5",
    fontWeight: 700,
    borderBottom: "2px solid #ccc",
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Quotation No</TableCell>
              <TableCell sx={headerStyle}>Aircraft</TableCell>
              <TableCell sx={headerStyle}>Enquiry From</TableCell>
              <TableCell sx={headerStyle}>Sectors</TableCell>
              <TableCell sx={headerStyle}>Created On</TableCell>
              {/* <TableCell sx={headerStyle}>Action</TableCell> */}
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
              >
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.aircraft?.code}
                </TableCell>

                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
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

export default SalesConfirmationList;
