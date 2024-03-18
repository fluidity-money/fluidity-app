// SPDX-License-Identifier: MIT

module fluidity_coin::fluidity_coin {
    use std::option;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::url;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{ Self, UID, ID};
    use sui::balance::{ Self, Balance};
    use protocol::version::Version as ScallopVersion;
    use protocol::market::Market as ScallopMarket;
    use protocol::reserve::MarketCoin;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::vector;

    // **************************************************** ERROR CODES ****************************************************

    const E_CONTRACT_IS_PAUSED: u64 = 0;
    const E_CONTRACT_IS_ALREADY_PAUSED: u64 = 1;
    const E_CONTRACT_IS_ALREADY_UNPAUSED: u64 = 2;
    const E_NOT_ENOUGH_COINS_IN_RESERVE: u64 = 3;
    const E_VAULTS_NOT_INITIALIZED: u64 = 4;
    const E_INVALID_SCALLOP_MARKET: u64 = 5;
    const E_INVALID_SCALLOP_VERSION: u64 = 6;
    const E_RECEIPIENTS_AMOUNTS_MISMATCH: u64 = 7;
    const E_BAD_ADMIN_CAP: u64 = 8;
    const E_BAD_WORKER_CAP: u64 = 9;
    const E_BAD_EMERGENCY_CAP: u64 = 10;
    const E_BAD_DAO_CAP: u64 = 11;

    // **************************************************** TYPES ****************************************************

    /// The global config
    struct Global<phantom UNDERLYING> has key  {
        id: UID,
        paused: bool,
        vaults_initialized: bool,
        scallop_market_id: address,
        scallop_version: address,
        admin_cap_id: ID,
        worker_cap_id: ID,
        emergency_cap_id: ID,
        dao_cap_id: ID
    }

    struct CoinReserve has key, store {
        id: UID,
        balance: Balance<FLUIDITY_COIN_CAP>
    }

    struct UserVault<phantom UNDERLYING, FLUIDITY_COIN_CAP> has key, store {
        id: UID,
        balance: Balance<MarketCoin<UNDERLYING>>
    }

    struct PrizePoolVault<phantom UNDERLYING> has key, store {
        id: UID,
        balance: Balance<MarketCoin<UNDERLYING>>
    }

    /// Name of the coin. By convention, this type has the same name as its parent module
    /// and has no fields. The full type of the coin defined by this module will be `COIN<FLUIDITY_COIN_CAP>`.
    struct FLUIDITY_COIN_CAP has drop {}

    struct AdminCap has key { id: UID }
    struct WorkerCap has key { id: UID }
    struct EmergencyCap has key { id: UID }
    struct DAOCap has key { id: UID }

    // **************************************************** EVENTS ****************************************************

    /// Event marking when a wrap transaction occurs
    struct WrapEvent has copy, drop {
        user_vault_id: ID,
        coin_reserve_id: ID,
        global_id: ID,
        underlying_coin_id: ID,
        user_address: address,
        underlying_amount: u64,
        s_coin_amount: u64,
        f_coin_amount: u64,
        time: u64,
    }

    /// Event marking when an unwrap transaction occurs
    struct UnwrapEvent has copy, drop {
        user_vault_id: ID,
        prize_pool_vault_id: ID,
        coin_reserve_id: ID,
        global_id: ID,
        f_coin_id: ID,
        user_address: address,
        f_coin_amount: u64,
        prize_pool_vault_amount: u64,
        underlying_amount: u64,
        time: u64,
    }

    // Event emitted when the module is initialized
    struct InitEvent has drop, copy {
        global_id: ID,
    }

    // Event emitted when vaults are initialized
    struct InitVaultEvent has drop, copy {
        user_vault_id: ID,
        prize_pool_vault_id: ID,
        coin_reserve_id: ID,
    }

    // Event emitted when coins are minted
    struct MintEvent has drop, copy {
        coin_reserve_id: ID,
        amount_minted: u64,
        caller: address,
    }

    // Event emitted when coins are burned
    struct BurnEvent has drop, copy {
        coin_reserve_id: ID,
        amount_burned: u64,
        caller: address,
    }

    // Event emitted when the contract is paused
    struct PauseEvent has drop, copy {
        global_id: ID,
        caller: address,
    }

    // Event emitted when the contract is unpaused
    struct UnpauseEvent has drop, copy {
        global_id: ID,
        caller: address,
    }

