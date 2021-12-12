import { asList } from "../utils/inputReader";

const input = asList("input");

function isBigCave(val: string): boolean {
  return val === val.toUpperCase();
}

const paths: Record<string, string[]> = {};

function addPath(from: string, to: string): void {
  if (to === "start") {
    return;
  }
  const list = paths[from] ?? [];
  list.push(to);
  paths[from] = list;
}

for (const line of input) {
  const parts = line.split("-");
  addPath(parts[0], parts[1]);
  addPath(parts[1], parts[0]);
}

function getPossiblePaths(allowVisitTwice: boolean): number {
  const finishedPaths = new Set<string>();
  const unfinishedPaths: {
    path: string;
    pos: string;
    visitedTwice: boolean;
  }[] = [{ path: "start", pos: "start", visitedTwice: false }];

  while (unfinishedPaths.length > 0) {
    const curr = unfinishedPaths.pop()!;
    const options = paths[curr?.pos];
    for (const option of options) {
      if (option === "end") {
        finishedPaths.add(curr.path + ",end");
      } else if (!isBigCave(option)) {
        if (!curr.path.includes(option)) {
          unfinishedPaths.push({
            path: curr.path + "," + option,
            pos: option,
            visitedTwice: curr.visitedTwice,
          });
        }
        if (!curr.visitedTwice && allowVisitTwice) {
          unfinishedPaths.push({
            path: curr.path + "," + option,
            pos: option,
            visitedTwice: true,
          });
        }
      } else {
        unfinishedPaths.push({
          path: curr.path + "," + option,
          pos: option,
          visitedTwice: curr.visitedTwice,
        });
      }
    }
  }

  return finishedPaths.size;
}

console.log(getPossiblePaths(false));
console.log(getPossiblePaths(true));
