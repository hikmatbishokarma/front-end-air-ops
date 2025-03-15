import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Navigation, Session } from "@toolpad/core/AppProvider";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import {
  Flight,
  ManageAccounts,
  PriceChange,
  RequestQuote,
  Engineering,
  Medication,
  Person,
  Handyman,
  Settings,
} from "@mui/icons-material";
import logoPhn from "./Asset/images/logo_phn.png";
import { ISession, SessionProvider } from "./SessionContext";
import { SnackbarProvider } from "./SnackbarContext";

export const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    segment: "/",
    icon: <DashboardIcon />,
  },
  {
    segment: "quotes",
    title: "Requests/Quotes",
    icon: <RequestQuote />,
  },

  {
    segment: "category",
    title: "Category",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "aircraft",
    title: "Aircraft Detail",
    icon: <ShoppingCartIcon />,
  },
  // {
  //   segment: "prices",
  //   title: "Prices",
  //   icon: <PriceChange />,
  // },

  {
    segment: "operations",
    title: "Operations",
    icon: <Handyman />,
  },
  {
    segment: "users",
    title: "Users",
    icon: <Person />,
  },

  {
    segment: "roles",
    title: "Role",
    icon: <ManageAccounts />,
  },
  {
    segment: "settings",
    title: "Setting",
    icon: <Settings />,
    children: [
      {
        segment: "profile",
        title: "Profile",
        icon: <Person />,
      },
      {
        segment: "change-password",
        title: "Change Password",
        icon: <Person />,
      },
    ],
  },
];

const BRANDING = {
  logo: <img src={logoPhn} alt="" />,
  title: "",
};

export default function App() {
  const [session, setSession] = React.useState<ISession | null>(null);
  const navigate = useNavigate();
  const [validNavigation, setValidNavigation] = React.useState<Navigation>([]);

  React.useEffect(() => {
    console.log("session::!11", session);
    if (session) {
      const accessResources = session?.user?.role?.accessPermissions?.map(
        (item) => item.resource,
      );

      if (accessResources && accessResources.length > 0) {
        NAVIGATION.forEach((item: any) => {
          if (accessResources.includes(item.segment) || item.kind) {
            return item;
          }
        });

        const filteredNavigation = NAVIGATION.filter(
          (item: any) => accessResources.includes(item.segment) || item.kind,
        );
        setValidNavigation(filteredNavigation);
      }
    }
  }, [session]);

  const signIn = React.useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    navigate("/sign-in");
  }, [navigate]);

  const sessionContextValue = React.useMemo(
    () => ({ session, setSession }),
    [session, setSession],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <SessionContext.Provider value={sessionContextValue}> */}
      <SessionProvider>
        <SnackbarProvider>
          <ReactRouterAppProvider
            navigation={NAVIGATION}
            // navigation={validNavigation}
            branding={BRANDING}
            session={session}
            authentication={{ signIn, signOut }}
          >
            <Outlet />
          </ReactRouterAppProvider>
        </SnackbarProvider>
      </SessionProvider>
      {/* </SessionContext.Provider> */}
    </ThemeProvider>
  );
}
