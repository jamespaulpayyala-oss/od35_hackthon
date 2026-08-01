import fs from "fs";
import axios from "axios";
import { imagePrompt } from '../prompts/imageprompt.js';

import { parseLLMJson } from "../../Utilis/pharseJsonn.js";



export async function analyzeImage() {

    const image =
        fs.readFileSync(
            "./storage/satellite/latest.png"
        ).toString("base64");

    const response =
        await axios.post(

            "http://localhost:11434/api/chat",

            {

                model: "qwen2.5vl:3b",

                messages: [

                    {

                        role: "user",

                        content: imagePrompt,

                        images: [image]

                    }

                ],

                stream: false

            }

        );
    const result = response.data.message.content;

    return parseLLMJson(result);


}