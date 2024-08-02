import PortMessage from '@/extension-wallet/utils/message/portMessage';
import type {
  LuxXContollerMethods,
  LuxXContollerMeththodNames,
  LuxXContollerNS,
} from '@/isomorphic/types/rabbyx';
import eventBus from './eventBus';

export type ShellWalletType<T extends LuxXContollerNS = 'walletController'> = {
  [P in LuxXContollerMeththodNames[T]]: LuxXContollerMethods[T][P];
};

export function makeShellWallet<T extends LuxXContollerNS = 'walletController'>(
  luxxExtId: string
): ShellWalletType<T> {
  const portMessageChannel = new PortMessage({ luxxExtId });

  portMessageChannel.connect('rabbyDesktop');

  const wallet = new Proxy(
    {},
    {
      get(_t1, key) {
        switch (key) {
          case 'openapi':
            return new Proxy(
              {},
              {
                get(_t2, openapiKey) {
                  return function (...params: any) {
                    return portMessageChannel.request({
                      type: 'openapi',
                      method: openapiKey,
                      params,
                    });
                  };
                },
              }
            );
            break;
          case 'testnetOpenapi':
            return new Proxy(
              {},
              {
                get(_t2, openapiKey) {
                  return function (...params: any) {
                    return portMessageChannel.request({
                      type: 'testnetOpenapi',
                      method: openapiKey,
                      params,
                    });
                  };
                },
              }
            );
            break;
          default:
            return function (...params: any) {
              return portMessageChannel.request({
                type: 'controller',
                method: key,
                params,
              });
            };
        }
      },
    }
  ) as any;

  portMessageChannel.on('message', (data) => {
    if (data.event === 'broadcast') {
      eventBus.emit(data.data.type, data.data.data);
    }
  });

  eventBus.addEventListener('broadcastToBackground', (data) => {
    portMessageChannel.request({
      type: 'broadcast',
      method: data.method,
      params: data.data,
    });
  });

  return wallet;
}
