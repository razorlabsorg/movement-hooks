import { Types } from 'movement-sdk'
import { Chain } from '../../chain'
import { Connector, ConnectorData } from '../base'
import { Account, SignMessagePayload, SignMessageResponse } from '../types'
import { MockProvider, MockProviderOptions } from './provider'

export class MockConnector extends Connector {
  readonly id = 'mock'
  readonly name = 'Mock'
  readonly ready = true

  provider?: MockProvider
  options: MockProviderOptions

  // eslint-disable-next-line no-useless-constructor
  constructor(config: { chains?: Chain[]; options: MockProviderOptions }) {
    super(config)
    this.options = config.options
  }

  async connect() {
    const provider = await this.getProvider()

    if (provider.onAccountChange) provider.onAccountChange(this.onAccountsChanged)
    if (provider.onNetworkChange) provider.onNetworkChange(this.onNetworkChanged)
    if (provider.onDisconnect) provider.onDisconnect(this.onDisconnect)

    this.emit('message', { type: 'connecting' })

    const account = await provider?.connect()
    const network = await provider?.network()
    const data: Required<ConnectorData> = {
      account: {
        address: account!.address,
        publicKey: account?.publicKey,
      },
      provider,
      network: network!,
    }

    return new Promise<Required<ConnectorData>>((res) => setTimeout(() => res(data), 100))
  }

  async disconnect() {
    const provider = await this.getProvider()
    await provider.disconnect()
  }

  async network(): Promise<string> {
    const provider = await this.getProvider()
    return provider.network()
  }

  async isConnected(): Promise<boolean> {
    const provider = await this.getProvider()
    return provider?.isConnected()
  }

  async account() {
    const provider = await this.getProvider()
    return provider.account()
  }

  async getProvider() {
    if (!this.provider) this.provider = new MockProvider(this.options)
    return this.provider
  }

  async signAndSubmitTransaction(transaction?: Types.EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!transaction) throw new Error('missing transaction')
    return provider?.signAndSubmitTransaction(transaction)
  }

  async signTransaction(transaction?: Types.EntryFunctionPayload): Promise<Uint8Array> {
    const provider = await this.getProvider()
    if (!transaction) throw new Error('missing transaction')
    return provider?.signTransaction(transaction)
  }

  async signMessage(payload?: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!payload) throw new Error('missing payload')
    return provider?.signMessage(payload)
  }

  isChainUnsupported(_networkName: string): boolean {
    return false
  }

  protected onAccountsChanged = (account?: Account) => {
    this.emit('change', { account })
  }

  protected onNetworkChanged = (network: { networkName: string }) => {
    this.emit('change', { network: network.networkName })
  }
  protected onDisconnect = () => {
    this.emit('disconnect')
  }

  toJSON() {
    return '<MockConnector>'
  }
}
