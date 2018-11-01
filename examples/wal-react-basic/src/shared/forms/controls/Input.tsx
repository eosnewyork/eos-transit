import React from 'react';
import styled from 'react-emotion';

export const Input = styled('input')({
  padding: 18,
  fontSize: 16,
  borderStyle: 'solid',
  borderWidth: 1,
  // borderBottomWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  // borderColor: 'rgba(255, 255, 255, 0.45)',
  borderRadius: 2,
  color: 'white',
  backgroundColor: 'transparent',
  outline: 'none',
  transition: 'all 0.2s',

  '&:focus': {
    borderColor: '#26c5df'
  },

  '&:not([type=checkbox]):not([type=file])': {
    width: '100%'
  },

  '&[disabled]': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: 'rgba(255, 255, 255, 0.3)'
  }
});

Input.displayName = 'Input';

export default Input;
