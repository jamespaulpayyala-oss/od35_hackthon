export function parseLLMJson(text) {

    if (!text) {

        throw new Error("Empty LLM response.");

    }

    // Remove markdown

    text = text.replace(/```json/gi, "");

    text = text.replace(/```/g, "");

    // Trim

    text = text.trim();

    // Extract JSON

    const start = text.indexOf("{");

    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {

        console.log(text);

        throw new Error("No JSON found in LLM response.");

    }

    const jsonString = text.substring(start, end + 1);

    try {

        return JSON.parse(jsonString);

    }

    catch (err) {

        console.log("INVALID JSON");

        console.log(jsonString);

        throw err;

    }

}