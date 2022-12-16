import Head from "next/head";
import React, { useCallback, useState } from "react";
import NodeMonitor from "../components/NodeMonitor";

export default function Home() {
  const [host, setHost] = useState("");
  const submit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.item(0) as HTMLInputElement;
    setHost(input.value);
  }, []);

  return (
    <div className="max-w-xl m-auto">
      <Head>
        <title>Ethereum Node Monitor</title>
        <meta name="description" content="Ethereum Node Monitor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="font-bold text-2xl my-4">Ethereum Node Monitor</h1>

        <div>
          Enter an Ethereum node address. The monitor will query the node and
          check if it's healthy.
        </div>

        <form className="my-4" onSubmit={submit}>
          <input
            className="border py-1 px-2 rounded-md"
            type="text"
            defaultValue="135.181.178.251"
          />
          <button
            type="submit"
            className="border py-1 px-2 mx-2 rounded-md hover:bg-gray-100"
          >
            Go
          </button>
        </form>

        <div className="-mx-4 min-h-[24rem]">
          {host != "" && <NodeMonitor host={host} />}
        </div>
      </main>

      <footer className="my-6">
        <a href="https://github.com/dcposch/ethmonitor">View on github</a>
      </footer>
    </div>
  );
}
