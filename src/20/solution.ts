import { asList } from "../utils/inputReader";

const input = asList("input");

type Value = 0 | 1;

const serPix = (x: number, y: number): string => `${y}.${x}`;

const algo: Value[] = [];

let litSet = new Set<string>();
let [minX, maxX, minY, maxY] = [0, 0, 0, 0];

function visualize() {
  console.log("\n");
  for (let y = minY - 1; y <= maxY + 1; y++) {
    let line = "";
    for (let x = minX - 1; x <= maxX + 1; x++) {
      line += litSet.has(serPix(x, y)) ? "#" : ".";
    }
    console.log(line);
  }
  console.log("\n");
}

function handleBounds(x: number, y: number): void {
  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
  maxX = Math.max(maxX, x);
  maxY = Math.max(maxY, y);
}

for (const val of input[0].split("")) {
  if (val === ".") {
    algo.push(0);
  } else if (val === "#") {
    algo.push(1);
  }
}

const image = input.slice(2);

for (let y = 0; y < image.length; y++) {
  const row = image[y].split("");
  for (let x = 0; x < row.length; x++) {
    if (row[x] === "#") {
      litSet.add(serPix(x, y));
      handleBounds(x, y);
    }
  }
}

let algoCount = 0;

function doAlgo(): void {
  const newLit = new Set<string>();

  // Stash locally so we can update these during the algo for next run
  const [cMinX, cMaxX, cMinY, cMaxY] = [minX, maxX, minY, maxY];

  // Extra padding for "the catch"
  for (let y = cMinY - 4; y <= cMaxY + 4; y++) {
    for (let x = cMinX - 4; x <= cMaxX + 4; x++) {
      let bitString = "";
      for (const pixY of [y - 1, y, y + 1]) {
        for (const pixX of [x - 1, x, x + 1]) {
          // "The catch" in action, automatically substitute the infinite values
          if (
            algo[0] === 1 &&
            (x < cMinX - 1 || x > cMaxX + 1 || y < cMinY - 1 || y > cMaxY + 1)
          ) {
            bitString += algoCount % 2;
          } else {
            bitString += litSet.has(serPix(pixX, pixY)) ? "1" : "0";
          }
        }
      }
      const litVal = algo[parseInt(bitString, 2)];
      if (litVal === 1) {
        newLit.add(serPix(x, y));
        // Solution should only max grow one per algorithm call (flipping of infinity not kept in mind)
        const clampedX = Math.max(Math.min(x, cMaxX + 1), cMinX - 1);
        const clampedY = Math.max(Math.min(y, cMaxY + 1), cMinY - 1);
        handleBounds(clampedX, clampedY);
      }
    }
  }

  litSet = newLit;
  algoCount++;
}

doAlgo();
doAlgo();
console.log(litSet.size);

for (let x = 3; x <= 50; x++) {
  doAlgo();
}
console.log(litSet.size);
