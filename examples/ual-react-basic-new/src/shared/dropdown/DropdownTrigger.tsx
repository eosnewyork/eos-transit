import React, { ReactNode, MouseEvent } from 'react';

export interface Props {
  children?: ReactNode;
  onTriggerClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function DropdownTrigger({ children, onTriggerClick }: Props) {
  return <div onClick={onTriggerClick}>{children}</div>;
}

export default DropdownTrigger;
