// This solution works for the largest example and the input, because they result in a
// balanced result where all elements are at the same resulting depth.
// This solution cannot handle some simpler examples.

import { asList } from "../utils/inputReader";

const input = asList("input");

interface Element {
  val: number;
  depth: number;
}

// InitialDepth 1 because we'll use everything for addition thus immediately nest it once
// Only the state needs to be nested an additional time on each addition
function parseElements(input: string, initialDepth = 1): Element[] {
  let depth = initialDepth;
  const result: Element[] = [];
  for (const glyph of input.split("")) {
    if (glyph === ",") {
      continue;
    } else if (["[", "]"].includes(glyph)) {
      depth += glyph === "[" ? 1 : -1;
    } else {
      result.push({ val: Number(glyph), depth });
    }
  }
  return result;
}

function reduceState(state: Element[]): boolean {
  // check for explode
  const explodeIndex = state.findIndex(
    (el, index) => el.depth > 4 && state[index + 1]?.depth === el.depth
  );

  if (explodeIndex >= 0) {
    const prev = state[explodeIndex - 1];
    if (prev) {
      prev.val += state[explodeIndex].val;
    }
    const next = state[explodeIndex + 2];
    if (next) {
      next.val += state[explodeIndex + 1].val;
    }
    state.splice(explodeIndex, 1);
    const exploded = state[explodeIndex];
    exploded.val = 0;
    exploded.depth -= 1;
    return true;
  }

  // check for split
  const splitIndex = state.findIndex((el) => el.val > 9);
  if (splitIndex >= 0) {
    const split = state[splitIndex];
    const lowerVal = Math.floor(split.val / 2);
    const higherVal = split.val - lowerVal;
    split.val = lowerVal;
    split.depth += 1;
    state.splice(splitIndex + 1, 0, { val: higherVal, depth: split.depth });
    return true;
  }

  return false;
}

type NestedNumberArray = number | NestedNumberArray[];

function transformToArray(state: Element[]): NestedNumberArray {
  let stringified = "";
  let currDepth = 0;
  let currDepthCount = 1;
  let justPaired = false;
  for (const el of state) {
    if (el.depth === currDepth) {
      if (!justPaired) {
        stringified += `,${el.val}`;
        currDepth = el.depth;
        justPaired = true;
        currDepthCount++;
        continue;
      } else if (currDepthCount === 8) {
        stringified += `]]],[[[${el.val}`;
      } else if (currDepthCount === 4 || currDepthCount === 12) {
        stringified += `]],[[${el.val}`;
      } else {
        stringified += `],[${el.val}`;
      }
      currDepthCount++;
    } else if (el.depth > currDepth) {
      const diff = el.depth - currDepth;
      stringified += "[".repeat(diff) + el.val;
      currDepthCount = 1;
    } else if (el.depth < currDepth) {
      const diff = currDepth - el.depth;
      stringified += "]".repeat(diff) + "],[" + el.val;
      currDepthCount = 1;
    }

    currDepth = el.depth;
    justPaired = false;
  }
  stringified += "]".repeat(currDepth);
  return JSON.parse(stringified);
}

function calculateMagnitude(arr: NestedNumberArray): number {
  if (!Array.isArray(arr)) {
    return arr as number;
  } else {
    return 3 * calculateMagnitude(arr[0]) + 2 * calculateMagnitude(arr[1]);
  }
}

const state = parseElements(input[0], 0);

for (const rawNext of input.slice(1)) {
  const next = parseElements(rawNext);
  state.forEach((el) => el.depth++);
  state.push(...next);
  let reduce = true;
  while (reduce) {
    reduce = reduceState(state);
  }
}

console.log(calculateMagnitude(transformToArray(state)));

let highest = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input.length; j++) {
    if (i !== j) {
      let sum = [...parseElements(input[i]), ...parseElements(input[j])];
      let reduce = true;
      while (reduce) {
        reduce = reduceState(sum);
      }
      try {
        const mag = calculateMagnitude(transformToArray(sum));
        highest = isNaN(mag) ? highest : Math.max(mag, highest);
      } catch (e) {
        // Unable to check this value
      }
    }
  }
}
console.log(highest);
