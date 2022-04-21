import * as React from "react";

export default function Summary() {
  return (
    <div>
      <h2>MONITOR YOUR ETHEREUM VALIDATORS</h2>
      <p>
        <em>Get notified immediately if one of your validators is down.</em> You
        can get an SMS or hit any REST API, for example to trigger PagerDuty.
      </p>
      <p>
        <pre>{getExampleSms()}</pre>
      </p>
      <p>
        <em>Get a message every week summarizing your performance.</em> Example
        below.
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
