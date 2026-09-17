export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Sadece POST isteği kabul edilir" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const { from, to } = await request.json();

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

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Rota hesaplanamadı",
        detail: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
