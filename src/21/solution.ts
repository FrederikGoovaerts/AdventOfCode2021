// const [player1Start, player2Start] = [4, 8]; // Ex1
const [player1Start, player2Start] = [3, 4]; // Input

let player1Pos = player1Start;
let player2Pos = player2Start;
let player1Score = 0;
let player2Score = 0;

const spaces = 10;

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

for (let i = 0; i < 444356092776315; i++) {
  detDieCount++;
}
