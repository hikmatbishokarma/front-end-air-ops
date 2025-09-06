import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "../SnackbarContext";
import { useSession } from "../SessionContext";
import { useEffect, useState } from "react";
import { Iclient } from "../interfaces/quote.interface";
import {
  GET_CLIENT_BY_ID,
  UPDATE_CLIENT,
} from "../lib/graphql/queries/clients";
import useGql from "../lib/graphql/gql";
import ClientChildren from "../pages/clients/children";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ClientType } from "../lib/utils";

type FormData = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  type: string;
  gstNo: string;
  panNo: string;
};

export const ClientDetailConfirmationForm = ({
  clientId,
  setClientDetailConfirm,
  onClientUpdated,
}) => {
  const showSnackbar = useSnackbar();

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const editFields = [
    { name: "type", label: "Type", options: [], xs: 12, required: true },
    { name: "name", label: "First Name", xs: 6, required: true },
    {
      name: "lastName",
      label: "Last Name",
      xs: 6,
      required: true,
      visible: (type: string) => type !== ClientType.COMPANY,
    },
    {
      name: "phone",
      label: "Phone",
      xs: 6,
      required: true,
      pattern: {
        value: /^[0-9]{10}$/, // Simple 10-digit number validation
        message: "Phone number must be 10 digits",
      },
    },
    {
      name: "email",
      label: "Email",
      xs: 6,
      required: true,
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
    },
    { name: "address", label: "Address", xs: 6, required: true },
    {
      name: "panNo",
      label: "PAN No",
      xs: 6,
      Pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN" },
      required: false,
      isRequired: (type: string) => type !== ClientType.OTHER,
    },
    {
      name: "gstNo",
      label: "GST No",
      xs: 6,
      Pattern: {
        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        message: "Invalid PAN",
      },
      required: false,
      isRequired: (type: string) => type !== ClientType.OTHER,
    },
    {
      name: "billingAddress",
      label: "Billing Address",
      xs: 6,
      required: false,
    },
  ];

  const { control, handleSubmit, reset, setValue, setError, getValues } =
    useForm<FormData>({
      defaultValues: {
        type: ClientType.PERSON,
      },
    });

  const [client, setClient] = useState<Iclient>();

  const fetchClientById = async (Id) => {
    const response = await useGql({
      query: GET_CLIENT_BY_ID,
      queryName: "client",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setClient(response);
    }
  };

  useEffect(() => {
    fetchClientById(clientId);
  }, [clientId]);

  useEffect(() => {
    if (client) {
      setValue("name", client.name || "");
      setValue("lastName", client.lastName || "");
      setValue("phone", client.phone || "");
      setValue("email", client.email || "");
      setValue("address", client.address || "");
      setValue("type", client.type || "");
      setValue("panNo", client.panNo || "");
      setValue("gstNo", client.gstNo || "");
    }
  }, [client, setValue]);

  const UpdateClient = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_CLIENT,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else {
        showSnackbar("Updated successfully", "success");
        setClientDetailConfirm(true);
        onClientUpdated?.({ id: Id, ...formData });
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: FormData) => {
    const { type, ...rest } = data;
    const formData = { ...rest, type };
    // if (type == "COMPANY") {
    //   formData["isCompany"] = true;
    // } else formData["isPerson"] = true;

    UpdateClient(clientId, { ...formData, operatorId });
    close();
  };

  return (
    <ClientChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={editFields}
      setValue={setValue} // ✅ Pass it down here
      submitButtonName={"Confirm"}
      getValues={getValues}
    />
  );
};

// const SuccessPage = ({ client, onGenerateInvoiceClick }) => {
//   // Check if both GST and PAN are present
//   const canGenerateInvoice =
//     client &&
//     client.gstNo &&
//     client.gstNo.trim() !== "" &&
//     client.panNo &&
//     client.panNo.trim() !== "";

//   return (
//     <Box sx={{ width: 96, height: 96, mx: "auto" }}>
//       <svg
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         xmlns="http://www.w3.org/2000/svg"
//         style={{ width: "100%", height: "100%" }}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//         ></path>
//       </svg>
//       <Typography variant="h3" component="h2">
//         Success!
//       </Typography>
//       <Typography variant="h6">
//         Generating Invoice for <span>{client?.name}</span>
//       </Typography>

//       {/* Display client details */}
//       <Paper elevation={2}>
//         <Typography variant="body1" className="text-gray-800">
//           <span className="font-medium">Email:</span> {client?.email || "N/A"}
//         </Typography>
//         <Typography variant="body1" className="text-gray-800">
//           <span className="font-medium">GST Number:</span>{" "}
//           {client?.gstNo || "Not Provided"}
//         </Typography>
//         <Typography variant="body1" className="text-gray-800">
//           <span className="font-medium">PAN Number:</span>{" "}
//           {client?.panNo || "Not Provided"}
//         </Typography>
//       </Paper>

//       {/* Generate Invoice Button - now opens client edit modal for invoice */}
//       <Button
//         onClick={onGenerateInvoiceClick}
//         disabled={!canGenerateInvoice}
//         variant="contained"
//         fullWidth
//         size="large"
//         sx={{
//           mt: 3,
//           fontWeight: "bold",
//           color: "white",
//           boxShadow: 3,
//           transition: "all 200ms ease-in-out", // transition duration-200 ease-in-out

//           // Conditional styles based on canGenerateInvoice
//           ...(canGenerateInvoice
//             ? {
//                 backgroundColor: "purple.600", // bg-purple-600 (accessing theme colors)
//                 "&:hover": {
//                   backgroundColor: "purple.700", // hover:bg-purple-700
//                   transform: "translateY(-4px) scale(1.05)", // transform hover:-translate-y-1 hover:scale-105 (4px is approx 1rem or 0.25rem * 16px if 1unit=4px, so 1 rem. Tailwind's -translate-y-1 is 4px)
//                 },
//               }
//             : {
//                 backgroundColor: "grey.400", // bg-gray-400
//                 cursor: "not-allowed", // cursor-not-allowed
//               }),
//         }}
//       >
//         Generate Invoice
//       </Button>

//       {!canGenerateInvoice && (
//         <Typography variant="body2" color="error">
//           Please go back and add both GST and PAN numbers to enable invoice
//           generation.
//         </Typography>
//       )}
//     </Box>
//   );
// };

const SuccessPage = ({ client, onGenerateInvoiceClick }) => {
  const canGenerateInvoice =
    client &&
    client.gstNo &&
    client.gstNo.trim() !== "" &&
    client.panNo &&
    client.panNo.trim() !== "";

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      {" "}
      {/* Add padding to the content area */}
      {/* MUI Icon for consistency */}
      <Box sx={{ mb: 4 }}>
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 50,
            color: "success.main",
            animation: "bounce 1s infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-15px)" },
            },
          }}
        />
      </Box>
      {/* <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: "extrabold",
          color: "success.dark",
          mb: 2,
        }}
      >
        Success!
      </Typography> */}
      <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
        Generating Invoice for{" "}
        <Typography
          component="span"
          variant="inherit"
          sx={{ fontWeight: "semibold" }}
        >
          {client?.name}
        </Typography>
      </Typography>
      {/* Display client details */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: "left",
          bgcolor: "grey.50",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
          mb: 4,
        }}
      >
        <Typography variant="body1" sx={{ color: "text.primary", mb: 1 }}>
          <Typography component="span" sx={{ fontWeight: "medium" }}>
            Email:
          </Typography>{" "}
          {client?.email || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary", mb: 1 }}>
          <Typography component="span" sx={{ fontWeight: "medium" }}>
            GST Number:
          </Typography>{" "}
          {client?.gstNo || "Not Provided"}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          <Typography component="span" sx={{ fontWeight: "medium" }}>
            PAN Number:
          </Typography>{" "}
          {client?.panNo || "Not Provided"}
        </Typography>
      </Paper>
      {/* Generate Invoice Button */}
      <Button
        onClick={onGenerateInvoiceClick}
        disabled={!canGenerateInvoice}
        variant="contained"
        fullWidth
        size="small"
        sx={{
          mt: 3,
          fontWeight: "bold",
          color: "white",
          boxShadow: 3,
        }}
      >
        Generate Invoice
      </Button>
      {!canGenerateInvoice && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Please go back and add both GST and PAN numbers to enable invoice
          generation.
        </Typography>
      )}
    </Box>
  );
};

