import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

// Define a type for the snackbar state
interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

// Define the type for the context value (a function to show snackbar)
type SnackbarContextType = (message: string, severity?: AlertColor) => void;

// Create a context with a default undefined value
const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

// Define Props for SnackbarProvider
interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  // Function to show the snackbar
  const showSnackbar: SnackbarContextType = useCallback(
    (message, severity = "success") => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  // Function to close the snackbar
  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => showSnackbar, [showSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use the Snackbar
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
