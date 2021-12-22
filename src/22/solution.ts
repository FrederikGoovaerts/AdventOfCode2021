import { asList } from "../utils/inputReader";

const input = asList("input");

function parseCuboid(cuboidString: string): Cuboid {
  const temp = cuboidString.split(/,(y|z)=/);
  const [[xMin, xMax], _yMarker, [yMin, yMax], _zMarker, [zMin, zMax]] =
    temp.map((val) => val.split("..").map(Number));
  return { xMin, xMax, yMin, yMax, zMin, zMax };
}

const operations: Operation[] = input.map((line) => {
  const parts = line.split(" x=");
  const cmd = parts[0] as Command;
  const cub = parseCuboid(parts[1]);
  return { cmd, cub };
});

// Quick filter
const part1Operations = operations.filter(
  (op) =>
    Math.abs(op.cub.xMin) <= 50 &&
    Math.abs(op.cub.xMax) <= 50 &&
    Math.abs(op.cub.yMin) <= 50 &&
    Math.abs(op.cub.yMax) <= 50 &&
    Math.abs(op.cub.zMin) <= 50 &&
    Math.abs(op.cub.zMax) <= 50
);

interface Operation {
  cmd: Command;
  cub: Cuboid;
}

type Command = "on" | "off";

interface Cuboid {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
}

function getBlocks(a: Cuboid): number {
  return (a.xMax - a.xMin + 1) * (a.yMax - a.yMin + 1) * (a.zMax - a.zMin + 1);
}

function isIn(a: Cuboid, b: Cuboid): boolean {
  return (
    a.xMax <= b.xMax &&
    a.xMin >= b.xMin &&
    a.yMax <= b.yMax &&
    a.yMin >= b.yMin &&
    a.zMax <= b.zMax &&
    a.zMin >= b.zMin
  );
}

// Resulting cuboids when b is removed from a
// Resulting cuboids, e.g. for a contained b are
function diff(a: Cuboid, b: Cuboid): Cuboid[] {
  if (isIn(a, b)) {
    return [];
  }
  const intersection = getIntersection(a, b);
  if (!intersection) {
    return [a];
  }
  const result: Cuboid[] = [];
  //Create largest slabs on X axis
  if (intersection.xMin > a.xMin) {
    result.push({
      ...a,
      xMax: intersection.xMin - 1,
    });
  }
  if (intersection.xMax < a.xMax) {
    result.push({
      ...a,
      xMin: intersection.xMax + 1,
    });
  }
  //Create smaller slabs on Y axis, touching X-axis slabs
  if (intersection.yMin > a.yMin) {
    result.push({
      ...a,
      xMin: intersection.xMin,
      xMax: intersection.xMax,
      yMax: intersection.yMin - 1,
    });
  }
  if (intersection.yMax < a.yMax) {
    result.push({
      ...a,
      xMin: intersection.xMin,
      xMax: intersection.xMax,
      yMin: intersection.yMax + 1,
    });
  }
  //Create smallest slabs on Z axis
  if (intersection.zMin > a.zMin) {
    result.push({
      ...a,
      xMin: intersection.xMin,
      xMax: intersection.xMax,
      yMin: intersection.yMin,
      yMax: intersection.yMax,
      zMax: intersection.zMin - 1,
    });
  }
  if (intersection.zMax < a.zMax) {
    result.push({
      ...a,
      xMin: intersection.xMin,
      xMax: intersection.xMax,
      yMin: intersection.yMin,
      yMax: intersection.yMax,
      zMin: intersection.zMax + 1,
    });
  }

  return result;
}

function getIntersection(a: Cuboid, b: Cuboid): Cuboid | undefined {
  if (
    a.xMax < b.xMin ||
    b.xMax < a.xMin ||
    a.yMax < b.yMin ||
    b.yMax < a.yMin ||
    a.zMax < b.zMin ||
    b.zMax < a.zMin
  ) {
    return undefined;
  }
  return {
    xMin: Math.max(a.xMin, b.xMin),
    xMax: Math.min(a.xMax, b.xMax),
    yMin: Math.max(a.yMin, b.yMin),
    yMax: Math.min(a.yMax, b.yMax),
    zMin: Math.max(a.zMin, b.zMin),
    zMax: Math.min(a.zMax, b.zMax),
  };
}

function runFor(operations: Operation[]) {
  let onCubes: Cuboid[] = [];

  for (const operation of operations) {
    const curr = operation.cub;
    const newOnCubes: Cuboid[] = [];
    for (const cube of onCubes) {
      const theDiff = diff(cube, curr);
      newOnCubes.push(...theDiff);
    }
    if (operation.cmd === "on") {
      newOnCubes.push(curr);
    }
    onCubes = newOnCubes;
  }

  console.log(onCubes.map(getBlocks).reduce((a, b) => a + b, 0));
}

runFor(part1Operations);
runFor(operations);
