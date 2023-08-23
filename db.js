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
  match_threshold = 0.85
) {
  const { data } = await supabaseClient.rpc("match_accounts", {
    query_embedding: embedding.data[0].embedding,
    match_threshold,
    match_count: 10,
  });
  return data;
};

module.exports.dbInsertAccount = async function (values) {
  return await supabaseClient.from("accounts").insert(values).select().single();
};

module.exports.dbInsertReport = async function (values) {
  return await supabaseClient.from("reports").insert(values).select();
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
