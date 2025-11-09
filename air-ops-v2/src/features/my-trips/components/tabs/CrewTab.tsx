import React from "react";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import { Sector } from "../../types/sector";

const CrewTab: React.FC<{ sector: Sector; currentUserId: string }> = ({
  sector,
  currentUserId,
}) => {
  // Get crew details from sector.crewDetails or fallback to empty object
  const crewDetails = sector.crewDetails || {};

  return (
    <Box sx={{ maxWidth: 520, pl: 1 }}>
      {sector.assignedCrews.map((group) => {
        if (!group.crews.length) return null;

        return (
          <Box key={group.designation}>
            {/* subtle group label */}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 3,
                mb: 1,
                color: "#888",
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              {group.designation.replace("_", " ")}
            </Typography>

            <List disablePadding>
              {group.crews.map((crewId, i) => {
                const user = crewDetails[crewId];

                // Fallback if crew details not found
                if (!user) {
                  return (
                    <Stack key={crewId}>
                      <ListItem sx={{ px: 0, py: 0.8 }}>
                        <ListItemText
                          primary={
                            <Typography fontWeight={600} fontSize={15}>
                              {crewId}
                              {crewId === currentUserId && (
                                <Typography
                                  component="span"
                                  fontWeight={400}
                                  fontSize={13}
                                  color="#777"
                                >
                                  {" "}
                                  (You)
                                </Typography>
                              )}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {i < group.crews.length - 1 && (
                        <Divider sx={{ ml: 6, my: 0.5 }} />
                      )}
                    </Stack>
                  );
                }

                const initials = user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <Stack key={crewId}>
                    <ListItem sx={{ px: 0, py: 0.8 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={user.profile || undefined}
                          sx={{
                            bgcolor: user.profile ? undefined : "#7C8CE0",
                            width: 38,
                            height: 38,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {!user.profile && initials}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography fontWeight={600} fontSize={15}>
                            {user.name}{" "}
                            {crewId === currentUserId && (
                              <Typography
                                component="span"
                                fontWeight={400}
                                fontSize={13}
                                color="#777"
                              >
                                (You)
                              </Typography>
                            )}
                          </Typography>
                        }
                        secondary={
                          <Typography fontSize={13} color="text.secondary">
                            {user.email}
                          </Typography>
                        }
                      />
                    </ListItem>

                    {i < group.crews.length - 1 && (
                      <Divider sx={{ ml: 6, my: 0.5 }} />
                    )}
                  </Stack>
                );
              })}
            </List>
          </Box>
        );
      })}
    </Box>
  );
};

export default CrewTab;
