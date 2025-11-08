import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import type { Navigation, Session } from "@toolpad/core/AppProvider";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
//import "../src/index.css";
// import "../dist/assets/styleview.css";
import "../src/Asset/Images/Versionstyle.css";

import {
  ManageAccounts,
  Person,
  Handyman,
  Settings,
  AccountBalance,
} from "@mui/icons-material";

import { SessionProvider, SnackbarProvider } from "./app/providers";

import AppWithSession from "./AppWithSession";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SessionProvider>
        <SnackbarProvider>
          <AppWithSession />
        </SnackbarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
