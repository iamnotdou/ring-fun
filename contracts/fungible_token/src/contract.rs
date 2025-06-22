use soroban_sdk::{contract, contractimpl, Address, Env, String};
use stellar_fungible::{
    capped::{check_cap, set_cap},
    Base, FungibleToken,
};
use stellar_ownable::set_owner;
use stellar_ownable_macro::only_owner;

#[contract]
pub struct MyFungibleToken;

#[contractimpl]
impl MyFungibleToken {
    pub fn __constructor(e: &Env, owner: Address, cap: i128, symbol: String, name: String) {
        set_owner(e, &owner);
        set_cap(e, cap);
        Base::set_metadata(e, 18, name, symbol);
    }

    #[only_owner]
    pub fn mint(e: &Env, account: Address, amount: i128) {
        check_cap(e, amount);
        Base::mint(e, &account, amount);
    }
}

#[contractimpl]
impl FungibleToken for MyFungibleToken {
    type ContractType = Base;

    fn total_supply(e: &Env) -> i128 {
        Self::ContractType::total_supply(e)
    }

    fn balance(e: &Env, account: Address) -> i128 {
        Self::ContractType::balance(e, &account)
    }

    fn allowance(e: &Env, owner: Address, spender: Address) -> i128 {
        Self::ContractType::allowance(e, &owner, &spender)
    }

    fn transfer(e: &Env, from: Address, to: Address, amount: i128) {
        Self::ContractType::transfer(e, &from, &to, amount);
    }

    fn transfer_from(e: &Env, spender: Address, from: Address, to: Address, amount: i128) {
        Self::ContractType::transfer_from(e, &spender, &from, &to, amount);
    }

    fn approve(e: &Env, owner: Address, spender: Address, amount: i128, live_until_ledger: u32) {
        Self::ContractType::approve(e, &owner, &spender, amount, live_until_ledger);
    }

    fn decimals(e: &Env) -> u32 {
        Self::ContractType::decimals(e)
    }

    fn name(e: &Env) -> String {
        Self::ContractType::name(e)
    }

    fn symbol(e: &Env) -> String {
        Self::ContractType::symbol(e)
    }
}
