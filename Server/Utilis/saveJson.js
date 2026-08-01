import fs from "fs";
import path from "path";

export function saveJson(filePath, data) {

    // Create folder if it doesn't exist
    fs.mkdirSync(
        path.dirname(filePath),
        { recursive: true }
    );

    // Save JSON
    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 4),
        "utf8"
    );

    console.log("✅ JSON saved:");
    console.log(filePath);

}