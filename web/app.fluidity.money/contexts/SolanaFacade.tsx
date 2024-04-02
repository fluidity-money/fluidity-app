import { useState, useEffect } from "react";

import BN from "bn.js";
import {
  useWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, setProvider, Idl } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  getBalance,
  internalSwap,
  limit,
  amountMinted as amountMintedInternal,
  associateAddressForAirdrop,
} from "~/util/chainUtils/solana/instructions";
import FluidityFacadeContext from "./FluidityFacade";
import { Token } from "~/util/chainUtils/tokens";

import associateAddressForAirdropIdl from "~/util/chainUtils/solana/associate-address-for-airdrop-idl.json";

const SolanaFacade = ({
  children,
  tokens,
}: {
  children: React.ReactNode;
  tokens: Token[];
}) => {
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const { connected, publicKey, disconnect, connecting, signMessage } = wallet;
  const { connection } = useConnection();

  const [airdropAssociationProgram, setAirdropAssociationProgram] =
    useState<Program<Idl> | null>(null);

  useEffect(() => {
    if (anchorWallet && wallet) {
      // if these aren't set up, then we can assume this isn't possible.

      const { signTransaction, signAllTransactions } = wallet;

      if (!publicKey || !signTransaction || !signAllTransactions) return;

      const provider = new AnchorProvider(connection, anchorWallet, {});

      setProvider(provider);

      const airdropAssociation = new Program(
        associateAddressForAirdropIdl as Idl,
        new PublicKey(associateAddressForAirdropIdl.metadata.address)
      );

      setAirdropAssociationProgram(airdropAssociation);
    }
  }, [connection, anchorWallet, wallet]);

  const swap = async (amount: string, tokenAddr: string) => {
    if (!publicKey) return;

    const fromToken = tokens.find((t) => t.address === tokenAddr);

    if (!fromToken)
      throw new Error(
        `Could not initiate Swap: Could not find matching token ${tokenAddr} in solana`
      );

    // true if swapping from fluid -> non-fluid
    const fromFluid = !!fromToken.isFluidOf;

    const toToken = fromFluid
      ? tokens.find((t) => t.address === fromToken.isFluidOf)
      : tokens.find((t) => t.isFluidOf === fromToken.address);

    if (!toToken)
      throw new Error(
        `Could not initiate Swap: Could not find dest pair token from ${tokenAddr} in solana`
      );

    return internalSwap(
      wallet,
      connection,
      connected,
      publicKey,
      amount,
      fromToken,
      toToken
    );
  };

  const balance = async (tokenAddr: string): Promise<BN> => {
    const token = tokens.find((t) => t.address === tokenAddr);

    if (!token)
      throw new Error(
        `Could not fetch balance: Could not find matching token ${tokenAddr} in solana`
      );

    if (!publicKey) return new BN(0);

    return getBalance(connection, publicKey, token);
  };

  const signBuffer = async (buffer: string): Promise<string | undefined> => {
    const enc = new TextEncoder();

    return signMessage?.(enc.encode(buffer))?.then((val) => String(val));
  };

  const getFluidTokens = async (): Promise<string[]> => {
    if (!publicKey) return [];

    const fluidTokens = tokens.filter((t) => t.isFluidOf);

    const fluidTokensPosBalance = await Promise.all(
      fluidTokens.filter(async (t) => getBalance(connection, publicKey, t))
    );

    return fluidTokensPosBalance.map((t) => t.address);
  };

  const amountMinted = async (tokenName: string): Promise<BN | undefined> => {
    if (!publicKey) return;
    return amountMintedInternal(publicKey, tokenName);
  };

  const airdropAssociateEthereumAccount = async (ethereumAddress: string) => {
    if (!publicKey) throw new Error(`Public key not set!`);

    if (!airdropAssociationProgram)
      throw new Error(`Airdrop Association Program not set!`);

    const sig = await associateAddressForAirdrop(
      airdropAssociationProgram,
      connected,
      publicKey,
      ethereumAddress
    );

    return sig;
  };

  return (
    <FluidityFacadeContext.Provider
      value={{
        connected,
        disconnect,
        connecting,
        swap,
        balance,
        limit,
        tokens: getFluidTokens,
        amountMinted,
        airdropAssociateEthereumAccount,
        rawAddress: publicKey?.toString() ?? "",
        // solana addresses are case sensitive
        address: publicKey?.toString(),
        signBuffer,
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export default SolanaFacade;
