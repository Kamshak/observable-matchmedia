import {IMatchMediaChannel, IMatchMediaChannelFactory, IMatchMediaChannelConfiguration} from "../../contracts/MatchMedia";
import {Observable} from "@reactivex/rxjs";
import ObservableMatchMedia from "./ObservableMatchMedia";
import "es6-shim";

export default class ObservableMatchMediaBuilder {
    protected _factory: IMatchMediaChannelFactory<MediaQueryList>;
    protected _channels: Map<string, IMatchMediaChannel<MediaQueryList>>;

    // Todo: Make the ctor private in TS 2.0
    constructor(factory: IMatchMediaChannelFactory<MediaQueryList>) {
        this._factory = factory;
        this._channels = new Map<string, IMatchMediaChannel<MediaQueryList>>();
    }

    // region private methods
    private get _allObservables(): Observable<MediaQueryList>[] {
        let observables: Observable<MediaQueryList>[] = [],
            values = Array.from(this._channels.values());

        for (let channel of values) {
            observables.push(channel.observable);
        }

        return observables;
    }

    private _mergeObservables(allObservables: Observable<MediaQueryList>[]): Observable<MediaQueryList> {
        return Observable.merge<MediaQueryList>(...allObservables);
    }

    private _defineBroadcastChannel(mergedObservable: Observable<MediaQueryList>): void {
        const broadcastChannel: IMatchMediaChannel<MediaQueryList> = {
            channelName: ObservableMatchMedia.broadcastChannelName,
            mediaQuery: "",
            observable: mergedObservable
        };

        this._channels.set(ObservableMatchMedia.broadcastChannelName, broadcastChannel);
    }
    // endregion

    public static createWith(factory: IMatchMediaChannelFactory<MediaQueryList>) {
        return new ObservableMatchMediaBuilder(factory);
    }

    public addChannel(config: IMatchMediaChannelConfiguration): ObservableMatchMediaBuilder {
        let createdChannel;
        if (!this._channels.has(config.channelName)) {
            createdChannel = this._factory.create(config);
            this._channels.set(config.channelName, createdChannel);
        }

        return this;
    }

    public addChannels(...config: IMatchMediaChannelConfiguration[]): ObservableMatchMediaBuilder {
        for (let conf of config) {
            this.addChannel(conf);
        }
        return this;
    }

    public build(): ObservableMatchMedia {
        const allObservables = this._allObservables,
            mergedObservable = this._mergeObservables(allObservables);

        this._defineBroadcastChannel(mergedObservable);

        return new ObservableMatchMedia(this._channels);
    }
}
