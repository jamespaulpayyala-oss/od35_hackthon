import { getElevationdata } from "./elevation.js";

export async function getSlope(lat, lon) {

    // ~55 meters offset
    const offset = 0.0005;

    const center = (await getElevationdata(lat, lon)).elevation;

    const north = (await getElevationdata(lat + offset, lon)).elevation;

    const south = (await getElevationdata(lat - offset, lon)).elevation;

    const east = (await getElevationdata(lat, lon + offset)).elevation;

    const west = (await getElevationdata(lat, lon - offset)).elevation;

    // Elevation differences
    const dzdx = east - west;
    const dzdy = north - south;

    // Distance between east-west and north-south samples
    const distance = 111000 * offset * 2;

    // Gradient
    const gradient = Math.sqrt(
        Math.pow(dzdx / distance, 2) +
        Math.pow(dzdy / distance, 2)
    );

    // Convert to degrees
    const slope = Math.atan(gradient) * 180 / Math.PI;

    let terrain;

    if (slope < 3)
        terrain = "Flat";
    else if (slope < 8)
        terrain = "Gentle";
    else if (slope < 15)
        terrain = "Moderate";
    else if (slope < 30)
        terrain = "Steep";
    else
        terrain = "Very Steep";

    return {

        centerElevation: center,

        elevations: {
            north,
            south,
            east,
            west
        },

        slope: Number(slope.toFixed(2)),

        terrain
    };
}