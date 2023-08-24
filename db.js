const { createClient } = require("@supabase/supabase-js");
const { configDotenv } = require("dotenv");

configDotenv();
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);
module.exports.match_accounts = async function (
  embedding,
  match_threshold = 0.88
) {
  const { data } = await supabaseClient.rpc("match_accounts", {
    query_embedding: embedding.data[0].embedding,
    match_threshold,
    match_count: 10,
  });
  return data;
};

module.exports.dbInsertAccount = async function (values) {
  return await supabaseClient.from("accounts").insert(values);
};

module.exports.dbInsertReport = async function (values) {
  return await supabaseClient.from("reports").insert(values);
};

module.exports.dbInsertCase = async function (case_id) {
  return await supabaseClient.from("cases").insert({ case_id });
};
module.exports.dbInsertCase = async function (values) {
  return await supabaseClient.from("cases").insert(values);
};

module.exports.getAccountsByCaseId = async function (case_id) {
  return await supabaseClient
    .from("accounts")
    .select("content")
    .eq("case_id", case_id);
};

module.exports.getAccountByContent = async function (content) {
  return await supabaseClient
    .from("accounts")
    .select("content")
    .eq("content", content)
    .single();
};

module.exports.getAccounts = async function (case_id) {
  return await supabaseClient
    .from("accounts")
    .select("id, case_id, content, from, received_at")
    .eq("case_id", case_id);
};

module.exports.getReports = async function () {
  return await supabaseClient
    .from("reports")
    .select("id, case_id, report, created_at");
};

module.exports.getReport = async function (id) {
  return await supabaseClient
    .from("reports")
    .select("id, case_id, report, created_at")
    .eq("id", id)
    .single();
};

module.exports.createUser = async function (values) {
  return await supabaseClient.from("users").insert(values).select().single();
};

module.exports.getUser = async function (email) {
  return await supabaseClient
    .from("users")
    .select()
    .eq("email", email)
    .single();
};
