
import styles from "./styles.css";

export const JoeFarmlandsOrCamelotKingdomLinks = () => [{ rel: "stylesheet", href: styles }];

const JoeFarmlandsOrCamelotKingdom = () => {
  return (
    <div className="joe_farmlands_or_camelot_div">
      <a href="#">
        <img
          className="joe_farmlands_or_camelot_img_joe"
          src="/images/joe-farmlands.png" />
      </a>
      <a href="#">
        <img
          className="joe_farmlands_or_camelot_img_camelot"
          src="/images/kingdom-of-camelot.png" />
      </a>
    </div>
  );
}

export default JoeFarmlandsOrCamelotKingdom;
