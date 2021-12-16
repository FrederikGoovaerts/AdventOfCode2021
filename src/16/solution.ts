import { asIs } from "../utils/inputReader";

const rawInput = asIs("input");
let input = "";
for (let i = 0; i < rawInput.length; i++) {
  input += parseInt(rawInput[i], 16).toString(2).padStart(4, "0");
}

interface Packet {
  version: string;
  type: string;
  start: number;
  end: number;
  value: number;
}

enum OPERATOR {
  SUM = "000",
  PROD = "001",
  MIN = "010",
  MAX = "011",
  GRT = "101",
  LT = "110",
  EQ = "111",
}

let totalVersion = 0;

function parsePacket(start: number): Packet {
  const version = input.slice(start, start + 3);
  totalVersion += parseInt(version, 2);
  const type = input.slice(start + 3, start + 6);

  if (type === "100") {
    // Literal value
    let value = "";
    let currIndex = start + 6;
    while (input[currIndex] === "1") {
      value += input.slice(currIndex + 1, currIndex + 5);
      currIndex += 5;
    }
    value += input.slice(currIndex + 1, currIndex + 5);

    return {
      version,
      type,
      start,
      end: currIndex + 4,
      value: parseInt(value, 2),
    };
  } else {
    // Operator
    const lengthType = input[start + 6];
    let subStart;

    const subs: Packet[] = [];
    if (lengthType === "0") {
      // 15 bits of total length
      const length = parseInt(input.slice(start + 7, start + 22), 2);
      subStart = start + 22;
      const subsEnd = start + 22 + length;
      while (subStart < subsEnd) {
        const sub = parsePacket(subStart);
        subStart = sub.end + 1;
        subs.push(sub);
      }
    } else {
      // 11 bits of nb of subpackets
      const nb = parseInt(input.slice(start + 7, start + 18), 2);
      subStart = start + 18;
      for (let i = 1; i <= nb; i++) {
        const sub = parsePacket(subStart);
        subs.push(sub);
        subStart = sub.end + 1;
      }
    }
    let value: number = 0;
    switch (type) {
      case OPERATOR.SUM: {
        value = subs.map((val) => val.value).reduce((a, b) => a + b, 0);
        break;
      }
      case OPERATOR.PROD: {
        value = subs.map((val) => val.value).reduce((a, b) => a * b, 1);
        break;
      }
      case OPERATOR.MIN: {
        value = Math.min(...subs.map((val) => val.value));
        break;
      }
      case OPERATOR.MAX: {
        value = Math.max(...subs.map((val) => val.value));
        break;
      }
      case OPERATOR.GRT: {
        value = subs[0].value > subs[1].value ? 1 : 0;
        break;
      }
      case OPERATOR.LT: {
        value = subs[0].value < subs[1].value ? 1 : 0;
        break;
      }
      case OPERATOR.EQ: {
        value = subs[0].value === subs[1].value ? 1 : 0;
        break;
      }
    }

    return { version, type, start, end: subStart - 1, value };
  }
}

const parsedRoot = parsePacket(0);
console.log(totalVersion);
console.log(parsedRoot.value);
