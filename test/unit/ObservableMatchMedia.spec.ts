import ObservableMatchMediaBuilder from "../../src/impl/MatchMedia/ObservableMatchMediaBuilder";
import MatchMediaChannelFactory from "../../src/impl/Factory/MatchMediaChannelFactory";
import IMatchMediaChannel from "../../src/contracts/MatchMedia/Channel/IMatchMediaChannel";

const smallOnlyChannelConfig = {channelName: "small-only", mediaQuery: "only screen and (max-width: 39.9375em)"},
      mediumOnlyChannelConfig = {channelName: "medium-only", mediaQuery: "only screen and (max-width: 39.9375em)"},
      largeOnlyChannelConfig = {
          channelName: "large-only",
          mediaQuery: "only screen and (min-width:64em) and (max-width:89.9375em)"
      };


describe("An ObservableMatchMedia", () => {
    let factory = undefined,
        builder = undefined;

    beforeEach(() => {
        factory = new MatchMediaChannelFactory(window);
        builder = ObservableMatchMediaBuilder
                    .createWith(factory)
                    .addChannel(smallOnlyChannelConfig);
    });

    it("instance can be obtained through the ObservableMatchMediaBuilder", () => {
        let observableMatchMedia = undefined;

        expect(() => observableMatchMedia = builder.build()).not.toThrow();
        expect(observableMatchMedia.channelCount).toEqual(2);
    });

    it("instance has a broadcastChannel property, that can be used to obtain the broadcast channel", () => {
        let observableMatchMedia = builder.build(),
            broadcast: IMatchMediaChannel<MediaQueryList> = undefined;

        expect(observableMatchMedia.channelCount).toEqual(2);
        expect(observableMatchMedia.hasChannel("*")).toBe(true);

        expect(() => broadcast = observableMatchMedia.broadcastChannel).not.toThrow();
        expect(broadcast).toBeDefined();
        console.log(broadcast);
        // expect(broadcast.observable).toBeDefined();
    });

    it("instance has a getChannel method to obtain a named channel", () => {
        let observableMatchMedia = builder.build(),
            channel: IMatchMediaChannel<MediaQueryList> = undefined;

        expect(observableMatchMedia.channelCount).toEqual(2);
        expect(observableMatchMedia.hasChannel(smallOnlyChannelConfig.channelName)).toBe(true);
        expect(() =>
            channel = observableMatchMedia.getChannel(smallOnlyChannelConfig.channelName)
        ).not.toThrow();
    });
});
