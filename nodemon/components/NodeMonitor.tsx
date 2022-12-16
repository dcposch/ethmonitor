import { useEffect, useState } from "react";
import { queryNode, ResOther, Result } from "./queryNode";
import { ResultLine } from "./ResultLine";

export default function NodeMonitor({ host }: { host: string }) {
  const [results, setResults] = useState<Result[]>([]);

  let completeHost = host;
  if (!host.startsWith("http")) completeHost = "http://" + host;
  if (!host.includes(":")) completeHost += ":8545";

  useEffect(() => {
    queryNode(completeHost, setResults);
  }, [completeHost]);

  const ipRes = results[0] as ResOther;
  const rest = results.slice(1);
  return (
    <div className="bg-blue-100 rounded-md p-4 my-4">
      <h2 className="my-2 text-lg font-bold">Connecting to {completeHost}</h2>
      {ipRes == null && <div>Checking connectivity...</div>}
      {ipRes != null && ipRes.err == null && (
        <div>Connecting from {ipRes.result}</div>
      )}
      {ipRes != null && ipRes.err != null && <div>Network disconnected?</div>}
      {rest.map((res, i) => (
        <ResultLine key={i} res={res} />
      ))}
    </div>
  );
}
