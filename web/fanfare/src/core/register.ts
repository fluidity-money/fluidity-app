import { Observable, mergeAll, map, of } from "rxjs";
import { Transaction } from "../types/OutputMessage";
import { TransactionProvider } from "../types/Transaction";

/** 
 * Composable Event Bus
 * 
 * This function creates an event bus that is composed of multiple services.
 * If you want to add a new service, you can simply add it to the list of services.
 */
export const createEventBus = (...services: Observable<Transaction>[]) => {
    const firehose = of(...services).pipe(
        mergeAll(),
    )

    return firehose;
}