import { Handler } from "@netlify/functions";
import proxyBeaconChain from "../proxyBeaconChain";

const handler: Handler = async (event, context) => {
  const addr = event.queryStringParameters["addr"];
  return proxyBeaconChain(`validator/eth1/${addr}`);
};

export { handler };
