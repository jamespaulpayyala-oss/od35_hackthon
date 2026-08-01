import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getAccessToken() {

    const params = new URLSearchParams();

    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    const { data } = await axios.post(
        "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token",
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return data.access_token;
}

export async function downloadSatelliteImage(lat, lon) {

    const token = await getAccessToken();

    const delta = 0.02;

    const bbox = [
        lon - delta,
        lat - delta,
        lon + delta,
        lat + delta
    ];

    const evalscript = `
//VERSION=3

function setup() {
    return {
        input: [{
            bands: ["B02","B03","B04","dataMask"]
        }],
        output: {
            bands: 4
        }
    };
}

function evaluatePixel(sample) {

    return [

        Math.min(sample.B04 * 3.5, 1),

        Math.min(sample.B03 * 3.5, 1),

        Math.min(sample.B02 * 3.5, 1),

        sample.dataMask

    ];

}
`;

    const payload = {

        input: {

            bounds: {

                bbox,

                properties: {

                    crs: "http://www.opengis.net/def/crs/EPSG/0/4326"

                }

            },

            data: [

                {

                    type: "S2L2A",

                    dataFilter: {

                        timeRange: {

                            from: "2026-06-01T00:00:00Z",

                            to: "2026-07-20T23:59:59Z"

                        },

                        mosaickingOrder: "leastCC",

                        maxCloudCoverage: 40

                    },

                    processing: {

                        upsampling: "BILINEAR",

                        downsampling: "BILINEAR"

                    }

                }

            ]

        },

        output: {

            width: 1024,

            height: 1024,

            responses: [

                {

                    identifier: "default",

                    format: {

                        type: "image/png"

                    }

                }

            ]

        },

        evalscript

    };

    try {

        const response = await axios.post(

            "https://sh.dataspace.copernicus.eu/api/v1/process",

            payload,

            {

                headers: {

                    Authorization: `Bearer ${token}`,

                    "Content-Type": "application/json",

                    Accept: "image/png"

                },

                responseType: "arraybuffer"

            }

        );

        // Storage folder
        const folder = path.join(
            process.cwd(),
            "storage",
            "satellite"
        );

        // Create folder if it doesn't exist
        fs.mkdirSync(folder, {
            recursive: true
        });

        // Final image path
        const imagePath = path.join(
            folder,
            "latest.png"
        );

        // Save image
        fs.writeFileSync(
            imagePath,
            response.data
        );

        console.log("====================================");
        console.log("✅ Satellite image downloaded");
        console.log("Saved:", imagePath);
        console.log("Size:", response.data.length, "bytes");
        console.log("Exists:", fs.existsSync(imagePath));
        console.log("====================================");

        return {

            success: true,

            image: imagePath

        };

    } catch (error) {

        console.log("====================================");
        console.log("❌ Satellite API Error");
        console.log("====================================");

        if (error.response) {

            console.log(error.response.status);

            console.log(error.response.data.toString());

        } else {

            console.log(error.message);

        }

        throw error;

    }

}