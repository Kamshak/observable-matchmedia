import {IMatchMediaChannel} from "./IMatchMediaChannel";
import {IMatchMediaChannelConfiguration} from "./IMatchMediaChannelConfiguration";

export interface IMatchMediaChannelFactory<TObserver> {
    new(window: Window);
    create(config: IMatchMediaChannelConfiguration): IMatchMediaChannel<TObserver>;
    get(channelName: string): IMatchMediaChannel<TObserver>;
    delete(channelName: string);
    has(channelName: string): boolean;
}
