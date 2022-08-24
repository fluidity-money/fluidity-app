// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

interface IProps {
  toggled: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton = ({ toggled, toggle }: IProps) => {
  return (
    <>
      <div className="toggle-bar" onClick={() => toggle(!toggled)}>
        <div
          className={toggled ? "toggle-slider-right" : "toggle-slider-left"}
        ></div>
      </div>
    </>
  );
};

export default ToggleButton;
