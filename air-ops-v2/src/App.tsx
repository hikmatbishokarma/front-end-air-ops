import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import type { Navigation, Session } from "@toolpad/core/AppProvider";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import {
  ManageAccounts,
  Person,
  Handyman,
  Settings,
  AccountBalance,
} from "@mui/icons-material";
import logoPhn from "./Asset/images/logo_phn.png";
import { SessionProvider } from "./SessionContext";
import { SnackbarProvider } from "./SnackbarContext";

import AppWithSession from "./AppWithSession";

// export const NAVIGATION: Navigation = [
//   {
//     kind: "header",
//     title: "Main items",
//   },
//   {
//     title: "Quotes",
//     segment: "",
//     icon: <DashboardIcon />,
//   },
//   // {
//   //   segment: "quotes",
//   //   title: "Requests/Quotes",
//   //   icon: <RequestQuote />,
//   // },

//   {
//     segment: "operations",
//     title: "Ops",
//     icon: <Handyman />,
//   },
//   {
//     segment: "security",
//     title: "Security",
//     icon: <Handyman />,
//   },

//   {
//     segment: "camo",
//     title: "CAMO",
//     icon: <Person />,
//   },

//   {
//     segment: "engineering",
//     title: "Engineering",
//     icon: <Person />,
//   },

//   {
//     segment: "crew",
//     title: "CREW",
//     icon: <Person />,
//   },

//   {
//     segment: "training-sales",
//     title: "Training & Sales",
//     icon: <Person />,
//   },
//   {
//     segment: "manuals",
//     title: "Manuals",
//     icon: <Person />,
//   },

//   {
//     segment: "accounts",
//     title: "Accounts",
//     icon: <AccountBalance />,
//   },

//   {
//     segment: "audit",
//     title: "Audit",
//     icon: <Person />,
//   },

//   // {
//   //   segment: "roles",
//   //   title: "Role",
//   //   icon: <ManageAccounts />,
//   // },

//   {
//     segment: "admin",
//     title: "Admin",
//     icon: <Settings />,
//     children: [
//       {
//         segment: "roles",
//         title: "Role",
//         icon: <ManageAccounts />,
//       },

//       {
//         segment: "category",
//         title: "Category",
//         icon: <ShoppingCartIcon />,
//       },
//       {
//         segment: "aircraft",
//         title: "Aircraft Detail",
//         icon: <ShoppingCartIcon />,
//       },
//       {
//         segment: "airports",
//         title: "Airports",
//         icon: <ShoppingCartIcon />,
//       },
//       {
//         segment: "users",
//         title: "Users",
//         icon: <Person />,
//       },
//     ],
//   },
//   {
//     segment: "settings",
//     title: "Setting",
//     icon: <Settings />,
//     children: [
//       {
//         segment: "profile",
//         title: "Profile",
//         icon: <Person />,
//       },
//       {
//         segment: "change-password",
//         title: "Change Password",
//         icon: <Person />,
//       },
//     ],
//   },
// ];

// const BRANDING = {
//   logo: <img src={logoPhn} alt="" />,
//   title: "",
// };

export default function App() {
  // // const [session, setSession] = React.useState<ISession | null>(null);
  // const { session, loading } = useSession();

  // const navigate = useNavigate();
  // const [validNavigation, setValidNavigation] = React.useState<Navigation>([]);

  // // React.useEffect(() => {
  // //   console.log("session::!11", session);
  // //   if (session) {
  // //     const accessResources = session?.user?.role?.accessPermissions?.map(
  // //       (item) => item.resource
  // //     );

  // //     if (accessResources && accessResources.length > 0) {
  // //       // NAVIGATION.forEach((item: any) => {
  // //       //   if (accessResources.includes(item.segment) || item.kind) {
  // //       //     return item;
  // //       //   }
  // //       // });

  // //       const filteredNavigation = NAVIGATION.filter(
  // //         (item: any) => accessResources.includes(item.segment) || item.kind
  // //       );
  // //       setValidNavigation(filteredNavigation);
  // //     }
  // //   }
  // // }, [session]);

  // React.useEffect(() => {
  //   if (loading) return; // Don't run until session is loaded

  //   console.log("session::!11", session);

  //   if (session) {
  //     const accessResources = session.user?.role?.accessPermissions?.map(
  //       (item) => item.resource
  //     );

  //     if (accessResources && accessResources.length > 0) {
  //       const filteredNavigation = NAVIGATION.filter(
  //         (item) => accessResources.includes(item.segment) || item.kind
  //       );
  //       setValidNavigation(filteredNavigation);
  //     }
  //   }
  // }, [session, loading]);

  // const signIn = React.useCallback(() => {
  //   // navigate("/sign-in");
  //   navigate("/login");
  // }, [navigate]);

  // const signOut = React.useCallback(() => {
  //   setSession(null);
  //   // navigate("/sign-in");
  //   navigate("/login");
  // }, [navigate]);

  // const sessionContextValue = React.useMemo(
  //   () => ({ session, setSession }),
  //   [session, setSession]
  // );

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
