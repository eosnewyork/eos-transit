import React, { Component, ReactNode } from 'react';
import styled from 'react-emotion';
import { IoMdCheckmark, IoIosCloseCircle } from 'react-icons/io';
import { EosLogo } from '../EosLogo';
import { SpinnerIcon } from '../icons/SpinnerIcon';

// Visual components

interface TransactionButtonStyleProps {
  disabled?: boolean;
  inProgress?: boolean;
  success?: boolean;
  danger?: boolean;
}

const TransactionButtonRoot = styled('button')(
  {
    flex: 1,
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
    boxShadow: '0 7px 15px -4px rgba(0, 0, 0, 0.4)',
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
      boxShadow: '0 4px 15px -7px rgba(0, 0, 0, 0.8)',
      transform: 'translateY(1px) scale(1)'
    }
  },
  ({ disabled, inProgress, success, danger }: TransactionButtonStyleProps) => {
    const style = {};

    if (disabled || inProgress) {
      Object.assign(style, {
        '&, &:hover': {
          backgroundColor: '#2e3542',
          boxShadow: '0 7px 15px -4px rgba(0, 0, 0, 0.4)',
          transform: 'translateY(0px) scale(1)',
          color: inProgress ? 'white' : '#576b7d',
          cursor: 'default'
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
          boxShadow: '0 7px 15px -4px rgba(0, 0, 0, 0.4)',
          transform: 'translateY(0px) scale(1)',
          color: 'white',
          cursor: 'default'
        }
      });
    }

    return style;
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
  danger?: boolean;
  onClick?: (event: any) => void;
  onWalletSelect?: (selectedWallet: any) => void;
}

export class TransactionButton extends Component<TransactionButtonProps> {
  render() {
    const { onClick, inProgress, disabled, success, danger } = this.props;

    return (
      <TransactionButtonRoot
        type="button"
        onClick={onClick}
        inProgress={inProgress}
        disabled={disabled}
        success={success}
        danger={danger}
      >
        <TransactionButtonIcon>
          {inProgress ? (
            <SpinnerIcon size={20} />
          ) : danger ? (
            <IoIosCloseCircle />
          ) : success ? (
            <IoMdCheckmark />
          ) : (
            <EosLogo />
          )}
        </TransactionButtonIcon>
        <TransactionButtonText>
          {inProgress
            ? 'Processing...'
            : danger
              ? 'Failed. Try again'
              : success
                ? 'Successful!'
                : 'Run transaction'}
        </TransactionButtonText>
      </TransactionButtonRoot>
    );
  }
}

export default TransactionButton;
