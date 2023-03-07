import { filter, Observable } from "rxjs";
import { Transaction } from "../types/OutputMessage";

export const BelongsToView = (observable: Observable<Transaction>, address) => {
    return observable.pipe(
        filter(({ source, destination }) => source === address || destination === address)
    );
}