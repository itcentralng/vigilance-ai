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
  let prompt = "Generate a report from the following incident accounts";
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
        role: "system",
        content: `You are a forensic expert, you can write a full report based on related incidents accounts.
          You can use the format below: 
          Incident Report (this is the title)
          No of witness accounts: ...
          Date: ...
          Time: ...

          Incident Description: ...
          Witness account 1:
          Location: ...
          Time: ...

          Witness account ...: ...
          Location: ...
          Time: ...

          Conclusion: ...
          
          Investigation Officer: Vigilance AI`,
      },
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
