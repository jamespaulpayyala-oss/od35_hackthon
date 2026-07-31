import axios from "axios";

async function getElevationdata(lat, long) {
    try{
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${long}`;
        const {data} = await axios.get(url);
        return {
            elevation: data.results[0].elevation
        }
    } catch (error) {
        console.error("Error fetching elevation data:", error.response?.data || error.message);
        throw error;
    }
}

export { getElevationdata };