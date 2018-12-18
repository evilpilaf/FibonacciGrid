export type Cell = {
  readonly coordinates: [number, number];
  status: "clean" | "clicked" | "found";
  value: number;
};
