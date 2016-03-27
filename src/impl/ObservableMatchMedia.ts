import {IMatchMediaChannelFactory} from "../contracts/IMatchMediaChannelFactory";
import {IMatchMediaChannel} from "../contracts/IMatchMediaChannel";
import {IMatchMediaChannelConfiguration} from "../contracts/IMatchMediaChannelConfiguration";
import {noopMediaQueryChannel} from "./MatchMediaChannelFactory";
import {Observable} from "rxjs";
import * as _ from "lodash";
import "es6-collections";

class ObservableMatchMedia {
    private _channels: Map<string, IMatchMediaChannel<MediaQueryList>>;

    constructor(channels: Map<string, IMatchMediaChannel<MediaQueryList>>) {
        this._channels = channels;
    }

    public getBroadcastChannel() {
        return this._channels.get("*");
    }

    public getChannel(channelName: string) {
        if (this._channels.has(channelName)) {
            return this._channels.get(channelName);
        }
        return noopMediaQueryChannel;
    }
}

class ObservableMatchMediaBuilder {
    private _factory: IMatchMediaChannelFactory<MediaQueryList>;
    private _channels: Map<string, IMatchMediaChannel<MediaQueryList>>;

    constructor(factory: IMatchMediaChannelFactory<MediaQueryList>) {
        this._factory = factory;
        this._channels = new Map<string, IMatchMediaChannel<MediaQueryList>>();
    }

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
        const allObservables = _.map(this._channels, "observable"),
              mergedObservable: Observable.merge(allObservables);

        this._channels.set("*", {
            channelName: "*",
            mediaQuery: "",
            observable: mergedObservable
        });

        return new ObservableMatchMedia(this._channels);
    }
}

export {ObservableMatchMedia, ObservableMatchMediaBuilder};
