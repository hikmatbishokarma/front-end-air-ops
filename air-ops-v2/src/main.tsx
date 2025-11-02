import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Layout from "./layouts/dashboard";
import DashboardPage from "./pages";

import RoleControllerPage from "@/pages/RoleControllerPage";

import UserControllerPage from "@/pages/UserControllerPage";
import { UserProfile } from "@/pages/settings/profile";
import ChangePassword from "@/pages/settings/change-password";

import AircraftControllerPage from "@/pages/AircraftControllerPage";
import AirportControllerPage from "@/pages/AirportControllerPage";
import Login from "@/pages/login";

import SecurityControllerPage from "@/pages/SecurityControllerPage";
import CrewControllerPage from "@/pages/CrewControllerPage";
import AccountControllerPage from "@/pages/AccountControllerPage";
import AuditControllerPage from "@/pages/AuditControllerPage";
import CamoControllerPage from "@/pages/CamoControllerPage";
import EngineeringControllerPage from "@/pages/EngineeringControllerPage";
import TrainingControllerPage from "@/pages/TrainingControllerPage";

import OperatorControllerPage from "@/pages/OperatorControllerPage";

import "../src/Asset/Images/Versionstyle.css";
import { LeaveRequest } from "@/features/leave/pages/LeaveRequestPage";

import TripConfirmationCalenderView from "@/features/ops/calendar/TripConfirmation";
import StaffLeaveCalenderView from "@/features/ops/calendar/LeaveCalender";
import { LibraryControllerPage } from "@/pages/LibraryControllerPage";

import TripDetailPage from "@/features/ops/trip/TripDetailPage";

import PassengerEditPage from "@/shared/components/passenger/PassengerEdit";
import QuoteControllerPage from "@/pages/QuoteControllerPage";
import {
  QuoteEdit,
  QuoteCreate,
  SalesConfirmationPreview,
} from "@/features/quotes";
import SaleConfirmationPreviewPage from "@/features/quotes/pages/SalesConfirmationPreview";
import OpsControllerPage from "@/pages/OpsControllerPage";
import ManualControllerPage from "@/pages/ManualControllerPage";
import Landingpage from "./pages/landingpage/landingpage";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "",
            Component: DashboardPage,
            //Component: DashboardIndex,
          },

          {
            path: "quotes",
            // Component: SalesDashboard,
            Component: QuoteControllerPage,
          },

          {
            path: "operations",
            // Component: OpsDashboard,
            Component: OpsControllerPage,
          },
          {
            path: "security",
            Component: SecurityControllerPage,
          },
          {
            path: "library",
            // Component: LibraryDashboard,
            Component: LibraryControllerPage,
          },
          {
            path: "camo",
            Component: CamoControllerPage,
          },
          {
            path: "engineering",
            Component: EngineeringControllerPage,
          },
          {
            path: "crew",
            Component: CrewControllerPage,
          },
          {
            path: "training-sales",
            Component: TrainingControllerPage,
          },
          {
            path: "manuals",
            // Component: ManualsDashboard,
            Component: ManualControllerPage,
          },
          {
            path: "accounts",
            Component: AccountControllerPage,
          },
          {
            path: "audit",
            Component: AuditControllerPage,
          },
          // {
          //   path: "admin/category",
          //   Component: AircraftCategoryList,
          // },
          {
            path: "admin/aircraft",
            Component: AircraftControllerPage,
          },
          {
            path: "admin/airports",
            Component: AirportControllerPage,
          },
          // {
          //   path: "flight-form",
          //   Component: PriceCreate,
          // },
          // {
          //   path: "quotes",
          //   Component: QuoteList,
          // },
          {
            path: "quotes/edit/:id",
            Component: QuoteEdit,
          },
          {
            path: "quotes/create",

            Component: QuoteCreate,
          },
          // {
          //   path: "prices",
          //   Component: PriceList,
          // },
          // {
          //   path: "prices/edit/:id",
          //   Component: PriceEdit,
          // },
          {
            path: "admin/roles",
            Component: RoleControllerPage,
          },
          {
            path: "admin/users",
            Component: UserControllerPage,
          },
          // {
          //   path: "admin/users/create",
          //   Component: UserCreate,
          // },
          {
            path: "admin/operators",
            Component: OperatorControllerPage,
          },
          {
            path: "settings/profile",
            Component: UserProfile,
          },
          {
            path: "settings/leave",
            Component: LeaveRequest,
          },
          {
            path: "settings/change-password",
            Component: ChangePassword,
          },
          // {
          //   path: "invoices/preview",
          //   Component: GenerateInvoice,
          // },
          {
            path: "trip-confirmation/calender",
            Component: TripConfirmationCalenderView,
          },
          {
            path: "staff-leave/calender",
            Component: StaffLeaveCalenderView,
          },

          // {
          //   path: "passenger-details",
          //   Component: AviationNSOPForm,
          // },

          {
            path: "trip-detail/:tripId",
            Component: TripDetailPage,
          },
          {
            path: "sales-confirmation-preview/:quotationNo",
            Component: SaleConfirmationPreviewPage,
          },
          {
            path: "passenger-detail/:quotationNo",
            Component: PassengerEditPage,
          },
        ],
      },

      {
        path: "/login",
        // Component: Login,
        Component: Login,
      },
      {
        path: "landingpage",
        Component: Landingpage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
