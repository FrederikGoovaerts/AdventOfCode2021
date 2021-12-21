// const [player1Start, player2Start] = [4, 8]; // Ex1
const [player1Start, player2Start] = [3, 4]; // Input

let player1Pos = player1Start;
let player2Pos = player2Start;
let player1Score = 0;
let player2Score = 0;

function getSpace(intialPos: number, roll: number): number {
  let result = intialPos + roll;
  if (result > 10) {
    result = ((result - 1) % 10) + 1;
  }
  return result;
}

const rollDetDie = () => {
  const result = detDieVal;
  detDieVal = detDieVal === 100 ? 1 : detDieVal + 1;
  detDieCount++;
  return result;
};

let detDieVal = 1;
let detDieCount = 0;

let player1Turn = true;

while (player1Score < 1000 && player2Score < 1000) {
  const move = rollDetDie() + rollDetDie() + rollDetDie();
  if (player1Turn) {
    player1Pos += move;
    if (player1Pos > 10) {
      player1Pos = ((player1Pos - 1) % 10) + 1;
    }
    player1Score += player1Pos;
  } else {
    player2Pos += move;
    if (player2Pos > 10) {
      player2Pos = ((player2Pos - 1) % 10) + 1;
    }
    player2Score += player2Pos;
  }
  player1Turn = !player1Turn;
}

console.log(Math.min(player2Score, player1Score) * detDieCount);

const qResults = [1, 2, 3];
const rollResults: number[] = [];
for (const a of qResults) {
  for (const b of qResults) {
    for (const c of qResults) {
      rollResults.push(a + b + c);
    }
  }
}
const doubleRollResult: [number, number][] = [];
for (const r1 of rollResults) {
  for (const r2 of rollResults) {
    doubleRollResult.push([r1, r2]);
  }
}

// Index on first layer is current highest score, which will always increase for a state
// Index on second layer is position of player 1
// Index on third layer is position of player 2
// Contained maps contain the score for the losing player if the current highest score belongs to the other player
// E.g. if state[11][9][2].p1S has entry <8, 12>, then we know of 12 ways to get to the state where players 1 and 2
//   are in positions 9 and 2 and have score 8 and 11 respectively.
const states: { p1S: Map<number, bigint>; p2S: Map<number, bigint> }[][][] = [];

function addState(
  p1Pos: number,
  p2Pos: number,
  p1Score: number,
  p2Score: number,
  entries: bigint
): void {
  const maxScore = Math.max(p1Score, p2Score);

  states[maxScore] = states[maxScore] ?? [];

  states[maxScore][p1Pos] = states[maxScore][p1Pos] ?? [];

  states[maxScore][p1Pos][p2Pos] = states[maxScore][p1Pos][p2Pos] ?? {
    p1S: new Map(),
    p2S: new Map(),
  };

  if (p1Score > p2Score) {
    const current = states[maxScore][p1Pos][p2Pos].p2S.get(p2Score) ?? 0n;
    states[maxScore][p1Pos][p2Pos].p2S.set(p2Score, current + entries);
  } else {
    const current = states[maxScore][p1Pos][p2Pos].p1S.get(p1Score) ?? 0n;
    states[maxScore][p1Pos][p2Pos].p1S.set(p1Score, current + entries);
  }
}

addState(player1Start, player2Start, 0, 0, 1n);

let p1Win = 0n;
let p2Win = 0n;

for (let max = 0; max < 21; max++) {
  const maxArray = states[max];
  if (maxArray) {
    maxArray.forEach((p1Entry, p1Pos) => {
      p1Entry.forEach((p2Entry, p2Pos) => {
        const { p1S, p2S } = p2Entry;

        const checkEntries = (map: Map<number, bigint>, maxForP1: boolean) => {
          for (const [min, entries] of map.entries()) {
            const [p1Score, p2Score] = maxForP1 ? [max, min] : [min, max];
            for (const rollP1 of rollResults) {
              let exit = false;
              for (const rollP2 of rollResults) {
                if (exit) {
                  break;
                }
                const space1 = getSpace(p1Pos, rollP1);
                const space2 = getSpace(p2Pos, rollP2);
                if (p1Score + space1 >= 21) {
                  p1Win += entries;
                  exit = true;
                } else if (p2Score + space2 >= 21) {
                  p2Win += entries;
                } else {
                  addState(
                    space1,
                    space2,
                    p1Score + space1,
                    p2Score + space2,
                    entries
                  );
                }
              }
            }
          }
        };

        checkEntries(p1S, false);
        checkEntries(p2S, true);
      });
    });
  }
}

console.log((p1Win > p2Win ? p1Win : p2Win).toString());
