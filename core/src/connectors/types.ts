import { AptosClient, Types } from "movement-sdk"
import { Address } from "../types"

export interface SignMessagePayload {
  address?: boolean // Should we include the address of the account in the message
  application?: boolean // Should we include the domain of the dapp
  chainId?: boolean // Should we include the current chain id the wallet is connected to
  message: string // The message to be signed and displayed to the user
  nonce: string // A nonce the dapp should generate
}

export interface SignMessageResponse {
  address?: Address | string
  application?: string
  chainId?: number
  fullMessage: string // The message that was generated to sign
  message: string // The message passed in by the user
  nonce: string
  prefix: 'MOVEMENT' // Should always be MOVEMENT
  signature: string | string[] // The signed full message
  bitmap?: Uint8Array
}

export type Account = {
  address: Address
  publicKey?: string | string[]
}

export interface Movement {
    account(): Promise<Account>
    connect(): Promise<Account>
    disconnect(): Promise<void>
  
    isConnected(): Promise<boolean>
    network(): Promise<string>
    signAndSubmitTransaction(
      transaction: Types.EntryFunctionPayload,
      options?: Partial<Types.SubmitTransactionRequest>,
    ): ReturnType<AptosClient['submitTransaction']>
    signMessage(message?: SignMessagePayload): Promise<SignMessageResponse>
    signTransaction(transaction: Types.EntryFunctionPayload): ReturnType<AptosClient['signTransaction']>
    on?: any
    onAccountChange?(listener: (account: Account) => void): void
    onNetworkChange?(listener: (network: string) => void): void
    onDisconnect?(listener: () => void): void
}

export enum WalletAdapterNetwork {
    Testnet = 'testnet',
}

export type NetworkInfo = {
    api?: string
    chainId?: string
    name: WalletAdapterNetwork | undefined
}