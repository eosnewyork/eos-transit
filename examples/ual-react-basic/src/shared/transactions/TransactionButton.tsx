import React, { Component, ReactNode } from 'react';
import styled from 'react-emotion';
import { IoMdCheckmark } from 'react-icons/io';
import { EosLogo } from '../EosLogo';
import { SpinnerIcon } from '../icons/SpinnerIcon';

// Visual components

interface TransactionButtonStyleProps {
  disabled?: boolean;
  inProgress?: boolean;
  success?: boolean;
}

const TransactionButtonRoot = styled('button')(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    padding: '10px 15px',
    color: 'white',
    fontSize: 12,
    fontWeight: 300,
    backgroundColor: '#2e3542',
    border: 'none',
    outline: 'none',
    textTransform: 'uppercase',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
    // boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.2s, transform 0.1s',

    '& strong': {
      fontWeight: 600
    },

    '&:hover': {
      backgroundColor: '#40495a',
      cursor: 'pointer'
    },

    '&:active': {
      backgroundColor: '#485163',
      // boxShadow: '0 3px 15px -4px rgba(0, 0, 0, 0.8)',
      // transform: 'translateY(1px) scale(0.99)'
    }
  },
  ({ disabled, inProgress, success }: TransactionButtonStyleProps) => {
    if (success) {
      return {
        '&, &:hover': {
          backgroundColor: '#11a067',
          // boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
          // transform: 'translateY(0px) scale(1)',
          color: 'white',
          cursor: 'default'
        }
      };
    }
    if (disabled || inProgress) {
      return {
        '&, &:hover': {
          backgroundColor: '#2e3542',
          // boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
          // transform: 'translateY(0px) scale(1)',
          color: disabled ? '#576b7d' : 'white',
          cursor: 'default'
        }
      };
    }

    return {};
  }
);

const TransactionButtonIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  marginRight: 8,
  fontSize: 18,

  '& svg': {
    width: '100%',
    maxHeight: '100%'
  }
});

const TransactionButtonText = styled('div')({
  flex: 1,
  padding: '0, 10px',
  textAlign: 'center'
});

// Exported component

export interface TransactionButtonProps {
  children?: ReactNode;
  inProgress?: boolean;
  disabled?: boolean;
  success?: boolean;
  onClick?: (event: any) => void;
  onWalletSelect?: (selectedWallet: any) => void;
}

export class TransactionButton extends Component<TransactionButtonProps> {
  render() {
    const { onClick, inProgress, disabled, success } = this.props;

    return (
      <TransactionButtonRoot
        onClick={onClick}
        inProgress={inProgress}
        disabled={disabled}
        success={success}
      >
        <TransactionButtonIcon>
          {inProgress ? (
            <SpinnerIcon size={20} />
          ) : success ? (
            <IoMdCheckmark />
          ) : (
            <EosLogo />
          )}
        </TransactionButtonIcon>
        <TransactionButtonText>
          {inProgress
            ? 'Processing...'
            : success
              ? 'Successful!'
              : 'Run transaction'}
        </TransactionButtonText>
      </TransactionButtonRoot>
    );
  }
}

export default TransactionButton;
