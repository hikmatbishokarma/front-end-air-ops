import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";

import FileUpload from "@/components/FileUpload";
import DocumentsList from "./DocumentList";

const UploadTab = ({ preflightDocs, postflightDocs, setDocs }) => {
  const [uploadType, setUploadType] = useState<"pre" | "post">("pre");

  const handleUpload = (fileObject) => {
    if (!fileObject) return;

    const newDoc = {
      name: fileObject.key.split("/").pop()!, // filename
      url: fileObject.url,
      key: fileObject.key,
      uploadedAt: new Date().toISOString(),
      type: uploadType,
    };

    if (uploadType === "pre") {
      setDocs({
        pre: [...preflightDocs, newDoc],
        post: postflightDocs,
      });
    } else {
      setDocs({
        pre: preflightDocs,
        post: [...postflightDocs, newDoc],
      });
    }
  };

  const handleDelete = (type: "pre" | "post", key: string) => {
    if (type === "pre") {
      setDocs({
        pre: preflightDocs.filter((d) => d.key !== key),
        post: postflightDocs,
      });
    } else {
      setDocs({
        pre: preflightDocs,
        post: postflightDocs.filter((d) => d.key !== key),
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      {/* Upload Mode Selector */}
      <Stack direction="row" spacing={1} mb={3}>
        <Button
          variant={uploadType === "pre" ? "contained" : "outlined"}
          onClick={() => setUploadType("pre")}
          sx={{ textTransform: "none", borderRadius: 3 }}
        >
          Pre-Flight
        </Button>
        <Button
          variant={uploadType === "post" ? "contained" : "outlined"}
          onClick={() => setUploadType("post")}
          sx={{ textTransform: "none", borderRadius: 3 }}
        >
          Post-Flight
        </Button>
      </Stack>

      {/* Your Existing Upload Component */}
      <FileUpload
        onUpload={handleUpload}
        accept=".pdf,.png,.jpg,.jpeg"
        label="Upload Document"
      />

      {/* Combined List */}
      <DocumentsList
        documents={[...preflightDocs, ...postflightDocs]}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default UploadTab;
