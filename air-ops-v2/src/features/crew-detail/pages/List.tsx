import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { CrewDetailEdit } from "./Edit";
import { CrewDetailCreate } from "./Creat";
import { CrewProfileView } from "../components/CrewProfileView";
import { useCrewData } from "../hooks/useCrewQueries";
import { useUpdateCrewStatus } from "../hooks/useCrewMutations";

interface CrewDetailListProps {
  filter: any;
  searchTerm: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CrewDetailList = ({
  filter,
  searchTerm,
  open,
  setOpen,
}: CrewDetailListProps) => {
  const [rowsPerPage] = useState(10);

  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");
  const [viewOpen, setViewOpen] = useState(false);

  // Use the crew data hook
  const { crewData, refreshList } = useCrewData({
    filter,
    searchTerm,
    rowsPerPage,
  });

  // Use the status update hook
  const { updateCrewStatus } = useUpdateCrewStatus();

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

  const handleEdit = (id: string) => {
    setIsEdit(true);
    setOpen(true);
    setCurrentRecordId(id);
  };

  const handleClose = () => setOpen(false);

  const handleView = (id: string) => {
    setViewOpen(true);
    setCurrentRecordId(id);
  };

  const handleStatusChange = async (itemId: string, newStatus: boolean) => {
    const result = await updateCrewStatus(itemId, newStatus);
    if (result.success) {
      refreshList();
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table">
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
            {crewData &&
              crewData?.map((item: any, index: number) => (
                <TableRow key={item.id} onClick={() => handleView(item.id)}>
                  <TableCell>{`${item.fullName}`.trim()}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item?.phone}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item?.roles?.map((role: any) => role?.name || role?.type)?.join(", ")}
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
