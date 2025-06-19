import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Outlet, Navigate, useLocation } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Account } from "@toolpad/core/Account";
import { useSession } from "../SessionContext";
import { Box } from "@mui/material";

function CustomAccount() {
  return (
    <Account
      slotProps={{
        preview: { slotProps: { avatarIconButton: { sx: { border: "0" } } } },
      }}
    />
  );
}

export default function Layout() {
  const { session, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <LinearProgress />
      </div>
    );
  }

  if (!session) {
    const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
    // const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ddd", // Light gray background
        padding: 2, // Optional
      }}
    >
      <DashboardLayout slots={{ toolbarAccount: CustomAccount }}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </Box>
  );
}
