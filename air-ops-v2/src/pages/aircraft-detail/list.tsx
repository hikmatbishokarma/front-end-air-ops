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
import { GET_AIRCRAFT_CATEGORIES } from "../../lib/graphql/queries/aircraft-categories";
import { useSnackbar } from "../../SnackbarContext";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GET_AIRCRAFT } from "../../lib/graphql/queries/aircraft-detail";
import { AircraftDetailCreate } from "./create";
import { AircraftDetailEdit } from "./edit";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "../../SessionContext";

export const AircraftDetailList = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const [aircraftDetail, setAircraftDetail] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const getAircraftDetails = async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT,
        queryName: "aircraftDetails",
        queryType: "query",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      console.log("data:hghg", data);
      if (!data) showSnackbar("Failed to fetch categories!", "error");
      setAircraftDetail(data);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch categories!", "error");
    }
  };

  useEffect(() => {
    getAircraftDetails();
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
    await getAircraftDetails();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ marginBottom: 2 }}
        >
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>isActive</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aircraftDetail?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item?.category?.name}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} size="small" />
                </TableCell>

                <TableCell>
                  {/* Edit Button */}
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(item.id)}
                  >
                    <EditIcon />
                  </IconButton>

                  {/* Delete Button */}
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
      <Dialog className="panel-one"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Aircraft Category" : "Create Aircraft Category"}
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
            <AircraftDetailEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <AircraftDetailCreate
              onClose={handleClose}
              refreshList={refreshList}
            />
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
