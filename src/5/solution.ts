import { asList } from "../utils/inputReader";

const input = asList("input");

interface Line {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface Point {
  x: number;
  y: number;
}

function serializePoint(point: Point): string {
  return `${point.x}.${point.y}`;
}

function parseLine(line: string): Line {
  const parts = line.split(" -> ");
  const parts1 = parts[0].split(",");
  const parts2 = parts[1].split(",");
  return {
    x1: Number(parts1[0]),
    y1: Number(parts1[1]),
    x2: Number(parts2[0]),
    y2: Number(parts2[1]),
  };
}

function getNonDiagonal(lines: Line[]): Line[] {
  return lines.filter((line) => line.x1 === line.x2 || line.y1 === line.y2);
}

function visualizeExample(coverage: Record<string, number>): void {
  for (let y = 0; y <= 9; y++) {
    let line = "";
    for (let x = 0; x <= 9; x++) {
      line += coverage[serializePoint({ x, y })] ?? ".";
    }
    console.log(line);
  }
}

function getCoveredPoints(line: Line): Point[] {
  const xSame = line.x1 === line.x2;
  const xAscending = line.x1 < line.x2;
  const ySame = line.y1 === line.y2;
  const yAscending = line.y1 < line.y2;

  const xChange = xSame ? 0 : xAscending ? 1 : -1;
  const yChange = ySame ? 0 : yAscending ? 1 : -1;

  const result: Point[] = [];
  for (
    let x = line.x1, y = line.y1;
    x !== line.x2 || y !== line.y2;
    x += xChange, y += yChange
  ) {
    result.push({ x, y });
  }
  result.push({ x: line.x2, y: line.y2 });
  return result;
}

const straightLines = getNonDiagonal(input.map(parseLine));

let coverage: Record<string, number> = {};

for (const line of straightLines) {
  for (const point of getCoveredPoints(line)) {
    coverage[serializePoint(point)] =
      (coverage[serializePoint(point)] ?? 0) + 1;
  }
}

console.log(Object.values(coverage).filter((val) => val > 1).length);

const lines = input.map(parseLine);
coverage = {};

for (const line of lines) {
  for (const point of getCoveredPoints(line)) {
    coverage[serializePoint(point)] =
      (coverage[serializePoint(point)] ?? 0) + 1;
  }
}

console.log(Object.values(coverage).filter((val) => val > 1).length);
