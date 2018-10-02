import React from 'react';
import styled from 'react-emotion';
import { IoIosArrowDown as ArrowDown } from 'react-icons/io';
import { SpinnerIcon } from '../shared/icons/SpinnerIcon';
import UserAvatar from './UserAvatar';

export interface UserMediaRootProps {
  isActive?: boolean;
}

const UserMediaRoot = styled('div')(
  {
    position: 'relative',
    display: 'flex',
    padding: '10px 15px',
    paddingRight: 20,
    backgroundColor: 'transparent',
    transition: 'all 0.2s',
    color: 'white',

    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 0, 0, 0.15)'
    }
  },
  ({ isActive }: UserMediaRootProps) => {
    if (isActive) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',

        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.25)'
        }
      };
    }

    return {};
  }
);

const UserMediaFigure = styled('div')({
  display: 'flex',
  width: 30,
  marginRight: 5,
  textAlign: 'center'
});

const UserMediaSpinner = styled('div')({
  width: 30,
  fontSize: 20
});

const UserMediaBody = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});

const UserMediaCaret = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // fontSize: 11,
  paddingLeft: 8
});

const UserMediaUsername = styled('div')({
  fontSize: 16,
  lineHeight: 1.2,
  color: '#26c5df',

  '&:not(:last-child)': {
    marginBottom: 4
  }
});

const UserMediaLoadingText = styled(UserMediaUsername)({
  color: 'white'
});

const UserMediaSublabel = styled('div')({
  flex: 1,
  display: 'flex',
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)'
});

export interface Props {
  children?: any;
  className?: string;
  isActive?: boolean;
  isLoading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  username?: string;
  sublabel?: string;
  caret?: boolean;
}

export function UserMedia(props: Props) {
  const {
    isActive,
    isLoading,
    onClick,
    username,
    sublabel,
    className,
    caret
  } = props;

  return (
    <UserMediaRoot onClick={onClick} isActive={isActive} className={className}>
      <UserMediaFigure>
        {isLoading ? (
          <UserMediaSpinner>
            <SpinnerIcon size={20} />
          </UserMediaSpinner>
        ) : (
          <UserAvatar />
        )}
      </UserMediaFigure>

      {isLoading ? (
        <UserMediaBody>
          <UserMediaLoadingText>Loading...</UserMediaLoadingText>
          <UserMediaSublabel>User data is being loaded</UserMediaSublabel>
        </UserMediaBody>
      ) : (
        <UserMediaBody>
          <UserMediaUsername>{username || 'unknown'}</UserMediaUsername>
          {sublabel ? <UserMediaSublabel>{sublabel}</UserMediaSublabel> : null}
        </UserMediaBody>
      )}

      {caret &&
        !isLoading && (
          <UserMediaCaret>
            <ArrowDown />
          </UserMediaCaret>
        )}
    </UserMediaRoot>
  );
}

export default UserMedia;
