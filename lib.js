const { URL } = require("url");

const axios = require("axios");
const ms = require("ms");

const baseURL = "https://fx-breach-alerts.herokuapp.com/";

const client = axios.create({
  baseURL
});

async function getBreaches(apiPath = "/hibp/breaches") {
  let avgDiff = 0;
  const {data: breaches} = await client.get(apiPath, {
    transformResponse(data) {
      const breaches = JSON.parse(data);
      return breaches.map(breach => {
        breach.BreachDate = new Date(breach.BreachDate);
        breach.AddedDate = new Date(breach.AddedDate);
        if (breach.ModifiedDate) {
          breach.ModifiedDate = new Date(breach.ModifiedDate);
        }
        breach.AddedDiff = parseInt(ms(breach.AddedDate - breach.BreachDate), 10);
        breach.LogoPath = new URL(
          `/img/logos/${breach.LogoPath}`,
          baseURL
        ).href;
        avgDiff += breach.AddedDiff;

        return breach;
      });
    }
  });
  return {
    breaches,
    avgDiff: avgDiff / breaches.length
  };
}

exports.getBreaches = getBreaches;
