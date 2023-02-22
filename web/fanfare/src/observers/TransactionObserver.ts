import { Observable } from "rxjs";
import { manager } from "../core/manager";
import { ChainConnector } from "../types/Chain";
import { Transaction } from "../types/OutputMessage";
import { TransactionProvider } from "../types/Transaction";

type TransactionObserverProps = {
    connector: ChainConnector
}

const TransactionObserver = ({
    connector
}: TransactionObserverProps): Observable<Transaction> => {
    return manager({
        name: () => connector.name(),
        onTransaction: (callback: (tx: Transaction) => void) => { },
        onError: function (err: (err: Error) => void): void {
            throw new Error("Function not implemented.");
        },
        onWatchdogFailure: function (err: () => void): void {
            throw new Error("Function not implemented.");
        },
        watchdog: function (): void {
            throw new Error("Function not implemented.");
        }
    }).observable;
}