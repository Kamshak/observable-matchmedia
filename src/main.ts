import MatchMediaChannelFactory from "./impl/MatchMediaChannelFactory";
import {ObservableMatchMediaBuilder} from "./impl/ObservableMatchMedia";
import {configurations} from "../test/media_queries";


console.log("main entry point to this module");

const bootstrap = (window) => {
    console.log("bootstrapping module...");

    const factory = new MatchMediaChannelFactory(window);
    // const channel = factory.create({
    //     channelName: "medium-only",
    //     mediaQuery: "only screen and (min-width:40em) and (max-width:63.9375em)"
    // });

    const b =
        ObservableMatchMediaBuilder
            .createWith(factory)
            .addChannels(configurations)
            .build();

    debugger;
    console.log("bootstrapping finished");
};

export {bootstrap};


