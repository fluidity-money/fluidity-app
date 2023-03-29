import { mergeAll, of, Subject } from "rxjs";
import { FanfareConfig } from "../types/Config";
import { ObserverConstructor } from "../types/Observer";
import { Transaction } from "../types/OutputMessage";

/** 
 * Composable Event Bus
 * 
 * This function creates an event bus that is composed of multiple services.
 * If you want to add a new service, you can simply add it to the list of services.
 */
export const createEventBus = (config: FanfareConfig, ...services: ObserverConstructor[]) => {
    const subject = new Subject<Transaction>()
    const firehose = of(...services.map(service => service(config))).pipe(
        mergeAll(),
    )
    firehose.subscribe(subject)

    return subject;
}