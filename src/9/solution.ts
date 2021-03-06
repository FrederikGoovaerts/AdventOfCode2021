import { asList } from "../utils/inputReader";
import { getNeighbours, getNeighboursLocs } from "../utils/neighbours";

const input = asList("input").map((val) => val.split("").map(Number));
const width = input[0].length;
const height = input.length;

function isLowPoint(x: number, y: number): boolean {
  const neighbours = getNeighbours(x, y, input, false);
  return neighbours.find((val) => val <= input[x][y]) === undefined;
}

function basinSize(x: number, y: number): number {
  let size = 0;
  const checked = new Set<string>();
  const locs: [number, number][] = [[x, y]];
  while (locs.length > 0) {
    const curr = locs.pop() as [number, number];
    if (!checked.has(`${curr[0]}.${curr[1]}`)) {
      checked.add(`${curr[0]}.${curr[1]}`);
      if (input[curr[0]][curr[1]] != 9) {
        size++;
        locs.push(...getNeighboursLocs(curr[0], curr[1], input, false));
      }
    }
  }

  return size;
}

let totalRisk = 0;
const lowPoints: [number, number][] = [];

for (let x = 0; x < height; x++) {
  for (let y = 0; y < width; y++) {
    if (isLowPoint(x, y)) {
      lowPoints.push([x, y]);
      totalRisk += input[x][y] + 1;
    }
  }
}

console.log(totalRisk);

const sizes: number[] = [];
for (const point of lowPoints) {
  sizes.push(basinSize(point[0], point[1]));
}
sizes.sort((a, b) => a - b);

console.log(sizes.pop()! * sizes.pop()! * sizes.pop()!);
