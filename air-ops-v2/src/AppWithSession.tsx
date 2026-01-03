import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Navigation } from "@toolpad/core/AppProvider";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";

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
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import logoPhn from "./Asset/images/logo_phn.png";

import { useSession } from "./app/providers"; // import your hook
const cloudfrontBaseUrl =
  import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/";

import AirplaneTicketOutlineIcon from "@mui/icons-material/AirplaneTicketOutlined";
import FactCheckOutlineIcon from "@mui/icons-material/FactCheckOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import AirlinesOutlinedIcon from "@mui/icons-material/AirlinesOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import ExposureOutlinedIcon from "@mui/icons-material/ExposureOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import SensorOccupiedOutlinedIcon from "@mui/icons-material/SensorOccupiedOutlined";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
// Email: srikar_13@yahoo.co.uk
// Temporary Password: 5v11FUQE

export const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  // {
  //   title: "Dashboard",
  //   segment: "app",
  //   icon: <LaptopMacOutlinedIcon />,
  // },
  {
    title: "Quotations",
    segment: "app/quotes",
    icon: <AirplaneTicketOutlineIcon />,
  },
  // {
  //   segment: "quotes",
  //   title: "Requests/Quotes",
  //   icon: <RequestQuote />,
  // },

  {
    segment: "app/operations",
    title: "Ops",
    icon: <FactCheckOutlineIcon />,
  },
  {
    segment: "app/my-trips",
    title: "Trips",
    icon: <LuggageOutlinedIcon />,
  },
  {
    segment: "app/security",
    title: "Security",
    icon: <PrivacyTipOutlinedIcon />,
  },
  {
    segment: "app/library",
    title: "Library",
    icon: <LocalLibraryOutlinedIcon />,
  },
  {
    segment: "app/camo",
    title: "CAMO",
    icon: <AirlinesOutlinedIcon />,
  },

  {
    segment: "app/engineering",
    title: "Engineering",
    icon: <EngineeringOutlinedIcon />,
  },

  {
    segment: "app/crew",
    title: "Crew",
    icon: <BadgeOutlinedIcon />,
  },

  {
    segment: "app/training-sales",
    title: "Training",
    icon: <AutoStoriesOutlinedIcon />,
  },
  {
    segment: "app/manuals",
    title: "Manuals",
    icon: <SourceOutlinedIcon />,
  },

  {
    segment: "app/accounts",
    title: "Accounts",
    icon: <ExposureOutlinedIcon />,
  },

  {
    segment: "app/audit",
    title: "Audit",
    icon: <QueryStatsOutlinedIcon />,
  },

  {
    segment: "app/notams",
    title: "Notam",
    icon: <QueryStatsOutlinedIcon />,
  },

  // {
  //   segment: "roles",
  //   title: "Role",
  //   icon: <ManageAccounts />,
  // },

  {
    segment: "app/admin",
    title: "Admin",
    icon: <AdminPanelSettingsOutlined />,
    children: [
      {
        segment: "roles",
        title: "Role",
        icon: <ManageAccounts />,
      },

      // {
      //   segment: "app/admin/category",
      //   title: "Category",
      //   icon: <ShoppingCartIcon />,
      // },
      {
        segment: "aircraft",
        title: "Aircraft Detail",
        icon: <RocketLaunchRoundedIcon />,
      },
      {
        segment: "airports",
        title: "Airports",
        icon: <LocalAirportIcon />,
      },
      // {
      //   segment: "users",
      //   title: "Users",
      //   icon: <Person />,
      // },
      {
        segment: "operators",
        title: "Operators",
        icon: <SensorOccupiedOutlinedIcon />,
      },
      {
        segment: "support-ticket",
        title: "Support Ticket",
        icon: <LocalActivityOutlinedIcon />,
      },
      {
        segment: "notice-board",
        title: "Notice Board",
        icon: <CampaignIcon />,
      },
    ],
  },
  {
    segment: "app/settings",
    title: "Settings",
    icon: <SettingsOutlinedIcon />,
    children: [
      {
        segment: "profile",
        title: "Profile",
        icon: <AccountCircleOutlinedIcon />,
      },
      {
        segment: "leave",
        title: "Leave",
        icon: <BeachAccessOutlinedIcon />,
      },
      {
        segment: "change-password",
        title: "Change Password",
        icon: <PasswordOutlinedIcon />,
      },
    ],
  },

  {
    segment: "my-tickets",
    title: "My Ticket",
    icon: <LocalActivityOutlinedIcon />,
  },
];

