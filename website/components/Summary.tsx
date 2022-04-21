import * as React from "react";

export default function Summary() {
  return (
    <div>
      <h2>MONITOR YOUR ETHEREUM VALIDATORS</h2>
      <p>
        <em>Get notified if a validator is down.</em> You can get an SMS or hit
        any REST API, for example to trigger PagerDuty.
      </p>
      <pre>{getExampleSms()}</pre>
      <p>
        <em>Get a weekly performance summary.</em> Example below.
      </p>
    </div>
  );
}
function getExampleSms() {
  return `    _________________________________________________
    \\                                                |
     \\    ONE OF YOUR VALIDATORS IS DOWN.            |
      |   See https://beaconcha.in/validator/12345   |
      |                                              |
      +----------------------------------------------+

`;
}