export const InvoiceConfirmationModal = ({
  open,
  handelInvoiceModelClose,
  onGenerateInvoice,
  invoiceType,
  currentRecord,
}) => {
  const showSnackbar = useSnackbar();

  const { client: initialClient, quotationNo } = currentRecord || {};

  const [currentClient, setCurrentClient] = useState<Iclient | null>(
    initialClient || null
  ); // Manage client state internally

  const [clientDetailConfirm, setClientDetailConfirm] = useState(false);

  // Effect to load initial client data or reset when modal opens
  useEffect(() => {
    if (open && initialClient) {
      setCurrentClient(initialClient);
      setClientDetailConfirm(false); // Reset confirmation state on open
    } else if (!open) {
      // When modal closes, reset all internal states
      setCurrentClient(null);
      setClientDetailConfirm(false);
    }
  }, [open, initialClient]);

  const onClientUpdated = (updatedData: Iclient) => {
    // <--- NEW HANDLER
    setCurrentClient(updatedData); // Update the currentClient state with new data
  };

  const onGenerateInvoiceClick = () => {
    handelInvoiceModelClose();
    onGenerateInvoice?.({
      type: invoiceType,
      quotationNo: quotationNo,
    });
    setClientDetailConfirm(false);
  };

  const handelOnClose = () => {
    setClientDetailConfirm(false);
    handelInvoiceModelClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth className="panel-one">
      <DialogTitle>
        <Typography
          variant="h5"
          component="div"
          className="font-bold text-gray-800 text-center"
        >
          {clientDetailConfirm ? "Generate Invoice " : "Confirm Client Details"}
        </Typography>
        <IconButton
          className="popup-quote-model"
          aria-label="close"
          onClick={handelOnClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon className="popup-close-panel" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="invoice-button">
        {!clientDetailConfirm && currentClient && open && (
          <ClientDetailConfirmationForm
            clientId={initialClient.id}
            setClientDetailConfirm={setClientDetailConfirm}
            onClientUpdated={onClientUpdated}
          />
        )}
        {clientDetailConfirm && (
          <SuccessPage
            client={currentClient}
            onGenerateInvoiceClick={onGenerateInvoiceClick}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
