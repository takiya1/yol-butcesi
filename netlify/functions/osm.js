export default async (req) => {
  if (req.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { south, west, north, east } = JSON.parse(req.body);

    const query = `
      [out:json][timeout:25];
      (
        way["bridge"="yes"](${south},${west},${north},${east});
        way["toll"="yes"](${south},${west},${north},${east});
        way["highway"="motorway"](${south},${west},${north},${east});
      );
      out tags center;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ data: query })
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
      body: JSON.stringify({ error: "OpenStreetMap sorgusu başarısız" })
    };
  }
};
