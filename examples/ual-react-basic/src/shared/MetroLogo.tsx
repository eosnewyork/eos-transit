import React from 'react';
import styled from 'react-emotion';

const MetroLogoRoot = styled('div')({
  '& > svg': {
    width: '100%'
  }
});

export function MetroLogo() {
  return (
    <MetroLogoRoot>
      <svg viewBox="0 0 42 45" version="1.1">
        <path
          fill="currentColor"
        />
      </svg>
    </MetroLogoRoot>
  );
}
