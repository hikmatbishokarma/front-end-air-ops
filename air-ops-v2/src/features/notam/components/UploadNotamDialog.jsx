import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, MenuItem, TextField, Box, CircularProgress, Alert, Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useCreateNotamMutation } from "../hooks/useNotamMutation";
import MediaUpload from "@/components/MediaUpload";

const REGIONS = [
    { code: "VECF", name: "Delhi" },
    { code: "VIDF", name: "Kolkata" },
    { code: "VOMF", name: "Chennai" },
    { code: "VABF", name: "Mumbai" },
];

export default function UploadNotamDialog({ open, onClose, category, onSuccess }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            region: "",
            file: null,
        }
    });
    const { createNotam, loading } = useCreateNotamMutation();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        if (!data.file) {
            setError("Please upload a PDF file");
            return;
        }

        setError(null);

        try {
            const notamData = {
                region: data.region,
                category,
                fileName: data.file.key.split('/').pop(), // Extract filename from key
                fileUrl: data.file.url,
                fileKey: data.file.key,
            };

            const result = await createNotam(notamData);

            if (result.success) {
                reset();
                onClose();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error("Error uploading NOTAM:", error);
            setError("Failed to upload NOTAM. Please try again.");
        }
    };

    const handleClose = () => {
        if (!loading) {
            reset();
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Upload {category} NOTAM</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box mt={2}>
                        <Controller
                            name="region"
                            control={control}
                            rules={{ required: "Region is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Region"
                                    select
                                    fullWidth
                                    error={!!errors.region}
                                    helperText={errors.region?.message}
                                >
                                    {REGIONS.map((r) => (
                                        <MenuItem key={r.code} value={r.code}>
                                            {r.name} ({r.code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box mt={3}>
                        <Controller
                            name="file"
                            control={control}
                            rules={{ required: "PDF file is required" }}
                            render={({ field }) => (
                                <MediaUpload
                                    value={field.value}
                                    onUpload={field.onChange}
                                    label="Upload NOTAM PDF"
                                    category="notams"
                                    accept=".pdf"
                                    size="medium"
                                />
                            )}
                        />
                        {errors.file && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors.file.message}
                            </Typography>
                        )}
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Upload"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
