import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Wallet } from 'eos-transit';
import { Dropdown, DropdownContainer, DropdownContent } from '../dropdown';
import { TransactionAddonButton } from './TransactionAddonButton';
import TransactionAddonMenu from './TransactionAddonMenu';

export interface TransactionAddonBlockProps {
  disabled?: boolean;
  success?: boolean;
  danger?: boolean;
  onWalletSelect?: (wallet: Wallet) => void;
}

export function TransactionAddonBlock({
  disabled,
  success,
  danger,
  onWalletSelect
}: TransactionAddonBlockProps) {
  return disabled ? (
    <TransactionAddonButton disabled={true} success={success} danger={danger}>
      <IoIosArrowDown />
    </TransactionAddonButton>
  ) : (
    <Dropdown>
      {({ isExpanded, toggle }) => (
        <DropdownContainer>
          <TransactionAddonButton
            onClick={toggle}
            danger={danger}
            success={success}
          >
            <IoIosArrowDown />
          </TransactionAddonButton>

          <DropdownContent visible={isExpanded} alignRight={true}>
            <TransactionAddonMenu onWalletSelect={onWalletSelect} />
          </DropdownContent>
        </DropdownContainer>
      )}
    </Dropdown>
  );
}

export default TransactionAddonBlock;
