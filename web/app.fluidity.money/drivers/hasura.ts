import { execute } from "apollo-link";
import {WebSocketLink} from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocket } from "ws"

const getWsClient = (wsurl: string) =>
new SubscriptionClient ( 
												wsurl,
												{reconnect: true},
												WebSocket
											 )

export const createSubscriptionObservable = ({wsurl, query, variables}: any) => 
execute(new WebSocketLink(getWsClient(wsurl)), {query: query, variables: variables});

