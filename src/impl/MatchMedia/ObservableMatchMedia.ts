import IMatchMediaChannel from "../../contracts/MatchMedia/IMatchMediaChannel";
import emptyMediaQueryChannel from "../Factory/EmptyMediaQueryChannel";
import "core-js/shim";

class ObservableMatchMedia {
    protected _channels: Map<string, IMatchMediaChannel<MediaQueryList>>;

    constructor(channels: Map<string, IMatchMediaChannel<MediaQueryList>>) {
        this._channels = channels;
    }

    public static broadcastChannelName = "*";

    public get broadcastChannel() {
        return this._channels.get(ObservableMatchMedia.broadcastChannelName);
    }

    public getChannel(channelName: string) {
        if (this._channels.has(channelName)) {
            return this._channels.get(channelName);
        }
        return emptyMediaQueryChannel;
    }

    public hasChannel(channelName: string): boolean {
        return this._channels.has(channelName);
    }

    public get channelCount(): number {
        return this._channels.size;
    }
}

export default ObservableMatchMedia;
