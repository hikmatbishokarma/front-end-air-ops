import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import useGql from "../../lib/graphql/gql";

import { useSnackbar } from "../../SnackbarContext";
import moment from "moment";

import { useSession } from "../../SessionContext";
import { GET_STAFF_CERTIFICATION } from "../../lib/graphql/queries/crew-detail";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DocumentPreviewDialog from "../../components/DocumentPreviewDialog";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const StaffCertificationList = ({ list }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table crew-table-v1">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Certification</TableCell>
              <TableCell>Licence No</TableCell>
              <TableCell>Date OF Issue</TableCell>
              <TableCell>Valid Till</TableCell>
              <TableCell>Issued By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{`${item.staffName}`.trim()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item?.licenceNo}</TableCell>
                  <TableCell>
                    {moment(item?.dateOfIssue).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>
                    {moment(item?.validTill).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>
                    {item.issuedBy ? (
                      <IconButton onClick={() => handlePreview(item.issuedBy)}>
                        <PictureAsPdfIcon color="primary" />
                      </IconButton>
                    ) : (
                      "No Attachment"
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DocumentPreviewDialog
        open={previewOpen}
        url={previewUrl}
        apiBaseUrl={apiBaseUrl}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};
