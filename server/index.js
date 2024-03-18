import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
const app = express();
const PORT = 8009;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, SERVER API!");
});

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the protected route!", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const result = verifyAccessToken(token);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  req.user = result.data;
  next();
}
function verifyAccessToken(token) {
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
