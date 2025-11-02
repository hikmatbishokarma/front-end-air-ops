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
} from "@mui/material";
import useGql from "../../../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../../../lib/graphql/queries/aircraft-categories";
import { useSnackbar } from "@/app/providers";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DELETE_AIRCRAFT,
  GET_AIRCRAFT,
} from "../../../lib/graphql/queries/aircraft-detail";
import { AircraftDetailCreate } from "./create";
import { AircraftDetailEdit } from "./edit";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "@/app/providers";
import { ConfirmationDialog } from "../../../components/ConfirmationDialog";

export const AircraftDetailList = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const [aircraftDetail, setAircraftDetail] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const getAircraftDetails = async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT,
        queryName: "aircraftDetails",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          paging: {
            offset: page * pageSize,
            limit: pageSize,
          },
          sorting: [{ field: "createdAt", direction: "DESC" }],
        },
      });

      if (!data) showSnackbar("Failed to fetch categories!", "error");
      setAircraftDetail(data);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch categories!", "error");
    }
  };

  useEffect(() => {
    getAircraftDetails();
  }, [page, pageSize]);

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
          query: DELETE_AIRCRAFT,
          queryName: "deleteOneAircraftDetail", // The mutation name is often inferred, or not strictly needed if the query is just the mutation definition.
          queryType: "mutation",
          variables: {
            input: {
              id: recordToDeleteId,
            },
          },
        });

        if (errors) {
          showSnackbar(
            errors?.[0]?.message || "Failed to delete aircraft!",
            "error"
          );
        } else {
          showSnackbar("Aircraft deleted successfully!", "success"); // Add a success message
          getAircraftDetails(); // Refresh the list
        }
      } catch (error: any) {
        showSnackbar(error.message || "Failed to delete aircraft!", "error");
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

              <TableCell>isActive</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aircraftDetail?.data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>

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

                  {/* Delete Button */}
                  <IconButton
                    className="ground-handlers"
                    color="secondary"
                    onClick={() => confirmDelete(item.id)} // Call confirmDelete
                  >
                    <DeleteIcon className="edit-icon-size" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={aircraftDetail.totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => setPageSize(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </TableContainer>
      <Dialog
        className="panel-one"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Aircraft Category" : "Create Aircraft Category"}
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