    // Event emitted during the collect_yield function
    struct DistributeYieldEvent has drop, copy {
        prize_pool_vault_id: ID,
        amount_distributed: u64,
        recipient: address,
    }

    /// Event emitted during an emergency drain of the prize pool vault
    struct EmergencyDrainEvent has drop, copy {
        prize_pool_vault_id: ID,
        amount_drained: u64,
        recipient: address,
        time: u64,
    }

    // **************************************************** FUNCTIONS ****************************************************

    fun assert_scallop_market<UNDERLYING>(
        global: &Global<UNDERLYING>,
        market: &ScallopMarket
    ) {
        assert!(
            object::id_address(market) == global.scallop_market_id,
            E_INVALID_SCALLOP_MARKET
        );
    }

    fun assert_scallop_version<UNDERLYING>(
        global: &Global<UNDERLYING>,
        version: &ScallopVersion
    ) {
        assert!(
            object::id_address(version) == global.scallop_version,
            E_INVALID_SCALLOP_VERSION
        );
    }

    fun assert_admin_cap<UNDERLYING>(
        global: &Global<UNDERLYING>,
        admin_cap: &AdminCap
    ) {
        assert!(global.admin_cap_id == object::id(admin_cap), E_BAD_ADMIN_CAP);
    }

    fun assert_worker_cap<UNDERLYING>(
        global: &Global<UNDERLYING>,
        worker_cap: &WorkerCap
    ) {
        assert!(global.worker_cap_id == object::id(worker_cap), E_BAD_WORKER_CAP);
    }

    fun assert_emergency_cap<UNDERLYING>(
        global: &Global<UNDERLYING>,
        emergency_cap: &EmergencyCap
    ) {
        assert!(global.emergency_cap_id == object::id(emergency_cap), E_BAD_EMERGENCY_CAP);
    }

    fun assert_dao_cap<UNDERLYING>(
        global: &Global<UNDERLYING>,
        dao_cap: &DAOCap
    ) {
        assert!(global.dao_cap_id == object::id(dao_cap), E_BAD_DAO_CAP);
    }

