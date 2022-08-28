import React from "react";
import { Button, TextField, Box } from "@mui/material";

const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.

exports.GetGuess = class extends React.Component {
  render() {
    const { parent, playable, guess } = this.props;
    // const { value } = this.state;
    console.log(guess);
    return (
      <div>
        {guess ? "It was incorrect. Pick again." : ""}
        <br />
        {!playable ? "Please wait..." : ""}
        <br />
        Guess a number between 0 and 10
        <input
          type="number"
          min={0}
          max={10}
          //   value={this.state.guess}
          onChange={(e) => {
            this.setState({ value: e.currentTarget.value });
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            parent.playGuess(this.state.value);
            console.log(this.state.value);
          }}
        >
          Submit Guess
        </Button>
      </div>
    );
  }
};

exports.WaitingForResults = class extends React.Component {
  render() {
    return <div>Waiting for results...</div>;
  }
};

exports.Done = class extends React.Component {
  render() {
    const {
      outcome,
      // , price
    } = this.props;
    return (
      <div>
        Thank you for playing.
        {/* <br></br>
        The Price was: {price || "Unknown"} */}
        <br></br>
        The outcome of this game was:
        <br />
        {outcome || "Unknown"}
      </div>
    );
  }
};

exports.Timeout = class extends React.Component {
  render() {
    return <div>There's been a timeout. (Someone took too long.)</div>;
  }
};

export default exports;
