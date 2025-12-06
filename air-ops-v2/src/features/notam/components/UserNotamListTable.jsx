import { useNotamsByCategory } from "../hooks/useNotamQueries";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, CircularProgress, Box, Typography
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { getCleanFileName } from "@/shared/utils";

const REGIONS = [
    { code: "VECF", name: "Delhi" },
    { code: "VIDF", name: "Kolkata" },
    { code: "VOMF", name: "Chennai" },
    { code: "VABF", name: "Mumbai" },
];

export default function UserNotamListTable({ category }) {
    const { notamList, loading } = useNotamsByCategory(category);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Region</strong></TableCell>
                        <TableCell><strong>File Name</strong></TableCell>
                        <TableCell><strong>Last Updated</strong></TableCell>
                        <TableCell align="right"><strong>Download</strong></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {REGIONS.map((region) => {
                        const file = notamList.find(r => r.region === region.code);

                        return (
                            <TableRow key={region.code}>
                                <TableCell>
                                    {region.name} ({region.code})
                                </TableCell>

                                <TableCell>
                                    {getCleanFileName(file?.fileName)}
                                </TableCell>

                                <TableCell>
                                    {file?.updatedAt ? new Date(file.updatedAt).toLocaleDateString() : "—"}
                                </TableCell>

                                <TableCell align="right">
                                    {file && (
                                        <IconButton onClick={() => window.open(file.fileUrl, "_blank")}>
                                            <DownloadIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
