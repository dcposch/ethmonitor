import { Response } from "@netlify/functions/dist/function/response";

const apiKey = process.env["BEACONCHAIN_API_KEY"];

export default async function proxyBeaconChain(
  path: string
): Promise<Response> {
  if (!apiKey) return { statusCode: 500, body: "missing API key" };

  const url = `https://beaconcha.in/api/v1/${path}`;
  const resp = await fetch(url, { method: "GET", headers: { apiKey } });
  const body = await resp.text();
  if (resp.status !== 200) {
    return { statusCode: resp.status, body };
  }

  const responseHeaders = { "Content-Type": "application/json" };
  return { statusCode: 200, headers: responseHeaders, body };
}
