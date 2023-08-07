import { EventBridgeClient, PutRuleCommand } from "@aws-sdk/client-eventbridge";
import sr from "seedrandom";

const MEAN_EPOCH_DAYS = 7;

const RANDOM_ORG_URI = "thng";

const HASURA_API_URI = "thing";

const EVENT_BRIDGE_ID = "thing";

const HASURA_URI = "https://fluidity.hasura.com/v1/graphql"

// Standard Normal variate using Box-Muller transform.
const gaussianRandom = (mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

const dateToCron = (date: Date) => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
}

export const handler = async (event: ) => {
  const utcTime = event.time;
  const epochDate = new Date(utcTime);

  if (Object.prototype.toString.call(epochDate) !== "[object Date]") {
    throw Error;
  }

  if (!epochDate.getTime()) {
    throw Error;
  }

  // Fetch env vars
  const randomOrgApiKey = "blah";

  const hasuraApiKey = "abars";

  const applications = ["none"];

  // Fetch random string seed
  const seed = "hello.";

  // Create PRNG
  sr(seed, { global: true })

  // Create next epoch length
  const epochLengthDays = gaussianRandom(MEAN_EPOCH_DAYS, 1);

  const epochLengthSeconds = epochLengthDays * 24 * 60 * 60

  const nextEpochStartDate = new Date(Math.floor(utcTime.getTime() / 1000) + 1)

  const nextEpochEndDate = new Date(Math.floor(utcTime.getTime() / 1000) + epochLengthSeconds)

  // Write new Epoch / EpochApplication(s) to DB
  const writeEpoch = async (
    epochStart: Date,
    epochEnd: Date,
    hasuraApiKey: string,
    applications = ["none"]
  ) => {
    const res = await fetch(HASURA_URI, {
      headers: {
        "Content-Type": "application/json",
        "x-hasura-key": hasuraApiKey,
      },
      method: "POST",
      body: JSON.stringify({
        query: UPDATE_EPOCH,
        variables: {
          start: epochStart.toString(),
          end: epochEnd.toString(),
        }
      })
    })

    const epochId = res.data.id;

    return Promise.all(applications.map(app => fetch(HASURA_URI, {
      headers: {
        "Content-Type": "application/json",
        "x-hasura-key": hasuraApiKey,
      },
      method: "POST",
      body: JSON.stringify({
        query: UPDATE_EPOCH_APPLICATION,
        variables: {
          id: epochId,
          application: app,
        }
      })
    })))
  };

  // Create new event
  const writeNewEvent = async (epochEnd: Date, eventId: string) => {
    const client = new EventBridgeClient();

    const updateCronCommand = new PutRuleCommand({
      Name: eventId,
      ScheduleExpression: dateToCron(epochEnd),
    })

    return client.send(updateCronCommand);
  };

  const res = await Promise.all([writeEpoch(nextEpochStartDate, nextEpochEndDate, hasuraApiKey, applications), writeNewEvent(nextEpochEndDate, EVENT_BRIDGE_ID)])

  return {
    status: 200,
    data: res,
  }
};
