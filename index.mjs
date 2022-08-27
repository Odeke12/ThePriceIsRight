import { loadStdlib, ask } from "@reach-sh/stdlib";
import * as backend from "./build/index.main.mjs";
const stdlib = loadStdlib();

const isTrevor = await ask.ask("Are you Trevor", ask.yesno);
const who = isTrevor ? "Trevor" : "Pauline";

console.log(`The Price is right as ${who}`);
let acc = null;
const createAcc = await ask.ask(
  `Would you like to create an account? (only possible on devnet)`,
  ask.yesno
);

if (createAcc) {
  acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
} else {
  const secret = await ask.ask("What is your secret", (x) => x);
  acc = await newTestAccountFromSecret(secret);
}

let ctc = null;
if (isTrevor) {
  ctc = acc.contract(backend);
  ctc.getInfo().then((info) => {
    console.log(`The contract is deplyed as ${JSON.stringify(info)}`);
  });
} else {
  const info = ask.ask("Please paste the contract information", JSON.parse);
  ctc = acc.contract(backend, info);
}

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async () => fmt(await stdlib.balanceOf(acc));
const before = await getBalance();
console.log(`Your balance is ${before}`);

const interact = { ...stdlib.hasRandom };

interact.informTimeout = () => {
  console.log("There was a timeout");
  process.exit(1);
};

if (isTrevor) {
  const amt = await ask.ask(
    `How much do you want to wager?`,
    stdlib.parseCurrency
  );
  interact.wager = amt;
  interact.deadline = { ETH: 100, ALGO: 100, CFX: 1000 }[stdlib.connector];
} else {
  interact.acceptWager = async (amt) => {
    const accepted = await ask.ask(
      `Do you accept the wager of ${fmt(amt)}?`,
      ask.yesno
    );
    if (!accepted) {
      process.exit(0);
    }
  };
}

interact.getHand = async () => {
  const hand = await ask.ask(`Guess a number from 1 to 10`, (x) => {
    if (x === undefined) {
      throw Error(`Not a valid number`);
    }
    return x;
  });
  console.log(`You chose ${hand}`);
  return hand;
};

const OUTCOME = ["Trevor wins", "Pauline wins", "Draw"];
interact.seeOutCome = async (outcome) => {
  console.log(`The outcome is : ${OUTCOME[outcome]}`);
};

const part = isTrevor ? ctc.p.Trevor : ctc.p.Pauline;

await part(interact);
const after = await getBalance();
console.log(`Your balance is now ${after}`);
ask.done();
