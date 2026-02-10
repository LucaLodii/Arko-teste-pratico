import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
