const { configDotenv } = require("dotenv");
const { default: OpenAI } = require("openai");

configDotenv();
const openai = new OpenAI();

async function createEmbedding(text) {
  return await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
}

function generatePrompt(accounts) {
  let prompt =
    "You are a forensic expert, you can write a summary report based on these accounts.\n";
  accounts.forEach(
    (account, index) => (prompt += `${index + 1}. ${account.content} \n`)
  );
  return prompt;
}
async function generateReport(accounts) {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: generatePrompt(accounts),
      },
    ],
    temperature: 0,
  });
  return res.choices[0].message.content;
}

module.exports = { createEmbedding, generateReport };
