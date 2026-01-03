import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { CREATE_NOTICE_BOARD, UPDATE_NOTICE_BOARD } from '../../lib/graphql/queries/notice-board';
import { useSession } from '@/app/providers';
import { useSnackbar } from '@/app/providers';
import useGql from '../../lib/graphql/gql';

interface NoticeBoardConfigProps {
    onSuccess?: () => void;
    CustomTrigger?: React.ComponentType<{ onClick: () => void }>;
    initialData?: any; // Add initialData prop
    openDirectly?: boolean; // Prop to force open directly (for external control)
    onClose?: () => void; // Prop to handle closing explicitly
}

export default function NoticeBoardConfig({ onSuccess, CustomTrigger, initialData, openDirectly, onClose }: NoticeBoardConfigProps) {
    const { session } = useSession();
    const showSnackbar = useSnackbar();
    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState('');
    const [dateRangeType, setDateRangeType] = useState('today');
    const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
    const [endDate, setEndDate] = useState<moment.Moment | null>(moment());
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    // Effect to handle opening directly via props
    useEffect(() => {
        if (openDirectly !== undefined) {
            setOpen(openDirectly);
        }
    }, [openDirectly]);

    // Effect to populate form when initialData changes or dialog opens
    useEffect(() => {
        if (open && initialData) {
            setMessage(initialData.message || '');
            setIsActive(initialData.isActive);
            // Determine date range type (simplified logic, mostly defaults to custom if not today/tomorrow exactly matches)
            // For editing, it's safer to just default to 'custom' and show the dates
            setDateRangeType('custom');
            setStartDate(moment(initialData.startDate));
            setEndDate(moment(initialData.endDate));
        } else if (open && !initialData) {
            // Reset for create mode
            setMessage('');
            setDateRangeType('today');
            setStartDate(moment());
            setEndDate(moment());
            setIsActive(true);
        }
    }, [open, initialData]);


    // Check if user is Superadmin
    const isSuperAdmin = session?.user?.roles?.includes('SUPER_ADMIN');

    if (!isSuperAdmin) {
        return null;
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    const handleSubmit = async () => {
        setLoading(true);
        let finalStartDate = moment();
        let finalEndDate = moment();

        if (dateRangeType === 'today') {
            finalStartDate = moment().startOf('day');
            finalEndDate = moment().endOf('day');
        } else if (dateRangeType === 'tomorrow') {
            finalStartDate = moment().add(1, 'days').startOf('day');
            finalEndDate = moment().add(1, 'days').endOf('day');
        } else if (dateRangeType === 'custom') {
            if (!startDate || !endDate) {
                showSnackbar('Please select both start and end dates', 'error');
                setLoading(false);
                return;
            }
            finalStartDate = startDate.startOf('day');
            finalEndDate = endDate.endOf('day');
        }

        try {
            if (initialData) {
                // Update Logic
                await useGql({
                    query: UPDATE_NOTICE_BOARD,
                    queryName: "updateOneNoticeBoard",
                    queryType: "mutation",
                    variables: {
                        input: {
                            id: initialData.id,
                            update: {
                                message,
                                startDate: finalStartDate.toDate(),
                                endDate: finalEndDate.toDate(),
                                isActive,
                            }
                        },
                    },
                });
                showSnackbar('Notice updated successfully!', 'success');
            } else {
                // Create Logic
                await useGql({
                    query: CREATE_NOTICE_BOARD,
                    queryName: "createNoticeBoard",
                    queryType: "mutation",
                    variables: {
                        input: {
                            message,
                            startDate: finalStartDate.toDate(),
                            endDate: finalEndDate.toDate(),
                            isActive,
                        },
                    },
                });
                showSnackbar('Notice created successfully!', 'success');
            }

            handleClose(); // Close dialog
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error(error);
            showSnackbar(`Error: ${error.message || "Something went wrong"}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {CustomTrigger ? (
                // Only render trigger if not controlled externally via openDirectly (or if you want both)
                // If openDirectly is passed, we assume the parent handles the trigger mostly, but CustomTrigger can still be used.
                // However, for the Edit button in the table, we might just pass openDirectly={true} when the edit state is active in parent.
                // Let's keep CustomTrigger for the "Create" button case.
                <CustomTrigger onClick={handleOpen} />
            ) : (
                !openDirectly && ( // Don't show default icon if controlled externally
                    <Tooltip title="Configure Notice Board">
                        <IconButton onClick={handleOpen} color="primary" size="small">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                )
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{initialData ? 'Edit Notice Board' : 'Create Notice Board'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3} mt={1}>
                        <TextField
                            label="Notice Message"
                            fullWidth
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Date Range</InputLabel>
                            <Select
                                value={dateRangeType}
                                label="Date Range"
                                onChange={(e) => setDateRangeType(e.target.value)}
                            >
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                                <MenuItem value="custom">Custom Date Range</MenuItem>
                            </Select>
                        </FormControl>

                        {dateRangeType === 'custom' && (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <Box display="flex" gap={2}>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { fullWidth: true } }}
                                        minDate={startDate || undefined}
                                    />
                                </Box>
                            </LocalizationProvider>
                        )}

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : (initialData ? 'Update' : 'Save & Publish')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
