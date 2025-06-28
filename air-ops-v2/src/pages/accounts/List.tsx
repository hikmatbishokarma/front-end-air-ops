import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  IconButton,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import useGql from "../../lib/graphql/gql";

import { useNavigate } from "react-router";

import { useSnackbar } from "../../SnackbarContext";

import SearchIcon from "@mui/icons-material/Search";

import { useSession } from "../../SessionContext";

import moment from "moment";
import InvoicePreview from "../../components/invoice-preview";
import { GET_INVOICES } from "../../lib/graphql/queries/invoice";
import CloseIcon from "@mui/icons-material/Close";
import { TRIP_CONFIRMATION } from "../../lib/graphql/queries/quote";

export const AccountList = ({ filter }) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [rows, setRows] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [totalCount, setTotalCount] = useState(0); // total count from backend

  const getInvoices = async () => {
    try {
      const data = await useGql({
        query: GET_INVOICES,
        queryName: "invoices",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...filter,
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          "paging": {
            "offset": page * rowsPerPage,
            "limit": rowsPerPage,
          },
          "sorting": [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      const result = data?.data?.map((invoice: any) => {
        return {
          ...invoice,
          id: invoice.id,
          quotationNo: invoice?.quotationNo,
          requester: invoice?.quotation?.requestedBy?.name,
          createdAt: moment(invoice.createdAt).format("DD-MM-YYYY HH:mm"),
          updatedAt: moment(invoice.updatedAt).format("DD-MM-YYYY HH:mm"),
        };
      });

      setTotalCount(data?.totalCount || 0);
      setRows(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getInvoices();
  }, [filter, page, rowsPerPage]);

  const handelPreview = (row) => {
    setSelectedRowData(row);
    setShowPreview(true);
  };

  const filteredRows = rows?.filter((row) =>
    row.quotationNo?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

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
      <TableContainer component={Paper} className="dash-table search">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <TextField
            variant="outlined"
            size="small"
            label="Search Quotation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Quotation No</TableCell>
              <TableCell sx={headerStyle}>Proforma Invoice No</TableCell>
              <TableCell sx={headerStyle}>Tax Invoice No</TableCell>
              <TableCell sx={headerStyle}>Requester</TableCell>
              <TableCell sx={headerStyle}>Created On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handelPreview(row)}
              >
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>

                <TableCell align="right">{row.proformaInvoiceNo}</TableCell>
                <TableCell align="right">
                  {row.taxInvoiceNo ? row.taxInvoiceNo : "NA"}
                </TableCell>
                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
                {/* <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handelPreview(row)}
                  >
                    <PreviewIcon fontSize="small" />
                  </IconButton>
                </TableCell> */}
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

      {/* <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {" "}
          Invoice Preview
          <IconButton
            aria-label="close"
            onClick={() => setShowPreview(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <InvoicePreview
            htmlContent={selectedRowData?.template}
            currentQuotation={selectedRowData?.quotationNo}
            type={selectedRowData?.type}
            handelTripConfirmation={handelTripConfirmation}
          />
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default AccountList;
