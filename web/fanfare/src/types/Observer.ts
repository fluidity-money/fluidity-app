import { Observable } from "rxjs";
import { Transaction } from "./OutputMessage";

export type ObserverConstructor = (FanfareConfig) => Observable<Transaction>