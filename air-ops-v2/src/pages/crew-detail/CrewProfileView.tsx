// UserProfileView.tsx

import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
} from "@mui/material";
import { useSession } from "../../SessionContext";
import { CrewDetailFormValues } from "./interface";
import { GET_CREW_DETAIL_BY_ID } from "../../lib/graphql/queries/crew-detail";
import moment from "moment";
import useGql from "../../lib/graphql/gql";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

export const CrewProfileView = ({ crewId }) => {
  const { session } = useSession();
  const [crewDetail, setCrewDetail] = useState<CrewDetailFormValues>();
  const [tab, setTab] = useState(0);

  const userId = session?.user?.id;

  const fetchCreDetailById = async (Id) => {
    console.log("Id:::", Id);
    const response = await useGql({
      query: GET_CREW_DETAIL_BY_ID,
      queryName: "crewDetail",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setCrewDetail(response);
    }
  };

  useEffect(() => {
    if (crewId) {
      fetchCreDetailById(crewId);
    }
  }, [crewId]);

  // A helper function to render a read-only field
  const renderViewField = (label, value) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.5 }}>
        {value || "N/A"}
      </Typography>
    </Grid>
  );

  const renderBasicTab = () => (
    <Box p={2}>
      <Grid container spacing={2}>
        {renderViewField("Full Name", crewDetail?.fullName)}
        {renderViewField("Display Name", crewDetail?.displayName)}
        {renderViewField("Crew ID", crewDetail?.crewId)}

        {renderViewField("Gender", crewDetail?.gender)}
        {renderViewField(
          "Date of Birth",
          crewDetail?.dateOfBirth
            ? moment(crewDetail.dateOfBirth).format("DD-MM-YYYY")
            : "N/A"
        )}
        {renderViewField("Designation", crewDetail?.designation)}
        {renderViewField("Location", crewDetail?.location)}
        {renderViewField("Phone", crewDetail?.phone)}
        {renderViewField("Email", crewDetail?.email)}
        {renderViewField("Alternate Contact", crewDetail?.alternateContact)}
        {renderViewField("Education", crewDetail?.education)}
        {renderViewField("Experience", crewDetail?.experience)}
        {renderViewField("Marital Status", crewDetail?.martialStatus)}
        {renderViewField(
          "Anniversary Date",
          crewDetail?.anniversaryDate
            ? moment(crewDetail.anniversaryDate).format("DD-MM-YYYY")
            : "N/A"
        )}
        {renderViewField("Religion", crewDetail?.religion)}
        {renderViewField("Nationality", crewDetail?.nationality)}
        {renderViewField("Aadhar", crewDetail?.aadhar)}
        {renderViewField("PAN", crewDetail?.pan)}
        {renderViewField("Passport No", crewDetail?.passportNo)}
        {renderViewField("Current Address", crewDetail?.currentAddress)}
        {renderViewField("Permanent Address", crewDetail?.permanentAddress)}
        {renderViewField("Blood Group", crewDetail?.bloodGroup)}
      </Grid>
    </Box>
  );

  const renderNomineeTab = () => (
    <Box p={2}>
      {crewDetail && crewDetail?.nominees?.length > 0 ? (
        crewDetail.nominees.map((nominee, index) => (
          <Card key={index} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight="bold" mb={1}>
              Nominee {index + 1}
            </Typography>
            <Grid container spacing={2}>
              {renderViewField("Full Name", nominee.fullName)}
              {renderViewField("Gender", nominee.gender)}
              {renderViewField("Relation", nominee.relation)}
              {renderViewField("Mobile Number", nominee.mobileNumber)}
              {renderViewField("Alternate Contact", nominee.alternateContact)}
              {renderViewField("Address", nominee.address)}
              {/* You might want to display a link or button to view the uploaded proof */}
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  ID Proof
                </Typography>
                {nominee.idProof && (
                  <a
                    href={`${apiBaseUrl}${nominee.idProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Insurance
                </Typography>
                {nominee.insurance && (
                  <a
                    href={`${apiBaseUrl}${nominee.insurance}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                )}
              </Grid>
            </Grid>
          </Card>
        ))
      ) : (
        <Typography>No nominee details available.</Typography>
      )}
    </Box>
  );

  const renderCertificateTab = () => (
    <Box p={2}>
      {crewDetail && crewDetail?.certifications?.length > 0 ? (
        crewDetail.certifications.map((cert, index) => (
          <Card key={index} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight="bold" mb={1}>
              Certificate {index + 1}
            </Typography>
            <Grid container spacing={2}>
              {renderViewField("Name", cert.name)}
              {renderViewField("Licence No", cert.licenceNo)}
              {renderViewField(
                "Date of Issue",
                cert.dateOfIssue
                  ? moment(cert.dateOfIssue).format("DD-MM-YYYY")
                  : "N/A"
              )}
              {renderViewField(
                "Valid Till",
                cert.validTill
                  ? moment(cert.validTill).format("DD-MM-YYYY")
                  : "N/A"
              )}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Issued By
                </Typography>
                {cert.issuedBy && (
                  <a
                    href={`${apiBaseUrl}${cert.issuedBy}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                )}
              </Grid>
            </Grid>
          </Card>
        ))
      ) : (
        <Typography>No certificate details available.</Typography>
      )}
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} md={3}>
        <Card sx={{ p: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            {/* Display profile picture from fetched data */}
            {crewDetail?.profile && (
              <Avatar
                alt="Profile"
                src={`${apiBaseUrl}${crewDetail.profile}`}
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2, // Add some margin bottom for spacing
                }}
              />
            )}
            <Typography mt={2}>{crewDetail?.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {crewDetail?.roles?.[0]?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {crewDetail?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {crewDetail?.phone}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List component="nav">
            {["Basic", "Nominee", "Certificate"].map((label, index) => (
              <ListItemButton
                selected={tab === index}
                onClick={() => setTab(index)}
                key={label}
                sx={{
                  color: tab === index ? "primary.main" : "text.primary",
                  backgroundColor:
                    tab === index ? "rgba(25, 118, 210, 0.1)" : "transparent",
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
                }}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      sx={{
                        color: tab === index ? "primary.main" : "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <Card sx={{ p: 2 }}>
          {tab === 0 && renderBasicTab()}
          {tab === 1 && renderNomineeTab()}
          {tab === 2 && renderCertificateTab()}
        </Card>
      </Grid>
    </Grid>
  );
};
