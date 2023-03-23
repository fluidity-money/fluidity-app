import { mergeAll, of } from "rxjs";
import { FanfareConfig } from "../types/Config";
import { ObserverConstructor } from "../types/Observer";

/** 
 * Composable Event Bus
 * 
 * This function creates an event bus that is composed of multiple services.
 * If you want to add a new service, you can simply add it to the list of services.
 */
export const createEventBus = (config: FanfareConfig, ...services: ObserverConstructor[]) => {

    const firehose = of(...services.map(service => service(config))).pipe(
        mergeAll(),
    )

    return firehose;
}