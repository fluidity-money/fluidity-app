// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

//import chai, {expect, assert} from 'chai';
//import chaiAsync from 'chai-as-promised';
//import contractList from 'util/contractList';
//import {ethers} from 'ethers';
//import makeContractSwap from 'util/makeContractSwap';
//import {BigNumber} from 'ethers/utils';
export {};
//
//chai.use(chaiAsync)
//
////get the test contracts
//const {addr: USDTAddr, abi: USDTAbi} = contractList?.ETH?.USDT || {};
//const {addr: fluidAddr, abi: fluidAbi} = contractList?.ETH?.fUSDT|| {};
//if (!USDTAddr|| !USDTAbi) throw new Error("No USDT Contract found - exiting.");
//if (!fluidAddr || !fluidAbi) throw new Error("No Fluid Contract found - exiting.");
////set up objects
//const provider = new ethers.providers.JsonRpcProvider();
//const USDTContract = new ethers.Contract(USDTAddr, USDTAbi,provider); 
//const fluidContract = new ethers.Contract(fluidAddr, fluidAbi,provider); 
////hardhat test acc prikey
//const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80").connect(provider);
//
//describe('ERC20 Swaps', function () {
//    let originalBalanceUSDT: BigNumber;
//    let newBalanceUSDT: BigNumber; 
//    let originalBalanceFluid: BigNumber;
//    let newBalanceFluid: BigNumber; 
//    const swapAmount = 100;
//    const bnSwapAmount = ethers.utils.parseUnits(swapAmount.toString(),6);
//    it('Make a token swap', async function() {
//        //get starting balance
//        originalBalanceUSDT = await USDTContract.balanceOf(wallet.address);
//        originalBalanceFluid = await fluidContract.balanceOf(wallet.address);
//        //would expect this, but it doesn't allow it to complete even with async test runner
//        await makeContractSwap('toFluid', swapAmount, 'USDT', wallet);
//        //get updated balance 
//        newBalanceUSDT = await USDTContract.balanceOf(wallet.address);
//        newBalanceFluid = await fluidContract.balanceOf(wallet.address);
//    })
//    it('Balances are correct after swap', async function() {
//        //fluid goes up
//        expect(newBalanceFluid.sub(originalBalanceFluid.toNumber()).toNumber()).to.equal(bnSwapAmount.toNumber());
//        //usdt goes down
//        expect(originalBalanceUSDT.sub(newBalanceUSDT.toNumber()).toNumber()).to.equal(bnSwapAmount.toNumber());
//      })
//    it('Swap back and recheck balance', async function() {
//        await makeContractSwap('fromFluid', swapAmount, 'USDT', wallet);
//        newBalanceUSDT = await USDTContract.balanceOf(wallet.address);
//        newBalanceFluid = await fluidContract.balanceOf(wallet.address);
//    });
//    it('Balances are back to their original state', async function() {
//        //fluid back to original 
//        expect(newBalanceFluid.toNumber()).to.equal(originalBalanceFluid.toNumber());
//        //usdt back to original
//        expect(newBalanceUSDT.toNumber()).to.equal(originalBalanceUSDT.toNumber());
//    });
//});
