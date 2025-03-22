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
} from "@mui/material";
import useGql from "../../lib/graphql/gql";

import { useSnackbar } from "../../SnackbarContext";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { AirportCreate } from "./create";
import { AirportEdit } from "./edit";
import { GET_AIRPORTS } from "../../lib/graphql/queries/airports";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const AirpotList = () => {
  const showSnackbar = useSnackbar();

  const [airport, setAirport] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const getAirports = async () => {
    try {
      const data = await useGql({
        query: GET_AIRPORTS,
        queryName: "airports",
        queryType: "query",
        variables: { paging: { limit: 20 } },
      });

      if (!data) showSnackbar("Failed to fetch categories!", "error");
      setAirport(data);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch categories!", "error");
    }
  };

  useEffect(() => {
    getAirports();
  }, []);

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

  //   const paginationModel = { page: 0, pageSize: 10 };

  //   const columns: GridColDef[] = [

  //     { field: 'name', headerName: 'Name',  },
  //     { field: 'iata_code', headerName: 'IATA Code',},
  //     {
  //       field: 'icao_code',
  //       headerName: 'ICAO Code'
  //     },
  //     {
  //         field: 'city',
  //         headerName: 'City'
  //       },
  //       {
  //         field: "actions",
  //         headerName: "Actions",
  //         sortable: false,
  //         width: 150,
  //         renderCell: (params) => (
  //           <>
  //             <IconButton
  //               color="primary"
  //               onClick={() => handleEdit(params.row.id)}
  //             >
  //               <EditIcon />
  //             </IconButton>
  //             <IconButton
  //               color="error"
  //               onClick={() => handleDelete(params.row.id)}
  //             >
  //               <DeleteIcon />
  //             </IconButton>
  //           </>
  //         ),
  //       },

  //   ];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ marginBottom: 2 }}
        >
          Create Role
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
            {airport?.map((item, index) => (
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
      </TableContainer>
      {/* <DataGrid
        rows={airport}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10,50,100]}
        sx={{ border: 0 }}
      /> */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Aircraft Category" : "Edit Aircraft Category"}
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
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
