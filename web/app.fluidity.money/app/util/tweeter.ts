import { numberToMonetaryString } from "@fluidity-money/surfing";

export const generateTweet = (
    reward: number,
    action: "send" | "receive" | undefined,
    extraHashtags: string[] = [],
) => {
    const inboundQueries: Record<string, string> = {
        utm_source: "twitter",
        utm_medium: "social",
        utm_campaign: action ? `${action}-share` : "est-share",
    };

    const tweetQueries: Record<string, string> = {};

    if (action)
        inboundQueries["action"] = action;

    const inboundUrl = new URL("https://app.fluidity.money/wtf");

    Object.entries(inboundQueries).forEach(([key, value]) => {
        inboundUrl.searchParams.set(key, value);
    });

    tweetQueries["url"] = inboundUrl.href;

    const twitterUrl = new URL("https://twitter.com/intent/tweet");

    tweetQueries["text"] = action ? 
        `I just won ${numberToMonetaryString(reward)} for ${ action === "send" ? "sending" : "recieving" } crypto with Fluidity Money!` :
        `I could have won ${numberToMonetaryString(reward)} for sending and recieving crypto with Fluidity Money!`;
    
    tweetQueries["hashtags"] = [
        "fluiditymoney",
        ...extraHashtags
    ].join(",");

    tweetQueries["via"] = `fluiditymoney`;

    Object.entries(tweetQueries).forEach(([key, value]) => {
        twitterUrl.searchParams.set(key, value);
    });

    return twitterUrl.href;
};