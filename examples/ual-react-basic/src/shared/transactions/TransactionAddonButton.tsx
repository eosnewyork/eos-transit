import React from 'react';
import styled from 'react-emotion';

export interface TransactionAddonButtonProps {
  disabled?: boolean;
  success?: boolean;
  danger?: boolean;
}

export const TransactionAddonButton = styled('div')(
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
    boxShadow: '0 7px 15px -4px rgba(0, 0, 0, 0.4)',
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
      backgroundColor: '#485163',
      boxShadow: '0 4px 15px -7px rgba(0, 0, 0, 0.8)',
      transform: 'translateY(1px)'
    }
  },
  ({ disabled, success, danger }: TransactionAddonButtonProps) => {
    const style = {};

    if (disabled) {
      Object.assign(style, {
        '&, &:hover': {
          borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
          backgroundColor: '#2e3542',
          boxShadow: '0 7px 15px -4px rgba(0, 0, 0, 0.4)',
          color: '#576b7d',
          cursor: 'default'
        },
        
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 7px 15px -4px rgba(0, 0, 0, 0.4)',
        }
      });
    }

    if (danger) {
      Object.assign(style, {
        backgroundColor: '#582a30',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        color: '#e87494',

        '&:hover, &:active': {
          backgroundColor: disabled ? '#582a30' : '#802e38',
          cursor: disabled ? 'default' : 'pointer'
        }
      });
    }

    if (success) {
      Object.assign(style, {
        '&, &:hover': {
          backgroundColor: '#11a067',
          borderColor: 'rgba(0, 0, 0, 0.3)',
          color: 'white',
          cursor: 'default'
        }
      });
    }

    return style;
  }
);

export default TransactionAddonButton;
