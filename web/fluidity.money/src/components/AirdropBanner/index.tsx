import { useState } from "react";
import { Card, GeneralButton, Text } from "@fluidity-money/surfing";
import style from "./Airdrop.module.scss";

const AirdropBanner = () => {
  const [show, setShow] = useState(true);

  if (!show) return <></>;

  return (
    <div className={style.container}>
      <Card type="opaque" color="holo" className={style.content}>
        <Text size="sm" className={style.text}>
          🌊 💸 The{" "}
          <a href="https://airdrop.fluidity.money" className={style.text}>
            <strong>
              <u> Fluidity Money Airdrop </u>
            </strong>
          </a>{" "}
          is happening!{" "}
          <a href="https://airdrop.fluidity.money" className={style.text}>
            <strong>
              <u> Use Fluid assets </u>
            </strong>
          </a>{" "}
          to earn rewards!
        </Text>
        <a href="https://airdrop.fluidity.money">
          <button className={style.button}>
            <Text size="sm" prominent code>
              LEARN MORE
            </Text>
          </button>
        </a>
      </Card>
      <GeneralButton
        size="small"
        prominent
        code
        className={style.closebutton}
        handleClick={() => setShow(false)}
      >
        ^
      </GeneralButton>
    </div>
  );
};

export default AirdropBanner;
