import { asIs } from "../utils/inputReader";

const input = asIs("input").split("\n\n");
const nbBoards = input.length - 1;

const drawOrder = input[0].split(",").map(Number);

// e.g. "4,5,8,10" : 1 means first board wins with said numbers, sorted
const winningLines: Set<[number[], number]> = new Set();

const boardNumbers: Record<number, number[]> = {};

for (let i = 1; i < input.length; i++) {
  boardNumbers[i] = [];
  const currentBoardRaw = input[i];
  const currentBoard = currentBoardRaw
    .split("\n")
    .map((row) => row.trim().split(/\s+/).map(Number));

  for (const row of currentBoard) {
    winningLines.add([[...row].sort(), i]);
  }

  for (let x = 0; x < 5; x++) {
    let column: number[] = [];
    for (let y = 0; y < 5; y++) {
      column.push(currentBoard[y][x]);

      boardNumbers[i].push(currentBoard[y][x]);
    }
    winningLines.add([[...column].sort(), i]);
  }
}

function choose(chooseWinner = true) {
  let winningBoards: Set<number> = new Set();
  let desiredBoard: number = -1;
  let winningDraw: number = -1;

  for (const currDraw of drawOrder) {
    for (const [line, id] of winningLines) {
      const filtered = line.filter((val) => val !== currDraw);
      if (filtered.length === 0) {
        winningBoards.add(id);
        if (chooseWinner || winningBoards.size === nbBoards) {
          desiredBoard = id;
          winningDraw = currDraw;
          break;
        }
      }
      line.length = 0;
      line.push(...filtered);
    }
    if (desiredBoard > 0) {
      break;
    }
  }

  let winningBoardNum = boardNumbers[desiredBoard];

  for (let i = 0; i < drawOrder.length && drawOrder[i] !== winningDraw; i++) {
    winningBoardNum = winningBoardNum.filter((val) => val !== drawOrder[i]);
  }
  winningBoardNum = winningBoardNum.filter((val) => val !== winningDraw);

  const a = winningBoardNum.reduce((prev, curr) => prev + curr, 0);

  console.log(a * winningDraw);
}

choose();
choose(false);
