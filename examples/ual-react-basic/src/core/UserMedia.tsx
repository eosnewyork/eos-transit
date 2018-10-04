import React from 'react';
import styled from 'react-emotion';
import { IoIosArrowDown as ArrowDown } from 'react-icons/io';
import { SpinnerIcon } from '../shared/icons/SpinnerIcon';
import UserAvatar from './UserAvatar';

export interface UserMediaRootProps {
  isActive?: boolean;
  faded?: boolean;
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
  ({ isActive, faded }: UserMediaRootProps) => {
    const style = {};

    if (isActive) {
      Object.assign(style, {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',

        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.25)'
        }
      });
    }

    if (faded) {
      Object.assign(style, {
        color: 'rgba(255, 255, 255, 0.3)'
      });
    }

    return style;
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

interface UserMediaUsernameProps {
  faded?: boolean;
}

const UserMediaUsername = styled('div')(
  {
    fontSize: 16,
    lineHeight: 1.2,
    transition: 'all 0.2s',

    '&:not(:last-child)': {
      marginBottom: 4
    }
  },
  ({ faded }: UserMediaUsernameProps) => ({
    color: faded ? 'rgba(255, 255, 255, 0.3)' : '#26c5df'
  })
);

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
  isAnonymous?: boolean;
  isLoading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  username?: string;
  sublabel?: string;
  caret?: boolean;
}

export function UserMedia(props: Props) {
  const {
    isActive,
    isAnonymous,
    isLoading,
    onClick,
    username,
    sublabel,
    className,
    caret
  } = props;

  return (
    <UserMediaRoot
      onClick={onClick}
      isActive={isActive}
      faded={isAnonymous}
      className={className}
    >
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
          <UserMediaUsername faded={isAnonymous}>
            {username || 'unknown'}
          </UserMediaUsername>
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
