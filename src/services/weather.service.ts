const fetchJson = async (url: URL, headers?: HeadersInit) => {
    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error(`External API failed with status ${response.status}`);
    }

    const result = await response.json();

    return result;
};

export const getWeather = async (
    latitude: number,
    longitude: number,
    startedAt: string,
) => {
    const startedAtDate = new Date(startedAt);
    const date = startedAtDate.toISOString().split("T")[0];
    const url = new URL("https://archive-api.open-meteo.com/v1/archive");

    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set(
        "hourly",
        "temperature_2m",
    );
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("start_date", date);
    url.searchParams.set("end_date", date);

    const data = await fetchJson(url);

    return data;
};

export const getRouteToSchaffhausen = async (
    latitude: number,
    longitude: number,
) => {
    const schaffhausenLatitude = 47.6965;
    const schaffhausenLongitude = 8.6345;
    const coordinates = `${longitude},${latitude};${schaffhausenLongitude},${schaffhausenLatitude}`;
    const url = new URL(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}`,
    );
    url.searchParams.set("overview", "full");
    url.searchParams.set("steps", "true");
    url.searchParams.set("annotations", "true");

    const data = await fetchJson(url);
    const route = data.routes?.[0];

    if (!route) {
        throw new Error("Route nach Schaffhausen wurde nicht gefunden");
    }

    return {
        destination: "Schaffhausen",
        distanceKm: Math.round((route.distance / 1000) * 100) / 100,
        durationMinutes: Math.ceil(route.duration / 60),
        geometry: route.geometry,
        steps: route.legs.flatMap((leg: { steps: unknown[] }) => leg.steps),
        waypoints: data.waypoints,
    };
};