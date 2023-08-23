const express = require("express");
const { getAccounts, getReports, getReport } = require("./db");
const router = express.Router();

router.get("/reports", async (req, res) => {
  res.send(await getReports());
});

router.get("/report/:id", async (req, res) => {
  res.send(await getReport(req.params.id));
});

router.get("/report/:id/accounts", async (req, res) => {
  const report = await getReport(req.params.id);
  res.send(await getAccounts(report.data.case_id));
});

module.exports = router;
