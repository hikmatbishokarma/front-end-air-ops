import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useIntimation } from "../../hooks/useIntimation";
import MediaUpload from "@/components/MediaUpload";
import { FileObject } from "@/shared/types/common";
import { logoColors } from "@/shared/utils";

interface TripDetailsTabProps {
  trip: any;
}

const RECIPIENT_TYPES = [
  "APD",
  "ATC",
  "Terminal",
  "Re Fuel",
  "CISF",
  "Airport Operator",
  "Ground Handler",
];

interface IntimationFormData {
  recipientType: string;
  toEmail: string;
  subject: string;
  note: string;
  attachmentUrl: string;
}

export default function IntimationsTab({ trip }: TripDetailsTabProps) {
  const tripId = trip.id;
  const { intimations, creating, sending, createIntimation, sendIntimation } =
    useIntimation(tripId);

  const [expandedSector, setExpandedSector] = useState<number>(0);

  // Group intimations by sector
  const intimationsBySector = intimations.reduce((acc: any, intimation: any) => {
    if (!acc[intimation.sectorNo]) {
      acc[intimation.sectorNo] = [];
    }
    acc[intimation.sectorNo].push(intimation);
    return acc;
  }, {});

  const handleSectorChange = (sectorIndex: number) => {
    setExpandedSector(expandedSector === sectorIndex ? -1 : sectorIndex);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Intimations
      </Typography>

      {trip.sectors?.map((sector: any, index: number) => (
        <Accordion
          key={index}
          expanded={expandedSector === index}
          onChange={() => handleSectorChange(index)}
          sx={{
            border: expandedSector === index ? `1px solid ${logoColors.accent}` : "1px solid #e0e0e0",
            borderRadius: 2,
            mb: 2,
            "&:before": { display: "none" },
            boxShadow: expandedSector === index ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Chip
                label={`Sector ${index + 1}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: `${logoColors.primary}15`,
                  color: logoColors.primary,
                  borderColor: `${logoColors.primary}40`,
                }}
                variant="outlined"
              />
              <Typography fontWeight="bold">
                {sector.source?.code} → {sector.destination?.code}
              </Typography>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <SectorIntimationForm
              tripId={tripId}
              sectorNo={index + 1}
              sector={sector}
              intimations={intimationsBySector[index + 1] || []}
              onCreateIntimation={createIntimation}
              onSendIntimation={sendIntimation}
              creating={creating}
              sending={sending}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

// Sector Intimation Form Component
interface SectorIntimationFormProps {
  tripId: string;
  sectorNo: number;
  sector: any;
  intimations: any[];
  onCreateIntimation: (input: any) => Promise<any>;
  onSendIntimation: (id: string) => Promise<any>;
  creating: boolean;
  sending: boolean;
}

function SectorIntimationForm({
  tripId,
  sectorNo,
  sector,
  intimations,
  onCreateIntimation,
  onSendIntimation,
  creating,
  sending,
}: SectorIntimationFormProps) {
  const [formData, setFormData] = useState<IntimationFormData>({
    recipientType: "",
    toEmail: "",
    subject: "",
    note: "",
    attachmentUrl: "",
  });

  const [attachment, setAttachment] = useState<FileObject | null>(null);
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate email on change
    if (name === "toEmail") {
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleAttachmentUpload = (fileObject: FileObject | null) => {
    setAttachment(fileObject);
    setFormData((prev) => ({
      ...prev,
      attachmentUrl: fileObject?.url || "",
    }));
  };

  const handleSaveDraft = async () => {
    // Validate email before saving
    if (!validateEmail(formData.toEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const input = {
      tripId,
      sectorNo,
      recipientType: formData.recipientType,
      toEmail: formData.toEmail,
      subject: formData.subject,
      note: formData.note,
      attachmentUrl: formData.attachmentUrl,
    };

    await onCreateIntimation(input);
    // Reset form
    setFormData({
      recipientType: "",
      toEmail: "",
      subject: "",
      note: "",
      attachmentUrl: "",
    });
    setAttachment(null);
    setEmailError("");
  };

  const handleSend = async (intimationId: string) => {
    await onSendIntimation(intimationId);
  };

  const isFormValid =
    formData.recipientType &&
    formData.toEmail &&
    validateEmail(formData.toEmail) &&
    !emailError;

  return (
    <Box>
      {/* Departure Airport Section */}
      <Box mb={3}>
        <Typography variant="subtitle2" fontWeight="bold" mb={2}>
          Departure Airport: {sector.source?.code}
        </Typography>

        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Recipient Type</InputLabel>
            <Select
              name="recipientType"
              value={formData.recipientType}
              onChange={handleInputChange}
              label="Recipient Type"
            >
              {RECIPIENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="To Email"
            name="toEmail"
            type="email"
            value={formData.toEmail}
            onChange={handleInputChange}
            error={!!emailError}
            helperText={emailError}
            required
          />

          <TextField
            fullWidth
            size="small"
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            size="small"
            label="Custom Note"
            name="note"
            multiline
            rows={3}
            value={formData.note}
            onChange={handleInputChange}
          />

          <MediaUpload
            label="Attachment (PDF)"
            value={attachment}
            onUpload={handleAttachmentUpload}
            category="intimation"
            size="medium"
            accept=".pdf"
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSaveDraft}
              disabled={creating || !isFormValid}
            >
              Save Draft
            </Button>
          </Stack>
        </Stack>

        {/* Display existing intimations for this sector */}
        {intimations.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Sent Intimations:
            </Typography>
            {intimations.map((intimation: any) => (
              <Box
                key={intimation._id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Stack spacing={1.5}>
                  {/* Header with recipient and status */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        To: {intimation.toEmail}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recipient: {intimation.recipientType}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={intimation.status}
                        size="small"
                        color={
                          intimation.status === "SENT"
                            ? "success"
                            : intimation.status === "DRAFT"
                              ? "default"
                              : "error"
                        }
                      />
                      {intimation.status === "DRAFT" && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSend(intimation._id)}
                          disabled={sending}
                        >
                          Send
                        </Button>
                      )}
                      {intimation.status === "FAILED" && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleSend(intimation._id)}
                          disabled={sending}
                        >
                          Resend
                        </Button>
                      )}
                    </Stack>
                  </Stack>

                  {/* Email Preview */}
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                    }}
                  >
                    {/* Subject */}
                    {intimation.subject && (
                      <Box mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Subject:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {intimation.subject}
                        </Typography>
                      </Box>
                    )}

                    {/* Note */}
                    {intimation.note && (
                      <Box mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Note:
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                          {intimation.note}
                        </Typography>
                      </Box>
                    )}

                    {/* Attachment */}
                    {intimation.attachmentUrl && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Attachment (PDF):
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              p: 1,
                              backgroundColor: "#f5f5f5",
                              borderRadius: 1,
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                fontSize: "1.2rem",
                              }}
                            >
                              📄
                            </Box>
                            <Typography variant="body2">Attachment (PDF)</Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => window.open(intimation.attachmentUrl, "_blank")}
                            sx={{ textTransform: "none" }}
                          >
                            Preview
                          </Button>
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  {/* Timestamp */}
                  {intimation.sentAt && (
                    <Typography variant="caption" color="text.secondary">
                      Sent: {new Date(intimation.sentAt).toLocaleString()}
                    </Typography>
                  )}
                  {intimation.errorMessage && (
                    <Typography variant="caption" color="error">
                      Error: {intimation.errorMessage}
                    </Typography>
                  )}
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
