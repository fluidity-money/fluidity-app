import {createContext} from "react";

export interface NotificationContext {
    notifications: Array<{id: string, message: string}>,
    addError: (message: string) => void
    addNotification: (message: string) => void
}

// expose access to errors and addError - setter and removal are self-managed
export const notificationContext = createContext<NotificationContext>({
    notifications: [],
    addError: () => 0,
    addNotification: () => 0,
});
