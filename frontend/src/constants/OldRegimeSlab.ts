import { Slab } from "./Slab";

export const oldRegimeTaxSlabs: Array<Slab> = [
  { llimit: 0, ulimit: 500000, addition: 0, rate: 0 },
  { llimit: 500000, ulimit: 1000000, addition: 12500, rate: 0.2 },
  { llimit: 1000000, ulimit: 1000000000, addition: 112500, rate: 0.3 },
];
