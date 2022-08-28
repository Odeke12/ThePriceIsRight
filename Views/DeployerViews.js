import React from "react";
import PlayerViews from "./PlayerViews";
import { Button, TextField, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const exports = { ...PlayerViews };

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div className="Deployer">
        <h2>Deployer (Trevor)</h2>
        {content}
      </div>
    );
  }
};

exports.SetWager = class extends React.Component {
  render() {
    const { parent, defaultWager, standardUnit } = this.props;
    const wager = (this.state || {}).wager || defaultWager;
    return (
      <div>
        {/* <input
          type="number"
          placeholder={defaultWager}
          onChange={(e) => this.setState({ wager: e.currentTarget.value })}
        />{" "} */}
        <TextField
          id="filled-basic"
          label="Outlined"
          variant="filled"
          type="number"
          placeholder={defaultWager}
          sx={{ backgroundColor: "white" }}
          onChange={(e) => this.setState({ wager: e.currentTarget.value })}
        />
        {standardUnit}
        <br />
        <br />
        <Button variant="contained" onClick={() => parent.setWager(wager)}>
          Set wager
        </Button>
      </div>
    );
  }
};

exports.Deploy = class extends React.Component {
  render() {
    const { parent, wager, standardUnit } = this.props;
    return (
      <div>
        Wager (pay to deploy): <strong>{wager}</strong> {standardUnit}
        <br />
        <Button variant="contained" onClick={() => parent.deploy()}>
          Deploy
        </Button>
      </div>
    );
  }
};

exports.Deploying = class extends React.Component {
  render() {
    return (
      <Box sx={{ display: "flex" }}>
        Deploying, please wait <CircularProgress />
      </Box>
    );
  }
};

exports.WaitingForAttacher = class extends React.Component {
  async copyToClipboard(button) {
    const { ctcInfoStr } = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = "Copied!";
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const { ctcInfoStr } = this.props;
    return (
      <div>
        Waiting for Attacher to join...
        <br /> Please give them this contract info:
        <pre className="ContractInfo">{ctcInfoStr}</pre>
        <Button
          variant="contained"
          onClick={(e) => this.copyToClipboard(e.currentTarget)}
        >
          Copy to clipboard
        </Button>
      </div>
    );
  }
};

export default exports;
