import { useState } from "react";
import NotamTabs from "../components/NotamTabs";
import { Box, Button } from "@mui/material";
import NotamTable from "../components/NotamTable";
import UploadNotamDialog from "../components/UploadNotamDialog";

export default function NotamAdminPage() {
  const [category, setCategory] = useState("DAILY");
  const [openUpload, setOpenUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of the table
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Box p={3}>
      <NotamTabs value={category} onChange={setCategory} />

      <Box display="flex" justifyContent="flex-end" mt={2} mb={1}>
        <Button variant="contained" onClick={() => setOpenUpload(true)}>
          Upload {category} NOTAM
        </Button>
      </Box>

      <NotamTable key={refreshKey} category={category} />

      <UploadNotamDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        category={category}
        onSuccess={handleUploadSuccess}
      />
    </Box>
  );
}