const defaultNavigation: Navigation = [
  {
    title: "Dashboard",
    segment: "app",
    icon: <LaptopMacOutlinedIcon />,
  },
];

const BRANDING = {
  logo: <img src={logoPhn} alt="" />,
  title: "",
};

export default function AppWithSession() {
  const { session, setSession, loading } = useSession();

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
      const logoImg = session?.user?.operator?.companyLogo ? (
        <img src={`${cloudfrontBaseUrl}${session.user.operator.companyLogo}`} alt="" />
      ) : (
        <img src={logoPhn} alt="" />
      );

      const updatedBranding = {
        logo: logoImg,
        title: "", // or session.user.agent.companyName
      };

      setBranding(updatedBranding);

      const accessResources = session.user?.permissions?.map(
        (item: any) => item.resource
      );

      if (accessResources && accessResources.length > 0) {
        // const filterNavigation = (item: any) => {
        //   // Check if the main item matches
        //   if (accessResources.includes(item.segment) || item.kind) {
        //     return true;
        //   }

        //   // If the item has children, recursively check the children
        //   if (item.children && item.children.length > 0) {
        //     const filteredChildren = item.children.filter(
        //       (child: any) =>
        //         accessResources.includes(child.segment) || child.kind
        //     );

        //     // If there are any valid children, keep this item
        //     return filteredChildren.length > 0;
        //   }

        //   // If no match found in the item or its children
        //   return false;
        // };

        const filterNavigation = (item: any) => {
          // Always include header items
          if (item.kind === "header") {
            return true;
          }

          // Extract resource from segment for permission checking
          // Segments are now like "app/quotes", "app/admin/aircraft", etc.
          let segmentForPermission = item.segment || "";
          if (segmentForPermission.startsWith("app/")) {
            segmentForPermission = segmentForPermission.replace("app/", "");
          }
          if (segmentForPermission === "app") {
            segmentForPermission = ""; // Dashboard
          }

          // For parent segments like "admin" or "settings", check parent permission
          // For child segments like "admin/aircraft", extract the child resource
          const parts = segmentForPermission.split("/");
          let resourceToCheck = segmentForPermission;

          if (parts.length > 1) {
            // For nested routes like "admin/aircraft", check the child resource "aircraft"
            resourceToCheck = parts[parts.length - 1];
          }

          // Check if the main item's segment matches
          const hasDirectAccess =
            segmentForPermission === ""
              ? true // Dashboard is accessible to all logged-in users
              : accessResources.includes(resourceToCheck);

          // If the item has children, recursively filter them
          if (item.children && item.children.length > 0) {
            const filteredChildren = item.children.filter((child: any) => {
              // Extract resource from child segment
              let childSegment = child.segment || "";
              if (childSegment.startsWith("app/")) {
                childSegment = childSegment.replace("app/", "");
              }
              // For nested routes like "app/admin/aircraft", extract "aircraft"
              const childParts = childSegment.split("/");
              const resource =
                childParts.length > 1
                  ? childParts[childParts.length - 1]
                  : childSegment;
              return accessResources.includes(resource);
            });

            // If there are any valid children, update the item's children and include the parent
            if (filteredChildren.length > 0) {
              item.children = filteredChildren; // Update the children of the current item
              return true; // Include the parent if it has any valid children
            }
          }

          // Include the item if it has direct access or if it had filtered children
          return hasDirectAccess;
        };

        const filteredNavigation = NAVIGATION.filter(filterNavigation);

        setValidNavigation([...defaultNavigation, ...filteredNavigation]);
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

  return (
    <ReactRouterAppProvider
      // navigation={NAVIGATION}
      navigation={validNavigation}
      // branding={BRANDING}
      branding={branding}
      session={session}
      authentication={{ signIn, signOut }}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
