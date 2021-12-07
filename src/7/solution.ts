import { asNumberLineList } from "../utils/inputReader";

const input = asNumberLineList("input");

const min = Math.min(...input);
const max = Math.max(...input);

const expensiveFuelPrices = [0];
for (let i = 1; i < max - min + 1; i++) {
  expensiveFuelPrices[i] = expensiveFuelPrices[i - 1] + i;
}

function fuelTo(pos: number, useExpensiveFuelPrices: boolean): number {
  return input
    .map((val) => Math.abs(pos - val))
    .map((val) => (useExpensiveFuelPrices ? expensiveFuelPrices[val] : val))
    .reduce((a, b) => a + b, 0);
}

function calculateFuel(useExpensiveFuelPrices: boolean): void {
  let lowestFuel = Number.MAX_SAFE_INTEGER;
  for (let dest = min; dest <= max; dest++) {
    const fuelToPos = fuelTo(dest, useExpensiveFuelPrices);
    if (fuelToPos < lowestFuel) {
      lowestFuel = fuelToPos;
    }
  }

  console.log(lowestFuel);
}

calculateFuel(false);
calculateFuel(true);
