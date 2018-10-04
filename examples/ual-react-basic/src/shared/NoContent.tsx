import React, { ComponentType } from 'react';
import styled from 'react-emotion';

const NoContentRoot = styled('div')({
  flex: 1,
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  // padding: '10px'
});

const NoContentFrame = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '50px 20px',
  border: '1px dashed rgba(255, 255, 255, 0.3)',
  textAlign: 'center'
});

const NoContentIcon = styled('div')({
  fontSize: 36,
  color: 'rgba(255, 255, 255, 0.8)',

  '&:not(:last-child)': {
    marginBottom: 20
  }
});

const Message = styled('div')({
  fontSize: 14,
  color: 'rgba(255, 255, 255, 1)',
  lineHeight: 1.2,

  '&:not(:last-child)': {
    marginBottom: 10
  }
});

const Sublabel = styled('div')({
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.4)',
  lineHeight: 1.2
});

export interface Props {
  className?: string;
  message: string;
  note?: string;
  icon?: ComponentType;
}

export function NoContent({ icon, message, note, className }: Props) {
  const Icon = icon;

  return (
    <NoContentRoot className={className}>
      <NoContentFrame>
        {Icon && (
          <NoContentIcon>
            <Icon />
          </NoContentIcon>
        )}
        <Message>{message}</Message>
        <Sublabel>{note}</Sublabel>
      </NoContentFrame>
    </NoContentRoot>
  );
}

export default NoContent;
