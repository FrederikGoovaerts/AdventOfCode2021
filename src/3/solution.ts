import { asList } from "../utils/inputReader";

const input = asList("input").map((line) => line.split(""));

let gamma = "";
let epsilon = "";

for (let j = 0; j < input[0].length; j++) {
  let zeroCount = 0;
  let oneCount = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i][j] === "1") {
      oneCount++;
    } else {
      zeroCount++;
    }
  }
  if (oneCount > zeroCount) {
    gamma += "1";
    epsilon += "0";
  } else {
    gamma += "0";
    epsilon += "1";
  }
}

console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));

function findVal(input: string[][], biggest = true): string {
  let candidates = input;

  for (let j = 0; j < candidates[0].length; j++) {
    let zeroCount = 0;
    let oneCount = 0;
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i][j] === "1") {
        oneCount++;
      } else {
        zeroCount++;
      }
    }
    let newCandidates: string[][];
    if (biggest) {
      if (oneCount >= zeroCount) {
        newCandidates = candidates.filter((can) => can[j] === "1");
      } else {
        newCandidates = candidates.filter((can) => can[j] === "0");
      }
    } else {
      if (zeroCount > oneCount) {
        newCandidates = candidates.filter((can) => can[j] === "1");
      } else {
        newCandidates = candidates.filter((can) => can[j] === "0");
      }
    }
    if (newCandidates.length === 1) {
      return newCandidates[0].join("");
    } else if (newCandidates.length > 1) {
      candidates = newCandidates;
    }
  }
  throw new Error("no result");
}

let ox = findVal(input);
let co = findVal(input, false);

console.log(
  parseInt(ox, 2) * parseInt(co, 2)
);
