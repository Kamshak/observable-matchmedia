export enum MatchMediaState {
    enter,
    leave
};

export interface IMediaQueryEventStateProducer {
    (ev): string;
}
