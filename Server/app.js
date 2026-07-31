import {getWaterBodies} from './services/waterbodies.js'
import {getElevationdata} from './services/elevation.js'
import {getWeatherData} from './services/weather.js'
import {calculateRisk} from './services/riskCalculator.js'
import {getSlope} from './services/slope.js'
import {analyzeDisaster} from './VLM/qwen.js'


const lat = 9.845560;
const long = 76.741159;

const weather = await getWeatherData(lat, long);
const elevation = await getElevationdata(lat, long);
const waterBodies = await getWaterBodies(lat, long);
const slope = await getSlope(lat, long);
const risk = calculateRisk({
    weather,
    elevation,
    waterBodies,
    slope
});

/*
const analysis = await analyzeDisaster({

    weather,

    elevation,

    waterBodies,

    risk

});
*/
console.log(risk);