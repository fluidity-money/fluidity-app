export const formatTweet = (uniqueCode: string, network: string): string => {
  return `https://twitter.com/intent/tweet?text=Requesting%20funds%20on%20the%20%40fluiditymoney%20%23${network}%20faucet!%20${uniqueCode}%20%23fluiditymoney&original_referer=https://faucet.fluidity.money`;
};
