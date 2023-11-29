export type BlockExplorer = { name: string; url: string; params?: Record<string, string> }

export type Chain = {
  /** ID in number form */
  id: number
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Collection of Node url endpoints */
  nodeUrls: {
    [key: string]: string
    default: string
  }
  /** Collection of block explorers */
  blockExplorers?: {
    [key: string]: BlockExplorer
    default: BlockExplorer
  }
  /** Flag for test networks */
  testnet?: boolean
} & (MainnetChain | TestnetChain)

type MainnetChain = {
  testnet?: false
}

type TestnetChain = {
  testnet: true
  faucetUrl: string
}

export const testnet: Chain = {
  id: 4,
  name: 'Testnet',
  network: 'testnet',
  nodeUrls: {
    default: 'https://seed-node1.movementlabs.xyz/v1',
  },
  blockExplorers: {
    default: {
      name: 'Movement Explorer',
      url: 'https://explorer.movementlabs.xyz',
      params: {
        network: 'testnet',
      },
    },
  },
  testnet: true,
  faucetUrl: 'https://seed-node1.movementlabs.xyz/v1',
}

export const defaultChains = [testnet]

export const defaultChain = testnet