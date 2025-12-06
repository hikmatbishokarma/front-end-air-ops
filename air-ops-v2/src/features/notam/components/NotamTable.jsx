import { useNotamsByCategory } from "../hooks/useNotamQueries";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, CircularProgress, Box, Typography
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { getCleanFileName } from "@/shared/utils";
// import { useDeleteNotamMutation } from "../hooks/useNotamMutation";

export default function NotamTable({ category }) {
    const { notamList, loading } = useNotamsByCategory(category);
    //const { deleteNotam } = useDeleteNotamMutation();

    // const handleDelete = async (id) => {
    //     if (window.confirm("Are you sure you want to delete this NOTAM?")) {
    //         await deleteNotam(id);
    //     }
    // };

    const handleDownload = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, "_blank");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!notamList || notamList.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    No {category} NOTAMs uploaded yet
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#1a237e' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Region</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>File Name</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Uploaded Date</TableCell>
                        <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {notamList.map((notam) => (
                        <TableRow key={notam.id} hover>
                            <TableCell>
                                {notam.region}
                            </TableCell>

                            <TableCell>
                                {getCleanFileName(notam.fileName)}
                            </TableCell>

                            <TableCell>
                                {notam.createdAt
                                    ? new Date(notam.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    : "—"
                                }
                            </TableCell>

                            <TableCell align="right">
                                <IconButton
                                    size="small"
                                    onClick={() => handleDownload(notam.fileUrl)}
                                    disabled={!notam.fileUrl}
                                    color="primary"
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(notam.id)}
                                    color="error"
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
