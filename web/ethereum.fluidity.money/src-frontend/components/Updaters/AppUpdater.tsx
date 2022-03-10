import { Connectors, useWallet } from "use-wallet";
import { JsonRpcProvider} from "ethers/providers";
import { useContext, useEffect, useState } from "react";
import Web3 from "web3"
import useSigner from "util/hooks/useSigner"
import {getAllFluidContracts, ListenerArgs} from "util/contractUtils";
import {formatUnits} from "ethers/utils";
import {Contract} from "ethers";
import {notificationContext} from "components/Notifications/notificationContext";
import {trimAddress} from "util/addresses";

declare let window: any;

const zeroAddr = "0x0000000000000000000000000000000000000000";

const AppUpdater = () => {
    // Runs a check on the app when loaded
    const wallet = useWallet<JsonRpcProvider>();
    const signer = useSigner();

    const [contracts, setContracts] = useState<Array<{contract: Contract, name: string}>>([]);
    const {addNotification} = useContext(notificationContext);

    if (wallet.status == "error")
      console.error(JSON.stringify(wallet));

    // Connects Wallet based on input type
    const connectWallet = async (connectorId: keyof Connectors) => {
        const doReconnect = !(connectorId === wallet.connector)
        //reset existing connection
        wallet.reset()
        //connect to wallet if connection exists
        if (doReconnect)
            await wallet.connect(connectorId);
    }

    // Checks wallet status (whether or not Meta is connected)
    const CheckWalletStatus = async (connectorId: keyof Connectors) => {
        // Ethereum wallet auto connect
        // MetaMask Check
        if (window.ethereum?.isMetaMask || window.ethereumProvder?.isMetaMask) {
            try {
                const checkConnection = async () => {
                    // Check if browser is running Metamask or another
                    let web3: any;
                    web3 = new Web3(window.ethereum);

                    // Check if User is already connected by retrieving the accounts without needing the user connected
                    web3.eth.getAccounts().then((addr: string) => {
                        // If accounts are connected, addr.length will contain an account hence having an account to connect to automatically
                        if (addr.length != 0) { connectWallet(connectorId) }
                    });
                };
                checkConnection();
            }
            catch (e) {
                console.log(e)
            }
        }
        // Walletconnect check
        // else if(window.ethereumProvider.isConnected && process.env.REACT_APP_WALLET_CONNECT_GETH_URI) {
        //     // Checks walletconnect if not connected
        //     CheckWalletStatus('walletconnect');
        // }
    }

    // add listeners to every fluid contract to track receival of transfers
    const createContractListeners = async() => {
        if (!signer) return;

        const address = await signer.getAddress();

        contracts.map(c => {
            c.contract.addListener('Transfer', ((...args: ListenerArgs) => {
                const [sender, receiver, amount] = args;
                if (address === receiver && sender !== zeroAddr)
                    addNotification(`Received ${formatUnits(amount, 6).toString()} ${c.name} from ${trimAddress(sender)}`);
            }))
        });
    }

    useEffect(() => {
        if (!signer || contracts.length !== 0) return;
        const fluidContracts = getAllFluidContracts('ETH', signer);

        // avoid infinite loop if there's no contracts
        if (fluidContracts.length === 0) return;

        setContracts(getAllFluidContracts('ETH', signer));
    }, [signer])

    useEffect(() => {
        if (signer && contracts)
            createContractListeners();
    }, [contracts]);

    useEffect(() => {
        // Ethereum wallet check (if exists)
        if (window.ethereum?.isConnected || window.ethereumProvder?.isConnected) {
            CheckWalletStatus('injected')
        }
        // Walletconnect check
        // else if(window.ethereumProvider.isConnected && process.env.REACT_APP_WALLET_CONNECT_GETH_URI) {
        //     // Checks walletconnect if not connected
        //     // CheckWalletStatus('walletconnect').then(() => console.log(signer?.getAddress))
        // }
    }, [])
    return <></>
}

export default AppUpdater;
