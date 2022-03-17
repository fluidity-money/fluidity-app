const Toolbar = ({ children }: { children: JSX.Element; }) => {
  return <div className="toolbar p-0_5">{children}</div>;
};

export const WalletToolbar = ({ children }: { children: JSX.Element; }) => {
  return <div className="wallet-menu-container">{children}</div>;
};

export default Toolbar;
