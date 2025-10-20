import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Layout from "./layouts/dashboard";
import DashboardPage from "./pages";

import RoleList from "./pages/role/list";
import RoleCreate from "./pages/role/create";

import UserList from "./pages/user/list";
import { UserProfile } from "./pages/settings/profile";
import RoleEdit from "./pages/role/edit";
import ChangePassword from "./pages/settings/change-password";
import { AircraftCategoryList } from "./pages/aircraft-category/list";
import { AircraftDetailList } from "./pages/aircraft-detail/list";
import { AirpotList } from "./pages/airports/list";
import Login from "./pages/login";

import GenerateInvoice from "./pages/quote/generate-invoice";
import OpsDashboard from "./pages/dashboard/OpsDashboard";
import SecurityDashboard from "./pages/dashboard/Security";
import CamoDashboard from "./pages/dashboard/Camo";
import EngineeringDashboard from "./pages/dashboard/Engineering";
import CrewDashboard from "./pages/dashboard/Crew";
import TrainingDashboard from "./pages/dashboard/Trainingsales";
import ManualsDashboard from "./pages/dashboard/Manuals";
import AccountsDashboard from "./pages/dashboard/Accounts";
import AuditDashboard from "./pages/dashboard/Audit";

import { OperatorList } from "./pages/operator/list";

import "../src/Asset/Images/Versionstyle.css";
import { LeaveRequest } from "./pages/leave/LeaveRequestPage";

import TripConfirmationCalenderView from "./pages/full-calender-view/TripConfirmation";
import StaffLeaveCalenderView from "./pages/full-calender-view/LeaveCalender";
import Library from "./pages/library/List";

import TripDetailPage from "./features/ops/trip/TripDetailPage";

import PassengerEditPage from "./shared/components/passenger/PassengerEdit";
import QuoteControllerPage from "./pages/QuoteControllerPage";
import QuoteEdit from "./features/quotes/pages/QuoteEdit";
import QuoteCreate from "./features/quotes/pages/QuoteCreate";
import SaleConfirmationPreviewPage from "./features/quotes/pages/SalesConfirmationPreview";
import OpsControllerPage from "./pages/OpsControllerPage";

const router = createBrowserRouter(
  [
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
              Component: SecurityDashboard,
            },
            {
              path: "library",
              // Component: LibraryDashboard,
              Component: Library,
            },
            {
              path: "camo",
              Component: CamoDashboard,
            },
            {
              path: "engineering",
              Component: EngineeringDashboard,
            },
            {
              path: "crew",
              Component: CrewDashboard,
            },
            {
              path: "training-sales",
              Component: TrainingDashboard,
            },
            {
              path: "manuals",
              Component: ManualsDashboard,
            },
            {
              path: "accounts",
              Component: AccountsDashboard,
            },
            {
              path: "audit",
              Component: AuditDashboard,
            },
            // {
            //   path: "admin/category",
            //   Component: AircraftCategoryList,
            // },
            {
              path: "admin/aircraft",
              Component: AircraftDetailList,
            },
            {
              path: "admin/airports",
              Component: AirpotList,
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
              Component: RoleList,
            },
            {
              path: "admin/roles/create",
              Component: RoleCreate,
            },
            {
              path: "admin/roles/edit/:id",
              Component: RoleEdit,
            },
            {
              path: "admin/users",
              Component: UserList,
            },
            // {
            //   path: "admin/users/create",
            //   Component: UserCreate,
            // },
            {
              path: "admin/operators",
              Component: OperatorList,
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
            {
              path: "invoices/preview",
              Component: GenerateInvoice,
            },
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
        // {
        //   path: "/sign-in",
        //   Component: SignIn,
        // },

        // {
        //   path: "/sign-up",
        //   // Component: Login,
        //   Component: SignUp,
        // },
        {
          path: "/login",
          // Component: Login,
          Component: Login,
        },
      ],
    },
  ],
  { basename: "/test" } // ✅ Add this
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
