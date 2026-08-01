import axios from "axios";
import { reportPrompt } from "./prompts/reportsPrompt.js";
import { parseLLMJson } from "../Utilis/pharseJsonn.js";

export async function generateReport(environmentData) {

    const prompt = `

${reportPrompt}

==================================================

IMPORTANT

Return ONLY valid JSON.

Rules:

1. Do NOT explain anything.
2. Do NOT use markdown.
3. Do NOT wrap the JSON inside \`\`\`.
4. The first character MUST be {
5. The last character MUST be }

==================================================

Environmental Data

${JSON.stringify(environmentData, null, 2)}

`;

    try {

        const response = await axios.post(
            "http://localhost:11434/api/chat",
            {
                model: "qwen2.5vl:3b",

                messages: [
                    {
                        role: "system",
                        content: "You are an environmental disaster AI. Return ONLY JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                format: "json",

                stream: false
            }
        );

        const raw = response.data.message.content;

        console.log("====================================");
        console.log("RAW LLM RESPONSE");
        console.log(raw);
        console.log("====================================");

        return parseLLMJson(raw);

    }

    catch (error) {

        console.error("LLM GENERATION FAILED");

        throw error;

    }

}