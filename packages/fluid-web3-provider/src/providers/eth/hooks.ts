import Web3 from "web3";
import { useState, useEffect, useReducer } from "react";
import { AbiItem } from "web3-utils";
import { EventData } from "web3-eth-contract";
import store from "localforage";

import Token from "../../Token.json";
import LiquidityProvider from "../../LiquidityProvider.json";
import IERC20Metadata from "../../IERC20Metadata.json";

const web3 = new Web3();

const getFluidAssetMetadata = async (address: string) => {
  const contract = new web3.eth.Contract(Token.abi as AbiItem[], address);
  const _getUnderlyingAssetMetadata = async () => {
    // Safe destructure
    const pool = new web3.eth.Contract(
      LiquidityProvider.abi as AbiItem[],
      await contract.methods.pool_().call()
    );
    const underlyingToken = new web3.eth.Contract(
      IERC20Metadata.abi as AbiItem[],
      await pool.methods.underlying_().call()
    );
    return await underlyingToken.methods.symbol().call();
  };

  return await Promise.all([
    contract.methods.symbol().call(),
    _getUnderlyingAssetMetadata(),
  ]);
};

const useUserTokenHistory = (
  address: string,
  contractAddress: string,
  onIncomingTransaction: (transaction: any) => void = () => {}
): any => {
  const contract = new web3.eth.Contract(
    Token.abi as AbiItem[],
    contractAddress
  );
  const [status, setStatus] = useState("loading");
  const [data, dispatch] = useReducer(
    (action, payload) => {
      switch (action) {
        case "SET_NOTIFY_BLOCK":
          return { ...data, notifyBlock: payload };

        case "ADD_TRANSACTION":
          if (payload.blockNumber > data.notifyBlock)
            onIncomingTransaction(payload);
          return { ...data, transactions: [...data.transactions, payload] };
      }
    },
    {
      notifyBlock: -1,
      transactions: [],
    }
  );

  useEffect(() => {
    (async () => {
      // Bail if we don't have a user address
      if (address === "") return;

      const symbols = await getFluidAssetMetadata(contractAddress);
      const [symbol, _underlyingSymbol] = symbols;
      const latestBlock = await web3.eth.getBlockNumber();
      dispatch({
        type: "SET_NOTIFY_BLOCK",
        payload: latestBlock,
      });

      const handleSwap = (event: EventData) => {
        const {
          event: eventName,
          blockNumber,
          transactionHash,
          returnValues: { amount },
        } = event;
        let currency = "";
        switch (eventName) {
          case "MintFluid":
            currency = symbols.join("-");
            break;
          case "BurnFluid":
            currency = symbols.slice().reverse().join("-");
            break;
        }
        dispatch({
          type: "ADD_TRANSACTION",
          payload: {
            blockNumber,
            transactionId: transactionHash,
            currency,
            amount,
            type: "Swap",
            target: "-",
            // Just in case we have edge cases
            _pure: event,
          },
        });
      };

      const handleTransfer = (event: EventData) => {
        const {
          returnValues: { from, to, value },
          blockNumber,
          transactionHash,
        } = event;

        dispatch({
          type: "ADD_TRANSACTION",
          payload: {
            blockNumber,
            transactionId: transactionHash,
            currency: symbol,
            amount: value,
            type: from === address ? "Sent" : "Recieved",
            target: from === address ? to : from,
            // Just in case we have edge cases
            _pure: event,
          },
        });
      };

      const handleReward = (event: EventData) => {
        const {
          returnValues: { amount },
          blockNumber,
          transactionHash,
        } = event;
        dispatch({
          type: "ADD_TRANSACTION",
          payload: {
            blockNumber,
            transactionId: transactionHash,
            currency: symbol,
            amount,
            type: "Reward",
            // Just in case we have edge cases
            _pure: event,
          },
        });
      };

      contract.events
        .Reward({
          fromBlock: 0,
          filter: {
            winner: address,
          },
        })
        .on("data", (event: EventData) => handleReward(event));

      // Transfers
      contract.events
        .Transfer({
          fromBlock: 0,
          filter: {
            to: address,
          },
        })
        .on("data", (event: EventData) => handleTransfer(event));

      contract.events
        .Transfer({
          fromBlock: 0,
          filter: {
            from: address,
          },
        })
        .on("data", (event: EventData) => handleTransfer(event));

      // Swaps
      contract.events
        .MintFluid({
          fromBlock: 0,
          filter: {
            addr: address,
          },
        })
        .on("data", (event: EventData) => handleSwap(event));

      contract.events
        .BurnFluid({
          fromBlock: 0,
          filter: {
            addr: address,
          },
        })
        .on("data", (event: EventData) => handleSwap(event));

      setStatus("ready");
    })();
  }, [address, contractAddress]);

  return [data, status];
};

const useBlockHistory = () => {
  const [blocks, setBlocks] = useState<any>({});
  const [queuedBlocks, setQueuedBlocks] = useState<any>({});
  store.getItem("blockHistory").then((data) => {
    if (data) {
      setBlocks({ ...(data as any), ...blocks });
    }
  });

  useEffect(() => {
    (async () => {
      await store.setItem("blockHistory", blocks);
    })();
  }, [blocks]);

  const fetchBlocks = (...blockNumbers: number[]) => {
    for (const blockNumber of blockNumbers) {
      if (!queuedBlocks[blockNumber]) {
        web3.eth.getBlock(blockNumber).then((block) => {
          setBlocks((blocks) => ({ ...blocks, [blockNumber]: block }));
        });
        setQueuedBlocks({ ...queuedBlocks, [blockNumber]: true });
      }
    }
  };
  return [blocks, fetchBlocks];
};

const useRewardHistory = (address: string) => {
  // Reward history generally speaking should be more shallow. Use last 1000 blocks.
  const [winners, setWinners] = useState([]);
  useEffect(() => {
    const contract = new web3.eth.Contract(Token.abi as AbiItem[], address);

    web3.eth.getBlockNumber().then((currentBlock) => {
      contract.events
        .Reward({
          fromBlock: currentBlock - 1000,
        })
        .on("data", (event: EventData) => {
          const {
            returnValues: { winner, amount },
            blockNumber,
          } = event;

          setWinners(
            [{ winner, amount, blockNumber }, ...winners].slice(0, 10)
          );
        });
    });
  }, []);

  return winners;
};

export {
  useBlockHistory,
  useRewardHistory,
  useUserTokenHistory,
  web3 as _web3,
};
export default { useBlockHistory, useRewardHistory, useUserTokenHistory };
