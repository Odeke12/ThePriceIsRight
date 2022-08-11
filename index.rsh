"reach 0.1";

const numberToGuess = 2000;
const [isOutCome, T_WINS, P_WINS, DRAW] = makeEnum(3);
const winner = (valueTrevor, valuePauline) => {
  if (valueTrevor === numberToGuess) {
    return 1;
  } else if (valuePauline === numberToGuess) {
    return 2;
  } else if (valueTrevor !== numberToGuess && valuePauline !== numberToGuess) {
    return 3;
  }
};

assert(winner(numberToGuess, 23232) === 1);
assert(winner(3345345, numberToGuess) === 2);
assert(winner(3345345, 3434) === 3);

const Player = {
  ...hasRandom,
  getHand: Fun([], UInt),
  seeOutCome: Fun([UInt], Null),
}; //Interface

export const main = Reach.App(() => {
  const Trevor = Participant("Trevor", {
    ...Player,
    wager: UInt,
  });
  const Pauline = Participant("Pauline", {
    ...Player,
    acceptWager: Fun([UInt], Null),
  });
  init();

  Trevor.only(() => {
    const wager = declassify(interact.wager);
    const _handTrevor = interact.getHand();
    const [_commitTrevor, _saltTrevor] = makeCommitment(interact, _handTrevor);
    const commitTrevor = declassify(_commitTrevor);
  });
  Trevor.publish(wager, commitTrevor).pay(wager);
  commit();

  Pauline.only(() => {
    interact.acceptWager(wager);
    const valuePauline = declassify(interact.getHand());
  });
  Pauline.publish(valuePauline).pay(wager);

  const outcome = (valueTrevor + (4 - valuePauline)) % 3;
  const result =
    valueTrevor === numberToGuess ? 2 : valuePauline === numberToGuess ? 0 : 1;
  const [forTrevor, forPauline] =
    result == 2 ? [2, 0] : result == 0 ? [0, 2] : [1, 1];
  transfer(forTrevor * wager).to(Trevor);
  transfer(forPauline * wager).to(Pauline);
  commit();

  each([Trevor, Pauline], () => {
    interact.seeOutCome(result);
  });
});
