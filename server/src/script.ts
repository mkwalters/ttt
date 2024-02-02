import { times } from "lodash-es";

const main = async () => {
  return times(3, (i) => {
    return `${i} hello script world`;
  });
};

const output = await main();
console.log("output", output);
