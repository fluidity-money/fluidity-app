import { Observable } from "rxjs";
import { Transaction } from "../types/OutputMessage";
import { TransactionProvider } from "../types/Transaction";

export const manager = (
    provider: TransactionProvider,
) => {
    const observable = new Observable<Transaction>((subscriber) => {
        let failureCount = 0;

        provider.onTransaction((tx) => subscriber.next(tx));
        provider.onError((err) => {
            failureCount += 1;

            
            subscriber.error(err);
        });
    })

    return {
        observable
    }
}