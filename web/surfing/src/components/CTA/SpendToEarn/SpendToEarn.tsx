import CardCarousel from "~/components/Container/CardCarousel/CardCarousel"
import { BloomEffect, Display, ProviderIcon, Text } from "~/lib"

import styles from './SpendToEarn.module.scss'

const SpendToEarn: React.FC = (props) => {

  // const { addToken } = props

  return (
    <CardCarousel>
      <CardCarousel.Slide>
        <div className={styles.providers}>
          <a
            onClick={(e) => {
              e?.stopPropagation();
              // addToken?.('fUSDC');
            }}
          >
            {/* <BloomEffect type="static" color={"red"} width={80} /> */}
            <ProviderIcon provider="Fluidity" />
          </a>
          <a href="https://app.1inch.io/#/1/simple/swap/ETH/0x9d1089802eE608BA84C5c98211afE5f37F96B36C/import-token">
            {/* <BloomEffect type="static" color={"red"} width={80} /> */}
            <ProviderIcon provider="Oneinch" />
          </a>
          <a href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x9d1089802eE608BA84C5c98211afE5f37F96B36C&chainId=1">
            {/* <BloomEffect type="static" color={"red"} width={80}/> */}
            <ProviderIcon provider="Sushiswap" />
          </a>
          <a href="https://app.balancer.fi/#/ethereum/pool/0xfee6da6ce300197b7d613de22cb00e86a8537f06000200000000000000000393/invest">
            {/* <BloomEffect type="static" color={"red"} width={80}/> */}
            <ProviderIcon provider="Balancer" />
          </a>
        </div>
        <Display size="xxxs">Spend To Earn</Display>
        <Text>Use Fluid Assets to generate yield.</Text>
      </CardCarousel.Slide>
      <CardCarousel.Slide>
        <div className={styles.providers}>
          <a href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x9d1089802eE608BA84C5c98211afE5f37F96B36C&chainId=1">
            {/* <BloomEffect type="static" color={"red"} width={80}/> */}
            <ProviderIcon provider="Sushiswap" />
          </a>
          <a href="https://app.uniswap.org/#/swap?outputCurrency=0x9d1089802eE608BA84C5c98211afE5f37F96B36C">
            {/* <BloomEffect type="static" color={"red"} width={80}/> */}
            <ProviderIcon provider="Uniswap" />
          </a>
          <a href="#">
            {/* <BloomEffect type="static" color={"red"} width={80}/> */}
            <ProviderIcon provider="Multichain" />
          </a>
          <a href="https://app.dodoex.io/?network=mainnet&from=0x9d1089802eE608BA84C5c98211afE5f37F96B36C&to=ETH">
            {/* <BloomEffect type="static" color={"red"} width={80}/> */}
            <ProviderIcon provider="Dodo" />
          </a>
        </div>
        <Display size="xxxs">Swap To Earn</Display>
        <Text>Swap Fluid Assets to generate yield.</Text>
      </CardCarousel.Slide>
    </CardCarousel>
  );
}

export default SpendToEarn