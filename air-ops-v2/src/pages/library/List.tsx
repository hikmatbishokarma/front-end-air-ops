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
  Menu,
  TablePagination, // Import Menu for the 3-dot actions
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

import PdfThumbnailCard from "../../components/ThumbnailCard";
import ReusableFilterPanel from "../../components/ReusableFilterPanel";
import moment from "moment";
import { DEPARTMENT_TYPES } from "../../lib/utils";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DocumentPreviewDialog from "../../components/DocumentPreviewDialog";
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

// Main App Component
const Library = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(); // For editing

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [libraries, setLibraries] = useState<Document[]>([]);

  // Simulate user permissions (replace with actual auth/role logic)
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(true);

  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  // State for the 3-dot menu
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const openMenu = Boolean(menuAnchorEl);

  const [selectedDocForMenu, setSelectedDocForMenu] = useState<Document | null>(
    null
  );

  const refreshList = async () => {
    // Fetch updated categories from API
    await getLibrary();
  };

  const handleMenuClick = (event, doc) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDocForMenu(doc);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedDocForMenu(null);
  };

  // Handle search input change
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
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
    // setCurrentDocument(null);
  }, []);

  // Simulate viewing a document
  const handleViewDocument = useCallback((documentName) => {
    setPreviewUrl(documentName);
    setPreviewOpen(true);
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

  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);

  // --- DATE FILTER STATES ---
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>();

  const [dateFilterType, setDateFilterType] = useState("anyDate");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  const formatStartOfDayISO = useCallback((date: Date): string => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0); // Set to start of UTC day
    return d.toISOString();
  }, []);

  const formatEndOfDayISO = useCallback((date: Date): string => {
    const d = new Date(date);
    d.setUTCHours(23, 59, 59, 999); // Set to end of UTC day
    return d.toISOString();
  }, []);

  const handleFilterOpen = (e) => {
    setFilterAnchorEl(e.currentTarget);
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  const handelOnApply = () => {
    const today = new Date();

    let from: string | null = null;
    let to: string | null = null;

    switch (dateFilterType) {
      case "today":
        from = formatStartOfDayISO(today);
        to = formatEndOfDayISO(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        from = formatStartOfDayISO(yesterday);
        to = formatEndOfDayISO(yesterday);
        break;
      case "lastWeek": // NEW CASE FOR LAST WEEK
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 7); // Start of day 7 days ago
        from = formatStartOfDayISO(lastWeekStart);
        to = formatEndOfDayISO(today); // End of today
        break;
      case "lastMonth":
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        ); // Day 0 of current month is last day of previous
        from = formatStartOfDayISO(firstDayOfLastMonth);
        to = formatEndOfDayISO(lastDayOfLastMonth);
        break;
      case "custom":
        if (customFromDate) {
          from = formatStartOfDayISO(new Date(customFromDate));
        }
        if (customToDate) {
          to = formatEndOfDayISO(new Date(customToDate));
        }
        break;
      case "anyDate":
      default:
        from = "";
        to = "";
        break;
    }

    if (dateFilterType !== "custom") {
      setCustomFromDate("");
      setCustomToDate("");
    }

    const newFilter = {
      ...(selectedDepartment && {
        department: { eq: selectedDepartment },
      }),

      ...(from &&
        to && {
          createdAt: {
            between: {
              lower: from,
              upper: to,
            },
          },
        }),
    };

    setFilter(newFilter);
  };

  const getLibrary = async (newOffset = 0, isLoadMore = false) => {
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
            ...(filter ? filter : {}),
          },
          paging: {
            offset: newOffset,
            limit: rowsPerPage,
          },
          sorting: [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Library!", "error");

      setTotalCount(result.totalCount);

      if (isLoadMore) {
        setLibraries((prev) => [...prev, ...result.data]);
      } else {
        setLibraries(result.data);
      }
      const nextOffset = newOffset + result.data.length;
      setOffset(nextOffset);
      setHasMore(nextOffset < result.totalCount);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Library!", "error");
    }
  };

  useEffect(() => {
    getLibrary();
  }, [searchTerm, filter, offset, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    const newOffset = newPage * rowsPerPage;
    setOffset(newOffset);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setOffset(0);
  };

  return (
    <>
      <h3>Library</h3>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ width: 300, mr: 2 }} // Removed flexGrow and added a right margin
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleFilterOpen}
            className="filter-date-range"
          >
            <FilterAltOutlinedIcon />
          </Button>

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
            Upload Doc
          </Button>
        </Box>
      </Box>

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
                    {" "}
                    <PdfThumbnailCard
                      doc={doc}
                      onClick={() => setSelectedDocUrl(doc.attachment)}
                      handleMenuClick={handleMenuClick}
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
                          <DescriptionIcon sx={{ mr: 1 }} />
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
              <TablePagination
                component="div"
                count={totalCount}
                page={offset}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </TableContainer>
          )}
          {/* </Paper> */}
        </Container>

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
            onClick={() => handleViewDocument(selectedDocForMenu?.attachment)}
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
      <ReusableFilterPanel
        open={openFilter}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        title="Filter"
        showDateFilter
        dateFilterType={dateFilterType}
        onDateFilterChange={setDateFilterType}
        fromDate={customFromDate ? moment(customFromDate) : null}
        toDate={customToDate ? moment(customToDate) : null}
        onFromDateChange={(date) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomFromDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomFromDate("");
          }
        }}
        onToDateChange={(date) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomToDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomToDate("");
          }
        }}
        onApply={() => {
          // your apply logic
          handelOnApply();
          handleFilterClose();
        }}
        onReset={() => {
          setDateFilterType("anyDate");
          setCustomFromDate("");
          setCustomToDate("");
          setSelectedDepartment("");
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Department
        </Typography>
        <Select
          fullWidth
          size="small"
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
          }}
          sx={{ mb: 3 }}
        >
          <MenuItem value="">All</MenuItem>
          {DEPARTMENT_TYPES.map((dept) => (
            <MenuItem key={dept.value} value={dept.value}>
              {dept.label}
            </MenuItem>
          ))}
        </Select>
      </ReusableFilterPanel>

      <DocumentPreviewDialog
        open={previewOpen}
        url={previewUrl}
        apiBaseUrl={apiBaseUrl}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default Library;
