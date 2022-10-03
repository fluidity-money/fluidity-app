import type { LinksFunction } from "@remix-run/node";
import { useState } from "react";

import {
  Card,
  Text,
  Display,
  numberToMonetaryString,
  GeneralButton,
  Heading,
} from "@fluidity-money/surfing";
import styles from "./styles.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

type IUserRewards = {
  claimNow: boolean;
  callback: () => void;
}


const UserRewards = ({claimNow, callback}: IUserRewards) => {

  const [loading, setLoading] = useState(false);
  
  const buttonText = claimNow ? "Claim now with fees" : "View breakdown"
  
  const onClick = () => {
    
  }
  
  return (
    <Card
      id="user-rewards"
      component="div"
      rounded={true}
      type={"holobox"}
    >
      {/* Icon */}
      <img id="logo" src="./tokens" alt="tokens" />

      {/* Unclaimed fluid rewards */}
      <section id="unclaimed">
        <Text size="md" >Unclaimed fluid rewards</Text>
        <Display size="md" >{numberToMonetaryString(6745)}</Display>
        <GeneralButton
          size={"large"}
          version={"primary"}
          buttonType="text"
          handleClick={onClick}
        >
          { buttonText }
        </GeneralButton>
      </section>

      {/* Auto-claims infobox */}
      <section id="infobox">
        <Heading as="h5">
          Auto-claims
        </Heading>
        <Text>
          {autoClaimInfo}
        </Text>
        <hr />
        <Heading as="h5">
          Instant-claim fees
        </Heading>
        <section>
          <Text>
            Network fee
          </Text>
          <Text>
            $0.002 FUSDC
          </Text>
        </section>
        <hr />
        <section>
          <Text>
            Gas fee
          </Text>
          <Text>
            $0.002 FUSDC
          </Text>
        </section>
        <hr />
      </section>
    </Card>
  );
};

export default UserRewards;

const autoClaimInfo = "Rewards will be claimed automatically, without fees<br>\
                        when market volume is reached. Claiming before this\n\
                        time will incur instant-claim fees stated below."


