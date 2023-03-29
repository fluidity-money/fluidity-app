import { TransactionProvider } from "../types/Transaction"
import { uuid } from "./global"

export const onUnhealthy = (provider: TransactionProvider) => {
    console.error(
        `[fanfare:${provider.name()}:${uuid}]`,
        `The ${provider.name()} service is unhealthy. Please check the logs for more information.`,
        "This provider will sleep for 5 minutes before attempting to reconnect.",
    )
}