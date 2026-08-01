import axios from "axios";

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;

    const toRad = (deg) => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getLandCover(lat, lon) {

    const query = `
[out:json][timeout:30];
(
  way["landuse"](around:2000,${lat},${lon});
  relation["landuse"](around:2000,${lat},${lon});

  way["natural"](around:2000,${lat},${lon});
  relation["natural"](around:2000,${lat},${lon});
);
out center tags;
`;

    const url =
        "https://maps.mail.ru/osm/tools/overpass/api/interpreter";

    try {

        const params = new URLSearchParams();
        params.append("data", query);

        const { data } = await axios.post(
            url,
            params,
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

        if (!data.elements || data.elements.length === 0) {

            return {

                found: false

            };
        }

        let nearest = null;
        let minDistance = Infinity;

        const summary = {};

        for (const element of data.elements) {

            if (!element.center)
                continue;

            const type =
                element.tags.landuse ||
                element.tags.natural ||
                "unknown";

            summary[type] = (summary[type] || 0) + 1;

            const distance = calculateDistance(
                lat,
                lon,
                element.center.lat,
                element.center.lon
            );

            if (distance < minDistance) {

                minDistance = distance;

                nearest = {

                    type,

                    distance: Math.round(distance),

                    name:
                        element.tags.name ||
                        type
                };
            }
        }

        return {

            found: true,

            nearestLandCover: nearest,

            summary

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