import { asList } from "../utils/inputReader";

const input = asList("input").map((val) => val.split(""));

const illegalScoresMap: Record<Closer, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const realScoresMap: Record<Closer, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

type Opener = string;
type Closer = string;

const openers: Opener[] = ["{", "[", "(", "<"];

const closerMap: Record<Opener, string> = {
  "(": ")",
  "{": "}",
  "[": "]",
  "<": ">",
};

let illegalScore = 0;
let realScores: number[] = [];

for (const line of input) {
  const expectedClosers = [];
  let illegal = false;
  for (const el of line) {
    if (openers.includes(el)) {
      expectedClosers.push(closerMap[el]);
    } else {
      const expected = expectedClosers.pop();
      if (expected !== el) {
        illegalScore += illegalScoresMap[el];
        illegal = true;
        break;
      }
    }
  }
  if (!illegal) {
    let realScore = 0;
    for (const closer of expectedClosers.reverse()) {
      realScore *= 5;
      realScore += realScoresMap[closer];
    }
    realScores.push(realScore);
  }
}
realScores.sort((a, b) => a - b);

console.log(illegalScore);

console.log(realScores[Math.floor(realScores.length / 2)]);
