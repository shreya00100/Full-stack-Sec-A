import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "development_secret_change_me";
const users = new Map(); // In-memory storage for this practical only.

app.post("/register", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password.trim() ||
    password.length < 6
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const cleanUsername = username.trim();
  if (users.has(cleanUsername)) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(cleanUsername, { username: cleanUsername, passwordHash });

  return res.status(201).json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  const user = typeof username === "string" ? users.get(username.trim()) : null;

  if (!user || typeof password !== "string" || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({ token });
});

app.get("/profile", (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorization.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ username: payload.username });
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.listen(PORT, () => {
  console.log(`JWT Authentication API running at http://localhost:${PORT}`);
});
