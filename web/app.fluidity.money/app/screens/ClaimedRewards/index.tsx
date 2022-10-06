import {
  Card,
  Text,
  Display,
  numberToMonetaryString,
  GeneralButton,
  LinkButton,
  Heading,
} from "@fluidity-money/surfing";

type IClaimedRewads = {
  reward: number;
  networkFee: number;
  gasFee: number;
  showBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClaimedRewards = ({reward, networkFee, gasFee, showBreakdown}: IClaimedRewads) => {
  return (
    <div>
      {/* Navigation Bar */}
      <header>
        <img src="FluidLogo" alt="FluidLogo" />
        <button>
          Cancel
        </button>
      </header>
    
      {/* Claimed Info */}
      <section>
          <Text>Congrats! You've claimed</Text>
          <Heading as="h5">
            {numberToMonetaryString(reward)} USD
          </Heading>
          <Text>The funds have been added to your wallet.</Text>

          {/* Fee Info*/}
          <section>
            <Text>
              Network fee
            </Text>
            <Text>
              ${networkFee} FUSDC
            </Text>
          </section>
          <hr />
          <section>
            <Text>
              Gas fee
            </Text>
            <Text>
              ${gasFee} FUSDC
            </Text>
          </section>
          <hr />
      </section>
    
      {/* Navigation Buttons*/}
      {/* Assets Button - SCOPED OUT */}
      {/*
      <GeneralButton
        version={"primary"}
        buttonType={"text"}
        size={"large"}
        handleClick={() => {}}
      >
        Go to Assets
      </GeneralButton>
      */}
      <GeneralButton
        version={"secondary"}
        buttonType={"icon before"}
        icon={"Twitter"}
        size={"large"}
        handleClick={() => {}}
      >
        Share
      </GeneralButton>
      <LinkButton
        size={"small"}
        type={"internal"}
        handleClick={() => showBreakdown(false)}
      >
        Reward History
      </LinkButton>
    </div>
  )
}

export default ClaimedRewards;