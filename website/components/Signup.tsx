import * as React from "react";

import { ethers } from "ethers";
import Notifications from "./Notification";

// A Web3Provider wraps the standard provider that Metamask injects.
const windowEth = window["ethereum"] as ethers.providers.ExternalProvider;
const provider = windowEth && new ethers.providers.Web3Provider(windowEth);

interface SignupState {
  account?: string; // Ethereum hex address, eg 0x123456789012345678901234567890
  accountName?: string; // Display name, either 0x12345... or ENS
  monitors: { validatorindex: number; status: string }[];
  validators: { validatorindex: number }[];
}

export default class Signup extends React.PureComponent<{}, SignupState> {
  constructor(props: {}) {
    super(props);
    this.state = { monitors: [], validators: [] };
  }

  async componentDidMount() {
    if (!provider) return;

    const accounts: string[] = await provider.send("eth_accounts", []);
    console.log("Got accounts", accounts);
    this.setEthAccounts(accounts);

    provider.on("accountsChanged", this.setEthAccounts);
  }

  render() {
    if (!provider) {
      return (
        <div>
          <h2>YOUR MONITORS</h2>
          <mark>Install an Ethereum wallet to sign up.</mark> The most popular
          is <a href="https://metamask.io">Metamask</a>.
        </div>
      );
    }

    const { account, accountName, monitors, validators } = this.state;
    if (!account) {
      return (
        <div>
          <h2>YOUR MONITORS</h2>
          <p>
            <a href="#" onClick={this.signUp}>
              Sign in with Ethereum
            </a>{" "}
            to add monitors.
          </p>
          <p>
            We'll automatically find any validators you've staked from your
            address. You can add additional ones manually.
          </p>
        </div>
      );
    }

    const dispName = accountName || account.substring(0, 10) + "…";
    return (
      <div>
        <h2>WELCOME, {dispName}!</h2>
        <p>You have {monitors.length} monitors.</p>
        {monitors.map((m) => (
          <p className="row" key={m.validatorindex}>
            <a href={`https://beaconcha.in/validator/${m.validatorindex}`}>
              #{m.validatorindex}
            </a>
            {m.status === "active_online" ? (
              <em>{m.status}</em>
            ) : (
              <mark>{m.status}</mark>
            )}
          </p>
        ))}
        <p>We found {validators.length} validators staked from your address.</p>
        <p>
          {validators.map((v) => (
            <>
              <a href={`https://beaconcha.in/validator/${v.validatorindex}`}>
                #{v.validatorindex}
              </a>{" "}
            </>
          ))}
        </p>
        <p className="row">
          <input placeholder="12345" ref={this.inValidatorID}></input>
          <button onClick={this.addValidator}>Add validator</button>
        </p>
        {monitors.length > 0 && <Notifications />}
        <Notifications />
      </div>
    );
  }

  signUp = async () => {
    // Request Metamask account.
    const accounts: string[] = await provider.send("eth_requestAccounts", []);
    console.log("Requested accounts", accounts);
    this.setEthAccounts(accounts);
  };

  setEthAccounts = async (accounts: string[]) => {
    const account = accounts[0];
    this.setState({ account });

    const accountName = await provider.lookupAddress(account);
    console.log("Got account name", accountName);
    this.setState({ accountName });

    let monitors: { validatorindex: number; status: string }[] = [];
    let validators: { validatorindex: number }[] = [];
    if (account) {
      let resp = await fetch(`/.netlify/functions/validators?addr=${account}`);
      validators = (await resp.json()).data;
      console.log(`Fetched validators for ${account}`, validators);

      resp = await fetch(`/.netlify/functions/monitor?user=${account}`);
      monitors = await resp.json();
      console.log(`Fetched monitors for ${account}`, monitors);
    }
    this.setState({ monitors, validators });
  };

  inValidatorID = React.createRef<HTMLInputElement>();

  addValidator = async () => {
    const validatorID = Number(this.inValidatorID.current.value);
    if (!(validatorID > 0)) {
      window.alert("Invalid validator ID");
      return;
    }

    console.log("Adding " + validatorID);
  };
}
