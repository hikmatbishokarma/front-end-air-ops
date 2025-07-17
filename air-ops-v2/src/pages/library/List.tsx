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

import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "../../SessionContext";
import VisibilityIcon from "@mui/icons-material/Visibility";

import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import DocumentPreviewDialog from "../../components/DocumentPreviewDialog";
import { DELETE_SECURITY } from "../../lib/graphql/queries/security";
import { LibraryEdit } from "./Edit";
import { LibraryCreate } from "./Create";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const LibraryList = ({
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

  const [isEdit, setIsEdit] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleEdit = (id) => {
    setIsEdit(true);
    setOpen(true);
    setCurrentRecordId(id);
  };

  const handleDelete = async () => {
    try {
      const result = await useGql({
        query: DELETE_SECURITY,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: deleteId } },
      });

      if (!result.data) showSnackbar("Failed to Delete Library!", "error");
    } catch (error) {
      showSnackbar(error.message || "Failed to Delete Library!", "error");
    } finally {
      setConfirmOpen(false);
      refreshList();
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table manuals-quo-v1">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Attachment</TableCell>

              <TableCell>Created On</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{`${row.name}`.trim()}</TableCell>

                  <TableCell>{row.department}</TableCell>

                  <TableCell>
                    {row.attachment ? (
                      <IconButton onClick={() => handlePreview(row.attachment)}>
                        {/* <VisibilityIcon color="primary" /> */}
                        <PictureAsPdfIcon color="primary" />
                      </IconButton>
                    ) : (
                      "No Attachment"
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {moment(row.createdAt).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell>
                    {/* Edit Button */}
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(row.id)}
                    >
                      <EditIcon />
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton
                      color="secondary"
                      //   onClick={() => handleDelete(row.id)}
                      onClick={() => handleDeleteClick(row.id)}
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
        className="panel-one"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Library" : "Create Library"}
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
            <LibraryEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <LibraryCreate onClose={handleClose} refreshList={refreshList} />
          )}
        </DialogContent>
      </Dialog>

      <DocumentPreviewDialog
        open={previewOpen}
        url={previewUrl}
        apiBaseUrl={apiBaseUrl}
        onClose={() => setPreviewOpen(false)}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
