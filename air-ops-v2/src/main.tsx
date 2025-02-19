// import * as React from 'react';
// import * as ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router';
// import App from './App';
// import Layout from './layouts/dashboard';
// import DashboardPage from './pages';
// import OrdersPage from './pages/orders';
// import SignInPage from './pages/signin';

// const router = createBrowserRouter([
//   {
//     Component: App,
//     children: [
//       {
//         path: '/',
//         Component: Layout,
//         children: [
//           {
//             path: '',
//             Component: DashboardPage,
//           },
//           {
//             path: 'orders',
//             Component: OrdersPage,
//           },
//         ],
//       },
//       {
//         path: '/sign-in',
//         Component: SignInPage,
//       },
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// );

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Layout from "./layouts/dashboard";
import DashboardPage from "./pages";
import OrdersPage from "./pages/orders";
import Category from "./pages/category";
import SignInPage from "./pages/sign-in";
import FlightRequestForm from "./pages/test";
import QuoteList from "./pages/quote/list";
import QuoteEdit from "./pages/quote/edit";
import PriceCreate from "./pages/price/Create";
import PriceList from "./pages/price/list";
import PriceEdit from "./pages/price/edit";
import RoleList from "./pages/role/list";
import RoleCreate from "./pages/role/create";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";
import UserList from "./pages/user/list";
import UserCreate from "./pages/user/create";
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "/",
            Component: DashboardPage,
          },
          // {
          //   path: "/orders",
          //   Component: OrdersPage,
          // },
          {
            path: "/category",
            Component: Category,
          },
          {
            path: "flight-form",
            Component: PriceCreate,
          },
          {
            path: "quotes",
            Component: QuoteList,
          },
          {
            path: "quotes/edit/:id",
            Component: QuoteEdit,
          },
          {
            path: "prices",
            Component: PriceList,
          },
          {
            path: "prices/edit/:id",
            Component: PriceEdit,
          },
          {
            path: "roles",
            Component: RoleList,
          },
          {
            path: "roles/create",
            Component: RoleCreate,
          },
          {
            path: "users",
            Component: UserList,
          },
          {
            path: "users/create",
            Component: UserCreate,
          },
        ],
      },
      // {
      //   path: "/sign-in",
      //   Component: SignInPage,
      // },
      {
        path: "/sign-in",
        Component: SignIn,
      },
      // {
      //   path: "/login",
      //   // Component: Login,
      //   Component: Registration
      // },
      {
        path: "/sign-up",
        // Component: Login,
        Component: SignUp,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
