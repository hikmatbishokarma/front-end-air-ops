import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Navigation } from "@toolpad/core/AppProvider";

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
  AccountBalance,
} from "@mui/icons-material";
import logoPhn from "./Asset/images/logo_phn.png";

import { useSession } from "./SessionContext"; // import your hook
import { set } from "react-hook-form";

export const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Quotes",
    segment: "",
    icon: <DashboardIcon />,
  },
  // {
  //   segment: "quotes",
  //   title: "Requests/Quotes",
  //   icon: <RequestQuote />,
  // },

  {
    segment: "operations",
    title: "Ops",
    icon: <Handyman />,
  },
  {
    segment: "security",
    title: "Security",
    icon: <Handyman />,
  },

  {
    segment: "camo",
    title: "CAMO",
    icon: <Person />,
  },

  {
    segment: "engineering",
    title: "Engineering",
    icon: <Person />,
  },

  {
    segment: "crew",
    title: "CREW",
    icon: <Person />,
  },

  {
    segment: "training-sales",
    title: "Training & Sales",
    icon: <Person />,
  },
  {
    segment: "manuals",
    title: "Manuals",
    icon: <Person />,
  },

  {
    segment: "accounts",
    title: "Accounts",
    icon: <AccountBalance />,
  },

  {
    segment: "audit",
    title: "Audit",
    icon: <Person />,
  },

  // {
  //   segment: "roles",
  //   title: "Role",
  //   icon: <ManageAccounts />,
  // },

  {
    segment: "admin",
    title: "Admin",
    icon: <Settings />,
    children: [
      {
        segment: "roles",
        title: "Role",
        icon: <ManageAccounts />,
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
      {
        segment: "airports",
        title: "Airports",
        icon: <ShoppingCartIcon />,
      },
      {
        segment: "users",
        title: "Users",
        icon: <Person />,
      },
      {
        segment: "agents",
        title: "Agents",
        icon: <Person />,
      },
    ],
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

export default function AppWithSession() {
  const { session, setSession, loading } = useSession();

  console.log("session111", session);

  const navigate = useNavigate();
  const [validNavigation, setValidNavigation] = React.useState<Navigation>([]);
  const [branding, setBranding] = React.useState<{
    logo: JSX.Element;
    title: string;
  } | null>(null);

  // React.useEffect(() => {

  React.useEffect(() => {
    if (loading) return; // Don't run until session is loaded

    if (session) {
      const logoImg = session?.user?.agent?.companyLogo ? (
        <img
          src={`https://airops.in/${session.user.agent.companyLogo}`}
          alt=""
        />
      ) : (
        <img src={logoPhn} alt="" />
      );

      const updatedBranding = {
        logo: logoImg,
        title: "", // or session.user.agent.companyName
      };

      setBranding(updatedBranding);

      // const accessResources = session.user?.role?.accessPermissions?.map(
      //   (item) => item.resource
      // );

      const accessResources = session.user?.permissions?.map(
        (item) => item.resource
      );

      if (accessResources && accessResources.length > 0) {
        const filteredNavigation = NAVIGATION.filter(
          (item: any) => accessResources.includes(item.segment) || item.kind
        );
        setValidNavigation(filteredNavigation);
      }
    }
  }, [session, loading]);

  const signIn = React.useCallback(() => {
    // navigate("/sign-in");
    navigate("/login");
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    // navigate("/sign-in");
    navigate("/login");
  }, [navigate]);

  console.log("branding", branding);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      // navigation={validNavigation}
      // branding={BRANDING}
      branding={branding}
      session={session}
      authentication={{ signIn, signOut }}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
