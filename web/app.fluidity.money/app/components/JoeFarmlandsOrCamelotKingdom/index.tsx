import styles from "./styles.css";

export const JoeFarmlandsOrCamelotKingdomLinks = () => [
  { rel: "stylesheet", href: styles },
];

const JoeFarmlandsOrCamelotKingdom = () => {
  return (
    <div className="joe_farmlands_or_camelot_div">
      <a
        href="https://traderjoexyz.com/arbitrum/pool/v21/0x4CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A/0xaf88d065e77c8cC2239327C5EDb3A432268e5831/100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="joe_farmlands_or_camelot_img_joe"
          src="/images/joe-farmlands.png"
        />
      </a>
      <a
        href="https://app.camelot.exchange/pools/0xAc07ed4CbdDA2cB17F9AEca2919c825dCb2882B9"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="joe_farmlands_or_camelot_img_camelot"
          src="/images/kingdom-of-camelot.png"
        />
      </a>
    </div>
  );
};

export default JoeFarmlandsOrCamelotKingdom;
