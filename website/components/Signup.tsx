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

    const { account, accountName, monitors } = this.state;
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

    const extraValidators = this.getExtraValidators();

    const dispName = accountName || account.substring(0, 10) + "…";
    return (
      <div>
        <h2>WELCOME, {dispName}!</h2>
        <p>You have {monitors.length} monitors.</p>
        {monitors.map((m) => (
          <div className="row" key={m.validatorindex}>
            <a href={`https://beaconcha.in/validator/${m.validatorindex}`}>
              #{m.validatorindex}
            </a>
            {m.status === "active_online" ? (
              <em>{m.status}</em>
            ) : (
              <mark>{m.status}</mark>
            )}
          </div>
        ))}
        <div className="row">
          <div>
            We found {extraValidators.length} more validators you deposited.
          </div>
          <button onClick={this.addAll}>Add all</button>
        </div>
        <p>
          {extraValidators.map((v) => (
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
      </div>
    );
  }

  getExtraValidators() {
    const { validators, monitors } = this.state;
    return validators.filter(
      (v) => !monitors.find((m) => m.validatorindex === v.validatorindex)
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

    const monitors = account ? await this.fetchMonitors() : [];
    const validators = account ? await this.fetchValidators() : [];
    this.setState({ monitors, validators });
  };

  async fetchValidators() {
    const { account } = this.state;
    let resp = await fetch(`/.netlify/functions/validators?addr=${account}`);
    const validators: { validatorindex: number }[] = (await resp.json()).data;
    console.log(`Fetched validators for ${account}`, validators);

    return validators;
  }

  async fetchMonitors() {
    const { account } = this.state;
    const resp = await fetch(`/.netlify/functions/monitor?user=${account}`);
    const monitors: { validatorindex: number; status: string }[] =
      await resp.json();
    console.log(`Fetched monitors for ${account}`, monitors);

    return monitors;
  }

  inValidatorID = React.createRef<HTMLInputElement>();

  addAll = async () => {
    const extraValidators = this.getExtraValidators();
    const promises = extraValidators.map((v) =>
      this.postValidator(v.validatorindex)
    );
    await Promise.all(promises);

    this.setState({ monitors: await this.fetchMonitors() });
  };

  addValidator = async () => {
    const validatorIndex = Number(this.inValidatorID.current.value);
    if (!(validatorIndex > 0)) {
      window.alert("Invalid validator ID");
      return;
    }
    await this.postValidator(validatorIndex);
    this.inValidatorID.current.value = "";

    this.setState({ monitors: await this.fetchMonitors() });
  };

  postValidator = async (validatorIndex: number) => {
    const { account } = this.state;
    if (!account) throw new Error("not signed in");

    console.log("Adding monitor " + validatorIndex);
    await fetch(
      `/.netlify/functions/monitor?user=${account}&validatorIndex=${validatorIndex}`,
      { method: "POST" }
    );
  };
}
