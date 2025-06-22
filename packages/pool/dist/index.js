import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CB65QXDBUJO6PR7WVKPWVUZSX76UGLQV26LK3ZP24CXJHD4DSF6KXQLV",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { peer_contract, wasm_hash, symbol, name }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ peer_contract, wasm_hash, symbol, name }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABFBvb2wAAAAFAAAAAAAAAAhrX2ZhY3RvcgAAAAsAAAAAAAAADnRva2VuX2Ftb3VudF94AAAAAAALAAAAAAAAAA50b2tlbl9hbW91bnRfeQAAAAAACwAAAAAAAAAHdG9rZW5feAAAAAATAAAAAAAAAAd0b2tlbl95AAAAABM=",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAADXBlZXJfY29udHJhY3QAAAAAAAATAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAAAAAARuYW1lAAAAEAAAAAA=",
            "AAAAAAAAAFxTd2FwIHRva2VucyB1c2luZyBjb25zdGFudCBwcm9kdWN0IGZvcm11bGEgKHggKiB5ID0gaykKUmV0dXJucyB0aGUgYW1vdW50IG9mIHRva2VucyByZWNlaXZlZAAAAARzd2FwAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAdpc19pbl94AAAAAAEAAAAAAAAACWFtb3VudF9pbgAAAAAAAAsAAAABAAAACw==",
            "AAAAAAAAAAAAAAAJZ2V0X3F1b3RlAAAAAAAAAgAAAAAAAAAHaXNfaW5feAAAAAABAAAAAAAAAAlhbW91bnRfaW4AAAAAAAALAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAANZGVwbG95X3RvX2RleAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAANZ2V0X3Bvb2xfaW5mbwAAAAAAAAAAAAABAAAH0AAAAARQb29s"]), options);
        this.options = options;
    }
    fromJSON = {
        swap: (this.txFromJSON),
        get_quote: (this.txFromJSON),
        deploy_to_dex: (this.txFromJSON),
        get_pool_info: (this.txFromJSON)
    };
}
