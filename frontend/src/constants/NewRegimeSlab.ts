import { Slab } from "./Slab";

export const newRegimeTaxSlabs: Array<Slab> = [
  { llimit: 0, ulimit: 750000, addition: 0, rate: 0 },
  { llimit: 750000, ulimit: 900000, addition: 15000, rate: 0.1 },
  { llimit: 900000, ulimit: 1200000, addition: 45000, rate: 0.15 },
  { llimit: 1200000, ulimit: 1500000, addition: 90000, rate: 0.2 },
  { llimit: 1500000, ulimit: 100000000, addition: 150000, rate: 0.3 },
];
