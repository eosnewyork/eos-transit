import React, { Component, ReactNode, createContext } from 'react';
import onClickOutside, { InjectedOnClickOutProps } from 'react-onclickoutside';
import { DropdownContainer } from './DropdownContainer';

export interface DropdownChildrenFnArg {
  isExpanded: boolean;
  toggle: () => void;
}

export interface DropdownProps {
  children?: (dropdownState: DropdownChildrenFnArg) => ReactNode;
  isExpanded?: boolean; // TODO: Handle passed force-state
  closesOn?: string; // TODO: Type more precisely and implement
}

export interface State {
  isExpanded: boolean;
}

export class Dropdown extends Component<
  DropdownProps & InjectedOnClickOutProps,
  State
> {
  state = { isExpanded: false };

  toggle = () => {
    this.setState(state => ({ isExpanded: !state.isExpanded }));
  };

  handleClickOutside = (event: any) => {
    if (!this.props.closesOn || this.props.closesOn === 'clickOutside') {
      this.setState({ isExpanded: false });
    }
  };

  render() {
    const { toggle } = this;
    const { isExpanded } = this.state;
    const { children } = this.props;

    return (
      <DropdownContainer>
        {children ? children({ isExpanded, toggle }) : null}
      </DropdownContainer>
    );
  }
}

export default onClickOutside(Dropdown);
