import {IMediaQueryEventStateProducer, MatchMediaState} from "../../contracts/MatchMedia/IMediaQueryEventStateProducer";

const matchMediaStateProducer: IMediaQueryEventStateProducer = (ev: Event ) => {
    return (ev.matches === true) ? MatchMediaState[MatchMediaState.enter] : MatchMediaState[MatchMediaState.leave];
};

export default matchMediaStateProducer;
