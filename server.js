const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/api/nws/:station", async (req, res) => {
  const station = String(req.params.station || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (!station) {
    return res.status(400).json({ error: "Missing station ID" });
  }

  const url = `https://api.weather.gov/stations/${station}/observations/latest`;

  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/geo+json, application/json",
        "User-Agent": "Perfect-Day-Prototype/0.8 (local prototype; contact: example@example.com)"
      }
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "NWS request failed",
        status: response.status,
        station,
        upstreamUrl: url,
        body: text
      });
    }

    res.type("application/json").send(text);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch NWS observation",
      message: error.message,
      station,
      upstreamUrl: url
    });
  }
});

app.listen(PORT, () => {
  console.log(`Perfect Day is running at http://localhost:${PORT}`);
});
