import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import QuotationWorkflowUpgradeConfirmation from "./quotation-workflow-upgrade-confirmation";
import useGql from "../../lib/graphql/gql";
import {
  UPDATE_QUOTE_STATUS,
  UPGRAD_QUOTE,
} from "../../lib/graphql/queries/quote";
import { useSnackbar } from "../../SnackbarContext";
import { QuotationStatus } from "../../lib/utils";



const quotationWorkflowTransition: Record<string, QuotationStatus[]> = {
  "new request": [QuotationStatus.QUOTED],
  quoted: [QuotationStatus.CONFIRMED, QuotationStatus.CANCELLED],
  confirmed: [QuotationStatus.BOOKED],
  booked: [QuotationStatus.INVOICE_SENT],
  cancelled: [QuotationStatus.NEW_REQUEST],
};

interface ActionMenuProps {
  currentState: QuotationStatus;
  id: string;
  code: string;
  refreshList:()=>void
}

const QuotationWorkflow: React.FC<ActionMenuProps> = ({
  currentState: initialCurrentState,
  id,
  code,
  refreshList
}) => {
  const showSnackbar = useSnackbar();
  const [currentState, setCurrentState] =
    useState<QuotationStatus>(initialCurrentState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getStatusKeyByValue = (obj, value) => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  useEffect(() => {
    setCurrentState(initialCurrentState);
  }, [initialCurrentState]);

  const allowedTransitions =
    quotationWorkflowTransition[currentState?.toLowerCase()];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateQuoteStatus = async (id, toStatus) => {
    try {
      const data = await useGql({
        query: UPDATE_QUOTE_STATUS,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            id: id,
            status: getStatusKeyByValue(QuotationStatus, toStatus),
          },
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Update status!", "error");
      } else showSnackbar("Update status!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Update Status!", "error");
    }
    finally{
      refreshList()
    }
  };

  const upgradQuote = async (code) => {
    try {
      const data = await useGql({
        query: UPGRAD_QUOTE,
        queryName: "",
        queryType: "mutation",
        variables: {
          code: code,
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Update status!", "error");
      } else showSnackbar("Update status!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Update Status!", "error");
    }
  };

  const handleMenuItemClick = async (toState: QuotationStatus) => {
    try {
      await updateQuoteStatus(id.toString(), toState);
      setCurrentState(toState);
    } catch (error) {
      console.error("Error transitioning state:", error);
    } finally {
      handleClose();
    }
  };

  const handleUpgradeClick = async () => {
    try {
      await upgradQuote(code);
    } catch (error) {
      console.error("Error upgrading quotation:", error);
    } finally {
      handleClose();
      refreshList()
    }
  };

  return (
    <>
      <Typography
        variant="body1"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        aria-controls="menu"
        aria-haspopup="true"
        sx={{ fontWeight: 600 }}
      >
        <Box
          component="span"
          sx={{
            color:
              currentState === QuotationStatus.BOOKED ? "green" : "inherit",
          }}
        >
          {currentState?.toUpperCase()}
        </Box>

        { ![QuotationStatus.BOOKED,QuotationStatus.UPGRADED].includes(currentState)   && (
          <IconButton size="small" aria-label="menu" onClick={handleClick}>
            <ArrowDropDown />
          </IconButton>
        )}

        {(currentState === QuotationStatus.QUOTED ||
          currentState === QuotationStatus.CANCELLED) && (
          <Tooltip title="Upgrade">
            <IconButton size="small">
              <QuotationWorkflowUpgradeConfirmation
                onUpgrade={handleUpgradeClick}
                currentState={currentState}
              />
            </IconButton>
          </Tooltip>
        )}
      </Typography>

      {currentState !== QuotationStatus.BOOKED && (
        <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {allowedTransitions?.map((transition, index) => (
            <MenuItem
              key={index}
              onClick={() => handleMenuItemClick(transition)}
            >
              <span
                style={{
                  color:
                    transition === QuotationStatus.BOOKED ? "green" : "inherit",
                }}
              >
                Move to <strong>{transition.toUpperCase()}</strong>
              </span>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default QuotationWorkflow;
