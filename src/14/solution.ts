import { asList } from "../utils/inputReader";

const input = asList("input");

const mapping = new Map<string, string[]>();

let curr: Record<string, bigint> = {};

const start = input[0].split("");
for (let i = 0; i < start.length - 1; i++) {
  const pair = start[i] + start[i + 1];
  curr[pair] = (curr[pair] ?? 0n) + 1n;
}

for (let i = 2; i < input.length; i++) {
  const parts = input[i].split(" -> ");
  const originParts = parts[0].split("");
  mapping.set(parts[0], [originParts[0] + parts[1], parts[1] + originParts[1]]);
}

function getNext(prev: Record<string, bigint>): Record<string, bigint> {
  const result: Record<string, bigint> = {};
  for (const entry of Object.entries(prev)) {
    const products = mapping.get(entry[0])!;
    for (const product of products) {
      result[product] = (result[product] ?? 0n) + entry[1];
    }
  }
  return result;
}

function getSolution(val: Record<string, bigint>): bigint {
  // Reduce doubles
  const singleCharCount: Record<string, bigint> = {};
  for (const entry of Object.entries(val)) {
    const parts = entry[0].split("");
    singleCharCount[parts[0]] = (singleCharCount[parts[0]] ?? 0n) + entry[1];
    singleCharCount[parts[1]] = (singleCharCount[parts[1]] ?? 0n) + entry[1];
  }
  for (const entry of Object.entries(singleCharCount)) {
    singleCharCount[entry[0]] =
      entry[1] / 2n + (entry[1] % 2n === 1n ? 1n : 0n); // Bigint variant of Math.ceil I guess
  }

  // Arbitrary value in input and example
  let currMost = "B";
  let currLeast = "B";

  for (const entry of Object.entries(singleCharCount)) {
    if (entry[1] < singleCharCount[currLeast]) {
      currLeast = entry[0];
    }
    if (entry[1] > singleCharCount[currMost]) {
      currMost = entry[0];
    }
  }

  return singleCharCount[currMost] - singleCharCount[currLeast];
}

for (let i = 0; i < 10; i++) {
  curr = getNext(curr);
}

console.log(Number(getSolution(curr)));

for (let i = 0; i < 30; i++) {
  curr = getNext(curr);
}

console.log(Number(getSolution(curr)));
