import {IMatchMediaChannelFactory, IMatchMediaChannelConfiguration, IMatchMediaChannel} from "../../contracts/MatchMedia";
import matchMediaStateProducer from "./../MatchMedia/MatchMediaStateProducer";
import emptyMediaQueryChannel from "./EmptyMediaQueryChannel";
import {Observable} from "@reactivex/rxjs";
import "core-js/shim";

class MatchMediaChannelFactory implements IMatchMediaChannelFactory<MediaQueryList> {
    private _matchMedia: (mediaQuery: string) => MediaQueryList;
    private _valueProducer = (channelName: string, matchMediaEvent) => (matchMediaEvent) => ({
            channelName,
            state: matchMediaStateProducer(matchMediaEvent)
        });
    private _createdMediaChannels: Map<string, IMatchMediaChannel<MediaQueryList>>;

    constructor(window: Window) {
        this._matchMedia = MatchMediaChannelFactory._ensureMatchMedia(window);
        this._createdMediaChannels = new Map<string, IMatchMediaChannel<MediaQueryList>>();
    }

    // region static methods
    private static _ensureMatchMedia(window: Window): (mediaQuery: string) => MediaQueryList {
        if (!window || !window.matchMedia) {
            throw new Error("matchMedia must be defined on window");
        }
        return window.matchMedia;
    }

    private static _ensureValidConfiguration(config: IMatchMediaChannelConfiguration) {
        if (!config || !config.channelName || !config.mediaQuery) {
            throw new Error(`[MatchMediaChannelFactory]: 
                config is not a valid instance of IMatchMediaChannelConfiguration`);
        }
    }
    // endregion

    // region private methods
    private _createObservableBy(channelName: string, list: MediaQueryList): Observable<MediaQueryList> {
        return Observable.fromEventPattern(
            (listener: MediaQueryListListener) => list.addListener(listener),
            (listener: MediaQueryListListener) => list.removeListener(listener),
            this._valueProducer(channelName)
        );
    }

    private _createMediaChannelObject({channelName, mediaQuery}: IMatchMediaChannelConfiguration) {
        const mediaQueryList = matchMedia(mediaQuery),
            observable = this._createObservableBy(channelName, mediaQueryList);

        return {
            channelName,
            mediaQuery,
            observable
        };
    }
    // endregion

    // region interface IMatchMediaChannelFactory implementation
    public create(config: IMatchMediaChannelConfiguration): IMatchMediaChannel<MediaQueryList> {
        let createdMediaChannel: IMatchMediaChannel<MediaQueryList>;

        MatchMediaChannelFactory._ensureValidConfiguration(config);

        if (this._createdMediaChannels.has(config.channelName)) {
            return this._createdMediaChannels.get(config.channelName);
        }

        createdMediaChannel = this._createMediaChannelObject(config);
        this._createdMediaChannels.set(createdMediaChannel.channelName, createdMediaChannel);

        return createdMediaChannel;
    }

    public get(channelName: string): IMatchMediaChannel<MediaQueryList> {
        return this._createdMediaChannels.has(channelName) ?
                    this._createdMediaChannels.get(channelName) :
                    emptyMediaQueryChannel;
    }

    public has(channelName: string) {
        return this._createdMediaChannels.has(channelName);
    }

    public remove(channelName: string) {
        if (this._createdMediaChannels.has(channelName)) {
            this._createdMediaChannels.delete(channelName);
        }
    }
    // endregion
}

export default MatchMediaChannelFactory;
