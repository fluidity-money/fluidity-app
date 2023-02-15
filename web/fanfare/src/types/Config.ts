import { Observable } from "rxjs";
import { Transaction } from "./OutputMessage";

/**
 * The configuration for Fanfare Notification Service.
 */
type FanfareConfig = {
    /** The number of times a notification can fail before it is considered unhealthy. */ 
    unhealthyThreshold: number;

    /** Service list */
    services: Observable<Transaction>[];
};

const defaultSettings: FanfareConfig = {
    unhealthyThreshold: 5,
    services: [],
};

export const mergeSettings = (settings: Partial<FanfareConfig>): FanfareConfig => {
    return {
        ...defaultSettings,
        ...settings,
    };
};
