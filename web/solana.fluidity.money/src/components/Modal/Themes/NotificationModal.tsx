import GenericModal from "components/Modal/GenericModal";

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
        <h2 className="primary-text">Notifications</h2>
        <hr className="notification-line" />
        <div className="connect-modal-form secondary-text">
          You have no notifications
        </div>
      </div>
    </GenericModal>
  );
};

export default NotificationModal;
