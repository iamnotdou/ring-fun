import { RPC_URL } from "@/config"

import * as Client from "../../packages/pool/dist/index"

export default new Client.Client({
  ...Client.networks.testnet,
  rpcUrl: RPC_URL,
  allowHttp: true,
})
