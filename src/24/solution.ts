// Values and logic transcribed from input

/*
Values below outlined for clarity
xIn  [12, 11, 13, 11, 14, -10, 11, -9, -3, 13, -5, -10, -4, -5];
yIn  [4,  11, 5,  11, 14,   7, 11,  4,  6,  5,  9,  12, 14, 14];
opIn [1,  1,  1,   1,  1,  26,  1, 26, 26,  1, 26,  26, 26, 26];

Indices with 26 as div value: 5, 7, 8, 10, 11, 12, 13
*/

const xIn = [12, 11, 13, 11, 14, -10, 11, -9, -3, 13, -5, -10, -4, -5];
const yIn = [4, 11, 5, 11, 14, 7, 11, 4, 6, 5, 9, 12, 14, 14];
const opIn = [1, 1, 1, 1, 1, 26, 1, 26, 26, 1, 26, 26, 26, 26];

export function doIteration(input: number, z: number, i: number): number {
  const x1 = (z % 26) + xIn[i];
  const z1 = Math.trunc(z / opIn[i]);
  const x2 = input === x1 ? 0 : 1;
  const y1 = x2 * 25 + 1;
  const z2 = z1 * y1;
  const y2 = (input + yIn[i]) * x2;
  return z2 + y2;
}

let states: { z: number; num: number[] }[] = [{ z: 0, num: [] }];

for (let i = 0; i < 14; i++) {
  const newStates: { z: number; num: number[] }[] = [];
  let num = states.pop();
  while (num) {
    const z = num.z;
    if (opIn[i] === 26) {
      const input = (z % 26) + xIn[i];
      if (10 > input && input > 0) {
        const newZ = doIteration(input, z, i);
        newStates.push({ num: [...num.num, input], z: newZ });
      }
    } else {
      for (let input = 1; input < 10; input++) {
        const newZ = doIteration(input, z, i);
        newStates.push({ num: [...num.num, input], z: newZ });
      }
    }

    num = states.pop();
  }
  states = newStates;
}

const validIds = states
  .filter((val) => val.z === 0)
  .map((val) => Number(val.num.join("")));

console.log(Math.max(...validIds));
console.log(Math.min(...validIds));
