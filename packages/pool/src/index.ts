import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CB65QXDBUJO6PR7WVKPWVUZSX76UGLQV26LK3ZP24CXJHD4DSF6KXQLV",
  }
} as const


export interface Pool {
  k_factor: i128;
  token_amount_x: i128;
  token_amount_y: i128;
  token_x: string;
  token_y: string;
}

export interface Client {
  /**
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Swap tokens using constant product formula (x * y = k)
   * Returns the amount of tokens received
   */
  swap: ({caller, is_in_x, amount_in}: {caller: string, is_in_x: boolean, amount_in: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_quote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_quote: ({is_in_x, amount_in}: {is_in_x: boolean, amount_in: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a deploy_to_dex transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deploy_to_dex: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_pool_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_info: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Pool>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {peer_contract, wasm_hash, symbol, name}: {peer_contract: string, wasm_hash: Buffer, symbol: string, name: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({peer_contract, wasm_hash, symbol, name}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABFBvb2wAAAAFAAAAAAAAAAhrX2ZhY3RvcgAAAAsAAAAAAAAADnRva2VuX2Ftb3VudF94AAAAAAALAAAAAAAAAA50b2tlbl9hbW91bnRfeQAAAAAACwAAAAAAAAAHdG9rZW5feAAAAAATAAAAAAAAAAd0b2tlbl95AAAAABM=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAADXBlZXJfY29udHJhY3QAAAAAAAATAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAAAAAARuYW1lAAAAEAAAAAA=",
        "AAAAAAAAAFxTd2FwIHRva2VucyB1c2luZyBjb25zdGFudCBwcm9kdWN0IGZvcm11bGEgKHggKiB5ID0gaykKUmV0dXJucyB0aGUgYW1vdW50IG9mIHRva2VucyByZWNlaXZlZAAAAARzd2FwAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAdpc19pbl94AAAAAAEAAAAAAAAACWFtb3VudF9pbgAAAAAAAAsAAAABAAAACw==",
        "AAAAAAAAAAAAAAAJZ2V0X3F1b3RlAAAAAAAAAgAAAAAAAAAHaXNfaW5feAAAAAABAAAAAAAAAAlhbW91bnRfaW4AAAAAAAALAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAANZGVwbG95X3RvX2RleAAAAAAAAAAAAAAA",
        "AAAAAAAAAAAAAAANZ2V0X3Bvb2xfaW5mbwAAAAAAAAAAAAABAAAH0AAAAARQb29s" ]),
      options
    )
  }
  public readonly fromJSON = {
    swap: this.txFromJSON<i128>,
        get_quote: this.txFromJSON<i128>,
        deploy_to_dex: this.txFromJSON<null>,
        get_pool_info: this.txFromJSON<Pool>
  }
}