import { Observable } from "rxjs";
import { manager } from "../core/manager";
import { Transaction } from "../types/OutputMessage";
import { TransactionProvider } from "../types/Transaction";

type TransactionObserverProps = {
    connector: TransactionProvider 
}

export const TransactionObserver = ({
    connector
}: TransactionObserverProps): Observable<Transaction> => {
    return manager(connector).observable;
}