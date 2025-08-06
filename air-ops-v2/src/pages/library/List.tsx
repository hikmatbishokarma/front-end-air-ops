// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   Button,
//   Switch,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   InputAdornment,
// } from "@mui/material";
// import useGql from "../../lib/graphql/gql";

// import { useSnackbar } from "../../SnackbarContext";

// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// import CloseIcon from "@mui/icons-material/Close";
// import { useSession } from "../../SessionContext";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import moment from "moment";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DescriptionIcon from "@mui/icons-material/Description";
// import ImageIcon from "@mui/icons-material/Image";
// import DocumentPreviewDialog from "../../components/DocumentPreviewDialog";
// import { DELETE_SECURITY } from "../../lib/graphql/queries/security";
// import { LibraryEdit } from "./Edit";
// import { LibraryCreate } from "./Create";

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
// export const LibraryList = ({
//   open,
//   setOpen,
//   list,
//   loading,
//   onSearch,
//   onFilterChange,
//   refreshList,
// }) => {
//   const showSnackbar = useSnackbar();
//   const { session, setSession } = useSession();

//   const operatorId = session?.user.operator?.id || null;

//   const [isEdit, setIsEdit] = useState(false);
//   const [currentRecordId, setCurrentRecordId] = useState("");

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [previewType, setPreviewType] = useState("");

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   const handleEdit = (id) => {
//     setIsEdit(true);
//     setOpen(true);
//     setCurrentRecordId(id);
//   };

//   const handleDelete = async () => {
//     try {
//       const result = await useGql({
//         query: DELETE_SECURITY,
//         queryName: "",
//         queryType: "mutation",
//         variables: { input: { id: deleteId } },
//       });

//       if (!result.data) showSnackbar("Failed to Delete Library!", "error");
//     } catch (error) {
//       showSnackbar(error.message || "Failed to Delete Library!", "error");
//     } finally {
//       setConfirmOpen(false);
//       refreshList();
//       setDeleteId(null);
//     }
//   };

//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setConfirmOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handlePreview = (url: string) => {
//     setPreviewUrl(url);
//     setPreviewOpen(true);
//   };

//   return (
//     <>
//       <TableContainer component={Paper} className="dash-table library-quo-v1">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Department</TableCell>
//               <TableCell>Attachment</TableCell>

//               <TableCell>Created On</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {list &&
//               list?.map((row, index) => (
//                 <TableRow key={row.id}>
//                   <TableCell>{`${row.name}`.trim()}</TableCell>

//                   <TableCell>{row.department}</TableCell>

//                   <TableCell>
//                     {row.attachment ? (
//                       <IconButton onClick={() => handlePreview(row.attachment)}>
//                         {/* <VisibilityIcon color="primary" /> */}
//                         <PictureAsPdfIcon color="primary" />
//                       </IconButton>
//                     ) : (
//                       "No Attachment"
//                     )}
//                   </TableCell>

//                   <TableCell align="right">
//                     {moment(row.createdAt).format("DD-MM-YYYY")}
//                   </TableCell>

//                   <TableCell>
//                     {/* Edit Button */}
//                     <IconButton className="ground-handlers"
//                       color="primary"
//                       onClick={() => handleEdit(row.id)}
//                     >
//                       <EditIcon className="edit-icon-size"/>
//                     </IconButton>

//                     {/* Delete Button */}
//                     <IconButton className="ground-handlers"
//                       color="secondary"
//                       //   onClick={() => handleDelete(row.id)}
//                       onClick={() => handleDeleteClick(row.id)}
//                     >
//                       <DeleteIcon className="edit-icon-size"/>
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Dialog
//         className="panel-one"
//         open={open}
//         onClose={() => setOpen(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>
//           {isEdit ? "Edit Library" : "Create Library"}
//           <IconButton
//             className="popup-quote-model"
//             aria-label="close"
//             onClick={() => setOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <CloseIcon className="popup-close-panel" />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           {isEdit ? (
//             <LibraryEdit
//               id={currentRecordId}
//               onClose={handleClose}
//               refreshList={refreshList}
//             />
//           ) : (
//             <LibraryCreate onClose={handleClose} refreshList={refreshList} />
//           )}
//         </DialogContent>
//       </Dialog>

//       <DocumentPreviewDialog
//         open={previewOpen}
//         url={previewUrl}
//         apiBaseUrl={apiBaseUrl}
//         onClose={() => setPreviewOpen(false)}
//       />

//       <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this item?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
//           <Button color="error" onClick={handleDelete}>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Menu, // Import Menu for the 3-dot actions
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import GridViewIcon from "@mui/icons-material/GridView";
import ListViewIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import 3-dot icon
import { LibraryCreate } from "./Create";
import CloseIcon from "@mui/icons-material/Close";
import { LibraryEdit } from "./Edit";
import useGql from "../../lib/graphql/gql";
import { GET_LIBRARIES } from "../../lib/graphql/queries/library";
import { useSession } from "../../SessionContext";
import { useSnackbar } from "../../SnackbarContext";
import DocumentCard from "../../components/DocumentCard";
import PdfThumbnailCard from "../../components/ThumbnailCard";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

interface Document {
  id: string;
  name: string;
  department: string;
  attachment: string;

  createdAt?: string;
  updatedAt?: string;
}

// Custom Theme with Blue and Red
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#dc3545", // Red
    },
    background: {
      default: "#f0f2f5",
      paper: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
        },
      },
    },
  },
});

