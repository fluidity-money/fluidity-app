// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
