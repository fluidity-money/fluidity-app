import { FluidityEthereum } from "fluid-web3-provider";
import { useEffect } from "react";
import { useContext } from "react";
import { notificationContext } from "./Notifications/notificationContext";

const FluidityChainEventListener = () => {
  const notifications = useContext(notificationContext);
  const onChain = useContext(FluidityEthereum);

  useEffect(() => {
    const subscription = onChain.subscribe(
      (ev: {
        event: "Sent" | "Recieved" | "Swap" | "Reward";
        currency: string;
        amount: number;
        target: string;
      }) => {
        switch (ev.event) {
          case "Reward":
            break;
          case "Sent":
            notifications.addNotification(
              `Sent ${ev.amount} ${ev.currency} to ${ev.target}`
            );
            break;
          case "Recieved":
            notifications.addNotification(
              `Recieved ${ev.amount} ${ev.currency} from ${ev.target}`
            );
            break;
          case "Swap":
            notifications.addNotification(
              `Successfully swapped ${ev.amount} ${ev.currency.replace(
                "-",
                " for "
              )}`
            );
            break;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  return <></>;
};

export default FluidityChainEventListener;
