#![cfg(test)]
extern crate std;
use soroban_sdk::{contract, testutils::Address as _, Address, BytesN, Env, String};

mod contract {
    use soroban_sdk::contractimport;

    contractimport!(file = "../../target/wasm32v1-none/release/fungible_token.wasm");
}

use crate::contract::{SwapContract, SwapContractClient};
use fungible_token::contract::{MyFungibleToken, MyFungibleTokenClient};

#[contract]
struct MockContract;

fn create_client<'a>(
    e: &Env,
    user: Address,
    symbol: String,
    name: String,
) -> (SwapContractClient<'a>, MyFungibleTokenClient<'a>) {
    let salt = BytesN::from_array(e, &[0u8; 32]);
    let wasm_hash = e.deployer().upload_contract_wasm(contract::WASM);

    let main_symbol = String::from_str(e, "RUGFUN");
    let main_name = String::from_str(e, "RF");

    let token_constructor_params = (user, 100000000_i128, main_symbol, main_name);
    let token_contract_address = e.register(MyFungibleToken, token_constructor_params);

    let address = e.register(
        SwapContract,
        (token_contract_address.clone(), wasm_hash, symbol, name),
    );

    (
        SwapContractClient::new(e, &address),
        MyFungibleTokenClient::new(e, &token_contract_address),
    )
}

#[test]
fn mint_under_cap() {
    let e = Env::default();
    e.mock_all_auths();
    let symbol = String::from_str(&e, "PEPE");
    let name = String::from_str(&e, "PEPE THE MOON");
    let user = Address::generate(&e);
    let (pool_client, peer_token_client) = create_client(&e, user.clone(), symbol, name);

    peer_token_client.mint(&user, &1000000);
    peer_token_client.approve(&user, &pool_client.address, &50000, &0);

    pool_client.swap(&user, &false, &50000);

    let pool_data = pool_client.get_pool_info();

    assert_eq!(pool_data.token_amount_x, 66666);
    assert_eq!(pool_data.token_amount_y, 150000);
}

// #[test]
// fn mint_exact_cap() {
//     let e = Env::default();
//     let cap = 1000;
//     let client = create_client(&e, &cap);
//     let user = Address::generate(&e);
//
//     client.mint(&user, &1000);
//
//     assert_eq!(client.balance(&user), 1000);
//     assert_eq!(client.total_supply(), 1000);
// }
//
// #[test]
// #[should_panic(expected = "Error(Contract, #106)")]
// fn mint_exceeds_cap() {
//     let e = Env::default();
//     let cap = 1000;
//     let client = create_client(&e, &cap);
//     let user = Address::generate(&e);
//
//     // Attempt to mint 1001 tokens (would exceed cap)
//     client.mint(&user, &1001); // This should panic
// }
//
// #[test]
// #[should_panic(expected = "Error(Contract, #106)")]
// fn mint_multiple_exceeds_cap() {
//     let e = Env::default();
//     let cap = 1000;
//     let client = create_client(&e, &cap);
//     let user = Address::generate(&e);
//
//     // Mint 600 tokens first
//     client.mint(&user, &600);
//
//     assert_eq!(client.balance(&user), 600);
//     assert_eq!(client.total_supply(), 600);
//
//     // Attempt to mint 500 more tokens (would exceed cap)
//     client.mint(&user, &500); // This should panic
// }
