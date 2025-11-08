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

const getCrewDetails = (id: string) => {
  return {
    name:
      {
        c1: "Capt. Arjun Mehta",
        c3: "Lara Sharma",
        c4: "Ravi Kumar",
        c6: "Manoj Pillai",
        c7: "Vivek Rao",
      }[id] ?? id,
    email: {
      c1: "arjun.mehta@airops.in",
      c3: "lara.sharma@airops.in",
      c4: "ravi.kumar@airops.in",
      c6: "manoj.pillai@airops.in",
      c7: "vivek.rao@airops.in",
    }[id],
    photo: null,
  };
};

const CrewTab: React.FC<{ sector: Sector; currentUserId: string }> = ({
  sector,
  currentUserId,
}) => {
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
                const user = getCrewDetails(crewId);
                const initials = user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("");

                return (
                  <Stack key={crewId}>
                    <ListItem sx={{ px: 0, py: 0.8 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={user.photo || undefined}
                          sx={{
                            bgcolor: user.photo ? undefined : "#7C8CE0",
                            width: 38,
                            height: 38,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {!user.photo && initials}
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
