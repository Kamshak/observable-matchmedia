import {IMatchMediaChannelFactory, IMatchMediaChannel} from "../../contracts/MatchMedia";
import {ITransition, IObservableTransition} from "../../contracts/Transition";
import {MatchMediaState} from "../../contracts/MatchMedia"
import {Observable} from "@reactivex/rxjs";
import ObservableMatchMediaBuilder from "../MatchMedia/ObservableMatchMediaBuilder";
import TransitionalMatchMedia from "./TransitionalMatchMedia";
import * as _ from "lodash";
// import "es6-collections";
import "es6-shim";

class TransitionalMatchMediaBuilder extends ObservableMatchMediaBuilder {
    private _transitions: Set<IObservableTransition<MediaQueryList>>;
    private _atLeastTwo = (actual: number, expected: number) => _.gte(actual, expected);
    private _moduloTwo = (actual: number) => actual % 2 === 0;

    protected static stateChangeProducer = (targetState) => (value) => _.isEqual(value.state, targetState);
    protected static leaveStatePredicate = TransitionalMatchMediaBuilder.stateChangeProducer(MatchMediaState[MatchMediaState.leave]);
    protected static enterStatePredicate = TransitionalMatchMediaBuilder.stateChangeProducer(MatchMediaState[MatchMediaState.enter]);

    constructor(factory: IMatchMediaChannelFactory<MediaQueryList>) {
        super(factory);
        this._transitions = new Set<IObservableTransition<MediaQueryList>>();
    }

    public static ObservableFrom(channel: IMatchMediaChannel<MediaQueryList>): Observable<MediaQueryList> {
        return channel.observable.filter(TransitionalMatchMediaBuilder.leaveStatePredicate);
    }

    public static ObservableTo(channel: IMatchMediaChannel<MediaQueryList>): Observable<MediaQueryList> {
        return channel.observable.filter(TransitionalMatchMediaBuilder.enterStatePredicate);
    }

    // region private methods
    private _ensureTransitionsAreDefined() {
        if (this._transitions.size === 0) {
            throw new Error("[TransitionalMatchMediaBuilder]: can't build class with no transitions defined");
        }
    }

    private _ensureChannelsExists(fromChannel: IMatchMediaChannel<MediaQueryList>, toChannel: IMatchMediaChannel<MediaQueryList>) {
        const areChannelNamesMissing = _.isEmpty(fromChannel.channelName) || _.isEmpty(toChannel.channelName),
              areChannelsMissing = !this._channels.has(fromChannel.channelName) || !this._channels.has(toChannel.channelName);

        if (areChannelNamesMissing || areChannelsMissing) {
            throw new Error("[TransitionalMatchMediaBuilder]: can not determine transition channels");
        }
    }

    private _determineChannels({fromChannelName, toChannelName}: ITransition) {
        const fromChannel = this._channels.get(fromChannelName),
              toChannel = this._channels.get(toChannelName);

        this._ensureChannelsExists(fromChannel, toChannel);

        return {
            from: fromChannel,
            to: toChannel
        };
    }

    private _containsTransition({from, to }: ITransition) {
        const array = Array.from(this._transitions);
        return _.findIndex(array, {from, to}) !== -1; // does the combination already exists in channels?
    }

    private _addTransition(transition: ITransition) {
        const {from, to} = this._determineChannels(transition);
        const transitionPlan = Observable.when(
            TransitionalMatchMediaBuilder.ObservableFrom(from).and(TransitionalMatchMediaBuilder.ObservableTo(to))
        );

        this._transitions.add({
            from: from.channelName,
            to: to.channelName,
            observable: transitionPlan
        });
    }

    private _ensureChannelsAreDefined() {
        const channelSize = this._channels.size;

        if (! (this._atLeastTwo(channelSize, 2) && this._moduloTwo(channelSize))) {
            throw {
                name: "NotEnoughChannelsException",
                message: "There are not enough channels defined to define transitions"
            };
        }
    }
    // endregion

    // region public methods
    public addTransition(transition: ITransition): TransitionalMatchMediaBuilder {
        this._ensureChannelsAreDefined();

        if (!(this._containsTransition(transition))) {
            this._addTransition(transition);
        }

        return this;
    }

    public addTransitions(...transitions: ITransition[]): TransitionalMatchMediaBuilder {
        for (let transition of transitions) {
            this.addTransition(transition);
        }

        return this;
    }
    // endregion

    public build(): TransitionalMatchMedia {
        this._ensureTransitionsAreDefined();
        return new TransitionalMatchMedia(this._channels);
    }
}

export {TransitionalMatchMediaBuilder};
