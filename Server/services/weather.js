import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

async function getWeatherData(lat, long) {
    try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${long}&days=3&aqi=no&alerts=yes`;
    const {data} = await axios.get(url);
    
    return {
        location: { 
            name : data.location.name,
            region: data.location.region,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,

        },
        current: {
            temp_c: data.current.temp_c,
            humidity: data.current.humidity,
            wind_dir: data.current.wind_dir,
            cloud: data.current.cloud,
            wind_kph: data.current.wind_kph,
            pressure_mb: data.current.pressure_mb,
            rain_mm: data.current.precip_mm,
            condition: data.current.condition.text,
        },
        forecast: 
            data.forecast.forecastday.map(day => ({
                date: day.date,
                max_temp_c: day.day.maxtemp_c,
                min_temp_c: day.day.mintemp_c,
                avgHumidity: day.day.avghumidity,
                totalRain_mm: day.day.totalprecip_mm,
                chanceOfRain: day.day.daily_chance_of_rain,}))
    
}

} catch (error) {
    console.error("Error fetching weather data:", error.response?.data || error.message);
    throw error;
}
}

export { getWeatherData };