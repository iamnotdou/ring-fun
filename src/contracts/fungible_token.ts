import { RPC_URL } from "@/config"
import * as Client from "fungible_token"

export default new Client.Client({
  ...Client.networks.testnet,
  rpcUrl: RPC_URL,
  allowHttp: true,
})
