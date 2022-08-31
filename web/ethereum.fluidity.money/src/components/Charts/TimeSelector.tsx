// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import Button from "components/Button";
import { appTheme } from "util/appTheme";

const TimeSelector = () => {
  const [btnSelect, setBtnSelect] = useState([
    false,
    false,
    false,
    true,
    false,
    false,
  ]);

  const btnSelector = (index: number) => {
    const tempArray = [false, false, false, false, false, false];
    tempArray[index] = true;
    setBtnSelect(tempArray);
  };

  const buttonLabels = ["1D", "1W", "1M", "3M", "6M", "1Y"];

  return (
    <div className="time-selector">
      {buttonLabels.map((buttonLabels, index) => (
        <Button
          label={buttonLabels}
          theme={`primary-text${appTheme}`}
          className="time-selector-button"
          goto={() => btnSelector(index)}
          timeSelected={btnSelect[index]}
          priviledge={0}
        />
      ))}
    </div>
  );
};

export default TimeSelector;
