import { Handler, HandlerEvent } from "@netlify/functions";
import { client, fetchAll, q } from "../db";

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

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
}

// Get all validators that the given user address is monitoring.
async function getMonitors(event: HandlerEvent) {
  const user = event.queryStringParameters["user"];
  if (!user || !user.startsWith("0x")) {
    return { statusCode: 500, body: "bad parameters" };
  }

  const results = await fetchAll(q.Match(q.Index("monitors-by-user"), user));
  return { statusCode: 200, body: JSON.stringify(results) };
}

export { handler };
