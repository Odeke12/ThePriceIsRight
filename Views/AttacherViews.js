import React from "react";
import PlayerViews from "./PlayerViews";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const exports = { ...PlayerViews };

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div className="Attacher">
        <h2>Attacher (Pauline)</h2>
        {content}
      </div>
    );
  }
};

exports.Attach = class extends React.Component {
  render() {
    const { parent } = this.props;
    const { ctcInfoStr } = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea
          spellCheck="false"
          className="ContractInfo"
          onChange={(e) => this.setState({ ctcInfoStr: e.currentTarget.value })}
          placeholder="{}"
        />
        <br />
        <Button
          variant="contained"
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >
          Attach
        </Button>
      </div>
    );
  }
};

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Attaching, please wait <CircularProgress />
      </div>
    );
  }
};

exports.AcceptTerms = class extends React.Component {
  render() {
    const { wager, standardUnit, parent } = this.props;
    const { disabled } = this.state || {};
    return (
      <div>
        The terms of the game are:
        <br /> Wager: {wager} {standardUnit}
        <br />
        <Button
          variant="contained"
          disabled={disabled}
          onClick={() => {
            this.setState({ disabled: true });
            parent.termsAccepted();
          }}
        >
          Accept terms and pay wager
        </Button>
      </div>
    );
  }
};

exports.WaitingForTurn = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for the other player <CircularProgress />
        <br />
        Think about the value you are going to guess
      </div>
    );
  }
};

export default exports;
