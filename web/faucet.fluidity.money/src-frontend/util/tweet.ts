
export const formatTweet = (uniqueCode: string): string => {
  return `https://twitter.com/intent/tweet?text=Requesting%20funds%20on%20the%20%40fluiditymoney%20Ethereum%20Ropsten%20Testnet!%20${uniqueCode}%20%23fluiditymoney&original_referer=https://faucet.fluidity.money`;
};
