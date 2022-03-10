import Button from "components/Button";
import { useHistory } from "react-router-dom";

// For toolbar toggle of which button is selected
interface selected {
  options: [boolean, boolean, boolean]
}

export const WalletToolbarContent = ({ selected }: { selected: selected }) => {
  const history = useHistory();

  return (
    <div className="wallet-menu">
      <div></div>
      <Button
        label="Overview"
        theme="white-primary-text"
        texttheme="header-text"
        className="submenu-button"
        goto={() => history.push("/wallet")}
        subSelected={selected.options[0]}
        priviledge={0}
      />
      <Button
        label="Send"
        theme="white-primary-text"
        texttheme="header-text"
        className="submenu-button"
        goto={() => history.push("/walletsend")}
        subSelected={selected.options[1]}
        priviledge={0}
      />
      <Button
        label="History"
        theme="white-primary-text"
        texttheme="header-text"
        className="submenu-button"
        goto={() => history.push("/wallethistory")}
        subSelected={selected.options[2]}
        priviledge={0}
      />
    </div>
  );
}