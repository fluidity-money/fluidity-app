import {getATAAddress, TokenAmount, TOKEN_PROGRAM_ID, u64, Uint64Layout} from '@saberhq/token-utils';
import {useSolana} from '@saberhq/use-solana';
import {PublicKey} from '@solana/web3.js';
import {useEffect} from 'react';
import {useFluidToken} from 'util/hooks';
import {FluidToken, FLUID_PROGRAM_ID, tokenList} from 'util/solana/constants';

//WinNotification displays when the user has won a payout
const WinNotification = ({addWinNotification}: {addWinNotification: (message: string) => void, }) => {
    const sol = useSolana();
    const {connection, publicKey} = sol
    const fluidTokens = useFluidToken();

    useEffect(() => {
        if (!publicKey || !fluidTokens)
            return;

        const ids: Array<number> = [];
        //watch the fluid program to notify when payouts occur
        ids.push(connection.onLogs(new PublicKey(FLUID_PROGRAM_ID), async res => {

            //get detailed transaction info
            const txn = await connection.getTransaction(
                res.signature, 
                {commitment: 'finalized'}
            );

            if (!txn)
                return;

            //extract the logs
            const logs = txn.meta?.logMessages;
            if (!logs || logs.length < 11)
                return;
            
            //check some of the log messages to see if it's a payout event
            //TODO is there a better way to watch for certain program calls?
            if (
                logs[0] === `Program ${FLUID_PROGRAM_ID} invoke [1]` &&
                logs[1] === `Program ${TOKEN_PROGRAM_ID} invoke [2]` &&
                logs[2] === `Program log: Instruction: MintTo` && //both of these are a mint instruction
                logs[6] === `Program log: Instruction: MintTo` && //only for the payout event
                logs[10] === `Program ${FLUID_PROGRAM_ID} success`
            )
                {

                //get all fluid token mint addresses
                const tokenMintAddresses = tokenList
                    .filter(token => token.symbol[0] === "f")
                    .map(({mintAddress, symbol}) => ({mintAddress, symbol}))
                
                if (!txn.meta?.preTokenBalances)
                    return;

                //there will only be one unique fluid token per payout,
                //so look for the first one in the list of changed balances
                const balance = txn.meta.preTokenBalances.find(bal =>
                    tokenMintAddresses.findIndex(({mintAddress}) =>
                        mintAddress === bal.mint)
                    !== -1
                )

                if (!balance)
                    return;

                //get the Token object that we've just traded
                const fluidToken = tokenList.find(token => token.mintAddress === balance.mint) as FluidToken;
                const token = fluidTokens[fluidToken.symbol]
                
                //find where ATA matches user and get their balance
                const ata = await getATAAddress({mint: new PublicKey(balance.mint), owner: publicKey});
                //balances are indexed by position in the accounts array
                const index = txn.transaction.message.accountKeys.findIndex(acc => acc.equals(ata))
                const pre = txn.meta?.preTokenBalances?.find(bal => bal.accountIndex === index)
                const post = txn.meta?.postTokenBalances?.find(bal => bal.accountIndex === index)

                if (!pre || !post)
                    return;
                //get the difference and alert
                const postAmount = new TokenAmount(token, post.uiTokenAmount.amount);
                const preAmount = new TokenAmount(token, pre.uiTokenAmount.amount);
                const amount = postAmount.greaterThan(preAmount) ?
                    postAmount.subtract(preAmount) :
                    preAmount.subtract(postAmount);

                addWinNotification(`You have just won ${amount.toExact()} ${amount.token.symbol}!`);
            }
        }, 'finalized'));

        //clean up subscription on unmount
        return () => {
            ids.forEach(id => {
                connection.removeOnLogsListener(id);
            });
        }
        
    },[sol.connected, sol.publicKey, fluidTokens])

    return <></>;
}

export default WinNotification;
