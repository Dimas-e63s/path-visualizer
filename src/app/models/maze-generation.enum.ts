export enum DirectionsEnum {
  N = 1,
  S = 2,
  E = 4,
  W = 8,
}

export const DX = new Map<DirectionsEnum, number>([
  [DirectionsEnum.E, 1],
  [DirectionsEnum.W, -1],
  [DirectionsEnum.N, 0],
  [DirectionsEnum.S, 0],
]);

export const DY = new Map<DirectionsEnum, number>([
  [DirectionsEnum.E, 0],
  [DirectionsEnum.W, 0],
  [DirectionsEnum.N, -1],
  [DirectionsEnum.S, 1],
]);

export const directions = [DirectionsEnum.N, DirectionsEnum.S, DirectionsEnum.W, DirectionsEnum.E];
