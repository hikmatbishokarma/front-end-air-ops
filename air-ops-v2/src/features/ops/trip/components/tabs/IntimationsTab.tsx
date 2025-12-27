import { useState, useEffect, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useIntimation } from "../../hooks/useIntimation";
import MediaUpload from "@/components/MediaUpload";
import { FileObject } from "@/shared/types/common";
import { logoColors } from "@/shared/utils";
import useGql from "@/lib/graphql/gql";
import { GET_AIRPORT_BY_ICAO } from "@/lib/graphql/queries/airports";
import moment from "moment";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const { intimations, creating, sending, createIntimation, sendIntimation, updateIntimation } =
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
              onUpdateIntimation={updateIntimation}
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
  onUpdateIntimation: (id: string, input: any) => Promise<any>;
}

const TEMPLATES = ["Template A", "Template B", "Template C"];

// Helper to set editor content safely
const setEditorContent = (ref: React.RefObject<HTMLDivElement>, content: string) => {
  if (ref.current) {
    ref.current.innerHTML = content;
  }
};

function SectorIntimationForm({
  tripId,
  sectorNo,
  sector,
  intimations,
  onCreateIntimation,
  onSendIntimation,
  creating,
  sending,
  onUpdateIntimation,
}: SectorIntimationFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [template, setTemplate] = useState<string>("");
  const [formData, setFormData] = useState<{
    toEmails: string;
    ccEmails: string;
    subject: string;
    body: string;
  }>({
    toEmails: "",
    ccEmails: "",
    subject: "",
    body: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Ref for the contentEditable div
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync editor content when template/editingId changes and ref becomes available
  useEffect(() => {
    if (editorRef.current && formData.body && editorRef.current.innerHTML !== formData.body) {
      editorRef.current.innerHTML = formData.body;
    }
  }, [template, editingId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Reset form on tab switch
    setTemplate("");
    setFormData({
      toEmails: "",
      ccEmails: "",
      subject: "",
      body: "",
    });
    setEditingId(null);
    setEditorContent(editorRef, "");
  };

  const currentAirportCode = activeTab === 0 ? sector.source?.code : sector.destination?.code;
  const currentType = activeTab === 0 ? 'Departure' : 'Arrival';

  // Fetch airport data and populate form
  const handleTemplateChange = async (event: SelectChangeEvent) => {
    const selectedTemplate = event.target.value;
    setTemplate(selectedTemplate);

    // Reset basics
    let newTo = "";
    let newCc = "";
    // Customize subject based on type
    let subject = `Flight Intimation - ${currentType} - ${sector.source?.code} to ${sector.destination?.code}`;

    // ZZZZ Logic: Manual Input
    if (currentAirportCode === "ZZZZ") {
      // Leave emails empty for manual input
    } else if (currentAirportCode) {
      // Fetch Airport Data
      try {
        const result = await useGql({
          query: GET_AIRPORT_BY_ICAO,
          variables: { icao: currentAirportCode },
          queryName: "airportByIcao",
          queryType: "query",
        });

        const airport = result;

        if (airport) {
          // TO: Main email
          if (airport.email) newTo = airport.email;

          // CC: Ground Handlers + Fuel Suppliers
          const ghEmails =
            airport.groundHandlersInfo?.map((g: any) => g.email) || [];
          const fuelEmails =
            airport.fuelSuppliers?.map((f: any) => f.email) || [];
          newCc = [...ghEmails, ...fuelEmails].filter(Boolean).join(", ");
        }
      } catch (error) {
        console.error("Error fetching airport data:", error);
      }
    }

    const depDate = sector.depatureDate
      ? moment(sector.depatureDate).format("DD MMM YYYY")
      : "";
    const depTime = sector.depatureTime || "";
    const pax = sector.pax || "TBA";

    const aircraftName = sector.aircraft?.name || "";
    const aircraftCode = sector.aircraft?.code || "";
    const aircraftDisplay = [aircraftName, aircraftCode].filter(Boolean).join(" - ") || "TBA";

    let generatedBody = "";

    // Updated to use Real HTML Tables since we are now using contentEditable
    const tableStyle = "border-collapse: collapse; width: 100%; border: 1px solid #000;";
    const thStyle = "padding: 8px; text-align: center; background-color: #f2f2f2; border: 1px solid #000; font-weight: bold;";
    const tdStyle = "padding: 8px; text-align: center; border: 1px solid #000;";

    switch (selectedTemplate) {
      case "Template B":
        // Template B: Formal Request
        generatedBody = `
          <p>Dear Partners,</p>
          <p>We kindly request your services for the following flight operation at <strong>${currentAirportCode}</strong> (${currentType}).</p>
          <br/>
          <table border="1" cellpadding="5" cellspacing="0" style="${tableStyle}">
            <thead>
                <tr>
                    <th colspan="2" style="${thStyle}">FLIGHT SCHEDULE / DETAILS</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="${tdStyle} text-align: left;"><strong>Sector</strong></td>
                    <td style="${tdStyle} text-align: left;">${sector.source?.code} - ${sector.destination?.code}</td>
                </tr>
                <tr>
                    <td style="${tdStyle} text-align: left;"><strong>Date</strong></td>
                    <td style="${tdStyle} text-align: left;">${depDate}</td>
                </tr>
                 <tr>
                    <td style="${tdStyle} text-align: left;"><strong>ETD (UTC)</strong></td>
                    <td style="${tdStyle} text-align: left;">${depTime}</td>
                </tr>
                 <tr>
                    <td style="${tdStyle} text-align: left;"><strong>Aircraft</strong></td>
                    <td style="${tdStyle} text-align: left;">${aircraftDisplay}</td>
                </tr>
                 <tr>
                    <td style="${tdStyle} text-align: left;"><strong>PAX</strong></td>
                    <td style="${tdStyle} text-align: left;">${pax}</td>
                </tr>
            </tbody>
          </table>
          <br/>
          <p>Please ensure all ground handling and fuel services are arranged accordingly. Awaiting your confirmation.</p>
          <p>Sincerely,<br/>Airops Operations</p>
        `;
        break;

      case "Template C":
        // Template C: Vertical Table (Clean)
        generatedBody = `
          <p>Greetings,</p>
          <p>Please find the operation details below:</p>
          <table border="1" cellpadding="5" cellspacing="0" style="${tableStyle}">
              <tr>
                <td style="${thStyle}">Airport</td>
                <td style="${tdStyle}">${currentAirportCode} (${currentType})</td>
              </tr>
              <tr>
                <td style="${thStyle}">Sector</td>
                <td style="${tdStyle}">${sector.source?.code} -> ${sector.destination?.code}</td>
              </tr>
              <tr>
                <td style="${thStyle}">Date</td>
                <td style="${tdStyle}">${depDate}</td>
              </tr>
              <tr>
                <td style="${thStyle}">Time (UTC)</td>
                <td style="${tdStyle}">${depTime}</td>
              </tr>
               <tr>
                <td style="${thStyle}">Aircraft</td>
                <td style="${tdStyle}">${aircraftDisplay}</td>
              </tr>
              <tr>
                <td style="${thStyle}">PAX</td>
                <td style="${tdStyle}">${pax}</td>
              </tr>
          </table>
          <p>Please confirm receipt.</p>
          <p>Regards,<br/>Ops Team</p>
        `;
        break;

      case "Template A":
      default:
        // Template A: Horizontal Table (Standard)
        generatedBody = `
          <p>Dear Team,</p>
          <p>Please find below the flight intimation details for ${currentType} at ${currentAirportCode}:</p>
          <table border="1" cellpadding="5" cellspacing="0" style="${tableStyle}">
            <thead>
                <tr>
                    <th style="${thStyle}">Sector</th>
                    <th style="${thStyle}">Date</th>
                    <th style="${thStyle}">ETD (UTC)</th>
                    <th style="${thStyle}">PAX</th>
                    <th style="${thStyle}">Aircraft</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="${tdStyle}">${sector.source?.code} - ${sector.destination?.code}</td>
                    <td style="${tdStyle}">${depDate}</td>
                    <td style="${tdStyle}">${depTime}</td>
                    <td style="${tdStyle}">${pax}</td>
                    <td style="${tdStyle}">${aircraftDisplay}</td>
                </tr>
            </tbody>
          </table>
          <p>Please acknowledge receipt.</p>
          <p>Best Regards,<br/>Operations Team</p>
        `;
        break;
    }

    setFormData((prev) => ({
      ...prev,
      toEmails: newTo,
      ccEmails: newCc,
      subject: subject,
      body: generatedBody,
    }));

    // Update Editor
    setEditorContent(editorRef, generatedBody);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle manual edits in contentEditable
  const handleBodyBlur = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setFormData(prev => ({ ...prev, body: html }));
  };

  const handleSaveDraft = async () => {
    // Ensure we grab latest content if user didn't blur
    const currentBody = editorRef.current?.innerHTML || formData.body;

    const input = {
      tripId,
      sectorNo,
      recipientType: currentType, // 'Departure' or 'Arrival'
      toEmails: formData.toEmails.split(",").map((e) => e.trim()).filter(Boolean),
      ccEmails: formData.ccEmails.split(",").map((e) => e.trim()).filter(Boolean),
      subject: formData.subject,
      body: currentBody,
      note: currentBody, // Fallback
      attachmentUrl: "",
      template: template,
    };

    if (editingId) {
      await onUpdateIntimation(editingId, input);
      setEditingId(null);
    } else {
      await onCreateIntimation(input);
    }

    // Clear form
    setTemplate("");
    setFormData({
      toEmails: "",
      ccEmails: "",
      subject: "",
      body: "",
    });
    setEditorContent(editorRef, "");
  };

  const handleEdit = (intimation: any) => {
    setEditingId(intimation._id);
    setTemplate(intimation.template || "");

    if (intimation.recipientType === 'Arrival') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }

    const bodyContent = intimation.body || intimation.note || "";

    setFormData({
      toEmails: (intimation.toEmails || [intimation.toEmail]).join(", "),
      ccEmails: (intimation.ccEmails || []).join(", "),
      subject: intimation.subject,
      body: bodyContent,
    });

    setEditorContent(editorRef, bodyContent);
  }

  const handleSend = async (intimationId: string) => {
    await onSendIntimation(intimationId);
  };

  // Filter intimations for current tab
  const filteredIntimations = intimations.filter(i => {
    if (activeTab === 0) return i.recipientType !== 'Arrival'; // Default to Departure
    return i.recipientType === 'Arrival';
  });

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="airport tabs">
          <Tab label={`Departure: ${sector.source?.code}`} />
          <Tab label={`Arrival: ${sector.destination?.code}`} />
        </Tabs>
      </Box>

      {/* Form Section */}
      <Box mb={3} sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, border: "1px solid #eee" }}>
        <Typography variant="subtitle2" fontWeight="bold" mb={2}>
          Compose Intimation ({currentType}: {currentAirportCode})
        </Typography>

        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Template</InputLabel>
            <Select
              value={template}
              onChange={handleTemplateChange}
              label="Select Template"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {TEMPLATES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {template && (
            <>
              <TextField
                fullWidth
                size="small"
                label="To (Comma separated)"
                name="toEmails"
                value={formData.toEmails}
                onChange={handleInputChange}
                helperText="Main recipients"
              />

              <TextField
                fullWidth
                size="small"
                label="CC (Comma separated)"
                name="ccEmails"
                value={formData.ccEmails}
                onChange={handleInputChange}
                helperText="Fuel, Ground Handlers, etc."
              />

              <TextField
                fullWidth
                size="small"
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />

              <Typography variant="caption" color="textSecondary">Email Body (Editable)</Typography>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBodyBlur}
                style={{
                  border: "1px solid #c4c4c4",
                  borderRadius: "4px",
                  padding: "16px",
                  minHeight: "300px",
                  maxHeight: "600px",
                  overflowY: "auto",
                  outline: "none",
                  backgroundColor: "#fff",
                  fontFamily: 'Roboto, sans-serif'
                }}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => setPreviewOpen(true)}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveDraft}
                  disabled={creating}
                >
                  {editingId ? "Update Draft" : "Save Draft"}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Box>

      {/* Existing Intimations List */}
      <Stack spacing={2}>
        {filteredIntimations.map((intimation: any) => (
          <Box
            key={intimation._id}
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              bgcolor: "#f9f9f9",
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" fontWeight="bold">
                  {intimation.subject}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={intimation.status} size="small" color={intimation.status === 'SENT' ? 'success' : 'default'} />
                  {intimation.status === 'DRAFT' && (
                    <>
                      <Button size="small" onClick={() => handleEdit(intimation)}>Edit</Button>
                      <Button size="small" variant="contained" onClick={() => handleSend(intimation._id)} disabled={sending}>Send</Button>
                    </>
                  )}
                </Stack>
              </Stack>
              <Typography variant="caption">To: {intimation.toEmails?.join(", ") || intimation.toEmail}</Typography>
              <Typography variant="caption">CC: {intimation.ccEmails?.join(", ")}</Typography>
              <Typography variant="caption">Type: {intimation.recipientType}</Typography>

              {/* Preview Body Button or Summary */}
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Email Preview</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="subtitle2"><strong>To:</strong> {formData.toEmails}</Typography>
            <Typography variant="subtitle2"><strong>CC:</strong> {formData.ccEmails}</Typography>
            <Typography variant="subtitle2"><strong>Subject:</strong> {formData.subject}</Typography>
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }} dangerouslySetInnerHTML={{ __html: formData.body }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
