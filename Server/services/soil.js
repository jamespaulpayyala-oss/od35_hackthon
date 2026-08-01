import axios from "axios";

export async function getSoilType(lat, lon) {

    const url =
        `https://rest.isric.org/soilgrids/v2.0/properties/query` +
        `?lon=${lon}` +
        `&lat=${lat}` +
        `&property=clay` +
        `&property=sand` +
        `&property=silt` +
        `&depth=0-5cm` +
        `&value=mean`;

    try {

        const { data } = await axios.get(url);

        const layers = data.properties.layers;

        const clay = Number((
            (layers.find(l => l.name === "clay")
                ?.depths?.[0]?.values?.mean ?? 0) / 10
        ).toFixed(1));

        const sand = Number((
            (layers.find(l => l.name === "sand")
                ?.depths?.[0]?.values?.mean ?? 0) / 10
        ).toFixed(1));

        const silt = Number((
            (layers.find(l => l.name === "silt")
                ?.depths?.[0]?.values?.mean ?? 0) / 10
        ).toFixed(1));

        const soilType = classifySoil(clay, sand, silt);

        return {

            found: true,

            soilType,

            composition: {

                clay,

                sand,

                silt

            },

            drainage: getDrainage(soilType),

            infiltration: getInfiltration(soilType),

            runoff: getRunoff(soilType)

        };

    } catch (err) {

        console.error(
            err.response?.data || err.message
        );

        return {

            found: false,

            error: err.message

        };

    }

}

// ----------------------------------
// Soil Classification
// ----------------------------------

function classifySoil(clay, sand, silt) {

    if (clay >= 40)
        return "Clay";

    if (sand >= 70)
        return "Sand";

    if (clay >= 27 && clay < 40)
        return "Clay Loam";

    if (sand >= 45 && sand < 70)
        return "Sandy Loam";

    if (
        silt >= 40 &&
        clay < 27 &&
        sand < 45
    )
        return "Silt Loam";

    return "Loam";

}

// ----------------------------------
// Drainage
// ----------------------------------

function getDrainage(type) {

    switch (type) {

        case "Clay":
            return "Poor";

        case "Clay Loam":
            return "Moderate";

        case "Loam":
            return "Good";

        case "Sandy Loam":
            return "Very Good";

        case "Sand":
            return "Excellent";

        case "Silt Loam":
            return "Moderate";

        default:
            return "Unknown";
    }

}

// ----------------------------------
// Infiltration
// ----------------------------------

function getInfiltration(type) {

    switch (type) {

        case "Clay":
            return "Low";

        case "Clay Loam":
            return "Medium";

        case "Loam":
            return "Medium";

        case "Sandy Loam":
            return "High";

        case "Sand":
            return "Very High";

        case "Silt Loam":
            return "Medium";

        default:
            return "Unknown";
    }

}

// ----------------------------------
// Runoff
// ----------------------------------

function getRunoff(type) {

    switch (type) {

        case "Clay":
            return "High";

        case "Clay Loam":
            return "Moderate";

        case "Loam":
            return "Moderate";

        case "Sandy Loam":
            return "Low";

        case "Sand":
            return "Very Low";

        case "Silt Loam":
            return "Moderate";

        default:
            return "Unknown";
    }

}