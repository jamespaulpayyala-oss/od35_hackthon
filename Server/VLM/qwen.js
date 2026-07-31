import axios from "axios";

export async function analyzeDisaster(data) {

    const prompt = `

You are DisasterGPT, an expert AI with the combined knowledge of:

- Hydrologists
- Geologists
- Meteorologists
- Environmental Engineers
- Disaster Management Specialists

Your task is to perform a professional disaster risk assessment.

IMPORTANT RULES

1. Analyze ONLY the data provided.
2. Do NOT invent environmental facts.
3. Do NOT assume slope, soil type, river level or satellite observations unless they are explicitly provided.
4. If information is missing, clearly state that it is unavailable and explain how it affects confidence.
5. Explain the reasoning behind every conclusion.
6. Use all available environmental parameters together.
7. The calculated risk scores are inputs. Explain them, do not change them.

Environmental Data

${JSON.stringify(data, null, 2)}

Produce ONLY valid JSON using this schema:

{
  "executiveSummary": "",
  "overallAssessment": {
    "riskLevel": "",
    "confidence": 0,
    "overallReason": ""
  },
  "environmentAnalysis": {
    "weather": {
      "analysis": "",
      "impact": ""
    },
    "rainfall": {
      "analysis": "",
      "impact": ""
    },
    "humidity": {
      "analysis": "",
      "impact": ""
    },
    "cloudCover": {
      "analysis": "",
      "impact": ""
    },
    "wind": {
      "analysis": "",
      "impact": ""
    },
    "elevation": {
      "analysis": "",
      "impact": ""
    },
    "waterBodies": {
      "analysis": "",
      "impact": ""
    }
  },
  "floodRisk": {
    "score": 0,
    "level": "",
    "analysis": "",
    "primaryFactors": [],
    "secondaryFactors": []
  },
  "landslideRisk": {
    "score": 0,
    "level": "",
    "analysis": "",
    "primaryFactors": [],
    "secondaryFactors": []
  },
  "causeEffectChain": [
    {
      "cause": "",
      "effect": ""
    }
  ],
  "missingData": [
    {
      "parameter": "",
      "whyItMatters": ""
    }
  ],
  "recommendations": [
    ""
  ]
}

`;

    const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
            model: "qwen2.5vl:3b",
            prompt,
            stream: false
        }
    );

    return response.data.response;
}