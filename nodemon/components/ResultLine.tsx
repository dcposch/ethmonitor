import { Result } from "./queryNode";

export function ResultLine({ res }: { res: Result }) {
  switch (res.type) {
    case "ping":
      if (res.err != null) {
        return <Row em="❌" title="connection failed" err={res.err} />;
      } else if (res.pingMs == null) {
        return <Row em="➡️" title="connecting..." />;
      } else {
        const chainName = res.chainId !== 1 ? "NOT mainnet" : "mainnet";
        const summary = `chain ${res.chainId}, ${chainName}`;
        const benchmark = `got reply in ${res.pingMs!.toFixed(0)}ms`;
        return <Row em="✅" title="connected" {...{ summary, benchmark }} />;
      }
    case "nodeInfo":
      if (res.err != null) {
        return (
          <Row
            em="❌"
            title="can't load node info"
            summary="is the RPC 'admin' namespace enabled?"
            err={res.err}
          />
        );
      } else if (res.wholeName == null) {
        return <Row em="➡️" title="loading node info..." />;
      } else {
        let emoji = "⚠️",
          benchmark,
          benchmarkTitle = "";
        if (res.externalSource == null) benchmark = "latest release unknown";
        else {
          benchmark = `${res.externalSource}: ${res.externalLatestVersion}`;
          if (res.version === res.externalLatestVersion) {
            emoji = "✅";
            benchmarkTitle = "running latest release";
          } else {
            benchmarkTitle = "not running latest release";
          }
        }
        return (
          <Row
            em={emoji}
            title={res.name! + " " + res.version!}
            summary={res.wholeName}
            benchmarkTitle={benchmarkTitle}
            benchmark={benchmark}
          />
        );
      }

    case "syncStatus":
      if (res.err) {
        return <Row em="❌" title={"sync unconfirmed"} err={res.err} />;
      } else if (res.latestBlock == null) {
        return <Row em="➡️" title="loading sync..." />;
      } else {
        const title = `latest block ${res.latestBlock}`;
        if (res.externalSource == null) {
          return (
            <Row
              em="⚠️"
              title={title}
              benchmark="can't verify latest block for this chain"
            />
          );
        } else {
          let emoji;
          let benchmarkTitle = "";
          let benchmark = `${res.externalSource}: ${res.externalLatestBlock}`;
          const numBehind = res.externalLatestBlock! - res.latestBlock!;
          if (numBehind > 1) {
            emoji = "⚠️";
            benchmarkTitle = `node is ${numBehind} blocks behind`;
          } else {
            emoji = "✅";
            benchmarkTitle = `node looks caught-up`;
          }
          return (
            <Row
              em={emoji}
              title={title}
              benchmark={benchmark}
              benchmarkTitle={benchmarkTitle}
            />
          );
        }
      }

    case "other":
      const method = res.method || "request";
      if (res.err) {
        return <Row em="❌" title={method + " failed"} err={res.err} />;
      } else if (res.result) {
        return <Row em="✅" title={method} summary={res.result} />;
      } else {
        return <Row em="➡️" title={method} />;
      }
  }
  throw new Error("Unhandled: " + JSON.stringify(res));
}

function Row({
  em,
  title,
  summary,
  benchmarkTitle,
  benchmark,
  err,
}: {
  em: string;
  title: string;
  summary?: string;
  benchmarkTitle?: string;
  benchmark?: string;
  err?: any;
}) {
  return (
    <div className="my-2 grid grid-cols-[1rem_1fr_1fr] gap-4">
      <div>{em}</div>
      <div className="overflow-hidden">
        <strong>{title}</strong>
        <div>{summary}</div>
        {err && <div className="text-red-700">{"" + (err.message || err)}</div>}
      </div>
      <div className="text-gray-600">
        <strong>{benchmarkTitle}</strong>
        <div>{benchmark}</div>
      </div>
    </div>
  );
}
