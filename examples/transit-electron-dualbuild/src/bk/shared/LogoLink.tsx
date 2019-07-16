import React from 'react';
import styled from 'react-emotion';
import { NavLink, NavLinkProps } from 'react-router-dom';

export const LogoLinkRoot = styled(NavLink)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 45,
  height: 45,
  fontSize: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  textDecoration: 'none',
  textTransform: 'uppercase',
  borderRadius: '50%',
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    textDecoration: 'none'
  }
});

export function LogoLink(props: NavLinkProps) {
  return <LogoLinkRoot {...props}>EOS</LogoLinkRoot>;
}

export default LogoLink;
