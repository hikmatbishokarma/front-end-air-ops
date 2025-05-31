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
import { AircraftCategoryCreate } from "./create";
import { AircraftCategoryEdit } from "./edit";

import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "../../SessionContext";

export const AircraftCategoryList = () => {
  const showSnackbar = useSnackbar();

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const [categories, setCategories] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const getCategories = async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT_CATEGORIES,
        queryName: "aircraftCategories",
        queryType: "query",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      console.log("data:hghg", data);
      if (!data) showSnackbar("Failed to fetch categories!", "error");
      setCategories(data);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch categories!", "error");
    }
  };

  useEffect(() => {
    getCategories();
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
    await getCategories();
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
          Create Category
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>isActive</TableCell>
              <TableCell>Modified Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Switch checked={category.isActive} size="small" />
                </TableCell>
                <TableCell>
                  {moment(category.updatedAt).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>
                  {/* Edit Button */}
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(category.id)}
                  >
                    <EditIcon />
                  </IconButton>

                  {/* Delete Button */}
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEdit ? "Edit Aircraft Category" : "Create Aircraft Category"}

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
            <AircraftCategoryEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <AircraftCategoryCreate
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
