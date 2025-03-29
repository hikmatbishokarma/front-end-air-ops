import React from "react";

import { Typography } from "@mui/material";
import SalesDashboard from "./SalesDashboard";

// Mock role (Replace with actual role management logic)
const userRole = "sales"; // Example: "user", "admin", etc.

const DashboardIndex = () => {
  return (
    <div>
      {userRole === "sales" ? (
        <SalesDashboard />
      ) : userRole === "admin" ? (
        <Typography variant="h6">Coming soon</Typography>
      ) : (
        <Typography variant="h6">Unauthorized Access</Typography>
      )}
    </div>
  );
};

export default DashboardIndex;
