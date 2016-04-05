import {ObservableMatchMedia, ObservableMatchMediaBuilder} from "../../src/impl/MatchMedia";
import {IMatchMediaChannelFactory} from "../../src/contracts/MatchMedia";
import MatchMediaChannelFactory from "../../src/impl/Factory/MatchMediaChannelFactory";

const smallOnlyChannelConfig = {channelName: "small-only", mediaQuery: "only screen and (max-width: 39.9375em)"},
      mediumOnlyChannelConfig = {channelName: "medium-only", mediaQuery: "only screen and (max-width: 39.9375em)"},
      largeOnlyChannelConfig = {channelName: "large-only", mediaQuery: "only screen and (min-width:64em) and (max-width:89.9375em)"};

describe("An ObservableMatchMediaBuilder", () => {
    let factory: IMatchMediaChannelFactory<MediaQueryList>;

    beforeEach(() => {
        factory = new MatchMediaChannelFactory(window);
    });

    it("can be imported", () => {
        expect(ObservableMatchMediaBuilder).toBeDefined();
        expect(ObservableMatchMediaBuilder).toEqual(jasmine.any(Function));
    });

    describe("has a static method createWith", () => {
        it("that can be called with a factory", () => {
            let builder = undefined;

            expect(() => builder = ObservableMatchMediaBuilder.createWith(factory)).not.toThrow();
            expect(builder).toBeDefined();
            expect(builder).toEqual(jasmine.any(ObservableMatchMediaBuilder));
        });

        xit("that must throw an error if called without a factory", () => {
            let builder = undefined;

            expect(() => builder = ObservableMatchMediaBuilder.createWith(null)).toThrow();
            expect(builder).toBeUndefined();
        });
    });

    describe("instance has an addChannel method", () => {
        let builder: ObservableMatchMediaBuilder = undefined,
            observableMatchMedia = undefined;

        beforeEach(() => {
            builder = ObservableMatchMediaBuilder.createWith(factory);
        });

        it("that can be called to add a new channel", () => {
            expect(() => builder.addChannel(mediumOnlyChannelConfig)).not.toThrow();
            observableMatchMedia = builder.build();
            expect(observableMatchMedia.hasChannel(mediumOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel("*")).toBe(true);
            expect(observableMatchMedia.channelCount).toEqual(2);
        });

        it("that can be called multiple with the same config", () => {
            expect(() => builder.addChannel(mediumOnlyChannelConfig)).not.toThrow();
            expect(() => builder.addChannel(mediumOnlyChannelConfig)).not.toThrow();
            expect(() => builder.addChannel(mediumOnlyChannelConfig)).not.toThrow();
            expect(() => builder.addChannel(mediumOnlyChannelConfig)).not.toThrow();

            observableMatchMedia = builder.build();
            expect(observableMatchMedia.hasChannel(mediumOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel("*")).toBe(true);
            expect(observableMatchMedia.channelCount).toEqual(2);
        });

        it("that can be called with different configs", () => {
            expect(() => builder.addChannel(smallOnlyChannelConfig)).not.toThrow();
            expect(() => builder.addChannel(mediumOnlyChannelConfig)).not.toThrow();
            expect(() => builder.addChannel(largeOnlyChannelConfig)).not.toThrow();

            observableMatchMedia = builder.build();
            expect(observableMatchMedia.hasChannel(smallOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel(mediumOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel(largeOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel("*")).toBe(true);
            expect(observableMatchMedia.channelCount).toEqual(4);
        });
    });

    describe("instance has a addChannels method", () => {
        let builder = undefined,
            observableMatchMedia = undefined;

        beforeEach(() => {
            builder = ObservableMatchMediaBuilder.createWith(factory);
        });

        it("which can be called with an array of configurations", () => {
            expect(() =>
                builder.addChannels(
                    smallOnlyChannelConfig,
                    mediumOnlyChannelConfig,
                    largeOnlyChannelConfig
                )).not.toThrow();

            observableMatchMedia = builder.build();
            expect(observableMatchMedia.hasChannel(smallOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel(mediumOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel(largeOnlyChannelConfig.channelName)).toBe(true);
            expect(observableMatchMedia.hasChannel("*")).toBe(true);
            expect(observableMatchMedia.channelCount).toEqual(4);
        });
    });

    describe("instance has a build method", () => {
        let builder = undefined;

        beforeEach(() => {
            builder = ObservableMatchMediaBuilder
                        .createWith(factory)
                        .addChannel(smallOnlyChannelConfig);
        });

        it("that can be called to finish the builder", () => {
            let observableMatchMedia: ObservableMatchMedia = undefined;

            expect(() => observableMatchMedia = builder.build()).not.toThrow();
            expect(observableMatchMedia).toBeDefined();
            expect(observableMatchMedia).toEqual(jasmine.any(ObservableMatchMedia));

            expect(observableMatchMedia.channelCount).toEqual(2);
            expect(observableMatchMedia.hasChannel("*")).toBe(true);
            expect(observableMatchMedia.hasChannel(smallOnlyChannelConfig.channelName));
        });
    });
});
