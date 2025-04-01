// SPDX-License-Identifier: MIT

module fluidity_utility_mining::fluidity_utility_mining {
    use sui::coin::{Self, Coin};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{ Self, UID, ID};
    use sui::balance::{ Self, Balance};
    use sui::event;

    // **************************************************** ERROR CODES ****************************************************

    const INSUFFICIENT_BALANCE: u64 = 0;

    // **************************************************** TYPES ****************************************************

    struct CoinReserve<phantom UNDERLYING> has key, store {
        id: UID,
        balance: Balance<UNDERLYING>
    }

    struct FLUIDITY_UTILITY_MINING has drop {}

    struct AdminCap has key { id: UID }
    struct WorkerCap has key { id: UID }

    // **************************************************** EVENTS ****************************************************

    // Event marking when a new coin reserve is created
    struct CreateCoinReserveEvent has copy, drop {
        coin_reserve_id: ID,
    }

    // Event marking when coins are distributed
    struct DistributeEvent has copy, drop {
        coin_reserve_id: ID,
        recipient: address,
        amount: u64,
    }

    // Event marking when coins are added to a reserve
    struct AddToReserveEvent has copy, drop {
        coin_reserve_id: ID,
        depositor: address,
        amount: u64,
    }

    // **************************************************** FUNCTIONS ****************************************************

    fun init(
        _: FLUIDITY_UTILITY_MINING, 
        ctx: &mut TxContext
    ) {
        transfer::transfer(WorkerCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));
        transfer::transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));
    }

    entry fun transfer_worker_cap(_: &AdminCap, worker_cap: WorkerCap, recipient: address) {
        transfer::transfer(worker_cap, recipient)
    }

    entry fun transfer_admin_cap(admin_cap: AdminCap, recipient: address) {
        transfer::transfer(admin_cap, recipient)
    }

    // Function to create a new coin reserve
    entry fun create_coin_reserve<UNDERLYING>(
        _: &AdminCap,
        ctx: &mut TxContext
    ) {
        let coin_reserve = CoinReserve<UNDERLYING> {
            id: object::new(ctx),
            balance: balance::zero(),
        };
        event::emit(CreateCoinReserveEvent {
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
        });
        transfer::share_object(coin_reserve);
    }

    // Function to add amount to a coin reserve
    entry fun add_to_reserve<UNDERLYING>(
        _: &AdminCap,
        coin_reserve: &mut CoinReserve<UNDERLYING>,
        coin: Coin<UNDERLYING>,
        ctx: &TxContext
    ) {
        let amount = coin::value(&coin);
        balance::join(&mut coin_reserve.balance, coin::into_balance(coin));
        event::emit(AddToReserveEvent {
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
            depositor: tx_context::sender(ctx),
            amount,
        });
    }

    entry fun distribute_from_reserve<UNDERLYING>(
        _: &WorkerCap,
        coin_reserve: &mut CoinReserve<UNDERLYING>,
        recipient: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(balance::value(&coin_reserve.balance) >= amount, INSUFFICIENT_BALANCE);
        let coin = coin::from_balance(balance::split(&mut coin_reserve.balance, amount), ctx);
        transfer::public_transfer(coin, recipient);
        event::emit(DistributeEvent {
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
            recipient,
            amount,
        });
    }
    
}