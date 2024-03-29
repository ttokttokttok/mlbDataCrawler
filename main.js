const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("too many command lines args");
    process.exit(1);
  }

  const baseURL = process.argv[2];

  console.log(`Starting crawl of ${baseURL}`);
  const report = await crawlPage(baseURL);
  printReport(report);
  // const pages = await crawlPage(baseURL, baseURL, {});
  // printReport(pages);
}

main();
