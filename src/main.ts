import MatchMediaChannelFactory from "./impl/MatchMediaChannelFactory";
import {ObservableMatchMediaBuilder} from "./impl/ObservableMatchMedia";
import * as _ from "lodash";
import {IMatchMediaChannel} from "./contracts/IMatchMediaChannel";

const configurations = {
    "small": {channelName: "small", mediaQuery: "only screen"},
    "small-only": {channelName: "small-only", mediaQuery: "only screen and (max-width: 39.9375em)"},
    "medium": {channelName: "medium", mediaQuery: "only screen and (min-width:40em)"},
    "medium-only": {channelName: "medium-only", mediaQuery: "only screen and (min-width:40em) and (max-width:63.9375em)"},
    "large": {channelName: "large", mediaQuery: "only screen and (min-width:64em)"},
    "large-only": {channelName: "large-only", mediaQuery: "only screen and (min-width:64em) and (max-width:89.9375em)"},
    "xlarge": {channelName: "xlarge", mediaQuery: "only screen and (min-width:90em)"},
    "xlarge-only": {channelName: "xlarge-only", mediaQuery: "only screen and (min-width:90em) and (max-width:119.9375em)"},
    "xxlarge": {channelName: "xxlarge", mediaQuery: "only screen and (min-width:120em)"}
};

console.log("main entry point to this module");

const bootstrap = (window) => {
    console.log("bootstrapping module...");

    const factory = new MatchMediaChannelFactory(window);
    const channelConfiguration = _.map(_.keys(configurations), (configKey) => {
        if (_.includes(configKey, "only")) {
            return configurations[configKey];
        }
        return;
    }).filter((val) => val !== undefined);

    // const channelConfiguration = _.valuesIn(configurations);

    const observableMatchMedia =
        ObservableMatchMediaBuilder
            .createWith(factory)
            .addChannels(...channelConfiguration)
            .build();

    const broadCastChannel: IMatchMediaChannel<MediaQueryList> = observableMatchMedia.broadcastChannel,
          medium = observableMatchMedia.getChannel("medium"),

          smallOnly = observableMatchMedia.getChannel(configurations["small-only"].channelName),
          mediumOnly = observableMatchMedia.getChannel(configurations["medium-only"].channelName),
          largeOnly = observableMatchMedia.getChannel(configurations["large-only"].channelName);

    [smallOnly, mediumOnly, largeOnly, broadCastChannel].forEach((channel: IMatchMediaChannel<MediaQueryList>) => {
        channel.observable.subscribe((value) => {
            console.log(`[${channel.channelName}] called with: `, value);
        });
    });

    console.log("bootstrapping finished");
};

export {bootstrap};


