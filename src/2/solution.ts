import { asList } from "../utils/inputReader";

const input = asList("input");

function solve(useAim = false) {
  let hor = 0;
  let depth = 0;
  let aim = 0;

  for (const line of input) {
    const parts = line.split(" ");
    const command = parts[0];
    const amount = parseInt(parts[1]);

    switch (command) {
      case "forward":
        hor += amount;
        if (useAim) {
          depth += amount * aim;
        }
        break;
      case "down":
        if (useAim) {
          aim += amount;
        } else {
          depth += amount;
        }
        break;
      case "up":
        if (useAim) {
          aim -= amount;
        } else {
          depth -= amount;
        }
        break;
    }
  }
  console.log(hor * depth);
}

solve(false);
solve(true);
