import { Types } from 'movement-sdk'

import { getProvider } from '../providers'

export type FetchLedgerArgs = {
  networkName?: string
}

// Return type of exported function has or is using name 'RoleType' from external module
export type FetchLedgerResult = Omit<Types.IndexResponse, 'role'> & {
  role: Types.RoleType
}

export async function fetchLedgerInfo({ networkName }: FetchLedgerArgs = {}): Promise<FetchLedgerResult> {
  const provider = getProvider({ networkName })
  const ledger = await provider.getLedgerInfo()
  return ledger as FetchLedgerResult
}

export type WatchLedgerArgs = { listen: boolean }
export type WatchLedgerCallback = (ledger: FetchLedgerResult) => void
