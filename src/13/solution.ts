import { asList } from "../utils/inputReader";

const input = asList("input");

interface Pixel {
  x: number;
  y: number;
}

const pixels: Pixel[] = [];

const blank = input.indexOf("");
for (let i = 0; i < blank; i++) {
  const parts = input[i].split(",");
  pixels.push({ x: Number(parts[0]), y: Number(parts[1]) });
}

function xFold(limit: number): void {
  const toRemove: Pixel[] = [];
  for (const pixel of pixels) {
    if (pixel.x > limit) {
      pixel.x = limit - (pixel.x - limit);
    } else if (pixel.x === limit) {
      toRemove.push(pixel);
    }
  }
}

function yFold(limit: number): void {
  const toRemove: Pixel[] = [];
  for (const pixel of pixels) {
    if (pixel.y > limit) {
      pixel.y = limit - (pixel.y - limit);
    } else if (pixel.y === limit) {
      toRemove.push(pixel);
    }
  }
}

for (let i = blank + 1; i < input.length; i++) {
  const parts = input[i].substring(11).split("=");
  if (parts[0] === "x") {
    xFold(Number(parts[1]));
  } else {
    yFold(Number(parts[1]));
  }
  break;
}

const dotSet: Set<string> = new Set();

for (const pixel of pixels) {
  dotSet.add(`${pixel.x}.${pixel.y}`);
}

console.log(dotSet.size);

for (let i = blank + 2; i < input.length; i++) {
  const parts = input[i].substring(11).split("=");
  if (parts[0] === "x") {
    xFold(Number(parts[1]));
  } else {
    yFold(Number(parts[1]));
  }
}

const maxX = pixels.reduce((prev, pixel) => Math.max(prev, pixel.x), 0);
const maxY = pixels.reduce((prev, pixel) => Math.max(prev, pixel.y), 0);

for (let y = 0; y <= maxY; y++) {
  let line = "";
  for (let x = 0; x <= maxX; x++) {
    if (pixels.find((val) => val.x === x && val.y === y)) {
      line += "█";
    } else {
      line += " ";
    }
  }
  console.log(line);
}
