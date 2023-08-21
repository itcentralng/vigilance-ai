const { configDotenv } = require("dotenv");
const { getAccounts } = require("./db");
const { generateReport, generatePrompt } = require("./openaiApi");
const { runServer } = require("./server");
configDotenv();

async function init() {
  // const { data, error } = await getAccounts(
  //   "b6efe0ab-5800-432a-8c3d-19dcd46a2ed8"
  // );
  // if (!error) console.log(await generateReport(data));
}
runServer();
init();

// run server
// generate a report from simalar accounts
// save report
// insert into db if not duplicate on message recieved
