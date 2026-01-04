import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    Tooltip,
    TablePagination,
    TextField,
    InputAdornment,
    Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import useGql from "@/lib/graphql/gql";
import NoticeBoardConfig from "@/components/NoticeBoard/NoticeBoardConfig";
import {
    GET_NOTICE_BOARDS,
    UPDATE_NOTICE_BOARD,
    DELETE_NOTICE_BOARD
} from "@/lib/graphql/queries/notice-board";
import { useSnackbar } from "@/app/providers";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

export default function NoticeBoardControllerPage() {
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    // Edit / Delete State
    const [editItem, setEditItem] = useState<any>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [recordToDeleteId, setRecordToDeleteId] = useState<string | null>(null);


    const fetchNotices = async () => {
        setLoading(true);
        try {
            const response = await useGql({
                query: GET_NOTICE_BOARDS,
                queryName: "noticeBoards",
                queryType: "query-with-count", // Requesting nodes + totalCount
                variables: {
                    filter: searchTerm
                        ? {
                            message: { iLike: searchTerm }
                        }
                        : {},
                    paging: {
                        offset: page * pageSize,
                        limit: pageSize,
                    },
                    sorting: [{ field: "createdAt", direction: "DESC" }],
                },
            });

            if (response && response.data) {
                setData(response.data);
                setTotalCount(response.totalCount);
            }
        } catch (error: any) {
            console.error("Failed to fetch notices", error);
            showSnackbar(error.message || "Failed to fetch notices", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [page, pageSize, searchTerm]);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusChange = async (id: string, newStatus: boolean) => {
        try {
            await useGql({
                query: UPDATE_NOTICE_BOARD,
                queryName: "updateOneNoticeBoard",
                queryType: "mutation",
                variables: {
                    input: {
                        id: id,
                        update: { isActive: newStatus }
                    }
                }
            });
            showSnackbar("Status updated successfully", "success");
            fetchNotices(); // Refresh list to reflect changes
        } catch (error: any) {
            showSnackbar(error.message || "Failed to update status", "error");
        }
    };

    const handleEdit = (item: any) => {
        setEditItem(item);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setRecordToDeleteId(id);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!recordToDeleteId) return;
        try {
            await useGql({
                query: DELETE_NOTICE_BOARD,
                queryName: "deleteOneNoticeBoard",
                queryType: "mutation",
                variables: { "input": { id: recordToDeleteId } }
            });
            showSnackbar("Notice deleted successfully", "success");
            fetchNotices();
        } catch (error: any) {
            showSnackbar(error.message || "Failed to delete notice", "error");
        } finally {
            setOpenConfirmDialog(false);
            setRecordToDeleteId(null);
        }
    };


    return (
        <Box p={3} >
            <Box className="notice_slide_bar"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                }}
            >
                <Box sx={{ flex: "1 1 auto", maxWidth: 300 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        label="Search Messages"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Create Button */}
                <NoticeBoardConfig
                    onSuccess={fetchNotices}
                    CustomTrigger={({ onClick }) => (
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onClick}>
                            Create Notice
                        </Button>
                    )}
                />

                {/* Edit Dialog (Reusing NoticeBoardConfig) */}
                {editItem && (
                    <NoticeBoardConfig
                        openDirectly={editDialogOpen}
                        initialData={editItem}
                        onSuccess={() => {
                            fetchNotices();
                            //    setEditItem(null); // Handled by onClose usually but safety
                        }}
                        onClose={() => {
                            setEditDialogOpen(false);
                            setEditItem(null);
                        }}
                    />
                )}

            </Box>

            <Paper elevation={2}>
                <TableContainer className="notice_table_board">
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }} className="notice_radius_one">
                                <TableCell><strong>Message</strong></TableCell>
                                <TableCell><strong>Start Date</strong></TableCell>
                                <TableCell><strong>End Date</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                {/* <TableCell><strong>Created By</strong></TableCell> */}
                                <TableCell><strong>Created At</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No notices found.</TableCell>
                                </TableRow>
                            ) : (
                                data.map((notice) => (
                                    <TableRow key={notice.id} hover>
                                        <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <Tooltip title={notice.message}>
                                                <span>{notice.message}</span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{moment(notice.startDate).format("DD MMM YYYY")}</TableCell>
                                        <TableCell>{moment(notice.endDate).format("DD MMM YYYY")}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={notice.isActive}
                                                onChange={(e) => handleStatusChange(notice.id, e.target.checked)}
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>
                                        {/* <TableCell>
                        {notice.createdBy ? `${notice.createdBy.firstName || ''} ${notice.createdBy.lastName || ''}` : 'System'}
                    </TableCell> */}
                                        <TableCell>{moment(notice.createdAt).format("DD MMM YYYY HH:mm")}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEdit(notice)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(notice.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={pageSize}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                />
            </Paper>

            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this notice? This action cannot be undone."
            />

        </Box>
    );
}
