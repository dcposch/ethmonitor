import { fetchWithTimeout, req } from "./jsonrpc";

export type Result = ResPing | ResNodeInfo | ResSyncStatus | ResOther;

export interface ResPing {
  type: "ping";
  err?: string;
  pingMs?: number;
  chainId?: number;
}

export interface ResNodeInfo {
  type: "nodeInfo";
  err?: string;
  wholeName?: string;
  name?: string;
  version?: string;
  externalSource?: string;
  externalLatestVersion?: string;
}

export interface ResSyncStatus {
  type: "syncStatus";
  err?: string;
  latestBlock?: number;
  externalSource?: string;
  externalLatestBlock?: number;
}

export interface ResOther {
  type: "other";
  err?: string;
  method?: string;
  result?: string;
}

export async function queryNode(host: string, setRes: (res: Result[]) => void) {
  console.log(`Querying node ${host}`);

  const rs = [] as Result[];

  const resIp = await tryQ(rs, setRes, { type: "other" }, queryExternalIp);
  if (resIp.err != null) return;

  const resPing = await tryQ(rs, setRes, { type: "ping" }, (r: ResPing) =>
    queryPing(r, host)
  );
  if (resPing.err != null) return;

  await tryQ(rs, setRes, { type: "nodeInfo" }, (r: ResNodeInfo) =>
    queryNodeInfo(r, host)
  );

  await tryQ(rs, setRes, { type: "other" }, (r: ResOther) =>
    queryReq(r, host, "eth_syncing")
  );

  await tryQ(rs, setRes, { type: "syncStatus" }, (r: ResSyncStatus) =>
    querySyncStatus(r, host, resPing.chainId!)
  );
}
async function tryQ<R extends Result>(
  results: Result[],
  setRes: (res: Result[]) => void,
  res: R,
  queryExternalIp: (res: R) => Promise<void>
) {
  results.push(res);
  setRes(results.slice());
  try {
    await queryExternalIp(res);
  } catch (e: any) {
    res.err = e;
  }
  setRes(results.slice());
  return res;
}

async function queryExternalIp(res: ResOther) {
  const ipRes = await fetchWithTimeout("http://ipv4.icanhazip.com");
  res.result = await ipRes.text();
}

async function queryPing(res: ResPing, host: string) {
  const startMs = performance.now();
  const version = await req(host, "eth_chainId");
  res.chainId = parseHex(version);
  res.pingMs = performance.now() - startMs;
}

async function queryNodeInfo(res: ResNodeInfo, host: string) {
  const ni = await req(host, "admin_nodeInfo");
  res.wholeName = ni.name;
  const parts = ni.name.split("/");
  res.name = parts[0].toLowerCase();
  res.version = parts[1].split("-")[0];

  if (res.name === "erigon") {
    const version = await getLatestReleaseName("ledgerwatch", "erigon");
    res.externalSource = "github";
    res.externalLatestVersion = version;
  }
}

async function querySyncStatus(
  res: ResSyncStatus,
  host: string,
  chainId: number
) {
  const ethBn = await req(host, "eth_blockNumber");
  const currentBlock = parseHex(ethBn);
  res.latestBlock = currentBlock;

  if (chainId === 1) {
    res.externalSource = "api.blockcypher.com";
    const bcResult = await fetchWithTimeout(
      "https://api.blockcypher.com/v1/eth/main"
    );
    res.externalLatestBlock = (await bcResult.json()).height;
  }
}

async function queryReq(res: ResOther, host: string, method: string) {
  res.method = method;
  const result = await req(host, method);
  res.result = JSON.stringify(result);
}

function parseHex(hex: string) {
  if (!hex.startsWith("0x")) throw new Error(hex);
  return parseInt(hex.substring(2), 16);
}

async function getLatestReleaseName(org: string, repo: string) {
  const url = `https://api.github.com/repos/${org}/${repo}/releases/latest`;
  const res = await fetchWithTimeout(url);
  const body = await res.json();
  return body.name;
}
