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

  render() {
    if (!provider) {
      return (
        <div>
          <mark>Install an Ethereum wallet to sign up.</mark> The most popular
          is <a href="https://metamask.io">Metamask</a>.
        </div>
      );
    }

    const { account, accountName } = this.state;
    if (!account) {
      return (
        <div>
          <em>
            <a href="#" onClick={this.signUp}>
              Sign up with Ethereum.
            </a>
          </em>
        </div>
      );
    }

    const dispName = accountName || account.substring(0, 10) + "…";
    return (
      <div>
        <em>Welcome, {dispName}!</em>
      </div>
    );
  }

  signUp = async () => {
    // Request Metamask account.
    const accounts: string[] = await provider.send("eth_requestAccounts", []);
    console.log("Got accounts", accounts);
    const account = accounts[0];
    this.setState({ account });

    var accountName = await provider.lookupAddress(account);
    console.log("Got account name", accountName);
    this.setState({ accountName });
  };
}