    entry fun new_coin<UNDERLYING>(
        scallop_market: address,
        scallop_version: address,
        coin_decimals: u8,
        coin_name: vector<u8>,
        coin_symbol: vector<u8>,
        coin_desc: vector<u8>,
        coin_icon_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let witness = FLUIDITY_COIN_CAP{};
        let coin_icon_url = url::new_unsafe_from_bytes(coin_icon_url);
        // Get a treasury cap for the coin and give it to the transaction sender
        let (treasury_cap, metadata) = coin::create_currency<FLUIDITY_COIN_CAP>(
            witness,                     // witness
            coin_decimals,               // decimals (should be the underlying)
            coin_name,                   // coin name
            coin_symbol,                 // coin symbol
            coin_desc,                   // coin description
            option::some(coin_icon_url), // coin icon url
            ctx
        );

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));

        let admin_cap = AdminCap { id: object::new(ctx) };
        let worker_cap = WorkerCap { id: object::new(ctx) };
        let emergency_cap = EmergencyCap { id: object::new(ctx) };
        let dao_cap = DAOCap { id: object::new(ctx) };

        // Store the capability IDs in the global storage for verification later.

        let admin_cap_id = object::id(&admin_cap);
        let worker_cap_id = object::id(&worker_cap);
        let emergency_cap_id = object::id(&emergency_cap);
        let dao_cap_id = object::id(&dao_cap);

        transfer::transfer(admin_cap, tx_context::sender(ctx));
        transfer::transfer(worker_cap, tx_context::sender(ctx));
        transfer::transfer(emergency_cap, tx_context::sender(ctx));
        transfer::transfer(dao_cap, tx_context::sender(ctx));

        let global = Global<UNDERLYING> {
            id: object::new(ctx),
            paused: false,
            vaults_initialized: false,
            scallop_market_id: scallop_market,
            scallop_version: scallop_version,
            admin_cap_id: admin_cap_id,
            worker_cap_id: worker_cap_id,
            emergency_cap_id: emergency_cap_id,
            dao_cap_id: dao_cap_id
        };
        event::emit(InitEvent { global_id: object::uid_to_inner(&global.id) });

        let user_vault = UserVault<UNDERLYING, FLUIDITY_COIN_CAP> {
            id: object::new(ctx),
            balance: balance::zero<MarketCoin<UNDERLYING>>(),
        };
        let prize_pool_vault = PrizePoolVault<UNDERLYING> {
            id: object::new(ctx),
            balance: balance::zero<MarketCoin<UNDERLYING>>(),
        };
        let coin_reserve = CoinReserve {
            id: object::new(ctx),
            balance: balance::zero<FLUIDITY_COIN_CAP>(),
        };
        event::emit(InitVaultEvent {
            user_vault_id: object::uid_to_inner(&user_vault.id),
            prize_pool_vault_id: object::uid_to_inner(&prize_pool_vault.id),
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
        });

        transfer::share_object(user_vault);
        transfer::share_object(prize_pool_vault);
        transfer::share_object(coin_reserve);

        global.vaults_initialized = true;
        global.scallop_market_id = scallop_market;
        global.scallop_version = scallop_version;

        transfer::share_object(global);
    }

    entry fun transfer_admin_cap(admin_cap: AdminCap, recipient: address) {
        transfer::transfer(admin_cap, recipient)
    }

    entry fun transfer_worker_cap(_: &AdminCap, worker_cap: WorkerCap, recipient: address) {
        transfer::transfer(worker_cap, recipient)
    }

    entry fun transfer_emergency_cap(_: &AdminCap, emergency_cap: EmergencyCap, recipient: address) {
        transfer::transfer(emergency_cap, recipient)
    }

    entry fun transfer_dao_cap(_: &AdminCap, dao_cap: DAOCap, recipient: address) {
        transfer::transfer(dao_cap, recipient)
    }

    // Manager can mint new coins to the coin reserve. Assumes the
    // global passed is the appropriate one, as the only error state is a
    // bad vault setup and blow up later (presumably.)
    entry fun mint<UNDERLYING>(
        treasury_cap: &mut TreasuryCap<FLUIDITY_COIN_CAP>,
        admin_cap: &AdminCap,
        global: &Global<UNDERLYING>,
        coin_reserve: &mut CoinReserve,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(global.vaults_initialized, E_VAULTS_NOT_INITIALIZED);
        assert_admin_cap(global, admin_cap);
        let minted_coin = coin::mint(treasury_cap, amount, ctx);
        balance::join(&mut coin_reserve.balance, coin::into_balance(minted_coin));
        event::emit(MintEvent {
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
            amount_minted: amount,
            caller: tx_context::sender(ctx),
        });
    }

    /// Manager can burn coins from the coin reserve
    entry fun burn<UNDERLYING>(
        treasury_cap: &mut TreasuryCap<FLUIDITY_COIN_CAP>,
        admin_cap: &AdminCap,
        global: &Global<UNDERLYING>,
        coin_reserve: &mut CoinReserve,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(global.vaults_initialized, E_VAULTS_NOT_INITIALIZED);
        assert!(balance::value(&coin_reserve.balance) >= amount, E_NOT_ENOUGH_COINS_IN_RESERVE);
        assert_admin_cap(global, admin_cap);
        let coins_to_burn_balance = balance::split(&mut coin_reserve.balance, amount);
        coin::burn(treasury_cap, coin::from_balance(coins_to_burn_balance, ctx));
        event::emit(BurnEvent {
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
            amount_burned: amount,
            caller: tx_context::sender(ctx),
        });

    }

    fun pause<UNDERLYING>(
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert!(!global.paused, E_CONTRACT_IS_ALREADY_PAUSED);
        global.paused = true;
        event::emit(PauseEvent { global_id: object::uid_to_inner(&global.id), caller: tx_context::sender(ctx)});
    }

    fun unpause<UNDERLYING>(
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert!(global.paused, E_CONTRACT_IS_ALREADY_UNPAUSED);
        global.paused = false;
        event::emit(UnpauseEvent { global_id: object::uid_to_inner(&global.id), caller: tx_context::sender(ctx)});
    }

    entry fun pause_admin<UNDERLYING>(
        admin_cap: &AdminCap,
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert_admin_cap(global, admin_cap);
        pause(global, ctx);
    }

    entry fun pause_dao<UNDERLYING>(
        dao_cap: &DAOCap,
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert_dao_cap(global, dao_cap);
        pause(global, ctx);
    }

    entry fun pause_emergency<UNDERLYING>(
        emergency_cap: &EmergencyCap,
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert_emergency_cap(global, emergency_cap);
        pause(global, ctx);
    }

    entry fun unpause_admin<UNDERLYING>(
        admin_cap: &AdminCap,
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert_admin_cap(global, admin_cap);
        unpause(global, ctx);
    }

    entry fun unpause_dao<UNDERLYING>(
        dao_cap: &DAOCap,
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert_dao_cap(global, dao_cap);
        unpause(global, ctx);
    }

    entry fun unpause_emergency<UNDERLYING>(
        emergency_cap: &EmergencyCap,
        global: &mut Global<UNDERLYING>,
        ctx: &TxContext
    ) {
        assert_emergency_cap(global, emergency_cap);
        unpause(global, ctx);
    }

    #[allow(lint(self_transfer))]
    public fun wrap<UNDERLYING>(
        global: &Global<UNDERLYING>,
        user_vault: &mut UserVault<UNDERLYING>,
        coin_reserve: &mut CoinReserve,
        scallop_version: &ScallopVersion,
        scallop_market: &mut ScallopMarket,
        clock: &Clock,
        coin: Coin<UNDERLYING>,
        ctx: &mut TxContext
    ) {
        assert!(!global.paused, E_CONTRACT_IS_PAUSED);
        assert!(global.vaults_initialized, E_VAULTS_NOT_INITIALIZED);
        assert_user_vault(global, user_vault);
        assert_scallop_market(global, scallop_market);
        assert_scallop_version(global, scallop_version);

        let amount = coin::value(&coin);
        let user = tx_context::sender(ctx);
        let coin_obj_id = object::id(&coin);

        // Mint s_coin to vault
        let s_coin = protocol::mint::mint(
            scallop_version, scallop_market, coin, clock, ctx
        );
        let s_coin_amount = coin::value(&s_coin);

        // "Mint" fCoin to user
        let reserve_coin_balance = balance::split(&mut coin_reserve.balance, s_coin_amount);
        let reserve_coin_amount = balance::value(&reserve_coin_balance);
        transfer::public_transfer(coin::from_balance(reserve_coin_balance, ctx), user);

        // Join s_coin to user vault
        balance::join(&mut user_vault.balance, coin::into_balance(s_coin));

        let now = clock::timestamp_ms(clock) / 1000;
        event::emit(WrapEvent {
            user_vault_id: object::uid_to_inner(&user_vault.id),
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
            global_id: object::uid_to_inner(&global.id),
            underlying_coin_id: coin_obj_id,
            user_address: user,
            underlying_amount: amount,
            s_coin_amount: s_coin_amount,
            f_coin_amount: reserve_coin_amount,
            time: now,
        });
    }

    #[allow(lint(self_transfer))]
    public fun unwrap<UNDERLYING>(
        global: &Global<UNDERLYING>,
        coin: Coin<FLUIDITY_COIN_CAP>,
        user_vault: &mut UserVault<FLUIDITY_COIN_CAP>,
        prize_pool_vault: &mut PrizePoolVault<UNDERLYING>,
        coin_reserve: &mut CoinReserve,
        scallop_version: &ScallopVersion,
        scallop_market: &mut ScallopMarket,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!global.paused, E_CONTRACT_IS_PAUSED);
        assert!(global.vaults_initialized, E_VAULTS_NOT_INITIALIZED);
        assert_user_vault(global, user_vault);
        assert_scallop_market(global, scallop_market);
        assert_scallop_version(global, scallop_version);

        let user = tx_context::sender(ctx);
        let f_coin_amount = coin::value(&coin);
        let balance = balance::split<MarketCoin<UNDERLYING>>(&mut user_vault.balance, f_coin_amount);
        let s_coin = coin::from_balance(balance, ctx);

        // Redeem sCoin from Scallop
        let redeemed_coin = protocol::redeem::redeem(
            scallop_version, scallop_market, s_coin, clock, ctx
        );

        // Split redeemed coin into user's coin and vault's coin
        let user_coin = coin::split<UNDERLYING>(&mut redeemed_coin, f_coin_amount, ctx);
        let user_coin_amount = coin::value(&user_coin);
        // Transfer user's coin to user
        transfer::public_transfer(user_coin, user);

        let redeemed_coin_amount = coin::value(&redeemed_coin);

        let s_coin_amount = 0;
        // Mint s_coin again but this time to prize pool vault for remaining amount (i.e. yield earned)
        if (redeemed_coin_amount != 0) {
            let s_coin = protocol::mint::mint(
                scallop_version, scallop_market, redeemed_coin, clock, ctx
            );
            s_coin_amount = coin::value(&s_coin);

            // Join s_coin to prize pool vault
            balance::join(&mut prize_pool_vault.balance, coin::into_balance(s_coin));
        } else {
            coin::destroy_zero(redeemed_coin);
        };

        let now = clock::timestamp_ms(clock) / 1000;
        event::emit(UnwrapEvent {
            user_vault_id: object::uid_to_inner(&user_vault.id),
            prize_pool_vault_id: object::uid_to_inner(&prize_pool_vault.id),
            coin_reserve_id: object::uid_to_inner(&coin_reserve.id),
            global_id: object::uid_to_inner(&global.id),
            f_coin_id: object::id(&coin),
            user_address: user,
            f_coin_amount: f_coin_amount,
            prize_pool_vault_amount: s_coin_amount,
            underlying_amount: user_coin_amount,
            time: now,
        });

        // "Burn" respective fCoin
        balance::join(&mut coin_reserve.balance, coin::into_balance(coin));
    }

    // Distribute yield to multiple addresses
    entry fun distribute_yield<UNDERLYING>(
        worker_cap: &WorkerCap,
        global: &Global<UNDERLYING>,
        prize_pool_vault: &mut PrizePoolVault<UNDERLYING>,
        scallop_version: &ScallopVersion,
        scallop_market: &mut ScallopMarket,
        clock: &Clock,
        recipients: vector<address>,
        amounts: vector<u64>,
        ctx: &mut TxContext
    ) {
        assert!(global.paused, E_CONTRACT_IS_PAUSED);
        assert_worker_cap(global, worker_cap);
        assert_scallop_market(global, scallop_market);
        assert_scallop_version(global, scallop_version);
        assert!(vector::length(&recipients) == vector::length(&amounts), E_RECEIPIENTS_AMOUNTS_MISMATCH);

        let s_coin = coin::from_balance(balance::withdraw_all<MarketCoin<UNDERLYING>>(&mut prize_pool_vault.balance), ctx);
        let redeemed_coin = protocol::redeem::redeem(
            scallop_version, scallop_market, s_coin, clock, ctx
        );

        let number_of_recipients = vector::length(&recipients);
        let i = 0u64;
        while (i < number_of_recipients) {
            let recipient = vector::borrow(&recipients, i);
            let amount = vector::borrow(&amounts, i);
            let redeemed_coin_amount = coin::value(&redeemed_coin);
            assert!(*amount <= redeemed_coin_amount, E_NOT_ENOUGH_COINS_IN_RESERVE);
            transfer::public_transfer(coin::split(&mut redeemed_coin, *amount, ctx), *recipient);
            event::emit(DistributeYieldEvent {
                prize_pool_vault_id: object::uid_to_inner(&prize_pool_vault.id),
                amount_distributed: *amount,
                recipient: *recipient,
            });
        };

        let redeemed_coin_amount = coin::value(&redeemed_coin);
        // if there is any remaining amount, mint s_coin again and join to prize pool vault
        if (redeemed_coin_amount != 0) {
            let s_coin = protocol::mint::mint(
                scallop_version, scallop_market, redeemed_coin, clock, ctx
            );

            // Join s_coin to prize pool vault
            balance::join(&mut prize_pool_vault.balance, coin::into_balance(s_coin));
        } else { // otherwise destroy the remaining coin
            coin::destroy_zero(redeemed_coin);
        };
    }

    #[allow(lint(self_transfer))]
    entry fun emergency_drain_prize_pool_vault<UNDERLYING>(
        dao_cap: &DAOCap,
        prize_pool_vault: &mut PrizePoolVault<UNDERLYING>,
        scallop_version: &ScallopVersion,
        scallop_market: &mut ScallopMarket,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert_dao_cap(global, dao_cap);
        assert!(balance::value(&prize_pool_vault.balance) != 0, E_NOT_ENOUGH_COINS_IN_RESERVE);
        let s_coin = coin::from_balance(balance::withdraw_all<MarketCoin<UNDERLYING>>(&mut prize_pool_vault.balance), ctx);
        let redeemed_coin = protocol::redeem::redeem(
            scallop_version, scallop_market, s_coin, clock, ctx
        );
        let dao = tx_context::sender(ctx);
        event::emit(EmergencyDrainEvent {
            prize_pool_vault_id: object::uid_to_inner(&prize_pool_vault.id),
            amount_drained: coin::value(&redeemed_coin),
            recipient: dao,
            time: clock::timestamp_ms(clock) / 1000,
        });
        transfer::public_transfer(redeemed_coin, dao);
    }
}
