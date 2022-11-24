import { Display, LinkButton, Text } from "@fluidity-money/surfing";

interface IUnclaimedRewardsHoverModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UnclaimedRewardsHoverModal = ({
  setShowModal,
}: IUnclaimedRewardsHoverModalProps) => {
  // access unclaimed rewards figure once merged
  const unclaimedRewards = 6745;
  return (
    <div
      className="unclaimed-modal-container"
      onMouseEnter={() => setShowModal(true)}
      onMouseLeave={() => setTimeout(() => setShowModal(false), 500)}
    >
      <img
        id="card-logo"
        src="/images/fluidTokensMetallicCropped.svg"
        alt="tokens"
        style={{ width: 100 }}
      />
      <section>
        <Text size="sm">Unclaimed rewards</Text>
        <Display className="unclaimed-total" size={"xs"}>
          {unclaimedRewards.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Display>
        <LinkButton
          size={"small"}
          type={"internal"}
          handleClick={() => {
            //navigate user unclaimed rewards
            return;
          }}
        >
          DETAILS
        </LinkButton>
      </section>
    </div>
  );
};

export default UnclaimedRewardsHoverModal;
