export interface Amphi {
  cost: number;
  id: 0 | 1 | 2 | 3;
}

type MaybeAmphi = Amphi | undefined;

export interface State {
  spent: number;
  hall: [
    // The 6 hallway spots, marked by their indices
    MaybeAmphi,
    MaybeAmphi,
    MaybeAmphi,
    MaybeAmphi,
    MaybeAmphi,
    MaybeAmphi
  ];
  rooms: [
    MaybeAmphi[], // Room 0
    MaybeAmphi[], // Room 1
    MaybeAmphi[], // Room 2
    MaybeAmphi[] // Room 3
  ];
}
