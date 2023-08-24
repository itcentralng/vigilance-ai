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
  dbInsertCase,
} = require("./db");
const { createEmbedding, generateReport } = require("./openai.api");
const { v4: uuidv4 } = require("uuid");
const reportsApi = require("./reports.api");
const usersApi = require("./users.api");

configDotenv();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/reports", reportsApi);
app.use("/api/users", usersApi);
app.post("/incoming-messages", async (req, res) => {
  let text = req.body.text.replace(/\n/g, " ") + " " + req.body.date;

  // Get embeddings for the complete text
  const textEmbedding = await createEmbedding(text);

  // Check if account is a duplicate
  // Insert into database if it is not a duplicate
  const ifExists = Boolean((await getAccountByContent(text)).data);
  if (!ifExists) {
    const relatedCases = await match_accounts(textEmbedding);

    // Generate a new uuid if there are no similar reports in the database
    // else set case_id to the related case_id
    const case_id = relatedCases.length ? relatedCases[0].case_id : uuidv4();

    const { error: insertCaseError } = await dbInsertCase({ case_id });
    if (!insertCaseError) console.log("Inserted Case Successful");
    else console.log(insertCaseError);

    const values = {
      content: text,
      embedding: textEmbedding.data[0].embedding,
      received_at: req.body.date,
      from: req.body.from,
      case_id,
    };
    const { error: insertError } = await dbInsertAccount(values);
    if (!insertError) console.log("Inserted Account Successful");
    else console.log(insertError);

    // Get all related reports
    const { data: accounts, accountsError } = await getAccountsByCaseId(
      case_id
    );
    // Insert generated report into db
    if (!accountsError) {
      const report = await generateReport(accounts);
      const { error } = await dbInsertReport({
        report: report,
        case_id: case_id,
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
