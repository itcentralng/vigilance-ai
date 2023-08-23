const express = require("express");
const cors = require("cors");
const { configDotenv } = require("dotenv");
const bodyParser = require("body-parser");
const {
  match_accounts,
  dbInsertAccount,
  getAccountsByCaseId,
  getAccountByContent,
  dbInsertReport,
} = require("./db");
const { createEmbedding, generateReport } = require("./openaiApi");
const { v4: uuidv4 } = require("uuid");

configDotenv();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/incoming-messages", async (req, res) => {
  let text = req.body.text.replace(/\n/g, " ");
  let intersection = new Array();

  // Get location and time info
<<<<<<< HEAD
  const [location, locationAndTime] = text.split("+");
=======
  locationAndTime = text.split("+")[0];
  location = locationAndTime.split(",")[0];
>>>>>>> ae299f949f0ffdd1e7419a3a3907caf0c5a68cd4

  // Get embeddings for the complete text
  const textEmbedding = await createEmbedding(text);

  // Check if account is a duplicate
  const ifExists = Boolean((await getAccountByContent(text)).data);
  if (!ifExists) {
    // Get embeddings for location and time (open ai)
    const locationAndTimeEmbedding = await createEmbedding(
      locationAndTime.trim()
    );
    // Get embeddings for location separately (open ai)
    const locationEmbedding = await createEmbedding(location.trim());

    // Find records related to location and time (database)
    const relatedLocationsAndTime = await match_accounts(
      locationAndTimeEmbedding
    );
    // Find records related to just the location (database)
    const relatedLocations = await match_accounts(locationEmbedding, 0.8);

    // if both groups of records contain accounts
    // Create and intersection of the records
    if (relatedLocations && relatedLocationsAndTime)
      intersection = relatedLocationsAndTime.filter((item) =>
        relatedLocations.find((item2) => item.id === item2.id)
      );

    const values = {
      content: text,
      embedding: textEmbedding.data[0].embedding,
      // Generate a new uuid if there are no similar reports in the database
      // else set case_id to the related case_id
      case_id: intersection[0] ? intersection[0].case_id : uuidv4(),
    };
    // Insert into database if it is not a duplicate
    const { data: insertedAccount, error: insertError } = await dbInsertAccount(
      values
    );
    if (!insertError) console.log("Insert Successful");
    else console.log(insertError);

    // Get all related reports
    const { data: accounts, accountsError } = await getAccountsByCaseId(
      insertedAccount.case_id
    );
    // Insert generated report into db
    if (!accountsError) {
      const report = await generateReport(accounts);
      const { error } = await dbInsertReport({
        report: report,
        case_id: insertedAccount.case_id,
        updated_at: new Date().toISOString(),
      });
      if (error) console.log(error);
      res.status(200).send(report);
    }
  } else {
    console.log("Account of incident already Exists!");
  }

  res.end();
});

const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Web server listening on port ${port}`);
});
