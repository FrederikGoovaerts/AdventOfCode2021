import { asIs } from "../utils/inputReader";

const input = asIs("input").split(",").map(Number);

const state: Record<number, number> = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
};

for (const jelly of input) {
  state[jelly]++;
}

function cycle(): void {
  const newJellies = state[0];
  for (let i = 0; i <= 7; i++) {
    state[i] = state[i + 1];
  }
  state[6] += newJellies;
  state[8] = newJellies;
}

function getAmount(): number {
  return (
    state[0] +
    state[1] +
    state[2] +
    state[3] +
    state[4] +
    state[5] +
    state[6] +
    state[7] +
    state[8]
  );
}

// Do 80 steps
for (let i = 0; i < 80; i++) {
  cycle();
}

console.log(getAmount());

// Do the remaining 176 steps to 256
for (let i = 0; i < 176; i++) {
  cycle();
}

console.log(getAmount());
