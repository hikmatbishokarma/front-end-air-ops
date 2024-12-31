import React, { useEffect, useState } from 'react';
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
import { Identifier } from 'react-admin';
import { updateQuotationState, upgradeQuotation } from '../../../apiClient';

export enum QuotationState {
  DRAFT = 'draft',
  QUOTATED = 'quotated',
  SOLD = 'sold',
  TERMINATED = 'terminated',
  UPGRADED = 'upgraded',
}

const quotationWorkflowTransition: Record<string, QuotationState[]> = {
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
  currentState: initialCurrentState,
  id,
  code,
}) => {
  const [currentState, setCurrentState] =
    useState<QuotationState>(initialCurrentState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setCurrentState(initialCurrentState);
  }, [initialCurrentState]);

  const allowedTransitions =
    quotationWorkflowTransition[currentState.toLowerCase()];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (toState: QuotationState) => {
    try {
      await updateQuotationState(id.toString(), toState);
      setCurrentState(toState);
    } catch (error) {
      console.error('Error transitioning state:', error);
    } finally {
      handleClose();
    }
  };

  const handleUpgradeClick = async () => {
    try {
      await upgradeQuotation(code);
    } catch (error) {
      console.error('Error upgrading quotation:', error);
    } finally {
      handleClose();
    }
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
            color: currentState === QuotationState.SOLD ? 'green' : 'inherit',
          }}
        >
          {currentState.toUpperCase()}
        </Box>

        {currentState !== QuotationState.SOLD && (
          <IconButton size='small' aria-label='menu' onClick={handleClick}>
            <ArrowDropDown />
          </IconButton>
        )}

        {(currentState === QuotationState.QUOTATED ||
          currentState === QuotationState.TERMINATED) && (
          <Tooltip title='Upgrade'>
            <IconButton size='small'>
              <QuotationWorkflowUpgradeConfirmation
                onUpgrade={handleUpgradeClick}
                currentState={currentState}
              />
            </IconButton>
          </Tooltip>
        )}
      </Typography>

      {currentState !== QuotationState.SOLD && (
        <Menu
          id='menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {allowedTransitions.map((transition, index) => (
            <MenuItem
              key={index}
              onClick={() => handleMenuItemClick(transition)}
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