// Main App Component
const Library = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const operatorId = session?.user.operator?.id || null;

  // const [libraries, setLibraries] = useState([
  //   {
  //     id: "1",
  //     name: "Project Alpha Report",
  //     department: "ENGINEERING",
  //     attachment: "alpha_report.pdf",
  //   },
  //   {
  //     id: "2",
  //     name: "Q3 Sales Forecast",
  //     department: "SALES",
  //     attachment: "sales_forecast.xlsx",
  //   },
  //   {
  //     id: "3",
  //     name: "HR Onboarding Guide",
  //     department: "HR",
  //     attachment: "onboarding_guide.docx",
  //   },
  //   {
  //     id: "4",
  //     name: "Security Policy V2",
  //     department: "SECURITY",
  //     attachment: "security_policy.pdf",
  //   },
  //   {
  //     id: "5",
  //     name: "Audit Findings 2024",
  //     department: "AUDIT",
  //     attachment: "audit_2024.pptx",
  //   },
  //   {
  //     id: "6",
  //     name: "Training Module 1",
  //     department: "TRAINING",
  //     attachment: "module1.mp4",
  //   },
  //   {
  //     id: "7",
  //     name: "Accounts Payable Process",
  //     department: "ACCOUNTS",
  //     attachment: "ap_process.pdf",
  //   },
  //   {
  //     id: "8",
  //     name: "Admin Procedures Manual",
  //     department: "ADMIN",
  //     attachment: "admin_manual.docx",
  //   },
  // ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(); // For editing
  const [newDocument, setNewDocument] = useState<Document>();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const [isEdit, setIsEdit] = useState(false);
  const [libraries, setLibraries] = useState<Document[]>([]);

  // Simulate user permissions (replace with actual auth/role logic)
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(true);

  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  const documentTypes = [
    "SALES",
    "OPS",
    "CAMO",
    "ENGINEERING",
    "SECURITY",
    "ACCOUNTS",
    "HR",
    "ADMIN",
    "AUDIT",
    "TRAINING",
    "OTHERS",
  ];

  // State for the 3-dot menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [selectedDocForMenu, setSelectedDocForMenu] = useState<Document | null>(
    null
  );

  const getLibrary = async () => {
    try {
      const result = await useGql({
        query: GET_LIBRARIES,
        queryName: "libraries",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
            ...(searchTerm
              ? {
                  or: [
                    { name: { iLike: searchTerm } },
                    { department: { iLike: searchTerm } },
                  ],
                }
              : {}),
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Library!", "error");

      console.log("result:::::", result);
      setLibraries(result.data);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Library!", "error");
    }
  };

  useEffect(() => {
    getLibrary();
  }, [searchTerm, filterType]);

  const refreshList = async () => {
    // Fetch updated categories from API
    await getLibrary();
  };

  const handleMenuClick = (event, doc) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocForMenu(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocForMenu(null);
  };

  // Handle search input change
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // Handle filter by type change
  const handleFilterTypeChange = useCallback((event) => {
    setFilterType(event.target.value);
  }, []);

  // Filter documents based on search term and type
  const filteredDocuments = useMemo(() => {
    let filtered = libraries;
    return filtered;
  }, [libraries, searchTerm, filterType]);

  // Open the Add/Edit Document dialog
  const handleOpenAddEditDialog = useCallback((doc: Document | null = null) => {
    setCurrentDocument(doc);
    if (doc) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
    setOpenAddEditDialog(true);
    handleMenuClose(); // Close menu if opened from there
  }, []);

  // Close the Add/Edit Document dialog and reset form
  const handleCloseAddEditDialog = useCallback(() => {
    setOpenAddEditDialog(false);
    setCurrentDocument(null);
  }, []);

  // Simulate viewing a document
  const handleViewDocument = useCallback((documentName) => {
    alert(`Viewing document: ${documentName || "No document uploaded"}`);
    handleMenuClose();
  }, []);

  // Simulate deleting a document entry
  const handleDeleteDocument = useCallback((id) => {
    // In a real app, use a custom modal instead of window.confirm
    if (window.confirm("Are you sure you want to delete this document?")) {
      setLibraries((prev) => prev.filter((doc) => doc.id !== id));
    }
    handleMenuClose();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{ flexGrow: 1, minWidth: "180px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="filter-type-label">Filter by type</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                onChange={handleFilterTypeChange}
                label="Filter by type"
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                color={viewMode === "grid" ? "primary" : "default"}
                onClick={() => setViewMode("grid")}
                aria-label="grid view"
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                color={viewMode === "list" ? "primary" : "default"}
                onClick={() => setViewMode("list")}
                aria-label="list view"
              >
                <ListViewIcon />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAddEditDialog()}
              color="primary"
            >
              Upload Document
            </Button>
          </Box>

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
            <Grid container spacing={3}>
              {filteredDocuments?.map((doc) => (
                <Grid item xs={12} sm={6} md={3} key={doc.id}>
                  {" "}
                  {/* Changed md={4} to md={3} for 4 cards per row */}
                  {/* <Card
                    elevation={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        height: 150,
                        bgcolor: "#f0f0f0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={`https://placehold.co/200x150/e0e0e0/555555?text=${doc?.attachment?.split(".").pop().toUpperCase()}`}
                        alt="Document Thumbnail"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/200x150/e0e0e0/555555?text=DOC";
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        pt: 1.5,
                        pb: 0.5,
                        px: 2,
                        position: "relative",
                      }}
                    >
                      {" "}
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ fontWeight: "bold", lineHeight: 1.3, mb: 0.5 }}
                      >
                        {doc.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ flexGrow: 1, pr: 0.5 }}>
                          {" "}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", lineHeight: 1.2 }}
                          >
                            {doc.name || "N/A"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", lineHeight: 1.2 }}
                          >
                            Department: {doc.department}
                          </Typography>
                        </Box>
                        <IconButton
                          aria-label="more actions"
                          onClick={(event) => handleMenuClick(event, doc)}
                          size="small"
                          sx={{ p: 0.5, alignSelf: "flex-end" }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card> */}
                  {/* <DocumentCard
                    title={doc.name}
                    url={`${apiBaseUrl}/${doc.attachment}`}
                    onClick={() => setSelectedDocUrl(doc.attachment)}
                  /> */}
                  <PdfThumbnailCard
                    doc={doc}
                    onClick={() => setSelectedDocUrl(doc.attachment)}
                    handleMenuClick={handleMenuClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Document Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Type
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <DescriptionIcon
                            sx={{ mr: 1, color: theme.palette.primary.main }}
                          />
                          {doc.name}
                        </Box>
                      </TableCell>
                      <TableCell>{doc.department}</TableCell>
                      <TableCell>{doc.name || "N/A"}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="view"
                          onClick={() => handleViewDocument(doc.name)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        {canEdit && (
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleOpenAddEditDialog(doc)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {canDelete && (
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteDocument(doc.id)}
                            color="secondary"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {/* </Paper> */}
        </Container>

        {/* 3-dot Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => handleViewDocument(selectedDocForMenu?.name)}
          >
            <VisibilityIcon sx={{ mr: 1 }} /> View
          </MenuItem>
          {canEdit && (
            <MenuItem
              onClick={() => handleOpenAddEditDialog(selectedDocForMenu)}
            >
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
          )}
          {canDelete && (
            <MenuItem
              onClick={() => handleDeleteDocument(selectedDocForMenu?.id)}
              sx={{ color: "secondary.main" }}
            >
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          )}
        </Menu>

        {/* Add/Edit Document Dialog */}

        <Dialog
          className="panel-one"
          open={openAddEditDialog}
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
      </Box>
    </ThemeProvider>
  );
};

export default Library;
