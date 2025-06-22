#!/usr/bin/env bash
set -euo pipefail
# Path to your compiled WASM (adjust target name if you're using `wasm32-unknown-unknown`)
WASM_PATH="target/wasm32v1-none/release/fungible_token.wasm"
NETWORK_PASSPHRASE="Test SDF Network ; September 2022"
# The Soroban CLI–imported key name or raw secret seed
# (you must have done `soroban auth import --seed <YOUR_SECRET>` or 
#  `soroban keys generate --global alice --network testnet --fund`)
KEY_NAME="alice"
OWNER_ACCOUNT="$(stellar keys show $KEY_NAME)"
INITIAL_SUPPLY=100000000
SYMBOL="RUGFUN"
NAME="RF"

CONTRACT_ID=$(stellar contract deploy \
  --wasm "$WASM_PATH" \
  --source alice \
  --network testnet \
  -- \
  --owner "$OWNER_ACCOUNT" \
  --cap "$INITIAL_SUPPLY" \
  --symbol "$SYMBOL" \
  --name "$NAME" \
| tail -n1)

