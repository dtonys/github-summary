import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

// Create the prompt template
const prompt = PromptTemplate.fromTemplate(`
Analyze the following GitHub repository README content and provide a summary and interesting facts about it.
README Content: {readme_content}
`);

const responseSchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("A list of 2 interesting facts about the repository"),
});

// Create the model
const model = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
}).withStructuredOutput(responseSchema);

// Create the chain
const chain = RunnableSequence.from([
  {
    readme_content: (input) => input.readme_content,
  },
  prompt,
  model
]);

export async function summarizeReadme(readmeContent) {
  try {
    const response = await chain.invoke({
      readme_content: readmeContent,
    });
    return response;
  } catch (error) {
    console.error("Error summarizing README:", error);
    throw error;
  }
} 