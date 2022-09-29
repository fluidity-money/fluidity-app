import type { LinksFunction } from "@remix-run/node";

import {
  Card,
  Text,
  Display,
  numberToMonetaryString,
  GeneralButton,
  Heading,
} from "@fluidity-money/surfing";
import styles from "./styles.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};


const UserRewards = () => (
  <Card
    className="user-rewards"
    component="div"
    rounded={true}
    type={"holobox"}
  >
    {/* Unclaimed fluid rewards */}
    <section>
      <img src="./tokens" alt="tokens" />
      <Text size="md" >Unclaimed fluid rewards</Text>
      <Display size="md" >{numberToMonetaryString(6745)}</Display>
      <GeneralButton
        size={"large"}
        version={"primary"}
        buttonType="text"
        handleClick={() => {}}
      >
        View Breakdown
      </GeneralButton>
    </section>

    {/* Auto-claims infobox */}
    <section>
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

export default UserRewards;

const autoClaimInfo = "Rewards will be claimed automatically, without fees\n\
                        when market volume is reached. Claiming before this\n\
                        time will incur instant-claim fees stated below."


