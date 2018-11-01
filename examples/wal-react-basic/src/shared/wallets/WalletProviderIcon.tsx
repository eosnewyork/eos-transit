import React from 'react';
import { IoIosUnlock } from 'react-icons/io';
import { FiCopy } from 'react-icons/fi';
import { ScatterLogo } from '../ScatterLogo';
import { MetroLogo } from '../MetroLogo';

const defaultIcon = IoIosUnlock;

const providerIcons = {
  'eos-metro': MetroLogo,
  'scatter-desktop': ScatterLogo,
  'paste-the-private-key': FiCopy
};

interface WalletProviderIconProps {
  providerId?: string;
}

export function WalletProviderIcon({ providerId }: WalletProviderIconProps) {
  const IconComponent =
    (providerId && providerIcons[providerId]) || defaultIcon;

  return <IconComponent />;
}

export default WalletProviderIcon;
