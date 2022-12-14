import { numberToMonetaryString } from "@fluidity-money/surfing";

export const generateMeta = (action: string) => {
  const basic = {
    title: "Why Fluidify? - Fluidity Money",
    description:
      "Fluidity is a protocol that rewards users for using their cryptocurrency.",

    "twitter:card": "summary_large_image",
    "twitter:site": "@fluiditymoney",
    "twitter:title": "Why Fluidify? - Fluidity Money",
    "twitter:description":
      "Fluidity is a protocol that rewards users for using their cryptocurrency.",
    "twitter:image": "https://static.fluidity.money/img/FluidShare.png",

    "og:title": "Why Fluidify?",
    "og:description":
      "Fluidity is a protocol that rewards users for using their cryptocurrency.",
    "og:url": "https://app.fluidity.money/wtf",
    "og:type": "website",
  };

  switch (action) {
    case "send":
      return {
        ...basic,
        "twitter:image": "https://static.fluidity.money/img/FluidSend.png",
        "og:image": "https://static.fluidity.money/img/FluidSend.png",
        "og:url": "https://app.fluidity.money/wtf?action=send",
      };

    case "receive":
      return {
        ...basic,
        "twitter:image": "https://static.fluidity.money/img/FluidRecv.png",
        "og:image": "https://static.fluidity.money/img/FluidRecv.png",
        "og:url": "https://app.fluidity.money/wtf?action=receive",
      };

    default:
      return basic;
  }
};

export const generateTweet = (
  reward: number | string,
  action?: "send" | "receive" | "claim",
  extraHashtags: string[] = []
) => {
  const inboundQueries: Record<string, string> = {
    utm_source: "twitter",
    utm_medium: "social",
    utm_campaign: action ? `${action}-share` : "est-share",
  };

  const tweetQueries: Record<string, string> = {};

  if (action) inboundQueries["action"] = action;

  const inboundUrl = new URL("https://app.fluidity.money/wtf");

  Object.entries(inboundQueries).forEach(([key, value]) => {
    inboundUrl.searchParams.set(key, value);
  });

  tweetQueries["url"] = inboundUrl.href;

  const twitterUrl = new URL("https://twitter.com/intent/tweet");

  if (!reward) return "";

  const formattedReward =
    typeof reward === "number"
      ? numberToMonetaryString(reward)
      : reward[0] === "$"
      ? reward
      : `$${reward}`;

  tweetQueries["text"] = (() => {
    switch (action) {
      case "claim":
        return `I just redeemed ${formattedReward} for using crypto with Fluidity Money!`;

      case "send":
        return `I just won ${formattedReward} for sending crypto with Fluidity Money!`;

      case "receive":
        return `I just won ${formattedReward} for recieving crypto with Fluidity Money!`;

      default:
        return `I could have won ${formattedReward} for sending and recieving crypto with Fluidity Money!`;
    }
  })();

  tweetQueries["hashtags"] = ["fluiditymoney", ...extraHashtags].join(",");

  tweetQueries["via"] = `fluiditymoney`;

  Object.entries(tweetQueries).forEach(([key, value]) => {
    twitterUrl.searchParams.set(key, value);
  });

  return twitterUrl.href;
};
