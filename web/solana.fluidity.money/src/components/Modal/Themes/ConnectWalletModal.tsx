import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";
import {useSolana, WalletProviderInfo, WalletType, WALLET_PROVIDERS} from "@saberhq/use-solana";
import {useContext, useMemo} from "react";
import {notificationContext} from "components/Notifications/notificationContext";

//whether the wallet is currently useable
const getIsInstalled = (type: WalletType) => 
    WALLET_PROVIDERS[type].isInstalled ? 
        (WALLET_PROVIDERS[type].isInstalled as (() => boolean))() :
        true; //assume true for wallets that don't implement isInstalled
    
//icons as returned by WALLET_PROVIDERS
type Icon = string | React.FC<React.SVGProps<SVGSVGElement>>;

const ConnectWalletModal = ({height, width, enable, toggle}: {height?: string; width?: string; enable: boolean; toggle: Function;}) => {
    const sol = useSolana();
    const {wallet} = sol;
    const {addError} = useContext(notificationContext);
    //memoise icons in a map
    const icons = new Map<string, Icon>();

    const connectWallet = async(type: WalletType) => {
        if (type == WalletType.SecretKey) {
            addError("Secret Key not supported - please use a different wallet.")
            return;
        }

        // check if not installed, and if so don't continue
        const isInstalled = getIsInstalled(type);

        if (!isInstalled) {
            addError(`${type} is not installed in your browser! Visit ${WALLET_PROVIDERS[type].url} to install it`);
            // window.open(WALLET_PROVIDERS[type].url, '_blank', 'noopener,noreferrer');
            return; 
        }
        
        try {
            await sol.activate(type);
            await sol.wallet?.connect();
        } catch (e) {
            console.error(`Failed to connect to ${type} with error ${e} - disconnecting`);
            sol.wallet?.disconnect();

            //remove so we don't get stuck in an infinite loop of invalid autoconnects
            localStorage.removeItem("use-solana/wallet-config");
        }

        //close modal
        toggle();
    }

    type Option = Omit<WalletProviderInfo, 'isInstalled'> & {
        type: WalletType,
        disabled: boolean,
        isInstalled: boolean
    }

    const options: Option[] = [];
    for (const _provider in WALLET_PROVIDERS) {
        //cast since we know it's valid
        const provider = _provider as WalletType;

        //add to memo map
        const {name, icon} = WALLET_PROVIDERS[provider]
        icons.set(name, icon);

        options.push({
            ...WALLET_PROVIDERS[provider],
            type: provider,
            disabled: provider === WalletType.Ledger || provider === WalletType.SecretKey,
            isInstalled: getIsInstalled(provider) 
        });
    }

    const renderedOptions = options.map(({name, type, icon, isInstalled, disabled}, index) => {
        const isConnected = sol.walletProviderInfo?.name === name && sol.wallet?.connected;
        const Icon = icons.get(name) as Icon; //will exist

        const iconProps = {
            className: `wallet-icon ${disabled && "disabled"} ${!isInstalled && "not-installed"}`,
            alt: name,
        };
        return (
        <>
            <Button
                label={name}
                key={name + index}
                theme={`wallet-button ${(isConnected ?? "") && "active"} ${disabled && "disabled"}`}
                    texttheme={`wallet-text ${disabled && "disabled"}`}
                fontSize="font-large"
                icon={typeof icon === 'string' ? 
                    // nosemgrep
                    <img
                        style={{height: "45px"}}
                        src={icon} 
                        {...iconProps}
                    /> :
                    <Icon
                        style={{height: "45px"}}
                        {...iconProps}
                    />
                }
                goto={() => {!disabled && connectWallet(type)}}
                disabled={isConnected}
            />
            </>
        )
    })
    return (
        <GenericModal
            enable={enable}
            toggle={() => toggle()}
            height={height}
            width={width}
        >
            <div className="connect-modal-body">
                <h2 className="primary-text">{wallet?.connected ? "Wallet Connected" : "Connect to Wallet"}</h2>
                <div className="connect-modal-form">
                    {renderedOptions}
                </div>
            </div>
        </GenericModal>
    );
}

export default ConnectWalletModal;
