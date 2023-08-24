const express = require("express");
const { getAccounts, getReports, getReport } = require("./db");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await getReports());
});

router.get("/:id", async (req, res) => {
  res.send(await getReport(req.params.id));
});

router.get("/:id/accounts", async (req, res) => {
  const report = await getReport(req.params.id);
  res.send(await getAccounts(report.data.case_id));
});

module.exports = router;
