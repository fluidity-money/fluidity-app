import styles from "./styles.css";

export const JoeFarmlandsOrCamelotKingdomLinks = () => [
  { rel: "stylesheet", href: styles },
];

const JoeFarmlandsOrCamelotKingdom = () => {
  return (
    <div className="joe_farmlands_or_camelot_div">
      <a
        href="https://traderjoexyz.com/arbitrum/pool/v21/0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a/0x912ce59144191c1204e64559fe8253a0e49e6548/25"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="joe_farmlands_or_camelot_img_joe"
          src="https://app-cdn.fluidity.money/images/joe-farmlands.png"
        />
      </a>
      <a
        href="https://app.camelot.exchange/pools/0xAc07ed4CbdDA2cB17F9AEca2919c825dCb2882B9"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="joe_farmlands_or_camelot_img_camelot"
          src="https://app-cdn.fluidity.money/images/kingdom-of-camelot.png"
        />
      </a>
    </div>
  );
};

export default JoeFarmlandsOrCamelotKingdom;
