// Visualization of "ids" for the locations used in this solution:
//
// 01X3X5X7X9[10] <- Hallway
//   0 1 2 3   <- rooms
//
// The spots marked with X are not usable, so are not modeled. The
// logic should keep in mind this extra step of moving in and out of
// a room.

import { Amphi, State } from "./types";
import isEqual from "lodash/isEqual";

function deepCopyState(state: State): State {
  return {
    spent: state.spent,
    hall: [...state.hall],
    rooms: state.rooms.map((room) => room.map((el) => el)) as State["rooms"],
  };
}

const createAmphi = (id: 0 | 1 | 2 | 3) => ({ id, cost: Math.pow(10, id) });

const hallwaySpots = [0, 1, 3, 5, 7, 9, 10];
const getRoomExit = (room: number) => room * 2 + 2;

const createBaseState = (rooms: (0 | 1 | 2 | 3)[][]): State => ({
  spent: 0,
  hall: [undefined, undefined, undefined, undefined, undefined, undefined],
  rooms: rooms.map((room) => room.map(createAmphi)) as State["rooms"],
});

const exampleState = createBaseState([
  [1, 0],
  [2, 3],
  [1, 2],
  [3, 0],
]);

const exampleState2 = createBaseState([
  [1, 3, 3, 0],
  [2, 2, 1, 3],
  [1, 1, 0, 2],
  [3, 0, 2, 0],
]);

const inputState = createBaseState([
  [3, 2],
  [1, 2],
  [1, 3],
  [0, 0],
]);

const inputState2 = createBaseState([
  [3, 3, 3, 2],
  [1, 2, 1, 2],
  [1, 1, 0, 3],
  [0, 0, 2, 0],
]);

function moveFromRoom(state: State, room: 0 | 1 | 2 | 3): State[] {
  const currentRoom = state.rooms[room];
  if (!currentRoom.find((val) => val && val.id !== room)) {
    return [];
  }
  const result: State[] = [];

  const moveIndex = currentRoom.findIndex((val) => val);
  const roomExit = getRoomExit(room);
  // Spots in the hallway to the left and right of the room, in order encountered
  const roomLeft = hallwaySpots.filter((val) => val < roomExit).reverse();
  const roomRight = hallwaySpots.filter((val) => val > roomExit);

  const doMove = (hallwaySpot: number) => {
    const newState = deepCopyState(state);
    const el = newState.rooms[room][moveIndex]!;
    newState.rooms[room][moveIndex] = undefined;
    newState.hall[hallwaySpot] = el;
    newState.spent +=
      el.cost * (Math.abs(hallwaySpot - roomExit) + (moveIndex + 1));
    result.push(newState);
  };

  for (const hallwaySpot of roomLeft) {
    // We can't pass, something is already here
    if (state.hall[hallwaySpot]) break;

    doMove(hallwaySpot);
  }

  for (const hallwaySpot of roomRight) {
    // We can't pass, something is already here
    if (state.hall[hallwaySpot]) break;

    doMove(hallwaySpot);
  }

  return result;
}

function moveToRoom(state: State): State[] {
  const result: State[] = [];
  for (const hallwaySpot of hallwaySpots) {
    if (!state.hall[hallwaySpot]) {
      continue;
    }
    const el: Amphi = state.hall[hallwaySpot]!;
    // Check if there are strangers in my bedroom
    if (state.rooms[el.id].find((val) => val && val.id !== el.id)) {
      continue;
    }
    const roomExit = getRoomExit(el.id);
    let hallwaySpotsToCross: number[];
    if (hallwaySpot < roomExit) {
      hallwaySpotsToCross = hallwaySpots.filter(
        (val) => val > hallwaySpot && val < roomExit
      );
    } else {
      hallwaySpotsToCross = hallwaySpots.filter(
        (val) => val > roomExit && val < hallwaySpot
      );
    }
    // Check if anything's in the way
    if (hallwaySpotsToCross.map((val) => state.hall[val]).find((val) => val)) {
      continue;
    }
    // move as deep as possible
    let roomIndex = state.rooms[el.id].findIndex((val) => val) - 1;
    if (roomIndex < 0) {
      roomIndex = state.rooms[el.id].length - 1;
    }
    const newState = deepCopyState(state);
    newState.hall[hallwaySpot] = undefined;
    newState.rooms[el.id][roomIndex] = el;
    newState.spent +=
      el.cost * (Math.abs(hallwaySpot - roomExit) + (roomIndex + 1));
    result.push(newState);
  }

  return result;
}

function getNextStates(state: State): State[] {
  return [
    ...moveFromRoom(state, 0),
    ...moveFromRoom(state, 1),
    ...moveFromRoom(state, 2),
    ...moveFromRoom(state, 3),
    ...moveToRoom(state),
  ];
}

function addState(state: State, states: Set<State>[]): void {
  // Arbitrary estimate of upper bound based on example and input results of part 1
  if (state.spent > 60_000) {
    return;
  }
  states[state.spent] = states[state.spent] ?? new Set();
  if (![...states[state.spent]].find((val) => isEqual(state, val))) {
    states[state.spent].add(state);
  }
}

function isWon(state: State): boolean {
  return (
    state.rooms[0].findIndex((val) => !val || val.id !== 0) === -1 &&
    state.rooms[1].findIndex((val) => !val || val.id !== 1) === -1 &&
    state.rooms[2].findIndex((val) => !val || val.id !== 2) === -1 &&
    state.rooms[3].findIndex((val) => !val || val.id !== 3) === -1
  );
}

function runFor(state: State) {
  const states: Set<State>[] = [new Set([state])];

  let won = false;
  for (const set of states) {
    if (won) {
      break;
    }
    if (set === undefined) {
      continue;
    }
    for (const state of [...set]) {
      if (isWon(state)) {
        console.log(state.spent);
        won = true;
        break;
      }

      const nextStates = getNextStates(state);
      nextStates.forEach((val) => addState(val, states));
    }
    states[[...set][0].spent] = undefined!;
  }
}

// runFor(exampleState);
// runFor(exampleState2);
runFor(inputState);
runFor(inputState2);
