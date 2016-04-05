import IMatchMediaEvent from "./IMatchMediaEvent";
import MatchMediaState from "./MatchMediaState";

interface IMediaQueryEventStateProducer {
    (ev: IMatchMediaEvent): string; // todo sollte hier nicht direkt das Objekt mit channelName und state retourniert werden?
}

export default IMediaQueryEventStateProducer;
