"reach 0.1";

const numberToGuess = 8;
const [isOutCome, T_WINS, P_WINS, DRAW] = makeEnum(3);
const winner = (valueTrevor, valuePauline) => {
  if (valueTrevor === numberToGuess) {
    return 0;
  } else if (valuePauline === numberToGuess) {
    return 1;
  } else if (valueTrevor !== numberToGuess && valuePauline !== numberToGuess) {
    return 2;
  } else {
    return 0;
  }
};

assert(winner(numberToGuess, 23232) === T_WINS);
assert(winner(3345345, numberToGuess) === P_WINS);
assert(winner(3345345, 3434) === DRAW);

forall(UInt, (handTrevor) =>
  forall(UInt, (handPauline) =>
    assert(isOutCome(winner(handTrevor, handPauline)))
  )
);

const Player = {
  ...hasRandom,
  getGuess: Fun([], UInt),
  seeOutCome: Fun([UInt], Null),
  informTimeout: Fun([], Null),
}; //Interface

export const main = Reach.App(() => {
  const Trevor = Participant("Trevor", {
    ...Player,
    wager: UInt,
    deadline: UInt,
  });
  const Pauline = Participant("Pauline", {
    ...Player,
    acceptWager: Fun([UInt], Null),
  });
  init();

  const informTimeout = () => {
    each([Trevor, Pauline], () => {
      interact.informTimeout();
    });
  };

  Trevor.only(() => {
    const wager = declassify(interact.wager);
    const deadline = declassify(interact.deadline);
  });
  Trevor.publish(wager, deadline).pay(wager);
  commit();

  Pauline.only(() => {
    interact.acceptWager(wager);
  });
  Pauline.pay(wager).timeout(relativeTime(deadline), () =>
    closeTo(Trevor, informTimeout)
  );

  var outcome = DRAW;
  invariant(balance() == 2 * wager && isOutCome(outcome));

  while (outcome == DRAW) {
    commit();

    Trevor.only(() => {
      const _handTrevor = interact.getGuess();
      const [_commitTrevor, _saltTrevor] = makeCommitment(
        interact,
        _handTrevor
      );
      const commitTrevor = declassify(_commitTrevor);
    });

    Trevor.publish(commitTrevor).timeout(relativeTime(deadline), () =>
      closeTo(Pauline, informTimeout)
    );
    commit();

    unknowable(Pauline, Trevor(_handTrevor, _saltTrevor));
    Pauline.only(() => {
      const handPauline = declassify(interact.getGuess());
    });
    Pauline.publish(handPauline).timeout(relativeTime(deadline), () =>
      closeTo(Trevor, informTimeout)
    );
    commit();

    Trevor.only(() => {
      const saltTrevor = declassify(_saltTrevor);
      const handTrevor = declassify(_handTrevor);
    });
    Trevor.publish(saltTrevor, handTrevor);
    checkCommitment(commitTrevor, saltTrevor, handTrevor);

    outcome = winner(handTrevor, handPauline);
    continue;
  }

  // const outcome = (valueTrevor + (4 - valuePauline)) % 3;
  // const result =
  // valueTrevor === numberToGuess ? 2 : valuePauline === numberToGuess ? 0 : 1;
  // const outcome = winner(handTrevor, handPauline);
  assert(outcome == T_WINS || outcome == P_WINS);
  const [forTrevor, forPauline] =
    outcome == 0 ? [2, 0] : outcome == 1 ? [0, 2] : [1, 1]; //Simplify this

  // transfer(forTrevor * wager).to(Trevor);
  // transfer(forPauline * wager).to(Pauline);
  transfer(2 * wager).to(outcome == T_WINS ? Trevor : Pauline);
  commit();

  each([Trevor, Pauline], () => {
    interact.seeOutCome(outcome);
  });
});
