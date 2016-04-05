import IMatchMediaChannelConfiguration from "./IMatchMediaChannelConfiguration";
import {Observable} from "@reactivex/rxjs";

interface IMatchMediaChannel<TObserver> extends IMatchMediaChannelConfiguration {
    observable: Observable<TObserver>;
}

export default IMatchMediaChannel;
