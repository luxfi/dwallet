import { IS_RUNTIME_PRODUCTION } from '@/isomorphic/constants';
import {
  LuxXContollerMethods,
  LuxXContollerMeththodNames,
  LuxXContollerNS,
  LuxXMethods,
} from '@/isomorphic/types/luxx';

function fixArgs(
  key: keyof LuxXMethods,
  args: Parameters<LuxXMethods[typeof key]>
) {
  const newArgs = [...args] as typeof args;
  switch (key) {
    default:
      break;
  }

  return newArgs;
}

/**
 * @description make etch rpc client, based on fetch(by default), or Axios Client
 */
function makeLuxXController<T extends LuxXContollerNS>(namespace: T) {
  const luxxClient = new Proxy<{
    [P in LuxXContollerMeththodNames[T]]: LuxXContollerMethods[T][P];
  }>({} as any, {
    get(_, prop: LuxXContollerMeththodNames[T]) {
      return async function (...args: any[]) {
        const fixedArgs = fixArgs(prop as keyof LuxXMethods, args as any);

        const method = `${namespace}.${prop}`;
        return window.rabbyDesktop?.ipcRenderer
          .invoke('__internal_rpc:luxx-rpc:query', {
            method,
            params: fixedArgs,
          })
          .then((event) => {
            // leave here for debug
            // console.debug(
            //   '[debug] __internal_rpc:luxx-rpc:query event back',
            //   event
            // );
            if (event.error) {
              // const err = new Error(`[luxx-controller] message: '${event.error.message}'; code: '${event.error.code}';`);
              // (err as any).rpcError = event.error;
              if (!IS_RUNTIME_PRODUCTION) {
                console.error(
                  `[luxx-controller] error on calling '${method}'`,
                  event.error
                );
              }
              throw event.error;
            }

            return event.result;
          });
      };
    },
  });

  return luxxClient;
}

export const walletController = makeLuxXController('walletController');
export const walletOpenapi = makeLuxXController('openapi');
export const walletTestnetOpenapi = makeLuxXController(
  'testnetOpenapi' as 'openapi'
);
export const permissionService = makeLuxXController('permissionService');
