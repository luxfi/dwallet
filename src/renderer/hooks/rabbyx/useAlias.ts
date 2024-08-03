import { walletController } from '@/renderer/ipcRequest/luxx';
import { useCallback, useEffect, useState } from 'react';

export const useAlias = (address: string) => {
  const [name, setName] = useState<string>();
  useEffect(() => {
    if (address) {
      walletController.getAlianName(address).then(setName);
    }
  }, [address]);

  const updateAlias = useCallback(
    async (alias: string) => {
      await walletController.updateAlianName(address, alias);
      setName(alias);
    },
    [address]
  );

  return [name, updateAlias] as const;
};
