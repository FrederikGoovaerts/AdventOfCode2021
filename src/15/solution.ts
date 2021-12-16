import { asList } from "../utils/inputReader";
import { getNeighboursLocs } from "../utils/neighbours";

const smallInput = asList("input").map((val) => val.split("").map(Number));
const largeInput = smallInput.map((val) => [...val]);
const wrap = (val: number, i: number) =>
  val + i > 9 ? ((val + i) % 10) + 1 : val + i;
for (const line of largeInput) {
  const vals = [...line];
  for (let i = 1; i < 5; i++) {
    line.push(...vals.map((val) => wrap(val, i)));
  }
}
const inputLines = [...largeInput];
for (let i = 1; i < 5; i++) {
  for (const line of inputLines) {
    largeInput.push(line.map((val) => wrap(val, i)));
  }
}

function calcSolution(input: number[][]) {
  const goalX = input.length - 1;
  const goalY = input[0].length - 1;

  const ser = (x: number, y: number) => `${x}.${y}`;
  const deSer = (a: string) => a.split(".").map(Number);
  const heur = (x: number, y: number) => goalX - x + goalY - y;

  const expandSet = new Set<string>([ser(0, 0)]);
  const originMap = new Map<string, string>();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  gScore.set(ser(0, 0), 0);
  fScore.set(ser(0, 0), heur(0, 0));

  let found = false;

  while (expandSet.size > 0) {
    const curr = [...expandSet].sort(
      (first, second) => fScore.get(first)! - fScore.get(second)!
    )[0];
    const [currX, currY] = deSer(curr);
    if (currX === goalX && currY === goalY) {
      found = true;
      break;
    }

    expandSet.delete(curr);

    const neigbours = getNeighboursLocs(currX, currY, input, false);

    for (const neighbour of neigbours) {
      const serNeighbour = ser(...neighbour);
      const currG = gScore.get(curr)! + input[neighbour[0]][neighbour[1]];
      if (currG < (gScore.get(serNeighbour) ?? Number.MAX_SAFE_INTEGER)) {
        originMap.set(serNeighbour, curr);
        gScore.set(serNeighbour, currG);
        fScore.set(serNeighbour, currG + heur(...neighbour));
        expandSet.add(serNeighbour);
      }
    }
  }

  if (found) {
    let total = 0;
    let currX = goalX;
    let currY = goalY;
    while (currX !== 0 || currY !== 0) {
      total += input[currX][currY];
      const next = originMap.get(ser(currX, currY))!;
      [currX, currY] = deSer(next);
    }
    console.log(total);
  }
}

calcSolution(smallInput);
calcSolution(largeInput);
