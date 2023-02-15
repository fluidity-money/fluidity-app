import { Transaction } from "./OutputMessage";

/**
 * TransactionProvider is a type that represents an abstracted chain event listener.
 * It is used to listen for transactions on a chain and emit them to the application.
 * 
 * @method onTransaction - A callback that is called when a transaction is emitted.
 * @method onError - A callback that is called when an error is emitted.
 * 
 * On error, the application should attempt to reconnect to the chain.
 * This is done by calling the onTransaction method again.
 * You shouldn't have to call the onError message yourself as 
 * it is usually handled by the Observable's internal manager.
 */
export type TransactionProvider = {
    onTransaction: (tx: (tx: Transaction) => void) => void;
    onError: (err: (err: Error) => void) => void;
    name: () => string;
}