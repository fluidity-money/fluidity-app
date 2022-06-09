import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";
import { appTheme } from "util/appTheme";
import useLocalStorage from "util/hooks/useLocalStorage";

interface Blockchain {
  blockchain: string;
  icon: string;
  visible: boolean;
  networks: Network[];
}

interface Network {
  name: string;
  address: string;
}

const NotificationModal = ({
  height,
  width,
  enable,
  toggle,
}: {
  height?: string;
  width?: string;
  enable: boolean;
  toggle: Function;
}) => {
  return (
    <GenericModal
      enable={enable}
      toggle={() => toggle()}
      height={height}
      width={width}
    >
      <div className="connect-modal-body--networks">
        <h2 className={`primary-text${appTheme}`}>Notifications</h2>
        <hr className="line" />
        <div className="connect-modal-form secondary-text">
          You have no notifications
        </div>
      </div>
    </GenericModal>
  );
};

export default NotificationModal;
