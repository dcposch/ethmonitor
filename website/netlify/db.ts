import fauna, { Expr } from "faunadb";

const secret = process.env["FAUNADB_SECRET"];
if (!secret) throw new Error("missing FAUNADB_SECRET");

const client = new fauna.Client({
  secret,
  domain: "db.us.fauna.com",
  scheme: "https",
});

const q = fauna.query;

async function fetchAll(expr: Expr): Promise<any[]> {
  const resp = await client.query(q.Map(q.Paginate(expr), (ref) => q.Get(ref)));
  const results = (resp["data"] as object[]).map((o) => o["data"]);
  return results;
}

export { client, q, fetchAll };
