const { JSDOM } = require("jsdom");
const axios = require("axios");
const puppeteer = require("puppeteer");

async function crawlPage(url) {
  console.log(`Actively crawling: ${url}`);

  try {
    nextURLs = await getAnchorsFromHTML(url);
    data = await getMLBData(nextURLs);
    return data;
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page ${url}`);
  }
}

async function getAnchorsFromHTML(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll(".trk-box"));
    return anchors.map((anchor) => anchor.href);
  });

  await browser.close();
  return links;
}

async function getMLBData(arr) {
  const browser = await puppeteer.launch();
  let fullData = [];
  for (const url of arr) {
    const page = await browser.newPage();
    await page.goto(url);

    try {
      await page.waitForSelector('[id="tb-0-body row-0 col-1"]', {
        visible: true,
        timeout: 5000,
      }); // Wait up to 5 seconds
      const data = await page.evaluate(() => {
        const row_0 = document.querySelector('[id="tb-0-body row-0 col-1"]');
        const row_0_val = +row_0.querySelector(".fbtTqY").textContent;
        const row_1 = document.querySelector('[id="tb-0-body row-1 col-1"]');
        const row_1_val = +row_1.querySelector(".fbtTqY").textContent;
        let selector_away = 0;
        let selector_home = 0;
        if (row_0_val != 0) selector_away = 1;
        if (row_1_val != 0) selector_home = 1;

        let pitcher_away;
        let pitcher_home;
        const pitchers = document.querySelectorAll(".gkjKqf");
        pitchers.forEach((val, index) => {
          if (index == 0) {
            const match = val.textContent.match(/(\d+\.\d+) ERA/);
            const era = match ? match[1] : null;
            pitcher_home = +era;
          } else if (index == 1) {
            const match = val.textContent.match(/(\d+\.\d+) ERA/);
            const era = match ? match[1] : null;
            pitcher_away = +era;
          }
        });

        const awayTeamBatters = document.querySelector(".away-r1");
        const awayBatters = awayTeamBatters.querySelector("tbody");
        const awayTeam = awayBatters.querySelectorAll("tr");
        let ba_1_away;
        let ba_2_away;
        let ba_3_away;
        let ba_4_away;
        let ba_5_away;
        let ops_1_away;
        let ops_2_away;
        let ops_3_away;
        let ops_4_away;
        let ops_5_away;
        awayTeam.forEach((val, index) => {
          if (index == 0) {
            const ba_b = val.querySelector('[id="tb-3-body row-0 col-7"]');
            const ops_b = val.querySelector('[id="tb-3-body row-0 col-8"]');
            ba_1_away = +ba_b.querySelector("span").textContent;
            ops_1_away = +ops_b.querySelector("span").textContent;
          } else if (index == 1) {
            const ba_b = val.querySelector('[id="tb-3-body row-1 col-7"]');
            const ops_b = val.querySelector('[id="tb-3-body row-1 col-8"]');
            ba_2_away = +ba_b.querySelector("span").textContent;
            ops_2_away = +ops_b.querySelector("span").textContent;
          } else if (index == 2) {
            const ba_b = val.querySelector('[id="tb-3-body row-2 col-7"]');
            const ops_b = val.querySelector('[id="tb-3-body row-2 col-8"]');
            ba_3_away = +ba_b.querySelector("span").textContent;
            ops_3_away = +ops_b.querySelector("span").textContent;
          } else if (index == 3) {
            const ba_b = val.querySelector('[id="tb-3-body row-3 col-7"]');
            const ops_b = val.querySelector('[id="tb-3-body row-3 col-8"]');
            ba_4_away = +ba_b.querySelector("span").textContent;
            ops_4_away = +ops_b.querySelector("span").textContent;
          } else if (index == 4) {
            const ba_b = val.querySelector('[id="tb-3-body row-4 col-7"]');
            const ops_b = val.querySelector('[id="tb-3-body row-4 col-8"]');
            ba_5_away = +ba_b.querySelector("span").textContent;
            ops_5_away = +ops_b.querySelector("span").textContent;
          }
        });

        const homeTeamBatters = document.querySelector(".home-r1");
        const homeBatters = homeTeamBatters.querySelector("tbody");
        const homeTeam = homeBatters.querySelectorAll("tr");
        let ba_1_home;
        let ba_2_home;
        let ba_3_home;
        let ba_4_home;
        let ba_5_home;
        let ops_1_home;
        let ops_2_home;
        let ops_3_home;
        let ops_4_home;
        let ops_5_home;
        homeTeam.forEach((val, index) => {
          if (index == 0) {
            const ba_b = val.querySelector('[id="tb-5-body row-0 col-7"]');
            const ops_b = val.querySelector('[id="tb-5-body row-0 col-8"]');
            ba_1_home = +ba_b.querySelector("span").textContent;
            ops_1_home = +ops_b.querySelector("span").textContent;
          } else if (index == 1) {
            const ba_b = val.querySelector('[id="tb-5-body row-1 col-7"]');
            const ops_b = val.querySelector('[id="tb-5-body row-1 col-8"]');
            ba_2_home = +ba_b.querySelector("span").textContent;
            ops_2_home = +ops_b.querySelector("span").textContent;
          } else if (index == 2) {
            const ba_b = val.querySelector('[id="tb-5-body row-2 col-7"]');
            const ops_b = val.querySelector('[id="tb-5-body row-2 col-8"]');
            ba_3_home = +ba_b.querySelector("span").textContent;
            ops_3_home = +ops_b.querySelector("span").textContent;
          } else if (index == 3) {
            const ba_b = val.querySelector('[id="tb-5-body row-3 col-7"]');
            const ops_b = val.querySelector('[id="tb-5-body row-3 col-8"]');
            ba_4_home = +ba_b.querySelector("span").textContent;
            ops_4_home = +ops_b.querySelector("span").textContent;
          } else if (index == 4) {
            const ba_b = val.querySelector('[id="tb-5-body row-4 col-7"]');
            const ops_b = val.querySelector('[id="tb-5-body row-4 col-8"]');
            ba_5_home = +ba_b.querySelector("span").textContent;
            ops_5_home = +ops_b.querySelector("span").textContent;
          }
        });

        // add Away Team average ERA & Home Team Starting Pitcher ERA.
        // add Home Team average BA & Away Team Starting Pitcher ERA.
        return [
          {
            score: selector_home,
            pitcher: pitcher_away,
            home: 1,
            ba_1: ba_1_home,
            ba_2: ba_2_home,
            ba_3: ba_3_home,
            ba_4: ba_4_home,
            ba_5: ba_5_home,
            ops_1: ops_1_home,
            ops_2: ops_2_home,
            ops_3: ops_3_home,
            ops_4: ops_4_home,
            ops_5: ops_5_home,
          },
          {
            score: selector_away,
            pitcher: pitcher_home,
            home: 0,
            ba_1: ba_1_away,
            ba_2: ba_2_away,
            ba_3: ba_3_away,
            ba_4: ba_4_away,
            ba_5: ba_5_away,
            ops_1: ops_1_away,
            ops_2: ops_2_away,
            ops_3: ops_3_away,
            ops_4: ops_4_away,
            ops_5: ops_5_away,
          },
        ];
      });
      data.forEach((val) => {
        fullData.push(val);
      });
    } catch (error) {
      console.log(`Could not find the element on ${url}: ${error}`);
    }
    await page.close();
  }
  await browser.close();
  return fullData;
}

module.exports = {
  crawlPage,
};
