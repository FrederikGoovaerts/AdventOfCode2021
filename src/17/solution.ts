import { asIs } from "../utils/inputReader";

const input = asIs("input").substring(15).split(", y=");
const [[minX, maxX], [minY, maxY]] = input.map((val) =>
  val.split("..").map(Number)
);

const inArea = (x: number, y: number) =>
  x <= maxX && x >= minX && y <= maxY && y >= minY;

let highestY = 0;

function hitsArea(xVel: number, yVel: number): boolean {
  let currHighestY = 0;

  let currXVel = xVel;
  let currYVel = yVel;
  let currX = 0;
  let currY = 0;
  while (currX <= maxX && currY >= minY) {
    if (inArea(currX, currY)) {
      highestY = Math.max(highestY, currHighestY);
      return true;
    }
    currX += currXVel;
    currY += currYVel;
    if (currXVel !== 0) {
      currXVel -= currXVel > 0 ? 1 : -1;
    }
    currYVel -= 1;
    currHighestY = Math.max(currHighestY, currY);
  }
  return false;
}

// Velocities to hit the area
const minXVelocity = Math.floor(Math.sqrt(minX * 2));
const maxYVelocity = maxX;

let found = false;

let hits = 0;
for (let x = minXVelocity; x <= maxX; x++) {
  // Lower y bound can be sharper for part 1
  for (let y = maxYVelocity; y >= minY; y--) {
    if (hitsArea(x, y)) {
      hits++;
      found = true;
    }
  }
}

console.log(highestY);
console.log(hits);
