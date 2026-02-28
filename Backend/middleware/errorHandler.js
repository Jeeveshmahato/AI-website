const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({ error: message });
};

export default errorHandler;
