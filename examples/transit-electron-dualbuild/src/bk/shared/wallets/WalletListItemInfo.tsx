import React from 'react';
import styled from 'react-emotion';
import { AccountInfo } from 'eos-transit';
import { toNumber } from '../helpers';

// TODO: Make expandable

// Visual components

interface WalletListItemInfoProps {
  accountInfo: AccountInfo;
  compact?: boolean;
}

export const WalletListItemInfoRoot = styled('div')({
  // display: 'flex',
  // alignItems: 'flex-start',
  width: '100%',
  paddingTop: 12
  // borderTop: '1px solid rgba(0, 0, 0, 0.2)'
});

export const WalletListItemInfoMain = styled('div')({
  fontSize: 14,
  fontWeight: 300,

  '&:not(:last-child)': {
    marginBottom: 8
  },

  '& strong': {
    fontWeight: 400
  },

  '& small': {
    fontSize: 12
  }
});

export const WalletListItemInfoParams = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 8,
  paddingTop: 8,
  borderTop: '1px solid rgba(0, 0, 0, 0.2)'
});

export const WalletListItemInfoParam = styled('div')({
  display: 'flex',
  alignItems: 'center',
  minWidth: 60,
  padding: '0 10px 4px 0',
  fontSize: 11
});

export const WalletListItemInfoParamHeading = styled('div')({
  width: 27,
  fontSize: 9,
  fontWeight: 300,
  // color: 'rgba(255, 255, 255, 0.8)',
  color: 'white',
  textTransform: 'uppercase'
});

export const WalletListItemInfoParamContent = styled('div')({
  flex: 1,
  fontSize: 11,
  fontWeight: 600,
  color: '#26c5df'
});

// Exported / behavior component

export function WalletListItemInfo({
  accountInfo,
  compact
}: WalletListItemInfoProps) {
  return (
    <WalletListItemInfoRoot>
      <WalletListItemInfoMain>
        <strong>{toNumber(accountInfo.core_liquid_balance).toFixed(4)}</strong>{' '}
        <small>EOS</small>
      </WalletListItemInfoMain>

      {!compact && (
        <WalletListItemInfoParams>
          <WalletListItemInfoParam>
            <WalletListItemInfoParamHeading>RAM</WalletListItemInfoParamHeading>
            <WalletListItemInfoParamContent>
              {`${accountInfo.ram_quota} Kb`}
            </WalletListItemInfoParamContent>
          </WalletListItemInfoParam>

          <WalletListItemInfoParam>
            <WalletListItemInfoParamHeading>CPU</WalletListItemInfoParamHeading>
            <WalletListItemInfoParamContent>
              {`${accountInfo.cpu_limit.available} ms`}
            </WalletListItemInfoParamContent>
          </WalletListItemInfoParam>

          <WalletListItemInfoParam>
            <WalletListItemInfoParamHeading>NET</WalletListItemInfoParamHeading>
            <WalletListItemInfoParamContent>
              {`${accountInfo.net_limit.available} KiB`}
            </WalletListItemInfoParamContent>
          </WalletListItemInfoParam>
        </WalletListItemInfoParams>
      )}
    </WalletListItemInfoRoot>
  );
}

export default WalletListItemInfo;
