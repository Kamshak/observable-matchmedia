import {IMatchMediaChannelFactory} from "../contracts/IMatchMediaChannelFactory";
import {IMatchMediaChannel} from "../contracts/IMatchMediaChannel";
import {IMatchMediaChannelConfiguration} from "../contracts/IMatchMediaChannelConfiguration";
import {noopMediaQueryChannel} from "./MatchMediaChannelFactory";
import {Observable} from "rxjs";
import * as _ from "lodash";
import "es6-collections";
import {merge} from "~rxjs/operator/merge";

class ObservableMatchMedia {
    private _channels: Map<string, IMatchMediaChannel<MediaQueryList>>;

    constructor(channels: Map<string, IMatchMediaChannel<MediaQueryList>>) {
        this._channels = channels;
    }

    public static broadcastChannelName = "*";

    public get broadcastChannel() {
        return this._channels.get(ObservableMatchMedia.broadcastChannelName);
    }

    public getChannel(channelName: string) {
        if (this._channels.has(channelName)) {
            return this._channels.get(channelName);
        }
        return noopMediaQueryChannel;
    }

    public hasChannel(channelName: string): boolean {
        return this._channels.has(channelName);
    }

    public get channelCount(): number {
        return this._channels.size;
    }
}

class ObservableMatchMediaBuilder {
    private _factory: IMatchMediaChannelFactory<MediaQueryList>;
    private _channels: Map<string, IMatchMediaChannel<MediaQueryList>>;

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
        return Observable.merge<MediaQueryList>(allObservables);
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

export {ObservableMatchMedia, ObservableMatchMediaBuilder};
