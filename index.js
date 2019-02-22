#!/usr/bin/env node

const {getBreaches} = require("./lib");

async function main(count=20) {
  const {avgDiff, breaches} = await getBreaches();

  console.log("| TITLE | BREACH DATE | ADDED DATE | DIFF |\n|:------|------------:|-----------:|-----:|");
  breaches
    .sort((itemA, itemB) => itemB.AddedDiff - itemA.AddedDiff)
    .slice(0, count)
    .forEach(breach => {
      let diff = `${breach.AddedDiff}d`;

      if (breach.AddedDiff > 365) {
        diff = `${(breach.AddedDiff / 365).toFixed(2)}y`;
      }

      const output = [
        breach.Title,
        breach.BreachDate.toLocaleDateString(),
        breach.AddedDate.toLocaleDateString(),
        diff
      ];
      console.log(output.join(" | "));
    });

  console.log(`\n\nAvg breach->added: ${avgDiff.toFixed(2)}d`);
}

main();
