import {useContext} from "react";
import {RedemptionContext} from "./redemptionContext";

interface RedeemBoxProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const RedeemBox = (props: RedeemBoxProps) => {
  const {value: redeemable, setValue: setRedeemable, submit} = useContext(RedemptionContext); 
  return <div className="redeem-container" {...props}>
    <div className="redeem header">Redeem</div> 
    <div className="redeem amount-large">0 FLUID</div>
    <div className="redeem part">
      <div className="left">Total USDC Raise</div>
      <div className="right flex row">100,000,000.000 <i className="icon usdc"/></div>
    </div> 
    <div className="redeem part">
      <div className="left">Total v-FLUID</div>
      <div className="right flex row"> 50,000,000.000 <i className="icon fluidity-logo"/></div>
    </div> 
    <div className="redeem part">
      <div className="left">Implied Option Price</div>
      <div className="right">$2.00</div>
    </div> 
    <input
      className="redeem input"
      placeholder="Redeemable v-FLUID"
      value={redeemable}
      onChange={e => setRedeemable(e.target.value)}
    />
    <button
      className="redeem button"
      onClick={_ => submit()}>Redeem v-FLUID</button>
    <div className="redeem bottom-text">0 USDC in wallet</div>
  </div>
}

export default RedeemBox;
