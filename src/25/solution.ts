import { asList } from "../utils/inputReader";

const input = asList("input").map((line) => line.split(""));
const height = input.length;
const width = input[0].length;

const ser = (x: number, y: number): string => `|${y}.${x}`;
const deser = (input: string): { x: number; y: number } => {
  const parts = input.split(".");
  return { x: Number(parts[1]), y: Number(parts[0].substring(1)) };
};

let downC: string[] = [];
let rightC: string[] = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (input[y][x] === "v") {
      downC.push(ser(x, y));
    } else if (input[y][x] === ">") {
      rightC.push(ser(x, y));
    }
  }
}

function printState() {
  console.log("");
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      if (rightC.includes(ser(x, y))) {
        line += ">";
      } else if (downC.includes(ser(x, y))) {
        line += "v";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

let moved = true;
let moveCounter = 0;

while (moved) {
  moved = false;
  let newRight = [];
  for (const right of rightC) {
    const coords = deser(right);
    const next = ser((coords.x + 1) % width, coords.y);
    if (!rightC.includes(next) && !downC.includes(next)) {
      newRight.push(next);
      moved = true;
    } else {
      newRight.push(right);
    }
  }
  rightC = newRight;

  let newDown = [];
  for (const down of downC) {
    const coords = deser(down);
    const next = ser(coords.x, (coords.y + 1) % height);
    if (!rightC.includes(next) && !downC.includes(next)) {
      newDown.push(next);
      moved = true;
    } else {
      newDown.push(down);
    }
  }
  downC = newDown;
  moveCounter++;
}
console.log(moveCounter);
