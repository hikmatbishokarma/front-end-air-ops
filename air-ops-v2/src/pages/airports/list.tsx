import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import useGql from "../../lib/graphql/gql";

import { useSnackbar } from "../../SnackbarContext";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { AirportCreate } from "./create";
import { AirportEdit } from "./edit";
import {
  DELETE_AIRPORT,
  GET_AIRPORTS,
} from "../../lib/graphql/queries/airports";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";

export const AirpotList = () => {
  const showSnackbar = useSnackbar();

  const [airport, setAirport] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const getAirports = async () => {
    try {
      const data = await useGql({
        query: GET_AIRPORTS,
        queryName: "airports",
        queryType: "query-with-count",
        variables: {
          filter: searchTerm
            ? {
                or: [
                  { city: { iLike: searchTerm } },
                  { country: { iLike: searchTerm } },
                  { iata_code: { iLike: searchTerm } },
                  { icao_code: { iLike: searchTerm } },
                  { name: { iLike: searchTerm } },
                ],
              }
            : {},
          paging: {
            offset: page * pageSize,
            limit: pageSize,
          },
          sorting: [{ field: "createdAt", direction: "DESC" }],
        },
      });

      if (!data) showSnackbar("Failed to fetch categories!", "error");
      setAirport(data);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch categories!", "error");
    }
  };

  useEffect(() => {
    getAirports();
  }, [searchTerm, page, pageSize]);

  const handleEdit = (id) => {
    setIsEdit(true);
    setOpen(true);
    setCurrentRecordId(id);
  };

  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false); // Close the confirmation dialog
    if (recordToDeleteId) {
      try {
        const { data, errors } = await useGql({
          query: DELETE_AIRPORT,
          queryName: "",
          queryType: "mutation",
          variables: {
            input: {
              "id": recordToDeleteId,
            },
          },
        });
        if (!data) {
          showSnackbar("Failed to delete airport!", "error");
        } else {
          showSnackbar("Airport deleted successfully!", "success"); // Add a success message
          getAirports(); // Refresh the list
        }
      } catch (error) {
        showSnackbar(error.message || "Failed to delete airport!", "error");
      } finally {
        setRecordToDeleteId(null); // Clear the ID after deletion attempt
      }
    }
  };

  const confirmDelete = (id: string) => {
    setRecordToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleClose = () => setOpen(false);

  // Function to refresh category list
  const refreshList = async () => {
    // Fetch updated categories from API
    await getAirports();
  };

  return (
    <>
      <Box
        className="search_quo1"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", // Optional: helps in responsiveness
          gap: 2, // Optional: adds spacing between elements on small screens
          mb: 2, // Optional: margin bottom
        }}
      >
        {/* Search box on the left */}
        <Box sx={{ flex: "1 1 auto", maxWidth: 300 }}>
          <TextField
            variant="outlined"
            size="small"
            label="Search Airports"
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

        {/* Add Airports button on the right */}
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Airports
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>IATA Code</TableCell>
              <TableCell>ICAO Code</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {airport?.data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.iata_code}</TableCell>
                <TableCell>{item?.icao_code}</TableCell>
                <TableCell>{item?.city}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(item.id)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="secondary"
                    onClick={() => confirmDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={airport.totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => setPageSize(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Airport Details" : "Edit Airport Details"}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
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
          {isEdit ? (
            <AirportEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <AirportCreate onClose={handleClose} refreshList={refreshList} />
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions> */}
      </Dialog>

      <ConfirmationDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
      />
    </>
  );
};
