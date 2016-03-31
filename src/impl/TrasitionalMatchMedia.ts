import {ObservableMatchMedia, ObservableMatchMediaBuilder} from "./ObservableMatchMedia";
import {IMatchMediaChannel} from "../contracts/IMatchMediaChannel";
import {ITransition, IObservableTransition} from "../contracts/ITransition";
import {Observable} from "@reactivex/rxjs";
import {IMatchMediaChannelFactory} from "../contracts/IMatchMediaChannelFactory";
import * as _ from "lodash";

class TransitionalMatchMediaBuilder extends ObservableMatchMediaBuilder {
    private _transitions: Set<IObservableTransition<MediaQueryList>>;

    constructor(factory: IMatchMediaChannelFactory<MediaQueryList>) {
        super(factory);
        this._transitions = new Set<IObservableTransition<MediaQueryList>>();
    }

    // region private methods
    private _ensureTransitionsAreDefined() {
        if (this._transitions.size === 0) {
            throw new Error("[TransitionalMatchMediaBuilder]: can't build class with no transitions defined");
        }
    }

    private _ensureChannelsExists(fromChannel: IMatchMediaChannel<MediaQueryList>,
                                  toChannel: IMatchMediaChannel<MediaQueryList>) {
        if (_.isEmpty(fromChannel.channelName) || _.isEmpty(toChannel.channelName)) {
            throw new Error("[TransitionalMatchMediaBuilder]: can not determine transition channels");
        }
    }

    private _determineChannels({from, to}: ITransition) {
        const fromChannel = this._channels.get(from),
              toChannel = this._channels.get(to);

        this._ensureChannelsExists(fromChannel, toChannel);

        return {
            from: fromChannel,
            to: toChannel
        };
    }

    private _containsTransition({from, to }: ITransition) {
        const array = Array.from(this._transitions);
        return _.findIndex(array, {from, to}) !== -1;
    }

    private _addTransition(transition: ITransition) {
        const {to, from} = this._determineChannels(transition);

        throw {
            name: "NotImplementedException",
            message: "lack of functionality or time"
        };
    }
    // endregion

    // region public methods
    public addTransition(transition: ITransition) {
        if (!(this._containsTransition(transition))) {
            this._addTransition(transition);
        }
    }
    // endregion

    public build(): TransitionalMatchMedia {
        this._ensureTransitionsAreDefined();
        return new TransitionalMatchMedia(this._channels);
    }
}

class TransitionalMatchMedia extends ObservableMatchMedia {
    constructor(channels: Map<string, IMatchMediaChannel<MediaQueryList>>) {
        super(channels);
    }
}

export {TransitionalMatchMediaBuilder};
