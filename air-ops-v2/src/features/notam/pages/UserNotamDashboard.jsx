import { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NotamCategoryTabs from "../components/NotamCategoryTabs";
import UserNotamListTable from "../components/UserNotamListTable";

export default function UserNotamDashboard() {
    const [category, setCategory] = useState("DAILY");

    return (
        <Paper sx={{ p: 3, borderRadius: '24px' }}>
            {/* Header */}
            <Box sx={{ pb: 1.5, mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                    NOTAM Documents
                </Typography>
            </Box>

            {/* Tabs */}
            <NotamCategoryTabs value={category} onChange={setCategory} />

            {/* Table */}
            <Box mt={2}>
                <UserNotamListTable category={category} />
            </Box>
        </Paper>
    );
}
