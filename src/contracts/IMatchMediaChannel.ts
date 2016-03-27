import {Observable} from "rxjs/Observable";
import {IMatchMediaChannelConfiguration} from "./IMatchMediaChannelConfiguration";

export interface IMatchMediaChannel<TObserver> extends IMatchMediaChannelConfiguration {
    observable: Observable<TObserver>;
}
