import React from 'react';
import styled from 'react-emotion';
import { FiUser } from 'react-icons/fi';

const UserAvatarRoot = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: 30,
  height: 30,
  fontSize: 20,
  // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '50%',
  overflow: 'hidden',

  '& img': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    maxWidth: '120%',
    maxHeight: '120%',
    textAlign: 'center'
  }
});

export interface Props {
  children?: any;
  isActive?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  url?: string;
}

export function UserAvatar(props: Props) {
  const { url } = props;

  return (
    <UserAvatarRoot>{url ? <img src={url} /> : <FiUser />}</UserAvatarRoot>
  );
}

export default UserAvatar;
