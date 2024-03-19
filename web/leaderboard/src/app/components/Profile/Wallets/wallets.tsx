import Image from "next/image";
import { useConnect } from "wagmi";

import { Text } from "@fluidity-money/surfing";

import styles from "./Wallets.module.scss";

export const Wallets = () => {
  const { connect, connectors } = useConnect();

  return (
    <>
      <ul className={styles.connect_wallets_list}>
        {connectors &&
          connectors.map((connector) => (
            <li
              key={`wallet-${connector.name}`}
              onClick={() => connect({ connector })}
              className={styles.wallets_item}
            >
              {connector.name === "MetaMask" ? (
                <Image
                  src="https://static.fluidity.money/images/wallets/eth_browser.svg"
                  width={32}
                  height={32}
                  alt="eth_browser"
                />
              ) : (
                <Image
                  src="https://static.fluidity.money/images/wallets/walletconnect.svg"
                  width={32}
                  height={32}
                  alt="wallet connect"
                />
              )}
              <Text size="sm" className={styles.connect_wallet_name}>
                {connector.name}
              </Text>
            </li>
          ))}
        <li
          key={`wallet-OKX-Wallet`}
          onClick={() => window?.open("https://www.okx.com/web3", "_blank")}
          className={styles.wallets_item}
        >
          <Image
            src="https://static.fluidity.money/images/wallets/okx.svg"
            className={styles.wallet_logo}
            width={32}
            height={32}
            alt="okx"
          />
          <Text size="sm" className={styles.connect_wallet_name}>
            OKX Wallet
          </Text>
        </li>
        <li
          key={`wallet-Coin98`}
          onClick={() => window?.open("https://wallet.coin98.com/", "_blank")}
          className={styles.wallets_item}
        >
          <Image
            src="https://static.fluidity.money/images/wallets/coin98.svg"
            className={styles.wallet_logo}
            width={32}
            height={32}
            alt="coin98"
          />
          <Text size="sm" className={styles.connect_wallet_name}>
            Coin98
          </Text>
        </li>
      </ul>
    </>
  );
};
