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
import useGql from "../../../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../../../lib/graphql/queries/aircraft-categories";
import { useSnackbar } from "@/app/providers";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { OperatorEdit } from "./edit";
import OperatorCreate from "./create";
import { GET_OPERATORS } from "../../../lib/graphql/queries/operator";
import CloseIcon from "@mui/icons-material/Close";

export const OperatorList = () => {
  const showSnackbar = useSnackbar();

  const [operators, setoperators] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const getoperators = async () => {
    try {
      const data = await useGql({
        query: GET_OPERATORS,
        queryName: "operators",
        queryType: "query",
        variables: {},
      });

      if (!data) showSnackbar("Failed to fetch categories!", "error");
      setoperators(data);
    } catch (error: any) {
      showSnackbar(error.message || "Failed to fetch categories!", "error");
    }
  };

  useEffect(() => {
    getoperators();
  }, []);

  const handleEdit = (id: string) => {
    setIsEdit(true);
    setOpen(true);
    setCurrentRecordId(id);
  };

  // const handleDelete = (id) => {
  //   //TODO
  // };

  const handleClose = () => setOpen(false);

  // Function to refresh category list
  const refreshList = async () => {
    // Fetch updated categories from API
    await getoperators();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button className="admin_role_responsive"
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>CompanyName</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operators?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item?.phone}</TableCell>
                <TableCell>{item?.companyName}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} size="small" />
                </TableCell>

                <TableCell>
                  {/* Edit Button */}
                  <IconButton
                    className="ground-handlers"
                    color="primary"
                    onClick={() => handleEdit(item.id)}
                  >
                    <EditIcon className="edit-icon-size" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        className="panel-one"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit operator" : "Create operator"}
          <IconButton
            className="popup-quote-model"
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon className="popup-close-panel" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isEdit ? (
            <OperatorEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <OperatorCreate onClose={handleClose} refreshList={refreshList} />
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
