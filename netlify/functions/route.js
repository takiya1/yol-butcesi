export default async (req) => {
  if (req.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { from, to } = JSON.parse(req.body);

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coordinates: [from, to],
          alternative_routes: {
            target_count: 3,
            share_factor: 0.6,
            weight_factor: 1.4
          }
        })
      }
    );

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Rota hesaplanamadı" })
    };
  }
};
