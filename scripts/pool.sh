stellar contract upload \                                                                       
  --wasm ../rugfun/target/wasm32v1-none/release/fungible_token.wasm \
  --source alice \
  --network testnet \
 

KEY_NAME="alice"
CONTRACT_ID="CD7LAIDP3HLUTNXGI54NFKPKQC2IKVLL7RVU4GHHQTGAQBIIWX57V563"
OWNER_ACCOUNT="$(stellar keys show $KEY_NAME)"
WASM_HASH="197554fbf89a87e80ed0540437701e7e94db7ca75e12049dbbf6ad29dd77afab"
SYMBOL="PEPE"
NAME="PP"

stellar contract deploy \
  --wasm ./target/wasm32v1-none/release/pool.wasm \
  --source alice \
  --network testnet \
  --alias pool \
  -- \
  --peer_contract "$CONTRACT_ID" \
  --wasm_hash "$WASM_HASH" \
  --symbol "$SYMBOL" \
  --name "$NAME"

