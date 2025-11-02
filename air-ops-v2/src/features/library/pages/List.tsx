import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Typography,
  Menu,
  MenuItem,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

import { LibraryEdit } from "./Edit";
import { LibraryCreate } from "./Create";
import { useLibraryData } from "../hooks/useLibraryQueries";
import useGql from "@/lib/graphql/gql";
import { DELETE_LIBRARY } from "@/lib/graphql/queries/library";
import PdfThumbnailCard from "@/components/ThumbnailCard";
import { UserAvatarCell } from "@/components/UserAvatar";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import DocumentPreviewDialog from "@/components/DocumentPreviewDialog";
import { useSnackbar } from "@/app/providers";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

interface Document {
  id: string;
  name: string;
  department: string;
  attachment: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
}

interface LibraryListProps {
  filter: any;
  searchTerm: string;
  viewMode: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const LibraryList = ({
  filter,
  searchTerm,
  viewMode,
  open,
  setOpen,
}: LibraryListProps) => {
  const showSnackbar = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEdit, setIsEdit] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // State for the 3-dot menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocForMenu, setSelectedDocForMenu] = useState<Document | null>(
    null
  );

  const openMenu = Boolean(menuAnchorEl);

  // Simulate user permissions (replace with actual auth/role logic)
  const canEdit = true;
  const canDelete = true;

  // Use the library data hook
  const { libraries, totalCount, offset, hasMore, getLibrary, refreshList } =
    useLibraryData({
      filter,
      searchTerm,
      rowsPerPage,
    });

  const handleMenuClick = (event: React.MouseEvent<Element>, doc: Document) => {
    setMenuAnchorEl(event.currentTarget as HTMLElement);
    setSelectedDocForMenu(doc);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedDocForMenu(null);
  };

  const handleOpenAddEditDialog = useCallback(
    (doc: Document | null = null) => {
      setCurrentDocument(doc);
      if (doc) {
        setIsEdit(true);
      } else {
        setIsEdit(false);
      }
      setOpen(true);
      handleMenuClose();
    },
    [setOpen]
  );

  const handleCloseAddEditDialog = useCallback(() => {
    setOpen(false);
    setCurrentDocument(null);
  }, [setOpen]);

  const handleViewDocument = useCallback((documentName: string) => {
    setPreviewUrl(documentName);
    setPreviewOpen(true);
    handleMenuClose();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    const newOffset = newPage * rowsPerPage;
    getLibrary(newOffset, false);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleDelete = async () => {
    try {
      const result = await useGql({
        query: DELETE_LIBRARY,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: deleteId } },
      });

      if (!result.data) showSnackbar("Failed to Delete Doc!", "error");
    } catch (error: any) {
      showSnackbar(error.message || "Failed to Delete Doc!", "error");
    } finally {
      setConfirmOpen(false);
      refreshList();
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleEdit = (doc: Document) => {
    setIsEdit(true);
    setCurrentDocument(doc);
    setOpen(true);
  };

  // Filter documents based on search term (client-side filtering not needed, but keep for compatibility)
  const filteredDocuments = useMemo(() => {
    return libraries;
  }, [libraries]);

  // Calculate page number from offset for TablePagination
  const page = Math.floor(offset / rowsPerPage);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {/* Document Display Area */}
          {filteredDocuments?.length === 0 ? (
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ py: 5 }}
            >
              No documents found.
            </Typography>
          ) : viewMode === "grid" ? (
            <>
              <Grid container spacing={3}>
                {filteredDocuments?.map((doc) => (
                  <Grid item xs={12} sm={6} md={3} key={doc.id}>
                    <PdfThumbnailCard
                      doc={doc}
                      onClick={() => handleViewDocument(doc.attachment)}
                      handleMenuClick={(event: React.MouseEvent<Element>) =>
                        handleMenuClick(event, doc)
                      }
                    />
                  </Grid>
                ))}
              </Grid>
              {hasMore && (
                <Button variant="text" onClick={() => getLibrary(offset, true)}>
                  View more
                </Button>
              )}
            </>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Uploaded By
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Document Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      File Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDocuments?.map((doc) => (
                    <TableRow key={doc.id} hover>
                      <TableCell>
                        <UserAvatarCell
                          user={
                            doc.createdBy
                              ? {
                                  ...doc.createdBy,
                                  name:
                                    doc?.createdBy?.displayName ||
                                    doc?.createdBy?.fullName,
                                  profilePicUrl: `${apiBaseUrl}${doc?.createdBy?.profile}`,
                                }
                              : null
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() => handleViewDocument(doc.attachment)}
                          >
                            <DescriptionIcon color="primary" />
                          </IconButton>
                          {doc.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={doc.department} />
                      </TableCell>
                      <TableCell>{doc.name || "N/A"}</TableCell>
                      <TableCell>
                        {canEdit && (
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(doc)}
                            color="primary"
                            className="ground-handlers"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {canDelete && (
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteClick(doc.id)}
                            color="secondary"
                            className="ground-handlers"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
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
          )}
        </Container>
      </Box>

      {/* 3-dot Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() =>
            handleViewDocument(selectedDocForMenu?.attachment || "")
          }
        >
          <VisibilityIcon sx={{ mr: 1 }} /> View
        </MenuItem>
        {canEdit && (
          <MenuItem onClick={() => handleOpenAddEditDialog(selectedDocForMenu)}>
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => handleDeleteClick(selectedDocForMenu?.id || "")}
            sx={{ color: "secondary.main" }}
          >
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <Dialog
        className="panel-one"
        open={open}
        onClose={handleCloseAddEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Library" : "Create Library"}
          <IconButton
            className="popup-quote-model"
            aria-label="close"
            onClick={handleCloseAddEditDialog}
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
              id={currentDocument?.id}
              onClose={handleCloseAddEditDialog}
              refreshList={refreshList}
            />
          ) : (
            <LibraryCreate
              onClose={handleCloseAddEditDialog}
              refreshList={refreshList}
            />
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
