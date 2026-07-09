import "reflect-metadata";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // An incredibly powerful free model
  temperature: 0,
});
import { DataSource } from "typeorm";

// Point these to the correct compatibility package paths:
import { createSqlAgent, SqlToolkit } from "@langchain/classic/agents/toolkits/sql";
import { SqlDatabase } from "@langchain/classic/sql_db";
import { Pool } from "pg";
export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Guard clause for environment variable
  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: "DATABASE_URL environment variable is missing." },
      { status: 500 }
    );
  }

  // Set up TypeORM DataSource required by LangChain JS
  const datasource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Keeps connections stable on cloud DBs like Neon/Supabase
  });

  // Initialize the database connection
  await datasource.initialize();

  // Wrap it with LangChain's SQL database utility
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

  // Initialize Groq model
  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  // Create the SQL Agent
  const toolkit = new SqlToolkit(db, llm);
  const systemPrompt = `You are a helpful assistant for a cafe. IMPORTANT: Always use the Indian Rupee symbol (₹) for all prices. Never use dollar signs ($).`;
  const agent = createSqlAgent(llm, toolkit, { prefix: systemPrompt });

  // Run the agent
  const result = await agent.invoke({ input: prompt });

  // Clean up and close the database connection connection
  await datasource.destroy();

  return Response.json({ response: result.output });
}
