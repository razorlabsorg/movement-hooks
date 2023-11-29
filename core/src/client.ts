import { AptosClient } from "movement-sdk";
import { Connector } from "./connectors";
import { ClientStorage } from "./storage";

export type ClientConfig<TProvider extends AptosClient = AptosClient> = {
  /** Enables reconnecting to last used connector on init */
  autoConnect?: boolean
  /**
   * Connectors used for linking accounts
   * @default [new RazorConnector()]
   */
  connectors?: (() => Connector[]) | Connector[]
  /** Interface for connecting to network */
  provider: ((config: { networkName?: string }) => TProvider) | TProvider
  /**
   * Custom storage for data persistance
   * @default window.localStorage
   */
  storage?: ClientStorage
}