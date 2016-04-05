import ObservableMatchMedia from "../MatchMedia/ObservableMatchMedia";
import {IMatchMediaChannel} from "../../contracts/MatchMedia";

class TransitionaMatchMedia extends ObservableMatchMedia {
    constructor(channels: Map<string, IMatchMediaChannel<MediaQueryList>>) {
        super(channels);
    }
}

export default TransitionaMatchMedia;
