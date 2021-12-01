import { asNumberList } from "../utils/inputReader";

const input = asNumberList();

let curr: number | undefined = undefined;
let count = 0;
for (const num of input) {
    if (curr !== undefined && num > curr) {
        count++;
    }
    curr = num;
}
console.log(count);

curr = undefined;
count = 0;
for (let i = 0; i < input.length - 2; i++) {
    const num = input[i] + input[i + 1] + input[i + 2];
    if (curr !== undefined && num > curr) {
        count++;
    }
    curr = num;
}
console.log(count);

