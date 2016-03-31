import {Observable} from "@reactivex/rxjs";

export interface ITransition {
    from: string;
    to: string;
}

export interface IObservableTransition<T> extends ITransition {
    observable: Observable<T>;
}
