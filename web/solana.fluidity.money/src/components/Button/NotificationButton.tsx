import NotificationModal from "components/Modal/Themes/NotificationModal";
import { useState } from "react";

const NotificationButton = () => {
  const [notificationToggle, setNotificationToggle] = useState(false);
  const notificationModalToggle = () => {
    setNotificationToggle(!notificationToggle);
  };

  return (
    <>
      <img
        onClick={() => setNotificationToggle(true)}
        className="notification-button"
        src={
          //  reward? ? "/img/reward_button.svg" :
          "/img/bell_button.svg"
        }
        alt="notification button"
      />
      <div>
        <NotificationModal
          enable={notificationToggle}
          toggle={notificationModalToggle}
          height="auto"
        />
      </div>
    </>
  );
};

export default NotificationButton;
