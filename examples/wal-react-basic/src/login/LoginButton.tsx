import React, { Component, ReactNode, Children } from 'react';
import styled from 'react-emotion';
import { EosLogo } from 'shared/EosLogo';

// Visual components
// TODO: Extract to `shared`

const LoginButtonRoot = styled('button')({
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
  borderRadius: 1,
  boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
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
    boxShadow: '0 3px 15px -4px rgba(0, 0, 0, 0.8)',
    transform: 'translateY(1px) scale(0.99)'
  }
});

const LoginButtonIcon = styled('div')({
  width: 24,
  height: 24
});

const LoginButtonText = styled('div')({
  flex: 1,
  padding: '0, 10px',
  textAlign: 'center'
});

const LoginButtonAddon = styled('div')({
  // TODO
});

// Exported component

export interface LoginButtonProps {
  children?: ReactNode;
  onClick?: (event: any) => void;
  onWalletSelect?: (selectedWallet: any) => void;
}

export class LoginButton extends Component<LoginButtonProps> {
  render() {
    const { onClick } = this.props;

    return (
      <LoginButtonRoot onClick={onClick}>
        <LoginButtonIcon>
          <EosLogo />
        </LoginButtonIcon>
        <LoginButtonText>
          Login with <strong>EOS</strong>
        </LoginButtonText>
      </LoginButtonRoot>
    );
  }
}

export default LoginButton;
