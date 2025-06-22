use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Bytes, BytesN, Env, String,
    Symbol,
};

mod contract_token {
    use soroban_sdk::contractimport;

    contractimport!(file = "../../target/wasm32v1-none/release/fungible_token.wasm");
}

use token::Client;

#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum SwapError {
    InvalidToken = 1,
    InsufficientLiquidity = 2,
    InsufficientAmountOut = 3,
    InvalidAmountIn = 4,
}

pub fn calculate_swap_amount_out(env: &Env) {}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Pool {
    pub token_x: Address,
    pub token_y: Address,
    pub token_amount_x: i128,
    pub token_amount_y: i128,
    pub k_factor: i128,
}

const POOL_KEY: Symbol = symbol_short!("POOL");

#[contract]
pub struct SwapContract;

#[contractimpl]
impl SwapContract {
    pub fn __constructor(
        e: Env,
        peer_contract: Address,
        wasm_hash: BytesN<32>,
        symbol: String,
        name: String,
    ) {
        let salt = [0u8; 32];
        let initial_x_token = 100000;
        let initial_y_fake_token = 100000;

        let token_constructor_params =
            (&e.current_contract_address(), initial_x_token, symbol, name);

        let token_contract_address = e
            .deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, token_constructor_params);

        contract_token::Client::new(&e, &token_contract_address)
            .mint(&e.current_contract_address(), &initial_x_token);

        let pool = Pool {
            token_x: token_contract_address.clone(),
            token_amount_x: initial_x_token,
            token_amount_y: initial_y_fake_token,
            token_y: peer_contract,
            k_factor: initial_x_token
                .checked_mul(initial_y_fake_token)
                .expect("Overflow in k calculation"),
        };

        e.storage().instance().set(&POOL_KEY, &pool);
    }

    /// Swap tokens using constant product formula (x * y = k)
    /// Returns the amount of tokens received
    pub fn swap(e: &Env, caller: Address, is_in_x: bool, amount_in: i128) -> i128 {
        if amount_in < 0 {
            panic!("Amount in must be positive");
        }

        let mut pool_data: Pool = e
            .storage()
            .instance()
            .get(&POOL_KEY)
            .expect("Pool not initialized");

        let (reserve_in, reserve_out, k_factor) = if is_in_x {
            (
                pool_data.token_amount_x,
                pool_data.token_amount_y,
                pool_data.k_factor,
            )
        } else {
            (
                pool_data.token_amount_y,
                pool_data.token_amount_x,
                pool_data.k_factor,
            )
        };

        // x * y = k
        // if x is in
        // (reserve_x + amount_in) * (reserve_y - amount_out) = k
        // amount_out = reserve_y - (k / (reserve_x + amount_in))
        // k / x = y
        // other wise if y is in
        // (reserve_y + amount_in) * (reserve_x - amount_out) = k
        // amount_out = reserve_x - (k / (reserve_y + amount_in))
        // so which means
        // (reserve_in + amount_in) * (reserve_out - amount_out ) = k
        // amount_out = reserve_out - (k / (reserve_in + amount_in))

        let new_reserve_in = reserve_in.checked_add(amount_in).unwrap();

        let new_reserve_out = k_factor.checked_div(new_reserve_in).unwrap();

        let amount_out = reserve_out.checked_sub(new_reserve_out).unwrap();

        if amount_out >= reserve_out {
            panic!("Insufficient liquidity");
        }

        let (token_in_client, token_out_client) = if is_in_x {
            (
                token::Client::new(e, &pool_data.token_x),
                token::Client::new(e, &pool_data.token_y),
            )
        } else {
            (
                token::Client::new(e, &pool_data.token_y),
                token::Client::new(e, &pool_data.token_x),
            )
        };

        caller.require_auth();

        token_in_client.transfer_from(
            &e.current_contract_address(),
            &caller,
            &e.current_contract_address(),
            &amount_in,
        );
        token_out_client.transfer(&e.current_contract_address(), &caller, &amount_out);

        if is_in_x {
            pool_data.token_amount_x = pool_data
                .token_amount_x
                .checked_add(amount_in)
                .expect("Overflow");
            pool_data.token_amount_y = pool_data
                .token_amount_y
                .checked_sub(amount_out)
                .expect("Underflow");
        } else {
            pool_data.token_amount_y = pool_data
                .token_amount_y
                .checked_add(amount_in)
                .expect("Overflow");
            pool_data.token_amount_x = pool_data
                .token_amount_x
                .checked_sub(amount_out)
                .expect("Underflow");
        }

        pool_data.k_factor = pool_data
            .token_amount_x
            .checked_mul(pool_data.token_amount_y)
            .expect("Overflow");

        e.storage().instance().set(&POOL_KEY, &pool_data);

        amount_out
    }

    pub fn get_quote(e: &Env, is_in_x: bool, amount_in: i128) -> i128 {
        if amount_in < 0 {
            panic!("Amount in must be positive");
        }

        let pool_data: Pool = e
            .storage()
            .instance()
            .get(&POOL_KEY)
            .expect("Pool not initialized");

        let (reserve_in, reserve_out, k_factor) = if is_in_x {
            (
                pool_data.token_amount_x,
                pool_data.token_amount_y,
                pool_data.k_factor,
            )
        } else {
            (
                pool_data.token_amount_y,
                pool_data.token_amount_x,
                pool_data.k_factor,
            )
        };

        // x * y = k
        // if x is in
        // (reserve_x + amount_in) * (reserve_y - amount_out) = k
        // amount_out = reserve_y - (k / (reserve_x + amount_in))
        // k / x = y
        // other wise if y is in
        // (reserve_y + amount_in) * (reserve_x - amount_out) = k
        // amount_out = reserve_x - (k / (reserve_y + amount_in))
        // so which means
        // (reserve_in + amount_in) * (reserve_out - amount_out ) = k
        // amount_out = reserve_out - (k / (reserve_in + amount_in))

        let new_reserve_in = reserve_in.checked_add(amount_in).unwrap();

        let new_reserve_out = k_factor.checked_div(new_reserve_in).unwrap();

        reserve_out.checked_sub(new_reserve_out).unwrap()
    }

    pub fn deploy_to_dex(e: &Env) {}

    pub fn get_pool_info(e: Env) -> Pool {
        e.storage()
            .instance()
            .get(&POOL_KEY)
            .expect("Pool not initialized")
    }
}
