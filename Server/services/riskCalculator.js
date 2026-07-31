export function calculateRisk({
    weather,
    elevation,
    waterBodies,
    slope
}) {

    let floodPositive = 0;
    let floodNegative = 0;

    let landslidePositive = 0;
    let landslideNegative = 0;

    const reasons = {
        flood: {
            positive: [],
            negative: []
        },
        landslide: {
            positive: [],
            negative: []
        }
    };

    // -----------------------------
    // Weather
    // -----------------------------

    const currentRain = weather.current.rain_mm;
    const forecastRain = weather.forecast?.[0]?.totalRain_mm ?? 0;
    const humidity = weather.current.humidity;
    const cloud = weather.current.cloud;
    const wind = weather.current.wind_kph;
    const condition = weather.current.condition.toLowerCase();

    // ==================================================
    // TERRAIN
    // ==================================================

    if (slope.slope < 2) {

        if (currentRain > 20 || forecastRain > 20) {

            floodPositive += 8;

            reasons.flood.positive.push(
                "Flat terrain with rainfall may retain water"
            );
        }

        landslideNegative += 10;

        reasons.landslide.negative.push(
            "Very low slope reduces landslide risk"
        );


    } else if (slope.slope < 8) {

        floodPositive += 3;
        landslideNegative += 5;

    } else if (slope.slope < 15) {

        landslidePositive += 8;
        reasons.landslide.positive.push("Moderately sloped terrain");

    } else if (slope.slope < 30) {

        landslidePositive += 18;
        floodNegative += 5;

        reasons.landslide.positive.push("Steep terrain");
        reasons.flood.negative.push("Steep terrain drains water faster");

    } else {

        landslidePositive += 30;
        floodNegative += 10;

        reasons.landslide.positive.push("Very steep terrain");
        reasons.flood.negative.push("Very steep terrain reduces water accumulation");
    }

    // ==================================================
    // CURRENT RAIN
    // ==================================================

    if (currentRain >= 100) {

        floodPositive += 30;
        landslidePositive += 25;

        reasons.flood.positive.push("Extreme rainfall");
        reasons.landslide.positive.push("Extreme rainfall");

    } else if (currentRain >= 50) {

        floodPositive += 20;
        landslidePositive += 15;

        reasons.flood.positive.push("Heavy rainfall");
        reasons.landslide.positive.push("Heavy rainfall");

    } else if (currentRain >= 20) {

        floodPositive += 10;
        landslidePositive += 8;

        reasons.flood.positive.push("Moderate rainfall");
        reasons.landslide.positive.push("Moderate rainfall");

    } else if (currentRain < 2) {

        floodNegative += 15;
        landslideNegative += 15;

        reasons.flood.negative.push("Very little rainfall");
        reasons.landslide.negative.push("Ground is relatively dry");
    }
    else if (

        condition.includes("rain") &&

        currentRain > 5

    ) {

        floodPositive += 3;

        landslidePositive += 3;

        reasons.flood.positive.push("Light rainfall");
    }

    // ==================================================
    // FORECAST
    // ==================================================

    if (forecastRain >= 80) {

        floodPositive += 15;
        landslidePositive += 12;

        reasons.flood.positive.push("Heavy rain expected");
        reasons.landslide.positive.push("Heavy rain expected");

    } else if (forecastRain < 10) {

        floodNegative += 8;
        landslideNegative += 5;

        reasons.flood.negative.push("Low forecast rainfall");
    }

    // ==================================================
    // HUMIDITY
    // ==================================================

    if (

        humidity >= 90 &&

        currentRain > 10

    ) {

        floodPositive += 5;

        landslidePositive += 5;

        reasons.flood.positive.push(
            "High humidity with rainfall"
        );
    } else if (humidity < 50) {

        floodNegative += 5;
        landslideNegative += 5;

        reasons.flood.negative.push("Low humidity");
        reasons.landslide.negative.push("Low humidity");
    }

    // ==================================================
    // CLOUD
    // ==================================================

    if (

        cloud >= 90 &&

        forecastRain > 20

    ) {

        floodPositive += 4;

        reasons.flood.positive.push(
            "Dense cloud with expected rainfall"
        );

    } else if (cloud < 20) {

        floodNegative += 4;
        reasons.flood.negative.push("Clear sky");
    }

    // ==================================================
    // WIND
    // ==================================================

    if ( wind>=60) {

        floodPositive += 3;
        reasons.flood.positive.push("Strong wind");

    } else if (wind < 10) {

        floodNegative += 2;
    }

    // ==================================================
    // ELEVATION
    // ==================================================

    if (elevation < 20) {

        floodPositive += 15;

    }
    else if (elevation < 80) {

        floodPositive += 5;

    }
    else if (elevation > 600) {

        floodNegative += 8;

        landslidePositive += 12;

    }

    if (

        currentRain < 2 &&

        forecastRain < 5

    ) {

        floodNegative += 10;

        landslideNegative += 10;

        reasons.flood.negative.push(

            "No significant rainfall"

        );

    }


    // ==================================================
    // WATER BODY
    // ==================================================

    if (waterBodies?.riverFound) {

        const distance = waterBodies.nearestWaterBody.distance;

        const type = waterBodies.nearestWaterBody.type?.toLowerCase() || "";

        console.log("Nearest Water Body:", distance, "m");

        let multiplier = 1;

        if (type.includes("stream"))
            multiplier = 0.5;

        if (type.includes("river"))
            multiplier = 1;

        if (
            type.includes("reservoir") ||
            type.includes("lake")
        )
            multiplier = 1.4; let score = 0;

        if (distance <= 250)
            score = 18;

        else if (distance <= 500)
            score = 12;

        else if (distance <= 1000)
            score = 6;
        else if (distance > 5000) {

            score = 4;
        }
    }

    if (currentRain > 20) {

        floodPositive += Math.round(score * multiplier);

    }
    else {

        floodPositive += Math.round((score * multiplier) * 0.3);

    }

    
    // ==================================================
    // WEATHER CONDITION
    // ==================================================

    if (
        condition.includes("storm") ||
        condition.includes("thunder")
    ) {

        floodPositive += 12;
        landslidePositive += 10;

        reasons.flood.positive.push("Thunderstorm");
        reasons.landslide.positive.push("Thunderstorm");

    } else if (condition.includes("rain")) {

        floodPositive += 8;
        landslidePositive += 6;

        reasons.flood.positive.push("Rainfall");
        reasons.landslide.positive.push("Rainfall");

    } else if (
        condition.includes("sunny") ||
        condition.includes("clear")
    ) {

        floodNegative += 8;
        landslideNegative += 8;

        reasons.flood.negative.push("Clear weather");
        reasons.landslide.negative.push("Clear weather");
    } else if (

        currentRain > 40 &&

        distance < 500 &&

        slope.slope < 5

    ) {

        floodPositive += 15;

        reasons.flood.positive.push(

            "Heavy rain over flat terrain near water body"

        );

    }


    // ==================================================
    // SMART WEATHER COMBINATION
    // ==================================================

    if (
        currentRain > 30 &&
        humidity > 85 &&
        cloud > 85
    ) {

        floodPositive += 12;

        reasons.flood.positive.push(
            "Persistent wet weather conditions"
        );
    }

    // ==================================================
    // FINAL SCORE
    // ==================================================

    let floodScore = floodPositive - floodNegative;
    let landslideScore = landslidePositive - landslideNegative;

    floodScore = Math.max(0, Math.min(100, floodScore));
    landslideScore = Math.max(0, Math.min(100, landslideScore));

    return {

        flood: {

            score: floodScore,

            level: getRiskLevel(floodScore),

            positiveFactors: reasons.flood.positive,

            negativeFactors: reasons.flood.negative

        },

        landslide: {

            score: landslideScore,

            level: getRiskLevel(landslideScore),

            positiveFactors: reasons.landslide.positive,

            negativeFactors: reasons.landslide.negative

        }

    };
}

function getRiskLevel(score) {

    if (score >= 80) return "Very High";
    if (score >= 60) return "High";
    if (score >= 40) return "Moderate";
    if (score >= 20) return "Low";

    return "Very Low";
}