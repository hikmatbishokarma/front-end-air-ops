// import * as React from 'react';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { Outlet } from 'react-router';
// import { ReactRouterAppProvider } from '@toolpad/core/react-router';
// import type { Navigation, Authentication } from '@toolpad/core/AppProvider';
// import { firebaseSignOut, onAuthStateChanged } from './firebase/auth';
// import SessionContext, { type Session } from './SessionContext';

// const NAVIGATION: Navigation = [
//   {
//     kind: 'header',
//     title: 'Main items',
//   },
//   {
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: 'orders',
//     title: 'Orders',
//     icon: <ShoppingCartIcon />,
//   },
// ];

// const BRANDING = {
//   title: "air-ops-v2",
// };

// // const AUTHENTICATION: Authentication = {
// //   signIn: () => {},
// //   signOut: firebaseSignOut,
// // };

// const AUTHENTICATION: any = {
//   signIn: async (credentials: { email: string; password: string }) => {
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });
//       if (!response.ok) {
//         console.error('Login error:');
//       }
//       const data = await response.json();
//       // Save token or session data (e.g., in localStorage or cookies)
//       localStorage.setItem('authToken', data.token);
//      // return data.user;
//     } catch (error) {
//       console.error('Login error:', error);
//       //throw error;
//     }
//   },
//   signOut: async () => {
//     try {
//       await fetch('/api/logout', { method: 'POST' });
//       localStorage.removeItem('authToken'); // Clear token or session data
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   },
// };

// export default function App() {
//   const [session, setSession] = React.useState<Session | null>(null);
//   const [loading, setLoading] = React.useState(true);

//   const sessionContextValue = React.useMemo(
//     () => ({
//       session,
//       setSession,
//       loading,
//     }),
//     [session, loading],
//   );

//   // React.useEffect(() => {
//   //   const unsubscribe = onAuthStateChanged((user) => {
//   //     if (user) {
//   //       setSession({
//   //         user: {
//   //           name: user.name || '',
//   //           email: user.email || '',
//   //           image: user.image || '',
//   //         },
//   //       });
//   //     } else {
//   //       setSession(null);
//   //     }
//   //     setLoading(false);
//   //   });

//   //   return () => unsubscribe();
//   // }, []);

//   React.useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//           setSession(null);
//           setLoading(false);
//           return;
//         }

//         const response = await fetch('/api/session', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) {
//           throw new Error('Session invalid');
//         }
//         const data = await response.json();
//         setSession({
//           user: {
//             name: data.user.name,
//             email: data.user.email,
//             image: data.user.image,
//           },
//         });
//       } catch (error) {
//         console.error('Session error:', error);
//         setSession(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkSession();
//   }, []);

//   return (
//     <ReactRouterAppProvider
//       navigation={NAVIGATION}
//       branding={BRANDING}
//       session={session}
//       authentication={AUTHENTICATION}
//     >
//       <SessionContext.Provider value={sessionContextValue}>
//         <Outlet />
//       </SessionContext.Provider>
//     </ReactRouterAppProvider>
//   );
// }

import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Navigation, Session } from "@toolpad/core/AppProvider";
import { SessionContext } from "./SessionContext";
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
} from "@mui/icons-material";
import logoPhn from './Asset/images/logo_phn.png';

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "quotes",
    title: "Requests/Quotes",
    icon: <RequestQuote />,
  },
  // {
  //   segment: "orders",
  //   title: "Orders",
  //   icon: <ShoppingCartIcon />,
  // },
  {
    segment: "category",
    title: "Category",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "prices",
    title: "Prices",
    icon: <PriceChange />,
  },

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
  // {
  //   segment: "engineers",
  //   title: "Engineers",
  //   icon: <Engineering />,
  // },

  // {
  //   segment: "doctors",
  //   title: "Doctors",
  //   icon: <Person />,
  // },

  // {
  //   segment: "cabin-crews",
  //   title: "Cabin Crews",
  //   icon: <Person />,
  // },

  // {
  //   segment: "operation-crews",
  //   title: "Operation Crews",
  //   icon: <ManageAccounts />,
  // },

  {
    segment: "roles",
    title: "Role",
    icon: <ManageAccounts />,
  },
];

const BRANDING = {
  logo: <img src={logoPhn} alt="" />,
  title: "",
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate("/sign-in");
    // navigate("/login");
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    navigate("/sign-in");
  }, [navigate]);

  console.log("session:::",session)

  const sessionContextValue = React.useMemo(
    () => ({ session, setSession }),
    [session, setSession],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SessionContext.Provider value={sessionContextValue}>
        <ReactRouterAppProvider
          navigation={NAVIGATION}
          branding={BRANDING}
          session={session}
          authentication={{ signIn, signOut }}
        >
          <Outlet />
        </ReactRouterAppProvider>
      </SessionContext.Provider>
    </ThemeProvider>
  );
}
