import * as fs from "fs";

export const asList = (): string[] =>
  fs.readFileSync("input", "utf8").split("\n");
export const asNumberList = (): number[] => asList().map(Number);
