// export interface ISession {
//   user?: {
//     id?: string | null;
//     name?: string | null;
//     image?: string | null;
//     email?: string | null;
//     role?: any | null;
//   };
// }

// import * as React from "react";
// import type { Session } from "@toolpad/core";

// export interface SessionContextValue {
//   // session: Session | null;
//   session: ISession | null;
//   setSession: (session: Session | null) => void;
// }

// export const SessionContext = React.createContext<SessionContextValue>({
//   session: {},
//   setSession: () => {},
// });

// export function useSession() {
//   return React.useContext(SessionContext);
// }
