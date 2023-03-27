import { manager } from "../core/manager";
import { TransactionProvider } from "../types/Transaction";
import { FanfareConfig } from "../types/Config";
import { ObserverConstructor } from "../types/Observer";

type TransactionObserverProps = {
    connector: TransactionProvider 
}

export const TransactionObserver = ({
    connector
}: TransactionObserverProps): ObserverConstructor => {
    return (config: FanfareConfig) =>  manager(connector, config).observable;
}