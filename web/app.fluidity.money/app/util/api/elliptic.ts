import { AML } from "elliptic-sdk"

const EllipticKey = process.env.FLU_ELLIPTIC_KEY || ""
const EllipticSecret = process.env.FLU_ELLIPTIC_SECRET || ""

// truncated typing for only necessary properties
type EllipticWalletResponse = {
  // float
  risk_score: number
  error: { message: string } | null
}

// placeholder
const riskThreshold = 2;

const isEllipticDisabled = async(address: string, network: string) => {
  const {client} = new AML({key: EllipticKey, secret: EllipticSecret})
  const requestBody = {
      subject: {
          asset: 'holistic',
          blockchain: network,
          type: 'address',
          hash: address,
      },
      type: 'wallet_exposure',
  };

  const {risk_score: riskScore, error}: EllipticWalletResponse = await client.post('/v2/wallet/synchronous', requestBody)

  if (error) {
    console.error(`failed to request elliptic risk score for address ${address} on network ${network}`, error)
  }

  return riskScore > riskThreshold;
}

export default isEllipticDisabled;
