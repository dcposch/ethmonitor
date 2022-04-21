import * as React from "react";

export default function Notifications() {
  const [phone, setPhone] = React.useState("");

  const inRef = React.useRef<HTMLInputElement>();
  const setSMS = React.useCallback(() => {
    // TODO: send to server
    setPhone(inRef.current.value);
    inRef.current.value = "";
  }, []);

  return (
    <div>
      <h2>NOTIFICATIONS</h2>
      <p>
        {!phone && <mark>No SMS number for notifications.</mark>}
        {phone && `If a validator goes down, you'll get a text at ${phone}.`}
      </p>
      <div className="row">
        <input type="text" ref={inRef}></input>
        <button onClick={setSMS}>Set SMS number</button>
      </div>
    </div>
  );
}
