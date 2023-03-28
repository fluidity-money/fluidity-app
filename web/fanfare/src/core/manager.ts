import { Observable } from "rxjs";
import { Transaction } from "../types/OutputMessage";
import { TransactionProvider } from "../types/Transaction";
import { onUnhealthy } from "./unhealthy";
import { FanfareConfig } from "../types/Config";

export const manager = (
    provider: TransactionProvider,
    { 
        debug,
        unhealthyThreshold
    }: FanfareConfig,
) => {
    let failureCount = 0;

    debug && console.log(`[debug] Starting manager for ${provider.name()}...`);
    const observable = new Observable<Transaction>((subscriber) => {
        
        debug && console.log(`[debug] Starting provider for ${provider.name()}...`);
        const onTransaction = (tx: Transaction) => {
            failureCount = 0;
            subscriber.next(tx)
        }
        
        const onError = (_: Error) => {
            failureCount += 1;
            if (failureCount >= unhealthyThreshold) {
                onUnhealthy(provider);
                setTimeout(() => {
                    provider.onTransaction(onTransaction);
                }, 300000);
                return;
            }
            provider.onTransaction(onTransaction);
        }
        
        const onWatchdogFailure = () => {
            onError(new Error("Watchdog failure, reconnecting..."));
        }
        
        try {
            provider.onTransaction(onTransaction);
        } catch (e) {
            subscriber.error(e);
        }
        provider.onError(onError);
        provider.onWatchdogFailure(onWatchdogFailure)

        setInterval(() => {
            if (failureCount >= unhealthyThreshold) {
                onUnhealthy(provider);
            }
        }, 10000)
    })

    return {
        observable
    }
}