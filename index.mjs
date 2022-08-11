import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from "./build/index.main.mjs";
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100);
const accTrevor = await stdlib.newTestAccount(startingBalance);
const accPauline = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));

const ctcTrevor = accTrevor.contract(backend);
const ctcPauline = accPauline.contract(backend, ctcTrevor.getInfo());

const Player = (Who) => {
  //Contructor
  getHand: () => {
    const hand = Math.floor(Math.random());
    console.log(`${Who} guessed ${hand}`);
    return hand;
  };
  seeOutCome: (outcome) => {
    console.log(`${Who} saw outcome ${outcome}`);
  };
};

await Promise.all([
  ctcTrevor.p.Trevor({
    ...Player("Trevor"),
    wager: stdlib.parseCurrency(5),
  }),
  ctcPauline.p.Pauline({
    ...Player("Pauline"),
    acceptWager: (amt) => {
      console.log(`Pauline accepts the wager of ${fmt(amt)}`);
    },
  }),
]);

const afterAlice = await getBalance(accTrevor);
const afterBob = await getBalance(accPauline);
console.log(`Alice went from ${beforeAlice} to ${afterAlice}.`);
console.log(`Bob went from ${beforeBob} to ${afterBob}.`);
