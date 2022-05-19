
# tribeca-govern-contracts

Contracts governed by Fluidity Tribeca governance

- Trf Data Store
    Holds TRF variables onchain for Fluidity Solana workers to pick up

## Building

	 make build

Ensure that solana environment is correctly set up.

## Deploy

	make deploy

Ensure that solana environment is correctly set up.

## initialize(bump)

Create the data store account. Must be performed by authority

### Accounts

| Name                            | Description                                                                       |
|---------------------------------|-----------------------------------------------------------------------------------|
| `calculaten_args`               | The derived data account TRF variables. Must be derived from the program account. |
| `payer`                         | The authority account. Signer                                                     |
| `system_program`                | The system program                                                                |

## change_num_reward_tiers(bump, m)

Changes TRF variable `m` (number of reward tiers). Must be performed by authority

### Accounts

| Name                            | Description                                                                       |
|---------------------------------|-----------------------------------------------------------------------------------|
| `calculaten_args`               | The derived data account TRF variables. Must be derived from the program account. |
| `authority`                     | The authority account. Signer                                                     |

## change_payout_frequency(bump, payout_freq)

Changes TRF variable `payout_freq`. Must be performed by authority

### Accounts

| Name                            | Description                                                                       |
|---------------------------------|-----------------------------------------------------------------------------------|
| `calculaten_args`               | The derived data account TRF variables. Must be derived from the program account. |
| `authority`                     | The authority account. Signer                                                     |

## change_delta(bump, delta)

Changes TRF variable `delta`. Must be performed by authority

### Accounts

| Name                            | Description                                                                       |
|---------------------------------|-----------------------------------------------------------------------------------|
| `calculaten_args`               | The derived data account TRF variables. Must be derived from the program account. |
| `authority`                     | The authority account. Signer                                                     |

## Testing - TBD

### Installing Testing Dependencies

`anchor test`
