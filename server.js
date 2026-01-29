const express = require("express");
const app = express();
const DATA = require("./data");

app.use(express.json());
app.use(express.static("public"));

/* =====================
   USERS
===================== */

const USERS = {
  Pr0j3ctB: {
    password: "E7WQ1tdxSqI?si=Gd3AuRLxgT87CeGa",
    role: "real",
    color: "blue",
    publicName: "B"
  },
  Pr0j3ctA: {
    password: "E7WQ1tdxSqI?si=Gd3AuRLxgT87CeGa",
    role: "secret",
    color: "orange",
    publicNames: [
      "Scientist Laura M. Hector",
      "Dr. Sarah Laford",
      "Scientist Gerard Balif",
      "Director Benard H. Herald",
      "Dr. Theadore Farlan"
    ]
  },
  Pr0j3ctAdmin: {
    password: "AdminPassword123!",
    role: "admin",
    color: "red",
    publicName: "ADMIN"
  }
};

/* =====================
   LOGIN
===================== */

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    username,
    role: user.role,
    color: user.color,
    publicName: user.publicName || null,
    publicNames: user.publicNames || null
  });
});

/* =====================
   FORUM
===================== */

app.get("/forum", (req, res) => {
  res.json(DATA.forum);
});

app.post("/forum/anon", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "Empty post" });
  }

  DATA.forum.push({
    id: Date.now(),
    author: "member_unknown",
    color: "green",
    text: req.body.text
  });

  res.json({ ok: true });
});

app.post("/forum/auth", (req, res) => {
  const { author, color, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ error: "Invalid post" });
  }

  DATA.forum.push({
    id: Date.now(),
    author,
    color,
    text
  });

  res.json({ ok: true });
});

/* =====================
   INBOX
===================== */

app.get("/inbox", (req, res) => {
  res.json(DATA.inbox);
});

app.post("/inbox/send", (req, res) => {
  const { from, to, subject, body, color } = req.body;

  if (!from || !to || !body) {
    return res.status(400).json({ error: "Invalid message" });
  }

  DATA.inbox.push({
    id: Date.now(),
    from,
    to,
    subject: subject || "(no subject)",
    body,
    color
  });

  res.json({ ok: true });
});

/* =====================
   LOGS (PARAGRAPHED)
===================== */

app.get("/logs", (req, res) => {
  res.json(DATA.logs);
});

app.post("/logs", (req, res) => {
  const { title, author, paragraphs, color } = req.body;

  if (!title || !author || !Array.isArray(paragraphs)) {
    return res.status(400).json({ error: "Invalid log format" });
  }

  DATA.logs.push({
    id: Date.now(),
    title,
    author,
    paragraphs,
    color
  });

  res.json({ ok: true });
});

/* =====================
   ADMIN CONTROLS
===================== */

app.post("/admin/clear-forum", (req, res) => {
  DATA.forum.length = 0;
  res.json({ ok: true });
});

app.post("/admin/clear-inbox", (req, res) => {
  DATA.inbox.length = 0;
  res.json({ ok: true });
});

app.post("/admin/clear-logs", (req, res) => {
  DATA.logs.length = 0;
  res.json({ ok: true });
});

/* =====================
   START SERVER
===================== */

app.listen(3000, () => {
  console.log("MAGITECH BB running at http://localhost:3000");
});
