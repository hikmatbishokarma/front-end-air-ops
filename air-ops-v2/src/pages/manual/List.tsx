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
import { DELETE_MANUAL } from "../../lib/graphql/queries/manual";
import { ManualEdit } from "./Edit";
import { ManualCreate } from "./Create";
import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import DocumentPreviewDialog from "../../components/DocumentPreviewDialog";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const ManualList = ({
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

  const operatorId = session?.user.agent?.id || null;

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
        query: DELETE_MANUAL,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: deleteId } },
      });

      if (!result.data) showSnackbar("Failed to Delete manual!", "error");
    } catch (error) {
      showSnackbar(error.message || "Failed to Delete manual!", "error");
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

  // const handlePreview = (url) => {
  //   url = `${apiBaseUrl}${url}`;
  //   setPreviewUrl(url);

  //   // detect file type
  //   if (url.endsWith(".pdf")) {
  //     setPreviewType("pdf");
  //   } else if (url.endsWith(".doc") || url.endsWith(".docx")) {
  //     setPreviewType("doc");
  //   } else if (
  //     url.endsWith(".png") ||
  //     url.endsWith(".jpg") ||
  //     url.endsWith(".jpeg")
  //   ) {
  //     setPreviewType("image");
  //   } else {
  //     setPreviewType("other");
  //   }

  //   setPreviewOpen(true);
  // };

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
                  {/* <TableCell>
                    {row.attachment ? (
                      <a
                        href={row.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textDecoration: "none",
                        }}
                      >
                        {row.attachment.endsWith(".pdf") && (
                          <PictureAsPdfIcon color="error" />
                        )}
                        {(row.attachment.endsWith(".doc") ||
                          row.attachment.endsWith(".docx")) && (
                          <DescriptionIcon color="primary" />
                        )}
                        {(row.attachment.endsWith(".png") ||
                          row.attachment.endsWith(".jpg") ||
                          row.attachment.endsWith(".jpeg")) && (
                          <ImageIcon color="action" />
                        )}
                        <span style={{ marginLeft: "8px" }}>View Document</span>
                      </a>
                    ) : (
                      "No Attachment"
                    )}
                  </TableCell> */}

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
      <Dialog className="panel-one"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle >
          {isEdit ? "Edit Manual" : "Create Manual"}
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
            <CloseIcon className="popup-close-panel" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isEdit ? (
            <ManualEdit
              id={currentRecordId}
              onClose={handleClose}
              refreshList={refreshList}
            />
          ) : (
            <ManualCreate onClose={handleClose} refreshList={refreshList} />
          )}
        </DialogContent>
      </Dialog>

      {/* <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Document Preview
          <IconButton
            aria-label="close"
            onClick={() => setPreviewOpen(false)}
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
        <DialogContent dividers style={{ height: "80vh" }}>
          {previewType === "pdf" && (
            <iframe
              src={previewUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          )}

          {previewType === "doc" && (
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                previewUrl
              )}`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          )}

          {previewType === "image" && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}

          {previewType === "other" && <p>Cannot preview this file type.</p>}
        </DialogContent>
      </Dialog> */}
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
