import { asList } from "../utils/inputReader";

const input = asList("input");

interface Element {
  parent: Element | undefined;
  val: [Element, Element] | number;
}

type NestedNumberArray = number | [NestedNumberArray, NestedNumberArray];

function constructNode(child1: Element, child2: Element): Element {
  const temp = {
    parent: undefined,
    val: [child1, child2] as [Element, Element],
  };

  temp.val.forEach((val) => (val.parent = temp));

  return temp as Element;
}

function parseElements(
  input: NestedNumberArray,
  parent: Element | undefined = undefined
): Element {
  if (!Array.isArray(input)) {
    return { parent, val: input };
  }
  const result = constructNode(
    parseElements(input[0]),
    parseElements(input[1])
  );
  result.parent = parent;

  return result;
}

function serState(state: Element): string {
  if (!Array.isArray(state.val)) {
    return `${state.val}`;
  }
  return `[${serState(state.val[0])},${serState(state.val[1])}]`;
}

const printState = (state: Element) => console.log(serState(state));

function addLeft(el: Element, val: number): void {
  const parent = el.parent;
  if (!parent) {
    return;
  }
  const parentVals = parent.val as [Element, Element];
  if (parentVals[1] === el) {
    let candidate = parentVals[0];
    while (Array.isArray(candidate.val)) {
      candidate = candidate.val[1];
    }
    candidate.val += val;
  } else {
    addLeft(parent, val);
  }
}

function addRight(el: Element, val: number): void {
  const parent = el.parent;
  if (!parent) {
    return;
  }
  const parentVals = parent.val as [Element, Element];
  if (parentVals[0] === el) {
    let candidate = parentVals[1];
    while (Array.isArray(candidate.val)) {
      candidate = candidate.val[0];
    }
    candidate.val += val;
  } else {
    addRight(parent, val);
  }
}

function explode(el: Element, depth: number = 1): boolean {
  if (!Array.isArray(el.val)) {
    return false;
  }
  if (depth === 5) {
    addLeft(el, el.val[0].val as number); // Order of operations does not allow deeper nesting
    addRight(el, el.val[1].val as number); // Order of operations does not allow deeper nesting
    el.val = 0;
    return true;
  }
  return explode(el.val[0], depth + 1) || explode(el.val[1], depth + 1);
}

function split(el: Element): boolean {
  if (!Array.isArray(el.val)) {
    if (el.val >= 10) {
      const lowerVal = Math.floor(el.val / 2);
      const higherVal = el.val - lowerVal;
      el.val = [
        { parent: el, val: lowerVal },
        { parent: el, val: higherVal },
      ];
      return true;
    }
    return false;
  }
  return split(el.val[0]) || split(el.val[1]);
}

function reduceState(state: Element): boolean {
  return explode(state) || split(state);
}

function calculateMagnitude(el: Element): number {
  if (!Array.isArray(el.val)) {
    return el.val;
  } else {
    return (
      3 * calculateMagnitude(el.val[0]) + 2 * calculateMagnitude(el.val[1])
    );
  }
}

let state = parseElements(JSON.parse(input[0]));

for (const rawNext of input.slice(1)) {
  const next = parseElements(JSON.parse(rawNext));
  state = constructNode(state, next);
  let reduce = true;
  while (reduce) {
    reduce = reduceState(state);
  }
}

console.log(calculateMagnitude(state));

let highest = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input.length; j++) {
    if (i !== j) {
      let sum = constructNode(
        parseElements(JSON.parse(input[i])),
        parseElements(JSON.parse(input[j]))
      );
      let reduce = true;
      while (reduce) {
        reduce = reduceState(sum);
      }
      const mag = calculateMagnitude(sum);
      highest = Math.max(mag, highest);
    }
  }
}
console.log(highest);
