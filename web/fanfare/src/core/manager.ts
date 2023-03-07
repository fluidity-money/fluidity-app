import { Observable } from "rxjs";
import { Transaction } from "../types/OutputMessage";
import { TransactionProvider } from "../types/Transaction";
import { onUnhealthy } from "./unhealthy";

import config from "../config";

export const manager = (
    provider: TransactionProvider,
) => {
    let failureCount = 0;

    const observable = new Observable<Transaction>((subscriber) => {
        
        const onTransaction = (tx: Transaction) => {
            failureCount = 0;
            subscriber.next(tx)
        }
        
        const onError = (_: Error) => {
            failureCount += 1;
            if (failureCount >= config.unhealthyThreshold) {
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
        
        provider.onTransaction(onTransaction);
        provider.onError(onError);
        provider.onWatchdogFailure(onWatchdogFailure)
    })

    return {
        observable
    }
}