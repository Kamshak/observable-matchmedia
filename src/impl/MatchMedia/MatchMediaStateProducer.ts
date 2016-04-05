import {IMediaQueryEventStateProducer, MatchMediaState} from "../../contracts/MatchMedia/IMediaQueryEventStateProducer";

interface IMatchMediaEvent extends Event {
    matches: boolean;
}

const matchMediaStateProducer: IMediaQueryEventStateProducer = (ev: IMatchMediaEvent ) => {
    return (ev.matches === true) ? 
        MatchMediaState[MatchMediaState.enter] :
        MatchMediaState[MatchMediaState.leave];
};

export default matchMediaStateProducer;
