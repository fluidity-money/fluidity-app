use fluidity::{
    instruction::*,
    math::*,
    state::{Obligation, Reserve},
};

use {
    base64::*,
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        program::{invoke, invoke_signed},
        program_pack::Pack,
    },
    spl_token,
};

fn main() {
    blah(&[2, 1, 1, 1])
}

fn blah(input: &[u8]) {
    let instruction = FluidityInstruction::try_from_slice(input).unwrap();

    match instruction {
        FluidityInstruction::Wrap(amount, seed, bump) => {
            println!("hello");
        }
        FluidityInstruction::Unwrap(amount, seed, bump) => {
            println!("hell1");
        }
        FluidityInstruction::Payout(amount, seed, bump) => {
            println!("hell2");
        }
        FluidityInstruction::InitSolendObligation(
            obligation_lamports,
            obligation_size,
            seed,
            bump,
        ) => {
            println!("hell3");
        }
        FluidityInstruction::LogTVL => {
            println!("hell4");
            println!("hell4");
        }
        FluidityInstruction::InitData(seed, lamports, space, bump) => {
            println!("hell5");
        }
        FluidityInstruction::MoveFromPrizePool(seed, bump) => {
            println!("hell6");
        }
    }
}

fn get_data() {
    let obg_data = base64::decode("AYS6WgcAAAAAAOyje4xa6wSdaaY2+r99GpE76Z57BUIZA3yc05/vfBp10K2lVV/U2Ar75ajSp7kikrqB9UhD1gzRhKBbfAYkS6UN2Ddy+3SYgjcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAniqZW8V/KhKQAAAAAAAAA9E5OOL/d5aCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA1X1qi7FUyvpJEEKaRCzYER2K4qgndF/zE8uulIMLruxElKo8AAAAAA3YN3L7dJiCNwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
    let obligation = Obligation::unpack_unchecked(&obg_data.unwrap());
    println!("{:?}\n", obligation);

    let res_data = base64::decode("AS5uzAcAAAAAAeyje4xa6wSdaaY2+r99GpE76Z57BUIZA3yc05/vfBp1DrrkDa7rucXE7PTXzoALfVGQqBVXo/NEN3CeUi2bgLsG+HrQ+CGmKRMxBCfIfXphAGvYv0IZ41jT04a1GsN5fZpB82JZccou0iY+eFc/5c4j4T0lWO0/LkerD4T7nnrnIqvhWnBfDtO4nEp79MhTmazMc4TX/koRahCZkYlPFD3mbzCc7v8wAAAtMo7xwX0iomB0xnH+AQAA1lFDMrToOQ4AAAAAAAAAAACIthEot+ANAAAAAAAAAADBguHdb0r12wtHNfQE20mUcZAu0edWSpDBJSQJoxHd93a8H50UVQAA2qQQO1a/tiJkJgTBpDz2722BXWc8fbemeE+0OU51xmNQSwVQAAgyAEB6EPNaAAAAgFPue6gKADIAYLeYbIgAAP//////////vOOtTbdI8jOLWVr1Mujz0yJ/Iw8XMYcfPydUObKFo5wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
    let reserve = Reserve::unpack_unchecked(&res_data.unwrap());
    println!("{:?}\n", reserve);

    let mint_data = base64::decode("AQAAANCtpVVf1NgK++Wo0qe5IpK6gfVIQ9YM0YSgW3wGJEulEGwEPQAAAAAGAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
    let mint = spl_token::state::Mint::unpack_unchecked(&mint_data.unwrap());
    println!("{:?}", mint);

    let deposited_amount = obligation.unwrap().deposits[0].deposited_amount;
    println!("deposited amount: {:?}", deposited_amount);

    let deposited_value = reserve
        .unwrap()
        .collateral_exchange_rate()
        .unwrap()
        .collateral_to_liquidity(deposited_amount)
        .unwrap();
    println!("deposited value: {:?}", deposited_value);

    let deposited_tokens = mint.unwrap().supply;
    println!("deposited tokens: {}", deposited_tokens);

    let available_prize_pool = deposited_value - deposited_tokens;
    println!("available prize pool: {}", available_prize_pool);
}
