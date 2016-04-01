import {IMatchMediaChannel} from "../../contracts/MatchMedia";
import {Observable} from "@reactivex/rxjs";

const emptyMediaQueryChannel: IMatchMediaChannel<MediaQueryList> = {
    channelName: "",
    mediaQuery: "",
    observable: Observable.empty<MediaQueryList>()
};

export default emptyMediaQueryChannel;
