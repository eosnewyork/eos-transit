import React, { ComponentType, ReactNode } from 'react';
import styled from 'react-emotion';

export interface MenuSectionHeaderButtonRootProps {
  iconOnly?: boolean;
  danger?: boolean;
}

export const MenuSectionHeaderButtonRoot = styled('div')(
  {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: 1,
    fontSize: 11,
    fontWeight: 300,
    backgroundColor: '#20252f',
    color: 'white',
    textAlign: 'center',
    outline: 'none',
    transition: 'all 0.2s',
    textTransform: 'uppercase',

    '&:hover': {
      backgroundColor: '#2e3542',
      color: 'white',
      cursor: 'pointer',
      borderColor: '#346f77'
    },

    '&:active': {
      backgroundColor: '#40495a',
      // backgroundColor: '#26c5df',
      borderColor: 'transparent'
    }
  },
  ({ iconOnly, danger }: MenuSectionHeaderButtonRootProps) => {
    const style = {};

    if (iconOnly) {
      Object.assign(style, { paddingLeft: 6, paddingRight: 6 });
    }

    if (danger) {
      Object.assign(style, {
        '&:hover, &:active': {
          backgroundColor: '#802e38'
        }
      });
    }

    return style;
  }
);

export const MenuSectionHeaderButtonIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  opacity: 0.5,

  '&:not(:last-child)': {
    marginRight: 6
  }
});

export const MenuSectionHeaderButtonText = styled('div')({
  flex: 1,
  textAlign: 'center'
});

export interface MenuSectionHeaderButtonProps {
  icon?: ComponentType;
  iconOnly?: boolean;
  danger?: boolean;
  children?: ReactNode;
  onClick?: (event: any) => void;
}

export function MenuSectionHeaderButton({
  onClick,
  icon,
  iconOnly,
  danger,
  children
}: MenuSectionHeaderButtonProps) {
  const Icon = icon;

  return (
    <MenuSectionHeaderButtonRoot
      onClick={onClick}
      iconOnly={iconOnly}
      danger={danger}
    >
      {Icon && (
        <MenuSectionHeaderButtonIcon>
          <Icon />
        </MenuSectionHeaderButtonIcon>
      )}

      {children && (
        <MenuSectionHeaderButtonText>{children}</MenuSectionHeaderButtonText>
      )}
    </MenuSectionHeaderButtonRoot>
  );
}

export default MenuSectionHeaderButton;
