// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

const Toolbar = ({ children }: { children: JSX.Element; }) => {
  return <div className="toolbar p-0_5">{children}</div>;
};

export const WalletToolbar = ({ children }: { children: JSX.Element; }) => {
  return <div className="wallet-menu-container">{children}</div>;
};

export default Toolbar;
