import { asList } from "../utils/inputReader";

const input = asList("input");

let uniqueLengthCount = 0;

for (const line of input) {
  const lineParts = line.split(" | ");
  const results = lineParts[1].split(" ");
  uniqueLengthCount += results.filter((val) =>
    [2, 3, 4, 7].includes(val.length)
  ).length;
}

console.log(uniqueLengthCount);

let readingCount = 0;

function allIn(a: string[], b: string[]): boolean {
  return a.find((val) => !b.includes(val)) === undefined;
}

for (const line of input) {
  const lineParts = line.split(" | ");
  let inputs = lineParts[0].split(" ").map((val) => val.split("").sort());
  // get trivial ones
  const one = inputs.find((val) => val.length === 2)!;
  const four = inputs.find((val) => val.length === 4)!;
  const seven = inputs.find((val) => val.length === 3)!;
  const eight = inputs.find((val) => val.length === 7)!;
  inputs = inputs.filter((val) => ![one, four, seven, eight].includes(val));
  // Nine overlaps four
  const nine = inputs.find((val) => allIn(four, val))!;
  inputs = inputs.filter((val) => val !== nine);
  // Zero overlaps seven and is length 6
  const zero = inputs.find((val) => val.length === 6 && allIn(seven, val))!;
  inputs = inputs.filter((val) => val !== zero);
  // Six is length 6
  const six = inputs.find((val) => val.length === 6)!;
  inputs = inputs.filter((val) => val !== six);
  // Five overlaps six
  const five = inputs.find((val) => allIn(val, six))!;
  inputs = inputs.filter((val) => val !== five);
  // Three overlaps nine
  const three = inputs.find((val) => allIn(val, nine))!;
  inputs = inputs.filter((val) => val !== three);
  // Two remains
  const two = inputs[0];
  const numberArray = [
    zero,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
  ].map((val) => val.join(""));

  const resultString = lineParts[1]
    .split(" ")
    .map((val) => numberArray.indexOf(val.split("").sort().join("")))
    .join("");
  readingCount += parseInt(resultString);
}

console.log(readingCount);
