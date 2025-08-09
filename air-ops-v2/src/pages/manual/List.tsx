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
import {
  GET_ACCESS_REQUEST_BY_ID,
  GET_ACCESS_REQUESTS,
  REQUEST_ACCESS,
} from "../../lib/graphql/queries/access-request";
import AccessRequestModal from "../../components/AccessRequestModal";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const ManualList = ({
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); //

  const [currentDoc, setCurrentDoc] = useState<any>();

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

  const checkForAccessRequest = async (Id) => {
    const response = await useGql({
      query: GET_ACCESS_REQUESTS,
      queryName: "accessRequests",
      queryType: "query",
      variables: {
        filter: {
          docId: { eq: Id },
        },
      },
    });

    if (response?.errors?.length) {
      showSnackbar("Internal Server!", "error");
    }

    return response.length ? response[0] : undefined;
  };

  const handlePreview = async (row) => {
    setCurrentDoc(row);
    const checkforRequest: any = await checkForAccessRequest(row.id);

    if (!checkforRequest) {
      setIsModalOpen(true);
    }
    if (checkforRequest.status == "PENDING") {
      showSnackbar("Your Request Not Accepted yet", "info");
    }

    if (checkforRequest.status == "ACCEPTED") {
      console.log(
        "checkforRequest.status",
        checkforRequest.status == "ACCEPTED"
      );
      setPreviewUrl(row.attachment);
      setPreviewOpen(true);
    }
  };

  const handleRequestAccessClick = async () => {
    const response = await useGql({
      query: REQUEST_ACCESS,
      queryName: "",
      queryType: "mutation",
      variables: { docId: currentDoc.id },
    });
    setIsModalOpen(false);
    if (response?.errors?.length) {
      showSnackbar("Internal Server!", "error");
    } else showSnackbar("Request sent successfully!", "success");
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
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Uploaded On</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.attachment ? (
                      <>
                        <IconButton onClick={() => handlePreview(row)}>
                          <PictureAsPdfIcon color="primary" />
                        </IconButton>
                        {`${row.name}`.trim()}
                      </>
                    ) : (
                      "No Attachment"
                    )}
                  </TableCell>

                  <TableCell>{row.department}</TableCell>

                  <TableCell align="right">
                    {moment(row.createdAt).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell>
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
                      <DeleteIcon className="edit-icon-size" />
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
          {isEdit ? "Edit Manual" : "Create Manual"}
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

      <AccessRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentTitle={currentDoc?.name}
        onRequestAccess={handleRequestAccessClick}
        isLoading={isLoading} // Pass the loading state
      />
    </>
  );
};
