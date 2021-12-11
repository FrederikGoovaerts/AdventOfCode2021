import { asList } from "../utils/inputReader";
import { getNeighboursLocs } from "../utils/neighbours";

const input = asList("input").map((val) => val.split("").map(Number));
const loopSize = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let totalFlashes = 0;

function increaseAndCheckFlash(
  x: number,
  y: number,
  flashedSet: Set<string>
): void {
  const curr = input[x][y]++;
  if (curr === 9) {
    flashedSet.add(`${x}.${y}`);
    for (const loc of getNeighboursLocs(x, y, input)) {
      if (!flashedSet.has(`${loc[0]}.${loc[1]}`)) {
        increaseAndCheckFlash(loc[0], loc[1], flashedSet);
      }
    }
  }
}

function doStep(): Set<string> {
  const flashedSet = new Set<string>();
  for (const x of loopSize) {
    for (const y of loopSize) {
      if (!flashedSet.has(`${x}.${y}`)) {
        increaseAndCheckFlash(x, y, flashedSet);
      }
    }
  }
  for (const flashed of flashedSet) {
    const coord = flashed.split(".").map(Number);
    input[coord[0]][coord[1]] = 0;
  }
  return flashedSet;
}

for (let step = 0; step < 100; step++) {
  const flashedSet = doStep();
  totalFlashes += flashedSet.size;
}

console.log(totalFlashes);

// We did step 1 to step 100 previously
for (let count = 101; ; count++) {
  const flashedSet = doStep();
  if (flashedSet.size === 100) {
    console.log(count);
    break;
  }
}
