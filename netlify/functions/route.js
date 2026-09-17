exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Sadece POST destekleniyor" })
    };
  }

  try {
    const { from, to } = JSON.parse(event.body || "{}");

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

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: await response.text()
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
};
