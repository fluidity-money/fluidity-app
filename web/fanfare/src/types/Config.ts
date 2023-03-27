import { Observable } from "rxjs";
import { Transaction } from "./OutputMessage";

/**
 * The configuration for Fanfare Notification Service.
 */
export type FanfareConfig = {
    /** The number of times a notification can fail before it is considered unhealthy. */ 
    unhealthyThreshold: number;

    /** Service list */
    services: ((FanfareConfig) => Observable<Transaction>)[];

    /** Debug mode */
    debug: boolean;
};

const defaultSettings: FanfareConfig = {
    unhealthyThreshold: 5,
    services: [],
    debug: false,
};

export const mergeSettings = (settings: Partial<FanfareConfig>): FanfareConfig => {
    return {
        ...defaultSettings,
        ...settings,
    };
};
