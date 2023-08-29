function factorial(num: number): number {
  if (num === 0 || num === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}

function probability(m: number, n: number, b: number): number {
  return (binom(m, b) * binom(n - m, m - b)) / binom(n, m);
}

function binom(n: number, k: number): number {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function payout(ATX: number, os: number, m: number, n: number, b: number): number {
  const a: number = (1 / m) * (os / ATX);
  const w: number = a / probability(m, n, b);
  return w;
}

type TxReward = {
  tier: number;
  reward: number;
  probability: number;
}

export const getTransactionRewards: (prizePool: number) => TxReward[] = (prizePool) => {
  const tiers = []
  const BTX = 1;
  const deltaweight: number = 365 * 24 * 60 * 60;
  const blocktime = 60;
  const ATX: number = (deltaweight * BTX) / blocktime;
  const m = 5;
  let n = m + 1;

  const os: number = prizePool / (deltaweight / blocktime);

  while (factorial(n) < (1 / 4) * ATX * factorial(m) * factorial(n - m)) {
    n++;
  }

  const updatedN: number = n - 1;

  for (let i = 1; i <= m; i++) {
    const w: number = payout(BTX, os, m, updatedN, i);
    const p: number = probability(m, updatedN, i);

    tiers.push({
      tier: m - i + 1,
      reward: w,
      probability: p
    })
  }
  return tiers;
}
