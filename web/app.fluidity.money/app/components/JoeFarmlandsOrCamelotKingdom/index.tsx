import styles from "./styles.css";

export const JoeFarmlandsOrCamelotKingdomLinks = () => [
  { rel: "stylesheet", href: styles },
];

const JoeFarmlandsOrCamelotKingdom = () => {
  return (
    <div className="joe_farmlands_or_camelot_div">
      <a
        href="https://traderjoexyz.com/arbitrum/pool/v21/0x000F1720A263f96532D1ac2bb9CDC12b72C6f386/0xaf88d065e77c8cC2239327C5EDb3A432268e5831/100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="joe_farmlands_or_camelot_img_joe"
          src="https://app-cdn.fluidity.money/images/joe-farmlands.png"
        />
      </a>
      <a
        href="https://app.camelot.exchange/pools/0xD42ef780e9B290Aa071C08B8e766f29A53A7f982"
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
