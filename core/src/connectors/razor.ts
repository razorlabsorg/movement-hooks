import { AptosClient, Types } from "movement-sdk"
import { Account, SignMessagePayload, SignMessageResponse } from "./types"
import { Connector } from "./base"
import { Chain } from "../chain"
import { ConnectorNotFoundError } from "../errors"
import { Address } from "../types"

type NetworkInfo = {
    api: string
    name: string
    chainId: string
}

declare global {
    interface Window {
        razor?: {
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
            onAccountChange?(listener: (account: Account) => void): void
            onNetworkChange?(listener: (network: { networkName: string }) => void): void
        }
    }
}

export type RazorConnectorOptions = {
  /** Id of connector */
  id?: string
  /** Name of connector */
  name?: string
}

export class RazorConnector extends Connector<Window['razor'], RazorConnectorOptions> {
  readonly id: string

  readonly name: string

  readonly ready = typeof window !== 'undefined' && !!window.razor

  provider?: Window['razor']

  constructor(config: { chains?: Chain[]; options?: RazorConnectorOptions } = {}) {
    super(config)

    let name = 'Razor'
    const overrideName = config.options?.name
    if (typeof overrideName === 'string') name = overrideName
    this.id = config.options?.id || 'razor'
    this.name = name
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.onAccountChange) provider.onAccountChange(this.onAccountsChanged)
      if (provider.onNetworkChange) provider.onNetworkChange(this.onNetworkChanged)

      this.emit('message', { type: 'connecting' })

      const account = await provider.connect()
      const network = await this.network()

      return {
        account,
        network,
        provider,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider) return
    // eslint-disable-next-line consistent-return
    return provider.disconnect()
  }

  async account() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.account()
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.network()
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.razor) this.provider = window.razor
    return this.provider
  }

  async isConnected() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      return provider.isConnected()
    } catch {
      return false
    }
  }

  async signAndSubmitTransaction(tx: Types.EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signAndSubmitTransaction(tx)
  }

  async signTransaction(tx: Types.EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(tx)
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const response = await provider.signMessage(message)

    return response
  }

  protected onAccountsChanged = (account: Account) => {
    if (!account.address) {
      this.emit('disconnect')
    } else {
      this.emit('change', { account })
    }
  }

  protected onNetworkChanged = (network: { networkName: string }) => {
    this.emit('change', { network: network.networkName })
  }
  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}