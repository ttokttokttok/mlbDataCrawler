const fs = require("fs");
const path = "data/data.json";

function printReport(pages) {
  console.log("===========");
  console.log("REPORT");
  console.log("===========");

  fs.readFile(path, (err, data) => {
    if (err) {
      console.error("Error reading data.json", err);
      return;
    }
    let json = JSON.parse(data);
    json.push(...pages);
    fs.writeFile(path, JSON.stringify(json, null, 2), (err) => {
      if (err) {
        console.error("Error writing to data.json", err);
        return;
      }
      console.log("Report data added to data.json");
    });
  });

  console.log("===========");
  console.log("REPORT");
  console.log("===========");
}

module.exports = {
  printReport,
};
