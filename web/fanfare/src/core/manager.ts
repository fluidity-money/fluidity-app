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
            // TODO: Sentry or something
            failureCount += 1;
        }
        
        const onWatchdogFailure = () => {
            failureCount += 1;
        }
        
        provider.onTransaction(onTransaction);
        provider.onError(onError);
        provider.onWatchdogFailure(onWatchdogFailure)
        provider

        setInterval(() => {
            if (failureCount >= config.unhealthyThreshold) {
                onUnhealthy(provider);
            }
        }, 10000)
    })

    return {
        observable
    }
}