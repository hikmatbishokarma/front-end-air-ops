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
  Chip,
  TablePagination,
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
import { SecurityEdit } from "./Edit";
import { SecurityCreate } from "./Create";

import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { UserAvatarCell } from "../../components/UserAvatar";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const SecurityList = ({
  open,
  setOpen,
  list,
  loading,
  refreshList,
  totalCount,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
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

      if (!result.data) showSnackbar("Failed to Delete Security!", "error");
    } catch (error) {
      showSnackbar(error.message || "Failed to Delete Security!", "error");
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Document Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <UserAvatarCell
                      user={
                        row.createdBy
                          ? {
                              ...row.createdBy,
                              name:
                                row?.createdBy?.displayName ||
                                row.createdBy?.displayName?.fullName,
                              profilePicUrl: `${apiBaseUrl}${row?.createdBy?.profile}`,
                            }
                          : null
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {row.attachment ? (
                      <>
                        <IconButton
                          onClick={() => handlePreview(row.attachment)}
                        >
                          <PictureAsPdfIcon color="primary" />
                        </IconButton>
                        {`${row.name}`.trim()}
                      </>
                    ) : (
                      "No Attachment"
                    )}
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid",
                        borderColor: "#1976d2", // Dark blue border color
                        color: "#212121", // Dark gray/black text color
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        fontSize: "0.8rem",
                      }}
                    >
                      {`${row.type}`.trim()}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip label={row.department} />
                  </TableCell>

                  <TableCell align="right">
                    {moment(row.createdAt).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell>
                    {/* <IconButton
                      aria-label="view"
                      onClick={() => handlePreview(row.attachment)}
                      color="primary"
                      className="ground-handlers"
                    >
                      <VisibilityIcon />
                    </IconButton> */}

                    {/* Edit Button */}
                    <IconButton
                      className="ground-handlers"
                      color="primary"
                      onClick={() => handleEdit(row.id)}
                    >
                      <EditIcon className="edit-icon-size" />
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton
                      className="ground-handlers"
                      color="secondary"
                      //   onClick={() => handleDelete(row.id)}
                      onClick={() => handleDeleteClick(row.id)}
                    >
                      <DeleteIcon className="ground-handlers" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
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
          {isEdit ? "Edit Security" : "Create Security"}
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
            <SecurityEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <SecurityCreate onClose={handleClose} refreshList={refreshList} />
          )}
        </DialogContent>
      </Dialog>

      <DocumentPreviewDialog
        open={previewOpen}
        url={previewUrl}
        apiBaseUrl={apiBaseUrl}
        onClose={() => setPreviewOpen(false)}
      />

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
      />
    </>
  );
};
