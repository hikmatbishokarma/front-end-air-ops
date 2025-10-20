import React from "react";
import { Grid, Typography, Button, Card, CardContent } from "@mui/material";
import cardflightview from "../Asset/Images/ATS-F-1.png";
import { IStatCard } from "../interfaces/common.interface";

interface StatCardProps {
  selectedTab: string;
  categories: IStatCard[];
  statData: any;
  onCreate?: (tab: string) => void;
  handleStatCardSelect?: (item: IStatCard) => void;
  createEnabledTabs?: string[];
  singularMap?: { [key: string]: string }; // Make this prop optional
}

const StatCard: React.FC<StatCardProps> = ({
  selectedTab,
  categories,
  statData,
  onCreate = () => {}, // Provide an empty default function
  handleStatCardSelect = () => {}, // Provide an empty default function
  createEnabledTabs = [],
  singularMap = {}, // Provide an empty default object
}) => {
  return (
    <div className="dashboard_main_d">
      <div className="ban_img"></div>

      <div style={{ padding: 20 }} className="v1_board">
        {/* Table Header Section */}
        <Grid
          className="pt-board"
          container
          justifyContent="space-between"
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          <Typography className="v1_h6" variant="h6">
            {selectedTab.toUpperCase()}
          </Typography>
          {createEnabledTabs.includes(selectedTab) && (
            <Button
              className="v1_quote_btn"
              variant="contained"
              color="primary"
              onClick={() => onCreate(selectedTab)}
            >
              Create {singularMap[selectedTab] || selectedTab}
            </Button>
          )}
        </Grid>

        {/* Cards Section */}
        <Grid container spacing={2}>
          {categories.map((item) => (
            <Grid item xs={3} key={item.name}>
              <Card
                onClick={() => handleStatCardSelect(item)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedTab === item.name ? "#001551" : "#fff",
                  color: selectedTab === item.name ? "#fff" : "#000",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <div className="card-fligh-label">
                    <Typography className="v1-card-h6" variant="h6">
                      {item.name.toUpperCase()}
                    </Typography>
                    <Typography variant="body1">
                      {statData?.summary?.[item.countLabel] ?? 0}
                    </Typography>
                    <div className="img-flight-label">
                      <img src={cardflightview} alt="Company Logo" width={75} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default StatCard;
