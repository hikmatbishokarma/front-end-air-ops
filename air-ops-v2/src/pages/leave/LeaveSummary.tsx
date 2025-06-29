import React from "react";
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";

const iconMap: Record<string, React.ReactNode> = {
  Casual: <BeachAccessIcon color="primary" />,
  Sick: <LocalHospitalIcon color="error" />,
  Privilege: <EmojiEventsIcon color="warning" />,
  Marriage: <FavoriteIcon color="secondary" />,
  Paternity: <FamilyRestroomIcon color="secondary" />,
};

type SummaryItem = {
  type: string;
  used: number;
  total: number;
};

type LeaveSummaryProps = {
  data: SummaryItem[];
};

const LeaveSummary: React.FC<LeaveSummaryProps> = ({ data }) => {
  return (
    <Grid container spacing={2} mb={2}>
      {data.map((item) => (
        <Grid item xs={6} md={2.3} key={item.type}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                {iconMap[item.type] || <BeachAccessIcon />}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {item.type} Leave
                  </Typography>
                  <Typography variant="h6">
                    {item.used}/{item.total}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LeaveSummary;
