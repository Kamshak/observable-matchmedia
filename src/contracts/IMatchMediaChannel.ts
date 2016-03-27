import {Subscribable} from "rxjs/Observable";

export interface IMatchMediaChannel<TObserver> extends Subscribable<TObserver> {
    channelName: string;
    mediaQuery?: string;
}
