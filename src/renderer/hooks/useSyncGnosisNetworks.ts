import { useEffect } from 'react';
import { walletController } from '../ipcRequest/luxx';

export const useSyncGnosisNetworks = (address?: string) => {
  useEffect(() => {
    if (address) {
      walletController.syncGnosisNetworks(address);
    }
  }, [address]);
};
