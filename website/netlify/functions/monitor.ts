import { Handler, HandlerEvent } from "@netlify/functions";
import { client, fetchAll, q } from "../db";
import proxyBeaconChain from "../proxyBeaconChain";

const handler: Handler = async (event, context) => {
  if (event.httpMethod === "GET") return getMonitors(event);
  if (event.httpMethod === "POST") return addMonitor(event);

  return { statusCode: 405, body: "bad method" };
};

// Add a new Ethereum validator to monitor.
async function addMonitor(event: HandlerEvent) {
  const user = event.queryStringParameters["user"];
  const validatorIndex = event.queryStringParameters["validator"];
  if (!user || !user.startsWith("0x") || !validatorIndex) {
    return { statusCode: 500, body: "bad parameters" };
  }

  const collM = q.Collection("monitors");
  await client.query(q.Create(collM, { data: { user, validatorIndex } }));

  return { statusCode: 200, body: "added" };
}

// Get all validators that the given user address is monitoring.
async function getMonitors(event: HandlerEvent) {
  const user = event.queryStringParameters["user"];
  if (!user || !user.startsWith("0x")) {
    return { statusCode: 500, body: "bad parameters" };
  }

  const monitors = await fetchAll(q.Match(q.Index("monitors-by-user"), user));
  const indices = monitors.map((m) => m.validatorIndex);

  let ret: { validatorIndex: number; status: string }[] = [];
  if (indices.length > 0) {
    const response = await proxyBeaconChain(`validator/${indices.join(",")}`);
    let vals = JSON.parse(response.body).data;
    if (indices.length === 1) vals = [vals];
    ret.push(
      ...vals.map(({ status, validatorindex }) => ({ status, validatorindex }))
    );
  }

  return { statusCode: 200, body: JSON.stringify(ret) };
}

export { handler };
