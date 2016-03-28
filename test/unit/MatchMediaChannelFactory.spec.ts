import {noopMediaQueryChannel} from "../../src/impl/MatchMediaChannelFactory";
import MatchMediaChannelFactory from "../../src/impl/MatchMediaChannelFactory";
import {IMatchMediaChannel} from "../../src/contracts/IMatchMediaChannel";
import {Observable} from "rxjs/Observable";

const mediumOnlyChannelConfig = {channelName: "small-only", mediaQuery: "only screen and (max-width: 39.9375em)"};

describe("A MatchMediaChannelFactory", () => {
    it("should be importable", () => {
        expect(MatchMediaChannelFactory).toBeDefined();
    });

    describe("is a constructor", () => {
        it("that can be called as constructor", () => {
            let factory = undefined;

            expect(() => factory = new MatchMediaChannelFactory(window)).not.toThrow();
            expect(factory).toEqual(jasmine.any(MatchMediaChannelFactory));
        });

        it("that can't be called if window is not gives as parameter", () => {
            let factory = undefined;

            expect(() => factory = new MatchMediaChannelFactory()).toThrow();
        });
    });

    describe("instance has a create method", () => {
        let factory = undefined,
            channelConfig;

        beforeEach(() => {
            factory = new MatchMediaChannelFactory(window);
            channelConfig = mediumOnlyChannelConfig;
        });

        it("that can be called to create a MatchMediaChannel", () => {
            let channel: IMatchMediaChannel<MediaQueryList> = undefined;

            expect(() => channel = factory.create(channelConfig)).not.toThrow();
            expect(channel).toBeDefined();
            expect(channel.channelName).toEqual(mediumOnlyChannelConfig.channelName);
            expect(channel.mediaQuery).toEqual(mediumOnlyChannelConfig.mediaQuery);
            expect(channel.observable).toBeDefined();
            expect(channel.observable).toEqual(jasmine.any(Observable));
        });

        it("that returns an already created channel if present", () => {
            let channel: IMatchMediaChannel<MediaQueryList> = undefined,
                sameChannel: IMatchMediaChannel<MediaQueryList> = undefined;

            expect(() => channel = factory.create(channelConfig)).not.toThrow();
            expect(() => sameChannel = factory.create(channelConfig)).not.toThrow();

            expect(channel).toEqual(sameChannel);
        });

        it("that must throw if called with an invalid configuration", () => {
            let channel: IMatchMediaChannel<MediaQueryList> = undefined;

            expect(() => channel = factory.create({})).toThrow();
            expect(channel).toBeUndefined();
        });
    });

    describe("instance has a get method", () => {
        let factory = undefined,
            channelConfig,
            defaultChannel;

        beforeEach(() => {
            factory = new MatchMediaChannelFactory(window);
            channelConfig = mediumOnlyChannelConfig;
            defaultChannel = factory.create(channelConfig);
        });

        it("that can be called to get an already created channel", () => {
            let channel = undefined;

            expect(() => channel = factory.get(channelConfig.channelName)).not.toThrow();
            expect(channel).toBeDefined();
            expect(channel).toEqual(defaultChannel);
        });

        it("that returns a noop implementation if there is no channel with the given name", () => {
            let channel = undefined;

            expect(() => channel = factory.get("this channel does not exist")).not.toThrow();
            expect(channel).toBeDefined();
            expect(channel).toEqual(noopMediaQueryChannel);
        });
    });

    describe("instance has a has method", () => {
        let factory = undefined,
            channelConfig,
            defaultChannel;

        beforeEach(() => {
            factory = new MatchMediaChannelFactory(window);
            channelConfig = mediumOnlyChannelConfig;
            defaultChannel = factory.create(channelConfig);
        });

        it("that can be used to determine if a channel with a given name exists", () => {
            expect(factory.has(defaultChannel.channelName)).toBe(true);
            expect(factory.has("this channel doesn't exist")).toBe(false);
        });
    });

    describe("instance has a remove method", () => {
        let factory = undefined,
            channelConfig,
            defaultChannel;

        beforeEach(() => {
            factory = new MatchMediaChannelFactory(window);
            channelConfig = mediumOnlyChannelConfig;
            defaultChannel = factory.create(channelConfig);
        });

        it("that can be used to remove an existing channel", () => {
            expect(factory.has(defaultChannel.channelName)).toBe(true);
            expect(() => factory.remove(defaultChannel.channelName)).not.toThrow();
            expect(factory.has(defaultChannel.channelName)).toBe(false);
        });
    });
});
