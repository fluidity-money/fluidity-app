//trim a string to <limit> decimal places
export const decimalTrim = (amount: string, limit: number) => {
    const trimIndex = amount.indexOf('.');
    const trim = trimIndex > -1 ? amount.slice(0, trimIndex + limit + 1) : amount;
    return trim;
}
