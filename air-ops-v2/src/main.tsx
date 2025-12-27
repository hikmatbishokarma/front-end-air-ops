import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Layout from "./layouts/dashboard";
import DashboardPage from "./pages";

import RoleControllerPage from "@/pages/RoleControllerPage";
import { RoleEdit } from "@/features/role";

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
import TripComplianceReportPage from "@/features/ops/pages/TripComplianceReport";

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
import { ProtectedRoute } from "./components/ProtectedRoute";
import MyTripsPage from "./features/my-trips/pages/MyTrip";
import SupportTicketsPage from "./pages/support/SupportTicketsPage";
import UserTicketListPage from "./pages/support/UserTicketListPage";
import UserTicketDetailsPage from "./features/support/user/components/UserTicketDetailsPage";
import CreateTicketPage from "./features/support/user/components/CreateTicketPane";
import NotamAdminPage from "./features/notam/pages/NotamPage";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Landingpage,
      },
      {
        path: "/login",
        Component: Login,
      },

      {
        path: "/app",
        Component: Layout,
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },

          {
            path: "quotes",
            element: (
              <ProtectedRoute>
                <QuoteControllerPage />
              </ProtectedRoute>
            ),
          },

          {
            path: "operations",
            element: (
              <ProtectedRoute>
                <OpsControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "security",
            element: (
              <ProtectedRoute>
                <SecurityControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "library",
            element: (
              <ProtectedRoute>
                <LibraryControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "camo",
            element: (
              <ProtectedRoute>
                <CamoControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "engineering",
            element: (
              <ProtectedRoute>
                <EngineeringControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "crew",
            element: (
              <ProtectedRoute>
                <CrewControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "training-sales",
            element: (
              <ProtectedRoute>
                <TrainingControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "manuals",
            element: (
              <ProtectedRoute>
                <ManualControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "accounts",
            element: (
              <ProtectedRoute>
                <AccountControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "audit",
            element: (
              <ProtectedRoute>
                <AuditControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "notams",
            element: (
              <ProtectedRoute>
                <NotamAdminPage />
              </ProtectedRoute>
            ),
          },
          // {
          //   path: "admin/category",
          //   Component: AircraftCategoryList,
          // },
          {
            path: "admin/aircraft",
            element: (
              <ProtectedRoute>
                <AircraftControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/airports",
            element: (
              <ProtectedRoute>
                <AirportControllerPage />
              </ProtectedRoute>
            ),
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
            element: (
              <ProtectedRoute>
                <QuoteEdit />
              </ProtectedRoute>
            ),
          },
          {
            path: "quotes/create",
            element: (
              <ProtectedRoute>
                <QuoteCreate />
              </ProtectedRoute>
            ),
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
            element: (
              <ProtectedRoute>
                <RoleControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/roles/edit/:id",
            element: (
              <ProtectedRoute>
                <RoleEdit />
              </ProtectedRoute>
            ),
          },
          // {
          //   path: "admin/users",
          //   element: (
          //     <ProtectedRoute>
          //       <UserControllerPage />
          //     </ProtectedRoute>
          //   ),
          // },
          {
            path: "admin/operators",
            element: (
              <ProtectedRoute>
                <OperatorControllerPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings/profile",
            element: (
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: "my-tickets",
            // element: (
            //   <ProtectedRoute>
            //     <UserTicketListPage />
            //   </ProtectedRoute>
            // ),
            Component: UserTicketListPage,
          },

          {
            path: "my-tickets/:id",
            // element: (
            //   <ProtectedRoute>
            //     <UserTicketListPage />
            //   </ProtectedRoute>
            // ),
            Component: UserTicketDetailsPage,
          },

          {
            path: "create-ticket",
            Component: CreateTicketPage,
          },

          {
            path: "settings/leave",
            element: (
              <ProtectedRoute>
                <LeaveRequest />
              </ProtectedRoute>
            ),
          },

          {
            path: "settings/change-password",
            element: (
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            ),
          },
          // {
          //   path: "invoices/preview",
          //   Component: GenerateInvoice,
          // },
          {
            path: "trip-confirmation/calender",
            element: (
              <ProtectedRoute>
                <TripConfirmationCalenderView />
              </ProtectedRoute>
            ),
          },
          {
            path: "staff-leave/calender",
            element: (
              <ProtectedRoute>
                <StaffLeaveCalenderView />
              </ProtectedRoute>
            ),
          },
          {
            path: "trip-detail/:tripId",
            // element: (
            //   <ProtectedRoute>
            //     <TripDetailPage />
            //   </ProtectedRoute>
            // ),
            Component: TripDetailPage,
          },
          {
            path: "trip-compliance-report/:tripId",
            Component: TripComplianceReportPage,
          },
          {
            path: "sales-confirmation-preview/:quotationNo",
            // element: (
            //   <ProtectedRoute>
            //     <SaleConfirmationPreviewPage />
            //   </ProtectedRoute>
            // ),
            Component: SaleConfirmationPreviewPage,
          },
          {
            path: "passenger-detail/:quotationNo",
            // element: (
            //   <ProtectedRoute>
            //     <PassengerEditPage />
            //   </ProtectedRoute>
            // ),
            Component: PassengerEditPage,
          },

          {
            path: "my-trips",
            // Component: MyTripsPage,
            element: (
              <ProtectedRoute>
                <MyTripsPage />
              </ProtectedRoute>
            ),
          },

          {
            path: "admin/support-ticket",
            // Component: MyTripsPage,
            element: (
              <ProtectedRoute>
                <SupportTicketsPage />
              </ProtectedRoute>
            ),
          },

          {
            path: "admin/support-ticket/:ticketId",
            Component: SupportTicketsPage,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
