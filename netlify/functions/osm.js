exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Sadece POST destekleniyor" })
    };
  }

  try {
    const { south, west, north, east } = JSON.parse(event.body || "{}");

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
