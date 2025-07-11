import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Outlet, Navigate, useLocation } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Account } from "@toolpad/core/Account";
import { useSession } from "../SessionContext";
import { Box } from "@mui/material";
import { ClockCompact } from "../components/Clock";

// function CustomAccount() {
//   return (
//     <Account
//       slotProps={{
//         preview: { slotProps: { avatarIconButton: { sx: { border: "0" } } } },
//       }}
//     />
//   );
// }

function CustomAccount() {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <ClockCompact /> {/* Clock on the left */}
      <Account
        slotProps={{
          preview: { slotProps: { avatarIconButton: { sx: { border: "0" } } } },
        }}
      />
    </Box>
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
      {/* <DashboardLayout slots={{ toolbarAccount: CustomAccount }}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout> */}
      {/* <DashboardLayout slots={{ toolbarAccount: CustomAccount }}>
        <Outlet />
      </DashboardLayout> */}
      <DashboardLayout
        slots={{ toolbarAccount: CustomAccount }}
        sx={{
          "& .MuiBreadcrumbs-root": { display: "none" },
          "& h4.MuiTypography-root": { display: "none" },
        }}
      >
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </Box>
  );
}
