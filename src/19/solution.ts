import { asList } from "../utils/inputReader";

const input = asList("input");

interface Beacon {
  x: number;
  y: number;
  z: number;
}

const serBeacon = (beacon: Beacon) => `${beacon.x}.${beacon.y}.${beacon.z}`;

function euclideanDistance(b1: Beacon, b2: Beacon): number {
  return Math.sqrt(
    Math.pow(b1.x - b2.x, 2) +
      Math.pow(b1.y - b2.y, 2) +
      Math.pow(b1.z - b2.z, 2)
  );
}

function manhattanDistance(b1: Beacon, b2: Beacon): number {
  return Math.abs(b1.x - b2.x) + Math.abs(b1.y - b2.y) + Math.abs(b1.z - b2.z);
}

interface RotateConfig {
  xyz: [0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2];
  negX: boolean;
  negY: boolean;
  negZ: boolean;
}

// All of this rotate stuff is handcrafted, sure hope it works

const turnConfigAroundX = (r: RotateConfig): RotateConfig[] => [
  r,
  {
    xyz: [r.xyz[0], r.xyz[2], r.xyz[1]],
    negX: r.negX,
    negY: r.negY,
    negZ: !r.negZ,
  },
  {
    xyz: [r.xyz[0], r.xyz[1], r.xyz[2]],
    negX: r.negX,
    negY: !r.negY,
    negZ: !r.negZ,
  },
  {
    xyz: [r.xyz[0], r.xyz[2], r.xyz[1]],
    negX: r.negX,
    negY: !r.negY,
    negZ: r.negZ,
  },
];

const baseConfigs: RotateConfig[] = [
  // X faces up
  { xyz: [0, 1, 2], negX: false, negY: false, negZ: false },
  // X turns to the back
  { xyz: [1, 0, 2], negX: false, negY: true, negZ: false },
  // X turns to the front
  { xyz: [1, 0, 2], negX: true, negY: false, negZ: false },
  // X turns right
  { xyz: [2, 1, 0], negX: true, negY: false, negZ: false },
  // X turns left
  { xyz: [2, 1, 0], negX: false, negY: false, negZ: true },
  // X faces down (turn along Z axis)
  { xyz: [0, 1, 2], negX: true, negY: true, negZ: false },
];

const configs = [
  ...turnConfigAroundX(baseConfigs[0]),
  ...turnConfigAroundX(baseConfigs[1]),
  ...turnConfigAroundX(baseConfigs[2]),
  ...turnConfigAroundX(baseConfigs[3]),
  ...turnConfigAroundX(baseConfigs[4]),
  ...turnConfigAroundX(baseConfigs[5]),
];

function transformBeacon(beacon: Beacon, config: RotateConfig): Beacon {
  const coords = [beacon.x, beacon.y, beacon.z];
  const result = {
    x: coords[config.xyz[0]],
    y: coords[config.xyz[1]],
    z: coords[config.xyz[2]],
  };
  result.x *= config.negX ? -1 : 1;
  result.y *= config.negY ? -1 : 1;
  result.z *= config.negZ ? -1 : 1;
  return result;
}

// Parse

let currScanner = 0;
let scannersToPlace: number[] = [];
const beacons: Beacon[][] = [[]];

for (const line of input.slice(1)) {
  if (line === "") {
    continue;
  } else if (line.startsWith("---")) {
    currScanner++;
    scannersToPlace.push(currScanner);
    beacons.push([]);
  } else {
    const coords = line.split(",").map(Number);
    beacons[currScanner].push({ x: coords[0], y: coords[1], z: coords[2] });
  }
}

const zeroBeacons = beacons[0];
const idMap = new Map<string, number>();

for (let i = 0; i < zeroBeacons.length; i++) {
  const beacon = zeroBeacons[i];
  idMap.set(serBeacon(beacon), i);
}

const distMap = new Map<number, [number, number]>();

function recalcZeroDists() {
  distMap.clear();
  for (let i = 0; i < zeroBeacons.length; i++) {
    for (let j = i + 1; j < zeroBeacons.length; j++) {
      const first = zeroBeacons[i];
      const second = zeroBeacons[j];
      const dist = euclideanDistance(first, second);
      distMap.set(dist, [
        idMap.get(serBeacon(first))!,
        idMap.get(serBeacon(second))!,
      ]);
    }
  }
}
recalcZeroDists();

const scannerOffsets: Map<number, { config: RotateConfig; offset: Beacon }> =
  new Map();

function checkProjectedExisting(
  beacon: Beacon,
  candidate: number,
  allBeacons: Beacon[],
  scanner: number
): boolean {
  const target = zeroBeacons[candidate];
  for (const config of configs) {
    const transformed = transformBeacon(beacon, config);
    const offset = {
      x: -transformed.x + target.x,
      y: -transformed.y + target.y,
      z: -transformed.z + target.z,
    };
    const transformedBeacons = allBeacons
      .map((b) => transformBeacon(b, config))
      .map((b) => ({
        x: b.x + offset.x,
        y: b.y + offset.y,
        z: b.z + offset.z,
      }));
    let count = 0;
    for (const t of transformedBeacons) {
      if (idMap.has(serBeacon(t))) {
        count++;
      }
    }
    if (count >= 8) {
      scannerOffsets.set(scanner, { config, offset });
      for (const t of transformedBeacons) {
        const ser = serBeacon(t);
        if (!idMap.has(ser)) {
          idMap.set(ser, zeroBeacons.length);
          zeroBeacons.push(t);
        }
      }
      return true;
    }
  }

  return false;
}

while (scannersToPlace.length > 0) {
  for (const scanner of scannersToPlace) {
    const scannerBeacons = beacons[scanner];
    let fixed = false;

    for (let i = 0; i < scannerBeacons.length && !fixed; i++) {
      for (let j = i + 1; j < scannerBeacons.length && !fixed; j++) {
        const first = scannerBeacons[i];
        const second = scannerBeacons[j];
        const dist = euclideanDistance(first, second);
        const candidates = distMap.get(dist);
        if (candidates) {
          if (
            checkProjectedExisting(
              first,
              candidates[0],
              scannerBeacons,
              scanner
            ) ||
            checkProjectedExisting(
              first,
              candidates[1],
              scannerBeacons,
              scanner
            )
          ) {
            scannersToPlace = scannersToPlace.filter((val) => val !== scanner);
            fixed = true;
          }
        }
      }
    }
    recalcZeroDists();
  }
}

console.log(zeroBeacons.length);

let highest = 0;

const offsets = [
  { x: 0, y: 0, z: 0 },
  ...[...scannerOffsets.values()].map((val) => val.offset),
];
for (let i = 0; i < offsets.length; i++) {
  for (let j = i + 1; j < offsets.length; j++) {
    const first = offsets[i];
    const second = offsets[j];
    highest = Math.max(highest, manhattanDistance(first, second));
  }
}

console.log(highest);
