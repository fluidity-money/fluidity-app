import { Transaction } from "./OutputMessage";

/**
 * TransactionProvider is a type that represents an abstracted chain event listener.
 * It is used to listen for transactions on a chain and emit them to the application.
 * 
 * On error, the application should attempt to reconnect to the chain.
 * This is done by calling the onTransaction method again.
 * You shouldn't have to handle the onError message yourself as 
 * it is usually handled by the Observable's internal manager.
*/
export type TransactionProvider = {
    /** 
     * @method onTransaction -
     * A callback that is called when a transaction is emitted. 
     * By convention this also starts and restarts the provider.
     */
    onTransaction: (tx: (tx: Transaction) => void) => void;
    /** @method onError - A callback that is called when an error is emitted. */
    onError: (err: (err: Error) => void) => void;
    /** @method onWatchdogFailure A callback that is called when the watchdog fails. */
    onWatchdogFailure: (err: () => void) => void;

    /** @method watchdog - A method that is called to check if the provider is healthy. */
    watchdog(): void;
    /** @method name - A method that returns the name of the provider. */
    name: () => string;
}