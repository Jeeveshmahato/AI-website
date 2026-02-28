const requireApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!process.env.API_KEY) {
    console.warn("[AUTH] API_KEY not set in environment - rejecting request");
    return res.status(503).json({ error: "Server authentication not configured" });
  }

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key. Provide X-API-Key header." });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};

export default requireApiKey;
