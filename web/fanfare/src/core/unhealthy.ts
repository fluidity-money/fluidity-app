import { TransactionProvider } from "../types/Transaction"

const onUnhealthy = (provider: TransactionProvider) => {
    console.error(
        `The ${provider.name()} service is unhealthy. Please check the logs for more information.`,
        "This provider will sleep for 5 minutes before attempting to reconnect.",
    )
}