import { Tooltip } from "@fluidity-money/surfing";
import {
  Display,
  LinkButton,
  numberToMonetaryString,
  Text,
} from "@fluidity-money/surfing";
import { useNavigate } from "@remix-run/react";

interface IUnclaimedRewardsHoverModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  unclaimedRewards: number;
}

const UnclaimedRewardsHoverModal = ({
  setShowModal,
  unclaimedRewards,
}: IUnclaimedRewardsHoverModalProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip
      style={{
        right: 64,
        top: 80,
        flexDirection: "row",
        gap: "1em",
        alignItems: "center",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        onMouseEnter={() => setShowModal(true)}
        onMouseLeave={() => setTimeout(() => setShowModal(false), 500)}
      >
        <img
          id="card-logo"
          src="/images/fluidTokensMetallicCropped.svg"
          alt="tokens"
          style={{ width: 100 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text size="sm">Unclaimed rewards</Text>
          <Display className="unclaimed-total" size={"xs"}>
            {numberToMonetaryString(unclaimedRewards)}
          </Display>
          <LinkButton
            size={"small"}
            type={"internal"}
            handleClick={() => {
              //navigate user unclaimed rewards
              unclaimedRewards > 0
                ? navigate("./rewards/unclaimed")
                : navigate("./rewards");
            }}
          >
            DETAILS
          </LinkButton>
        </div>
      </div>
    </Tooltip>
  );
};

export default UnclaimedRewardsHoverModal;
