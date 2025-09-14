// src/components/DashboardTabs.jsx

import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const DashboardTabs = ({ tabsData, selectedTab, onTabChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }} className="security_tabs_filter">
      <Tabs
        value={selectedTab}
        onChange={onTabChange}
        aria-label="data filter tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabsData.map((item) => (
          <Tab
            key={item.label}
            label={item.label}
            value={item.value}
            sx={{ textTransform: "none" }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default DashboardTabs;
