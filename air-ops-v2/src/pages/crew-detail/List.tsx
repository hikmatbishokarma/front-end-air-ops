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
  Typography,
} from "@mui/material";
import useGql from "../../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../../lib/graphql/queries/aircraft-categories";
import { useSnackbar } from "../../SnackbarContext";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GET_AIRCRAFT } from "../../lib/graphql/queries/aircraft-detail";

import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "../../SessionContext";
import { CrewDetailEdit } from "./Edit";
import { CrewDetailCreate } from "./Creat";
import {
  DELETE_CREW_DETAIL,
  GET_CREW_DETAILS,
  UPDATE_CREW_DETAIL,
} from "../../lib/graphql/queries/crew-detail";
import { get } from "react-hook-form";
import { CrewProfileView } from "./CrewProfileView";

export const CrewDetailList = ({
  open,
  setOpen,
  list,
  loading,
  onSearch,
  onFilterChange,
  refreshList,
}) => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const operatorId = session?.user.operator?.id || null;

  // const [crewDetails, setCrewDetails] = useState<any>([]);
  //   const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");

  const [viewOpen, setViewOpen] = useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  //   setIsEdit(false);
  // };

  // const getCrewDetails = async () => {
  //   try {
  //     const result = await useGql({
  //       query: GET_CREW_DETAILS,
  //       queryName: "crewDetails",
  //       queryType: "query-with-count",
  //       variables: {
  //         filter: {
  //           ...(operatorId && { operatorId: { eq: operatorId } }),
  //         },
  //       },
  //     });

  //     if (!result.data) showSnackbar("Failed to fetch Crew Details!", "error");
  //     setCrewDetails(result.data);
  //   } catch (error) {
  //     showSnackbar(error.message || "Failed to fetch Crew Details!", "error");
  //   }
  // };

  // useEffect(() => {
  //   getCrewDetails();
  // }, []);

  const handleEdit = (id) => {
    setIsEdit(true);
    setOpen(true);
    setCurrentRecordId(id);
  };

  const handleDelete = async (id) => {
    //TODO

    try {
      const result = await useGql({
        query: DELETE_CREW_DETAIL,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: id } },
      });

      if (!result.data) showSnackbar("Failed to Delete Crew Details!", "error");
    } catch (error) {
      showSnackbar(error.message || "Failed to Delete Crew Details!", "error");
    }
  };

  const handleClose = () => setOpen(false);

  // // // Function to refresh category list
  // const refreshList = async () => {
  //   // Fetch updated categories from API
  //   // await getCrewDetails();
  // };

  const handleView = (id) => {
    setViewOpen(true);
    setCurrentRecordId(id);
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const data = await useGql({
        query: UPDATE_CREW_DETAIL,
        queryName: "updateOneCrewDetail",
        queryType: "mutation",
        variables: { input: { id: itemId, update: { isActive: newStatus } } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("status changed", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to change status!", "error");
    } finally {
      refreshList();
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table crew-table-v1">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>MobileNo</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Is Active</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list?.map((item, index) => (
                <TableRow key={item.id} onClick={() => handleView(item.id)}>
                  <TableCell>{`${item.fullName}`.trim()}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item?.phone}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item?.roles?.map((item) => item?.name)?.join(", ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {moment(item.createdAt).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Switch
                      checked={item.isActive}
                      onChange={() =>
                        handleStatusChange(item.id, !item.isActive)
                      }
                      color="primary"
                    />
                  </TableCell>
                  <TableCell
                    className="panel-one"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {/* Edit Button */}
                    <IconButton
                      className="popup-quote-model"
                      color="primary"
                      onClick={() => handleEdit(item.id)}
                    >
                      <EditIcon className="popup-close-panel" />
                    </IconButton>

                    {/* Delete Button */}
                    {/* <IconButton
                      color="secondary"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton> */}
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
          {isEdit ? "Edit Staff Details" : "Create Staff Details"}
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
            <CrewDetailEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <CrewDetailCreate onClose={handleClose} refreshList={refreshList} />
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions> */}
      </Dialog>

      <Dialog
        className="panel-one"
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Profile
          <IconButton
            className="popup-quote-model"
            aria-label="close"
            onClick={() => setViewOpen(false)}
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
          <CrewProfileView crewId={currentRecordId} />
        </DialogContent>
      </Dialog>
    </>
  );
};
