import React from 'react';
import { IoIosLock } from 'react-icons/io';

const defaultIcon = IoIosLock;

const providerIcons = {
  'scatter-dektop': IoIosLock,
  'eos-metro': IoIosLock,
  'paste-the-private-key': IoIosLock
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
