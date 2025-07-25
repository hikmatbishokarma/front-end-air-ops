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
import { GET_AIRPORTS } from "../../lib/graphql/queries/airports";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export const AirpotList = () => {
  const showSnackbar = useSnackbar();

  const [airport, setAirport] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

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
          paging: { limit: 20 },
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
  }, [searchTerm]);

  const handleEdit = (id) => {
    setIsEdit(true);
    setOpen(true);
    setCurrentRecordId(id);
  };

  const handleDelete = (id) => {
    //TODO
  };

  const handleClose = () => setOpen(false);

  // Function to refresh category list
  const refreshList = async () => {
    // Fetch updated categories from API
    await getAirports();
  };

  return (
    <>
      {/* <Box sx={{ flex: "1 1 auto", maxWidth: 300 }}>
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ marginBottom: 2 }}
        >
          Add Airports
        </Button>
      </Box> */}

      <Box className="search_quo1"
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
                    onClick={() => handleDelete(item.id)}
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
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>

      <Dialog className="panel-one"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Airport Details" : "Edit Airport Details"}
          <IconButton className="popup-quote-model"
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon className="popup-close-panel"/>
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
    </>
  );
};
