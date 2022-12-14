// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import GeneralButton, { IGeneralButtonProps } from "../GeneralButton"

interface ILaunchButton extends Omit<IGeneralButtonProps, "handleClick"> {}

const LaunchButton: React.FC<ILaunchButton> = (props) => {
  const handleLaunchFluidity = () => (window.location.href = "https://app.fluidity.money/")

  return (
    <GeneralButton
      {...props}
      handleClick={handleLaunchFluidity}
    >
      {props.children}
    </GeneralButton>
  )
}

export default LaunchButton