import {IMediaQueryEventStateProducer, MatchMediaState, IMatchMediaEvent} from "../../contracts/MatchMedia";


const matchMediaStateProducer: IMediaQueryEventStateProducer = (ev: IMatchMediaEvent ) => {
    return (ev.matches === true) ?
        MatchMediaState[MatchMediaState.enter] :
        MatchMediaState[MatchMediaState.leave];
};

export default matchMediaStateProducer;
