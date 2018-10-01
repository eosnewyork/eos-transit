import React from 'react';
import styled from 'react-emotion';

export const ScreenContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'stretch'
});

export const ScreenContentHeader = styled('header')({
  display: 'flex',
  padding: '25px 30px'
});

export const ScreenContentHeaderMain = styled('div')({
  flex: 1
});

export interface ScreenContentBodyProps {
  flex?: boolean;
}

export const ScreenContentBody = styled('main')(
  {
    flex: 1,
    margin: '0 auto',
    padding: '30px 0'
  },
  ({ flex }: ScreenContentBodyProps) => ({
    display: flex !== false ? 'flex' : 'block'
  })
);

export interface ScreenContentBodyContainerProps {
  flex?: boolean;
}

export const ScreenContentBodyContainer = styled('div')(
  {
    maxWidth: 480,
    width: 480
  },
  ({ flex }: ScreenContentBodyContainerProps) => ({
    display: flex !== false ? 'flex' : 'block',
    flexDirection: 'column'
  })
);

export const ScreenContentFooter = styled('footer')({});
