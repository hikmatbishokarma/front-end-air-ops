// import * as React from 'react';

// export interface Session {
//   user: {
//     name?: string;
//     email?: string;
//     image?: string;
//   };
// }

// interface SessionContextType {
//   session: Session | null;
//   setSession: (session: Session | null) => void;
//   loading: boolean;
// }

// const SessionContext = React.createContext<SessionContextType>({
//   session: null,
//   setSession: () => {},
//   loading: true,
// });

// export default SessionContext;

// export const useSession = () => React.useContext(SessionContext);

import * as React from "react";
import type { Session } from "@toolpad/core";

export interface SessionContextValue {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const SessionContext = React.createContext<SessionContextValue>({
  session: {},
  setSession: () => {},
});

export function useSession() {
  return React.useContext(SessionContext);
}
