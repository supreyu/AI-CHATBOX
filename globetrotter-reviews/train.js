require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateSentences() {
  try {
    // 注意这里使用了 completions.create 而不是 createCompletion
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo", // 请根据需要选择合适的模型，例如 "text-davinci-003"
      prompt: "I want to track my refund. Generate similar sentences:",
      max_tokens: 50,
      n: 5,
    });

    response.data.choices.forEach((choice, index) => {
      console.log(`Generated sentence ${index + 1}: ${choice.text.trim()}`);
    });
  } catch (error) {
    console.error("Error generating sentences:", error);
  }
}

generateSentences();
