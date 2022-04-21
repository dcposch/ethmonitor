import { Response } from "@netlify/functions/dist/function/response";

import fetch from "node-fetch";

const apiKey = process.env["BEACONCHAIN_API_KEY"];
if (!apiKey) throw new Error("missing BEACONCHAIN_API_KEY");

export default async function proxyBeaconChain(
  path: string
): Promise<Response> {
  const url = `https://beaconcha.in/api/v1/${path}`;
  const resp = await fetch(url, { method: "GET", headers: { apiKey } });
  const body = await resp.text();
  if (resp.status !== 200) {
    return { statusCode: resp.status, body };
  }

  const responseHeaders = { "Content-Type": "application/json" };
  return { statusCode: 200, headers: responseHeaders, body };
}
