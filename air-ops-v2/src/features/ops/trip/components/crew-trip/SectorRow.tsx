import { useState } from "react";
import {
  TableRow,
  TableCell,
  Collapse,
  Box,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableBody,
  Avatar,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadIcon from "@mui/icons-material/Download";

export const SectorRow = ({ sector }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sector Header Row */}
      <TableRow sx={{ background: "#FAFAFA" }}>
        <TableCell colSpan={6}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={600} fontSize={14}>
              Sector {sector.sectorNo}: {sector.source.code}
              {sector.source.name && ` (${sector.source.name})`} →{" "}
              {sector.destination.code}
              {sector.destination.name && ` (${sector.destination.name})`}
              &nbsp; ({sector.depatureTime} → {sector.arrivalTime})
            </Typography>

            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {/* Collapsible Documents List */}
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 1 }}>
              {sector.crewDocuments?.length ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Document</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Crew</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Uploaded At</TableCell>
                      <TableCell align="center">Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sector.crewDocuments.map((doc) => (
                      <TableRow key={doc._id}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.type.toUpperCase()}</TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              sx={{ width: 26, height: 26, fontSize: 14 }}
                              src={doc.uploadedBy?.profileImage}
                            >
                              {doc.uploadedBy?.name?.[0]}
                            </Avatar>
                            {doc.uploadedBy?.name}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              px: 1.2,
                              py: 0.3,
                              borderRadius: 1,
                              fontSize: 12,
                              background: "#EDEDED",
                            }}
                          >
                            {doc.uploadedBy?.role}
                          </Box>
                        </TableCell>

                        <TableCell>
                          {new Date(doc.uploadedAt).toLocaleString()}
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              component="a"
                              href={doc.url}
                              download
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography sx={{ p: 1, fontSize: 13, color: "#777" }}>
                  No documents uploaded for this sector.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
