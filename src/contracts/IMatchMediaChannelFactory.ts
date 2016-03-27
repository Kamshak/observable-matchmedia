import {IMatchMediaChannel} from "./IMatchMediaChannel";
import {IMatchMediaChannelConfiguration} from "./IMatchMediaChannelConfiguration";

export interface IMatchMediaChannelFactory<TObserver> {
    create(config: IMatchMediaChannelConfiguration): IMatchMediaChannel<TObserver>;
    remove(channelName: string);
    has(channelName: string): boolean;
    get(channelName: string): IMatchMediaChannel<TObserver>;
}
