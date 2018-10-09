import React from 'react';
import styled from 'react-emotion';

export interface TransactionAddonButtonProps {
  disabled?: boolean;
  success?: boolean;
}

export const TransactionAddonButton = styled('button')(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 44,
    padding: '10px 15px',
    color: 'white',
    fontSize: 18,
    fontWeight: 300,
    backgroundColor: '#2e3542',
    border: 'none',
    borderLeft: '1px solid rgba(0, 0, 0, 0.3)',
    outline: 'none',
    textTransform: 'uppercase',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    // boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.2s, transform 0.1s',

    '& strong': {
      fontWeight: 600
    },

    '&:hover': {
      backgroundColor: '#40495a',
      borderColor: 'transparent',
      cursor: 'pointer'
    },

    '&:active': {
      backgroundColor: '#485163'
      // boxShadow: '0 3px 15px -4px rgba(0, 0, 0, 0.8)',
      // transform: 'translateY(1px) scale(0.99)'
    }
  },
  ({ disabled, success }: TransactionAddonButtonProps) => {
    if (success) {
      return {
        '&, &:hover': {
          backgroundColor: '#11a067',
          borderColor: 'rgba(0, 0, 0, 0.3)',
          // boxShadow: '0 3px 15px -4px rgba(0, 0, 0, 0.4)',
          // transform: 'translateY(0px) scale(1)',
          color: 'white',
          cursor: 'default'
        }
      };
    }

    if (disabled) {
      return {
        '&, &:hover': {
          borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
          backgroundColor: '#2e3542',
          // boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
          // transform: 'translateY(0px) scale(1)',
          color: '#576b7d',
          cursor: 'default'
        }
      };
    }
    return {};
  }
);

export default TransactionAddonButton;
