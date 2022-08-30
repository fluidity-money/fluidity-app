// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import Icon from "components/Icon";

const AppContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className="app-container gradient-background">
      {children}
      {/* Fluidity text footer */}
      <div className="fluidity-footer flex row flex-space-between width-auto">
        <div className="flex row flex-space-between gap">
          <Icon src="i-fluidity-medium" />
          <div className="fluidity-text">Fluidity.</div>
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
