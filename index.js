const { URL } = require("url");

const axios = require("axios");
const ms = require("ms");

const baseURL = "https://fx-breach-alerts.herokuapp.com/";

const client = axios.create({
  baseURL
});

async function main() {
  const { data: breaches } = await getBreaches();

  let avgDiff = 0;

  console.log("| TITLE | BREACH DATE | ADDED DATE | DIFF |\n|:------|------------:|-----------:|-----:|");
  breaches
    .sort((itemA, itemB) => {
      return parseInt(itemB.AddedDiff, 10) - parseInt(itemA.AddedDiff, 10);
    })
    .forEach(breach => {
      avgDiff += parseInt(breach.AddedDiff, 10);
      const str = [
        breach.Title,
        breach.BreachDate.toLocaleDateString(),
        breach.AddedDate.toLocaleDateString(),
        (parseInt(breach.AddedDiff, 10) / 365).toFixed(2) + "y"
      ];
      console.log(str.join(" | "));
    });

  console.log(`\n\nAvg breach->added: ${(avgDiff / breaches.length).toFixed(2)}d`);
}

main();

async function getBreaches(apiPath = "/hibp/breaches") {
  return client.get(apiPath, {
    transformResponse(data) {
      const breaches = JSON.parse(data);
      return breaches.map(breach => {
        breach.BreachDate = new Date(breach.BreachDate);
        breach.AddedDate = new Date(breach.AddedDate);
        if (breach.ModifiedDate) {
          breach.ModifiedDate = new Date(breach.ModifiedDate);
        }
        breach.AddedDiff = ms(breach.AddedDate - breach.BreachDate);
        breach.LogoPath = new URL(
          `/img/logos/${breach.LogoPath}`,
          baseURL
        ).href;
        return breach;
      });
    }
  });
}
