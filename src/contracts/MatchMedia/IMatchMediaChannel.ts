import IMatchMediaChannelConfiguration from "./IMatchMediaChannelConfiguration";
import {Observable} from "rxjs/Observable";

interface IMatchMediaChannel<TObserver> extends IMatchMediaChannelConfiguration {
    observable: Observable<TObserver>;
}

export default IMatchMediaChannel;
