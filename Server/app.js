import express from "express";
import cors from "cors";
import path from "path";

import { getWaterBodies } from "./services/waterbodies.js";
import { getElevationdata } from "./services/elevation.js";
import { getWeatherData } from "./services/weather.js";
import { calculateRisk } from "./services/riskCalculator.js";
import { getSlope } from "./services/slope.js";
import { getLandCover } from "./services/landcover.js";
import { getSoilType } from "./services/soil.js";
import { downloadSatelliteImage } from "./services/satelliteImage.js";
import { analyzeImage } from "./VLM/imageAnalysis/imageAnalysis.js";
import { generateReport } from "./VLM/qwen.js";

const app = express();

const PORT = process.env.PORT || 3000;

const BASE_URL =
  process.env.BASE_URL ||
  "https://batman-property-officer-repeated.trycloudflare.com";

app.use(cors());
app.use(express.json());

app.use(
    "/storage",
    express.static(path.join(process.cwd(), "storage"))
);

// Health Check
app.get("/", (req, res) => {
    res.send("DMAPS Backend Running");
});

// Main Analysis Route
app.post("/analyze", async (req, res) => {

    try {

        const { lat, lng } = req.body;

        console.log("=================================");
        console.log("New Analysis Request");
        console.log("Latitude :", lat);
        console.log("Longitude:", lng);
        console.log("=================================");

        // Weather
        const weather = await getWeatherData(lat, lng);

        // Elevation
        const elevation = await getElevationdata(lat, lng);

        // Water
        const waterBodies = await getWaterBodies(lat, lng);

        // Slope
        const slope = await getSlope(lat, lng);

        // Land Cover
        const landCover = await getLandCover(lat, lng);

        // Soil
        const soilType = await getSoilType(lat, lng);

        // Satellite
        const satellite = await downloadSatelliteImage(lat, lng);

        // Image AI
        const imageAnalysis = await analyzeImage();

        // Risk
        const risk = calculateRisk({
            weather,
            elevation,
            waterBodies,
            slope,
            landCover,
            soilType,
            imageAnalysis
        });

        // LLM Report
        let report = null;

        try {

            report = await generateReport({
                weather,
                elevation,
                waterBodies,
                slope,
                landCover,
                soilType,
                imageAnalysis,
                risk
            });

        } catch (llmError) {

            console.error("LLM ERROR");
            console.error(llmError);

            report = {
                executiveSummary: "LLM generation failed.",
                recommendations: [],
                overallAssessment: {
                    confidence: 0
                }
            };

        }

        return res.status(200).json({

            success: true,

            weather,

            elevation,

            waterBodies,

            slope,

            landCover,

            soilType,

            imageAnalysis,

            risk,

            report,

            satelliteImage:
                `${BASE_URL}/storage/satellite/latest.png`

        });

    } catch (err) {

        console.error("=================================");
        console.error("BACKEND ERROR");
        console.error(err);
        console.error(err.stack);
        console.error("=================================");

        return res.status(500).json({

            success: false,

            message: err.message,

            stack: err.stack

        });

    }

});

app.listen(PORT, () => {

    console.log(`🚀 DMAPS Server Running on ${PORT}`);

});