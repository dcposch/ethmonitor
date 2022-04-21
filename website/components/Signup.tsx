import * as React from "react";

import { ethers } from "ethers";

// A Web3Provider wraps the standard provider that Metamask injects.
const windowEth = window["ethereum"] as ethers.providers.ExternalProvider;
const provider = windowEth && new ethers.providers.Web3Provider(windowEth);

interface SignupState {
  account?: string; // Ethereum hex address, eg 0x123456789012345678901234567890
  accountName?: string; // Display name, either 0x12345... or ENS
}

export default class Signup extends React.PureComponent<{}, SignupState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
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

    const { account, accountName } = this.state;
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
        <p>You have 0 monitors.</p>
        <p>We found 0 validators staked from your address.</p>
        <input
          type="number"
          placeholder="12345"
          ref={this.inValidatorID}
        ></input>
        <button onClick={this.addValidator}>Add validator</button>
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

    var accountName = await provider.lookupAddress(account);
    console.log("Got account name", accountName);
    this.setState({ accountName });
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
