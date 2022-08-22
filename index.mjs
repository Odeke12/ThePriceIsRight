import { loadStdlib, ask } from "@reach-sh/stdlib";
import * as backend from "./build/index.main.mjs";
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(10);
const accTrevor = await stdlib.newTestAccount(startingBalance);
const accPauline = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
const beforeTrevor = await getBalance(accTrevor);
const beforePauline = await getBalance(accPauline);

const ctcTrevor = accTrevor.contract(backend); //Is there an issue with this line
const ctcPauline = accPauline.contract(backend, ctcTrevor.getInfo());

const Player = (Who) => ({
  //Contructor
  ...stdlib.hasRandom,
  getHand: () => {
    const hand = Math.floor(Math.random());
    console.log(`${Who} guessed ${hand}`);
    return hand;
  },
  seeOutCome: (outcome) => {
    console.log(`${Who} saw outcome ${outcome}`);
  },
  informTimeout: () => {
    console.log(`${Who} observed a timeout`);
  },
});

await Promise.all([
  ctcTrevor.p.Trevor({
    ...Player("Trevor"),
    wager: stdlib.parseCurrency(5),
  }),
  ctcPauline.p.Pauline({
    ...Player("Pauline"),
    acceptWager: async (amt) => {
      if (Math.random() <= 0.5) {
        for (let i = 0; i < 10; i++) {
          console.log(`Pauline accepts the wager of ${fmt(amt)}`);
          await stdlib.wait(1);
        }
      } else {
        console.log(`Pauline accepts the wager of ${fmt(amt)}.`);
      }
    },
  }),
]);

const afterTrevor = await getBalance(accTrevor);
const afterPauline = await getBalance(accPauline);
console.log(`Trevor went from ${beforeTrevor} to ${afterTrevor}.`);
console.log(`Pauline went from ${beforePauline} to ${afterPauline}.`);
