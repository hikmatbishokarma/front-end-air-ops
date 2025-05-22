import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TablePagination,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import useGql from "../../lib/graphql/gql";
import {
  GET_QUOTES,
  SHOW_PREVIEW,
  UPDATE_QUOTE_STATUS,
} from "../../lib/graphql/queries/quote";

import { Outlet, useNavigate } from "react-router";

import { useSnackbar } from "../../SnackbarContext";

import PreviewIcon from "@mui/icons-material/Preview";
import QuotePreview from "../../components/quote-preview";

import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";

import QuotationCancellationConfirmation from "./quotation-cancellation";
import SearchIcon from "@mui/icons-material/Search";
import { useQuoteData } from "../../hooks/useQuoteData";
import { useSession } from "../../SessionContext";

export const QuoteList = ({ filter }) => {
  const { session, setSession, loading } = useSession();

  const agentId = session?.user.agent?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [rows, setRows] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [currentId, setCurrentId] = useState();
  const [currentQuotation, setCurrentQuotation] = useState();

  const [selectedRequester, setSelectedRequester] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [totalCount, setTotalCount] = useState(0); // total count from backend

  const getQuotes = async () => {
    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...filter,
            ...(selectedRequester && {
              requestedBy: { eq: selectedRequester },
            }),
            ...(agentId && { agentId: { eq: agentId } }),
          },
          "paging": {
            "offset": page * rowsPerPage,
            "limit": rowsPerPage,
          },
          "sorting": [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      const result = data?.data?.map((quote: any) => {
        return {
          id: quote.id,
          quotationNo: quote?.quotationNo,
          status: QuotationStatus[quote.status],
          requester: quote.requestedBy.name,
          requesterId: quote.requestedBy.id,
          version: quote.version,
          revision: quote.revision,
          itinerary: quote.itinerary
            ?.map((itinerary: any) => {
              return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
            })
            .join(", "),
          createdAt: quote.createdAt,
          updatedAt: quote.updatedAt,
          code: quote.code,
        };
      });
      console.log("result:::", result);
      setTotalCount(data?.totalCount || 0);
      setRows(result);
      // Extract unique requesters for dropdown
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, [filter, selectedRequester, page, rowsPerPage]);

  const handelPreview = async (quotationNo, quoteId) => {
    const result = await useGql({
      query: SHOW_PREVIEW,
      queryName: "showPreview",
      queryType: "query-without-edge",
      variables: { quotationNo },
    });

    if (!result) {
      showSnackbar("Internal server error!", "error");
    }
    setCurrentId(quoteId);
    setCurrentQuotation(quotationNo);
    setPreviewData(result);
    setShowPreview(true);
  };

  const refreshList = async () => {
    await getQuotes();
  };

  const updateQuoteStatus = async (id, toStatus) => {
    try {
      const data = await useGql({
        query: UPDATE_QUOTE_STATUS,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            id: id,
            status: getEnumKeyByValue(QuotationStatus, toStatus),
          },
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Update status!", "error");
      } else showSnackbar("Update status!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Update Status!", "error");
    } finally {
      refreshList();
    }
  };

  const handelCancellation = async (id) => {
    try {
      await updateQuoteStatus(id, QuotationStatus.CANCELLED);
    } catch (error) {
      console.error("Error transitioning state:", error);
    } finally {
    }
  };

  // const upgradQuote = async (code) => {
  //   try {
  //     const data = await useGql({
  //       query: UPGRAD_QUOTE,
  //       queryName: "",
  //       queryType: "mutation",
  //       variables: {
  //         code: code,
  //       },
  //     });

  //     if (data?.errors?.length > 0) {
  //       showSnackbar("Failed To Update status!", "error");
  //     } else showSnackbar("Update status!", "success");
  //   } catch (error) {
  //     showSnackbar(error?.message || "Failed To Update Status!", "error");
  //   }
  // };

  const filteredRows = rows?.filter((row) =>
    row.quotationNo?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const { clients } = useQuoteData();

  // const handleUpgradeClick = async (code) => {
  //   try {
  //     await upgradQuote(code);
  //   } catch (error) {
  //     console.error("Error upgrading quotation:", error);
  //   } finally {
  //     refreshList();
  //   }
  // };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page when rows per page changes
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table">
        <Box display="flex" justifyContent="flex-end" mb={2}>
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
              <TableCell>Quotation No</TableCell>
              <TableCell align="right">Status</TableCell>
              {/* <TableCell align="right">Requester</TableCell> */}
              <TableCell align="right">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <span>Requester</span>
                  <FormControl size="small" sx={{ mt: 1, minWidth: 120 }}>
                    <Select
                      displayEmpty
                      value={selectedRequester}
                      onChange={(e) => setSelectedRequester(e.target.value)}
                      sx={{ fontSize: "0.8rem" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {clients.map((r: any) => (
                        <MenuItem key={r.id} value={r.id}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </TableCell>

              <TableCell align="right">Itinenary</TableCell>
              {/* <TableCell align="right">Version</TableCell> */}
              {/* <TableCell align="right">Preview</TableCell> */}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                //onClick={() => handelPreview(row.id)}
              >
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>
                <TableCell align="right">{row.status}</TableCell>

                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handelPreview(row.quotationNo, row.id)}
                  >
                    <PreviewIcon fontSize="small" />
                  </IconButton>

                  {QuotationStatus.QUOTE == row.status && (
                    <>
                      <Tooltip title="Cancel">
                        <IconButton>
                          <QuotationCancellationConfirmation
                            onCancellation={() => handelCancellation(row.id)}
                            quotationNo={row.quotationNo}
                            quotationId={row.id}
                          />
                        </IconButton>
                      </Tooltip>

                      {/* <Tooltip title="Upgrade">
                        <IconButton size="small">
                          <QuotationWorkflowUpgradeConfirmation
                            onUpgrade={() => handleUpgradeClick(row.code)}
                            currentState={row.status}
                            code={row.code}
                          />
                        </IconButton>
                      </Tooltip> */}
                    </>
                  )}

                  {/* <IconButton
                    color="primary"
                    onClick={() => handelEmailNotification(row.id)}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton> */}
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

      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Quote Preview</DialogTitle>

        <DialogContent>
          <QuotePreview
            htmlContent={previewData}
            currentId={currentId}
            currentQuotation={currentQuotation}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuoteList;
