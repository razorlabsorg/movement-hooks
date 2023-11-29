// eslint-disable-next-line import/extensions
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector.js'
import { AptosClient } from 'movement-sdk'
import { GetProviderArgs, getProvider, watchProvider } from 'movement-hooks/core'

export type UseProviderArgs = Partial<GetProviderArgs>

export function useProvider<TProvider extends AptosClient = AptosClient>({ networkName }: UseProviderArgs = {}) {
  return useSyncExternalStoreWithSelector(
    (cb) => watchProvider<TProvider>({ networkName }, cb),
    () => getProvider<TProvider>({ networkName }),
    () => getProvider<TProvider>({ networkName }),
    (x) => x,
  )
}
