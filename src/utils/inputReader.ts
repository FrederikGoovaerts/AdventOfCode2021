import * as fs from "fs";

export const asIs = (fileName: string = "input"): string =>
  fs.readFileSync(fileName, "utf8").trim();

export const asList = (fileName: string = "input"): string[] =>
  asIs(fileName).split("\n");

export const asNumberList = (fileName: string = "input"): number[] =>
  asList(fileName).map(Number);
