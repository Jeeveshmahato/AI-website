// Vercel serverless entrypoint. An Express app is a valid (req, res) handler,
// so exporting it is all Vercel needs; it must NOT call app.listen().
import app from "../app.js";

export default app;
