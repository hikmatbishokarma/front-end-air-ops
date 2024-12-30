import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import QuotationWorkflowUpgradeConfirmation from './QuotationWorkflowUpgradeConfirmation';
import { useEffect, useState } from 'react';
import { Identifier } from 'react-admin';

export enum QuotationState {
  DRAFT = 'draft',
  QUOTATED = 'quotated', // Quotation created, not yet confirmed by the customer
  SOLD = 'sold', // Finalized and confirmed by the customer
  TERMINATED = 'terminated', // Booking cancelled or terminated
  UPGRADED = 'upgraded', // Status for upgraded booking or service
}

const quotationWorkflowTransition: any = {
  draft: [QuotationState.QUOTATED],
  quotated: [QuotationState.SOLD, QuotationState.TERMINATED],
  terminated: [QuotationState.DRAFT],
};

interface ActionMenuProps {
  currentState: QuotationState;
  id: Identifier;
  code: string;
}

const QuotationWorkflow: React.FC<ActionMenuProps> = ({
  currentState: currentStateOnInit,
  id,
  code,
}) => {
  const [currentState, setCurrentState] =
    useState<QuotationState>(currentStateOnInit);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setCurrentState(currentStateOnInit);
  }, [currentStateOnInit]);

  const allowedTransitions =
    quotationWorkflowTransition[`${currentState?.toLowerCase()}`];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpgradeClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/quotations/upgrade-quotation`,
        {
          method: 'POST', // Specify POST method
          headers: {
            'Content-Type': 'application/json', // Ensure the server knows the request body format
          },
          body: JSON.stringify({
            code: code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      handleClose();
    } catch (error) {
      console.error('Failed to fetch flight info:', error);
    }
  };

  const updateQuotationState = async (toState: QuotationState) => {
    try {
      await fetch(`http://localhost:3000/quotations/update-quotation-state`, {
        method: 'POST', // Specify POST method
        headers: {
          'Content-Type': 'application/json', // Ensure the server knows the request body format
        },
        body: JSON.stringify({
          id,
          state: toState,
        }),
      });
    } catch (error) {
      console.error('Failed to fetch update state:', error);
    }
  };

  const handleMenuItemClick = async (toState: QuotationState) => {
    await updateQuotationState(toState);
    setCurrentState(toState);
    handleClose();
  };
  return (
    <>
      <Typography
        variant='body1'
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        aria-controls='menu'
        aria-haspopup='true'
        sx={{ fontWeight: 600 }}
      >
        <Box
          component='span'
          sx={{
            color: () =>
              currentState?.toLowerCase() === QuotationState.SOLD
                ? 'green'
                : 'inherit',
          }}
        >
          {''}
          {currentState?.toUpperCase()}
        </Box>

        {
            currentState?.toLowerCase() !== QuotationState.SOLD?(
              <IconButton size='small' aria-label='menu' onClick={handleClick}>
                <ArrowDropDown />
              </IconButton>
            ):null
        }

{
    (currentState?.toLowerCase()==QuotationState.QUOTATED|| currentState?.toLowerCase()===QuotationState.TERMINATED)  && (<Tooltip title='Upgrade'>
        <IconButton size='small' aria-label='menu'>
          <QuotationWorkflowUpgradeConfirmation
            onUpgrade={handleUpgradeClick}
            currentState={currentState}
          />
        </IconButton>
      </Tooltip>)
}

        {/* {currentState?.toLowerCase() !== QuotationState.QUOTATED ? (
          <IconButton size='small' aria-label='menu' onClick={handleClick}>
            {currentState?.toLowerCase() !== QuotationState.UPGRADED ? (
              <ArrowDropDown />
            ) : null}
          </IconButton>
        ) : (
          <Tooltip title='Upgrade'>
            <IconButton size='small' aria-label='menu'>
              <QuotationWorkflowUpgradeConfirmation
                onUpgrade={handleUpgradeClick}
                currentState={currentState}
              />
            </IconButton>
          </Tooltip>
        )} */}
      </Typography>

      {currentState?.toLowerCase() !== QuotationState.SOLD && (
        <Menu
          id='menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {allowedTransitions.map((transition: string, index: number) => (
            <MenuItem
              key={index}
              onClick={() => handleMenuItemClick(transition as QuotationState)}
            >
              <span
                style={{
                  color:
                    transition === QuotationState.SOLD ? 'green' : 'inherit',
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
