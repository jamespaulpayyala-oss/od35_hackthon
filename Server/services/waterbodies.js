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

export async function getWaterBodies(lat, lon) {

    const query = `
[out:json][timeout:30];
(
  way["natural"="water"](around:10000,${lat},${lon});
  relation["natural"="water"](around:10000,${lat},${lon});

  way["water"="reservoir"](around:10000,${lat},${lon});
  relation["water"="reservoir"](around:10000,${lat},${lon});

  way["waterway"="river"](around:10000,${lat},${lon});
  relation["waterway"="river"](around:10000,${lat},${lon});

  way["waterway"="stream"](around:10000,${lat},${lon});
  relation["waterway"="stream"](around:10000,${lat},${lon});
);
out center tags;
`;

    const url = "https://maps.mail.ru/osm/tools/overpass/api/interpreter";

    try {

        const params = new URLSearchParams();
        params.append("data", query);

        const { data } = await axios.post(url, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        if (!data.elements || data.elements.length === 0) {
            return {
                riverFound: false,
                nearbyWaterBodies: []
            };
        }

        const waterBodies = [];

        for (const element of data.elements) {

            if (!element.center) continue;

            const distance = calculateDistance(
                lat,
                lon,
                element.center.lat,
                element.center.lon
            );

            waterBodies.push({
                name: element.tags?.name || "Unnamed Water Body",
                type:
                    element.tags?.water ||
                    element.tags?.waterway ||
                    element.tags?.natural ||
                    "water",
                distance: Math.round(distance),
                latitude: element.center.lat,
                longitude: element.center.lon
            });
        }

        // Remove duplicates
        const uniqueWaterBodies = waterBodies.filter(
            (body, index, self) =>
                index === self.findIndex(
                    (b) =>
                        b.name === body.name &&
                        b.type === body.type
                )
        );

        // Sort by nearest
        uniqueWaterBodies.sort((a, b) => a.distance - b.distance);

        return {
            riverFound: uniqueWaterBodies.length > 0,
            nearestWaterBody: uniqueWaterBodies[0] || null,
            nearbyWaterBodies: uniqueWaterBodies
        };

    } catch (err) {

        console.error(err.response?.data || err.message);

        return {
            riverFound: false,
            error: err.message,
            nearbyWaterBodies: []
        };
    }
}