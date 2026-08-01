export function calculateRisk({
    weather,

    elevation,

    waterBodies,

    slope,

    soil,

    landCover,

    soilType,

    imageAnalysis: analysis
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

    if (wind >= 60) {

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

        const type =
            waterBodies.nearestWaterBody.type?.toLowerCase() || "";

        let multiplier = 1;

        if (type.includes("stream"))
            multiplier = 0.5;

        else if (type.includes("river"))
            multiplier = 1;

        else if (
            type.includes("reservoir") ||
            type.includes("lake")
        )
            multiplier = 1.4;

        let score = 0;

        if (distance <= 250)
            score = 18;

        else if (distance <= 500)
            score = 12;

        else if (distance <= 1000)
            score = 6;

        else if (distance > 5000) {

            floodNegative += 8;

            reasons.flood.negative.push(
                "Far from major water body"
            );
        }

        if (currentRain > 20)
            floodPositive += Math.round(score * multiplier);

        else
            floodPositive += Math.round(score * multiplier * 0.3);

        // Smart Combination
        if (
            currentRain > 40 &&
            distance < 500 &&
            slope.slope < 5
        ) {

            floodPositive += 15;

            reasons.flood.positive.push(
                "Heavy rain over flat terrain near water body"
            );
        }
    }

    if (landCover?.riskModifier) {

        if (landCover.riskModifier.flood >= 0)
            floodPositive += landCover.riskModifier.flood;
        else
            floodNegative += Math.abs(landCover.riskModifier.flood);

        if (landCover.riskModifier.landslide >= 0)
            landslidePositive += landCover.riskModifier.landslide;
        else
            landslideNegative += Math.abs(landCover.riskModifier.landslide);
    }

    // ==================================================
// SOIL TYPE
// ==================================================

if (soil?.found) {

    switch (soil.soilType) {

        case "Clay":

            floodPositive += 10;
            landslidePositive += 12;

            reasons.flood.positive.push(
                "Clay soil has poor drainage and high runoff"
            );

            reasons.landslide.positive.push(
                "Clay soil becomes unstable when saturated"
            );

            break;

        case "Clay Loam":

            floodPositive += 6;
            landslidePositive += 7;

            reasons.flood.positive.push(
                "Clay loam retains moderate moisture"
            );

            reasons.landslide.positive.push(
                "Clay loam may weaken during prolonged rainfall"
            );

            break;

        case "Loam":

            floodNegative += 3;
            landslideNegative += 2;

            reasons.flood.negative.push(
                "Loam has balanced drainage"
            );

            reasons.landslide.negative.push(
                "Loam provides moderate slope stability"
            );

            break;

        case "Sandy Loam":

            floodNegative += 6;
            landslideNegative += 5;

            reasons.flood.negative.push(
                "Sandy loam drains water efficiently"
            );

            reasons.landslide.negative.push(
                "Good soil drainage reduces saturation"
            );

            break;

        case "Sand":

            floodNegative += 10;
            landslideNegative += 8;

            reasons.flood.negative.push(
                "Sandy soil allows rapid infiltration"
            );

            reasons.landslide.negative.push(
                "Low water retention reduces instability"
            );

            break;

        case "Silt Loam":

            floodPositive += 4;
            landslidePositive += 5;

            reasons.flood.positive.push(
                "Silt loam can generate surface runoff"
            );

            reasons.landslide.positive.push(
                "Fine particles are susceptible to erosion"
            );

            break;

    }

    // -----------------------------
    // Drainage
    // -----------------------------

    switch (soil.drainage) {

        case "Poor":

            floodPositive += 8;
            landslidePositive += 6;

            reasons.flood.positive.push(
                "Poor drainage increases water accumulation"
            );

            break;

        case "Moderate":

            floodPositive += 3;

            break;

        case "Excellent":

            floodNegative += 5;

            reasons.flood.negative.push(
                "Excellent drainage reduces flooding"
            );

            break;

    }

    // -----------------------------
    // Infiltration
    // -----------------------------

    switch (soil.infiltration) {

        case "Low":

            floodPositive += 6;

            reasons.flood.positive.push(
                "Low infiltration increases runoff"
            );

            break;

        case "Medium":

            break;

        case "High":

        case "Very High":

            floodNegative += 5;

            reasons.flood.negative.push(
                "High infiltration reduces runoff"
            );

            break;

    }

    // -----------------------------
    // Runoff
    // -----------------------------

    switch (soil.runoff) {

        case "High":

            floodPositive += 6;

            reasons.flood.positive.push(
                "High natural runoff"
            );

            break;

        case "Moderate":

            floodPositive += 2;

            break;

        case "Low":

        case "Very Low":

            floodNegative += 4;

            reasons.flood.negative.push(
                "Low natural runoff"
            );

            break;

    }

}

// ==================================================
// SOIL + RAIN COMBINATION
// ==================================================

if (
    soil?.found &&
    currentRain > 40
) {

    if (
        soil.soilType === "Clay" ||
        soil.soilType === "Clay Loam"
    ) {

        floodPositive += 10;
        landslidePositive += 8;

        reasons.flood.positive.push(
            "Heavy rainfall over clay-rich soil"
        );

        reasons.landslide.positive.push(
            "Clay-rich soil becomes unstable after heavy rainfall"
        );

    }

    if (
        soil.soilType === "Sand"
    ) {

        floodNegative += 5;

        reasons.flood.negative.push(
            "Sandy soil absorbs rainfall efficiently"
        );

    }

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

    function imageRisk(){

    if(!imageAnalysis) return;

    if(imageAnalysis.water.expansion==="High"){

        floodPositive+=20;

        reasons.flood.positive.push(

            "Satellite detected expanded water bodies"

        );

    }

    if(imageAnalysis.vegetation.density==="Low"){

        floodPositive+=6;

        landslidePositive+=8;

        reasons.flood.positive.push(

            "Sparse vegetation"

        );

        reasons.landslide.positive.push(

            "Reduced vegetation cover"

        );

    }

    if(imageAnalysis.terrain.erosion==="Visible"){

        landslidePositive+=18;

        reasons.landslide.positive.push(

            "Visible erosion"

        );

    }

    if(imageAnalysis.soil.bareSoil==="High"){

        landslidePositive+=12;

        reasons.landslide.positive.push(

            "Large exposed soil"

        );

    }

}

function combinationRisk(){

    // Heavy rain + river expansion
    if(

        weather.current.rain_mm>40 &&

        imageAnalysis.water.expansion==="High"

    ){

        floodPositive+=15;

        reasons.flood.positive.push(

            "Heavy rainfall combined with expanded water bodies"

        );

    }

    // Heavy rain + steep slope + erosion

    if(

        weather.current.rain_mm>30 &&

        slope.slope>20 &&

        imageAnalysis.terrain.erosion==="Visible"

    ){

        landslidePositive+=20;

        reasons.landslide.positive.push(

            "Heavy rainfall over eroded steep terrain"

        );

    }

    // Clay soil + rainfall

    if(

        soil.soilType==="Clay" &&

        weather.current.rain_mm>30

    ){

        floodPositive+=10;

        landslidePositive+=8;

    }

    // Low vegetation + heavy rain

    if(

        imageAnalysis.vegetation.density==="Low" &&

        weather.current.rain_mm>40

    ){

        landslidePositive+=10;

    }

    // Dense forest reduces risk

    if(

        imageAnalysis.environment?.forest==="Dense"

    ){

        floodNegative+=5;

        landslideNegative+=8;

    }

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