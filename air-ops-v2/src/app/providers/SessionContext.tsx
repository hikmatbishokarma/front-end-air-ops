import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface IAgent {
  id: string;
  name?: string;
  email?: string;
  companyLogo: string;
  phone?: string;
  address?: string;
  companyName?: string;
}
export interface ISession {
  user: {
    id?: string | null;
    name?: string | null;
    image?: string | null;
    email?: string | null;
    role?: any | null;
    roles?: string[] | null;
    type: string;
    permissions?: any;
    operator?: IAgent;
  };
}

export interface SessionContextValue {
  session: ISession | null;
  setSession: (session: ISession | null) => void;
  loading: boolean; // ✅ Add loading state
}

// ✅ Ensure context allows `undefined` for proper usage with hooks
export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [session, setSessionState] = useState<ISession | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Initialize `loading`

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      setSessionState(JSON.parse(savedSession));
    }
    setLoading(false); // ✅ Set loading to false after fetching
  }, []);

  const setSession = (newSession: ISession | null) => {
    console.log("newSession", newSession);
    setSessionState(newSession);
    if (newSession) {
      localStorage.setItem("session", JSON.stringify(newSession));
    } else {
      localStorage.removeItem("session");
    }
  };

  return (
    <SessionContext.Provider value={{ session, setSession, loading }}>
      {children} {/* ✅ Ensure children are returned properly */}
    </SessionContext.Provider>
  );
};

// ✅ Custom hook to use session context
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
