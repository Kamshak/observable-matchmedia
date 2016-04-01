import {Observable} from "@reactivex/rxjs";
import ITransition from "./ITransition";

interface IObservableTransition<T> extends ITransition {
    observable: Observable<T>;
}

export default IObservableTransition;
