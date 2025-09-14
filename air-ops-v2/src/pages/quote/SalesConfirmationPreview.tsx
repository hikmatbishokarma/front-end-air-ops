import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
} from "@mui/material";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router";
import useGql from "../../lib/graphql/gql";
import { PREVIEW_SALES_CONFIRMATION } from "../../lib/graphql/queries/quote";
import { useSnackbar } from "../../SnackbarContext";

const SaleConfirmationPreviewPage = () => {
  const navigate = useNavigate();
  const { quotationNo } = useParams(); // assuming route like /preview/:id

  const showSnackbar = useSnackbar();

  const [htmlContent, setHtmlContent] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Apply inline styles from backend HTML
  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent || "";
    const styleTags = tempDiv.getElementsByTagName("style");

    const styleElements: HTMLStyleElement[] = [];

    for (let i = 0; i < styleTags.length; i++) {
      const styleContent = styleTags[i].innerHTML;
      const styleElement = document.createElement("style");
      styleElement.innerHTML = styleContent;
      document.head.appendChild(styleElement);
      styleElements.push(styleElement);
    }

    return () => {
      styleElements.forEach((styleElement) =>
        document.head.removeChild(styleElement)
      );
    };
  }, [htmlContent]);

  const getSalesConfirmation = async (quotationNo) => {
    try {
      const data = await useGql({
        query: PREVIEW_SALES_CONFIRMATION,
        queryName: "previewSalesConfirmation",
        queryType: "query-without-edge",
        variables: { quotationNo: quotationNo },
      });

      if (!data || data?.errors) {
        showSnackbar(
          data?.errors?.[0]?.message || "Something went wrong",
          "error"
        );
      } else {
        setHtmlContent(data);
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to Add!", "error");
    }
  };

  useEffect(() => {
    getSalesConfirmation(quotationNo);
  }, [quotationNo]);

  const sanitizedHTML = DOMPurify.sanitize(htmlContent || "", {
    ADD_TAGS: ["style"],
  });

  const componentRef = useRef<HTMLDivElement>(null);

  const handleConfirmSave = async () => {
    try {
      navigate("/quotes"); // ✅ redirect after confirmation
    } catch (error) {
      showSnackbar(error.message || "Failed to save!", "error");
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  return (
    <>
      <Box p={3} display="flex" flexDirection="column" alignItems="center">
        {/* A4 container */}
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            width: "210mm", // A4 width
            minHeight: "297mm", // A4 height
            overflow: "auto",
          }}
        >
          <div
            ref={componentRef}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        </Paper>

        {/* Actions */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 3, width: "210mm" }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              navigate(
                `/passenger-detail/${encodeURIComponent(quotationNo || "")}`
              )
            }
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenConfirmDialog(true)}
          >
            Confirm & Save
          </Button>
        </Stack>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          Are you sure you want to confirm and save this sales confirmation?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button color="success" onClick={handleConfirmSave}>
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaleConfirmationPreviewPage;
