import * as React from "react";

export default function Footer() {
  return (
    <div className="row">
      <div>
        🛠 built with <a href="https://github.com/gakonst/foundry">forge</a> and{" "}
        <a href="https://esbuild.github.io/">esbuild</a>
      </div>
      <a href="https://github.com/dcposch/ethmonitor">view on Github</a>
      <br />
      <br />
    </div>
  );
}
