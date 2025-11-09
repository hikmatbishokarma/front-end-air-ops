import { useState, useEffect } from "react";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import FileUpload from "@/components/FileUpload";
import DocumentsList from "./DocumentList";
import { Sector } from "../../types/sector";
import { useSession, useSnackbar } from "@/app/providers";
import useGql from "@/lib/graphql/gql";
import { UPLOAD_TRIP_DOC_BY_CREW } from "@/lib/graphql/queries/trip-detail";

interface UploadTabProps {
  sector: Sector;
  preflightDocs: any[];
  postflightDocs: any[];
  setDocs: (docs: { pre: any[]; post: any[] }) => void;
}

const UploadTab = ({
  sector,
  preflightDocs,
  postflightDocs,
  setDocs,
}: UploadTabProps) => {
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const currentUserId = session?.user?.id || null;
  const [uploadType, setUploadType] = useState<"pre" | "post">("pre");
  const [uploading, setUploading] = useState(false);

  // Load existing crew uploaded documents from sector
  useEffect(() => {
    if (sector.crewUploadedDocs && sector.crewUploadedDocs.length > 0) {
      const preDocs: any[] = [];
      const postDocs: any[] = [];

      sector.crewUploadedDocs.forEach((doc) => {
        const docItem = {
          name: doc.name,
          url: doc.url,
          key: doc.url, // Use URL as key for now
          uploadedAt: new Date().toISOString(), // API doesn't provide uploadedAt
          type: doc.type === "pre" ? "pre" : "post",
        };

        if (doc.type === "pre") {
          preDocs.push(docItem);
        } else {
          postDocs.push(docItem);
        }
      });

      setDocs({ pre: preDocs, post: postDocs });
    }
  }, [sector.crewUploadedDocs, setDocs]);

  const handleUpload = async (fileObject: any) => {
    if (!fileObject || !currentUserId || !sector.tripId) {
      showSnackbar("Missing required information for upload", "error");
      return;
    }

    try {
      setUploading(true);

      // Upload document via API
      const result = await useGql({
        query: UPLOAD_TRIP_DOC_BY_CREW,
        queryName: "uploadTripDocByCrew",
        queryType: "mutation",
        variables: {
          data: {
            name:
              fileObject.key.split("/").pop() || fileObject.name || "document",
            url: fileObject.url,
            type: uploadType,
            crewId: currentUserId,
          },
          where: {
            tripId: { eq: sector.tripId },
            sectorSource: { eq: sector.source },
            sectorDestination: { eq: sector.destination },
            depatureDate: { eq: sector.depatureDate },
          },
        },
      });

      if (result?.errors) {
        throw new Error(
          result.errors[0]?.message || "Failed to upload document"
        );
      }

      const newDoc = {
        name: fileObject.key.split("/").pop() || fileObject.name || "document",
        url: fileObject.url,
        key: fileObject.url,
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

      showSnackbar("Document uploaded successfully", "success");
    } catch (error: any) {
      console.error("Error uploading document:", error);
      showSnackbar(error.message || "Failed to upload document", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type: "pre" | "post", key: string) => {
    // TODO: Implement delete API call if needed
    // For now, just remove from local state
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
    showSnackbar("Document deleted", "success");
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      {/* Upload Mode Selector */}
      <Stack direction="row" spacing={1} mb={3}>
        <Button
          variant={uploadType === "pre" ? "contained" : "outlined"}
          onClick={() => setUploadType("pre")}
          disabled={uploading}
          sx={{ textTransform: "none", borderRadius: 3 }}
        >
          Pre-Flight
        </Button>
        <Button
          variant={uploadType === "post" ? "contained" : "outlined"}
          onClick={() => setUploadType("post")}
          disabled={uploading}
          sx={{ textTransform: "none", borderRadius: 3 }}
        >
          Post-Flight
        </Button>
      </Stack>

      {/* Upload Component */}
      {uploading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : (
        <FileUpload
          onUpload={handleUpload}
          accept=".pdf,.png,.jpg,.jpeg"
          label="Upload Document"
        />
      )}

      {/* Combined List */}
      <DocumentsList
        documents={[...preflightDocs, ...postflightDocs]}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default UploadTab;
