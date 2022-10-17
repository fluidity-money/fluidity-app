// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
