const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

/* =========================
   FILE PATHS
========================= */

const DATA_DIR = path.join(__dirname, "data");
const FORUM_FILE = path.join(DATA_DIR, "forum.json");
const INBOX_FILE = path.join(DATA_DIR, "inbox.json");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");

/* =========================
   ENSURE FILES EXIST
========================= */

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

for (const file of [FORUM_FILE, INBOX_FILE, LOGS_FILE]) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
}

/* =========================
   LOAD DATA
========================= */

let forumPosts = JSON.parse(fs.readFileSync(FORUM_FILE));
let inboxMessages = JSON.parse(fs.readFileSync(INBOX_FILE));
let logs = JSON.parse(fs.readFileSync(LOGS_FILE));

const saveForum = () =>
  fs.writeFileSync(FORUM_FILE, JSON.stringify(forumPosts, null, 2));
const saveInbox = () =>
  fs.writeFileSync(INBOX_FILE, JSON.stringify(inboxMessages, null, 2));
const saveLogs = () =>
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));

/* =========================
   USERS (THIS FIXES LOGIN)
========================= */

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

/* =========================
   LOGIN
========================= */

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

/* =========================
   FORUM
========================= */

app.get("/forum", (req, res) => {
  res.json(forumPosts);
});

app.post("/forum/anon", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Empty post" });

  forumPosts.push({
    id: Date.now(),
    author: "member_unknown",
    color: "green",
    text,
    timestamp: new Date().toISOString()
  });

  saveForum();
  res.json({ success: true });
});

app.post("/forum/auth", (req, res) => {
  const { author, color, text } = req.body;
  if (!author || !text) return res.status(400).json({ error: "Invalid post" });

  forumPosts.push({
    id: Date.now(),
    author,
    color,
    text,
    timestamp: new Date().toISOString()
  });

  saveForum();
  res.json({ success: true });
});

/* =========================
   INBOX (PRIVATE MAIL)
========================= */

app.get("/inbox", (req, res) => {
  res.json(inboxMessages);
});

app.post("/inbox/send", (req, res) => {
  const { from, to, subject, body, color } = req.body;

  if (!from || !to || !body) {
    return res.status(400).json({ error: "Invalid message" });
  }

  inboxMessages.push({
    id: Date.now(),
    from,
    to,
    subject: subject || "(no subject)",
    body,
    color,
    timestamp: new Date().toISOString()
  });

  saveInbox();
  res.json({ success: true });
});

/* =========================
   LOGS (FALLOUT STYLE)
========================= */

app.get("/logs", (req, res) => {
  res.json(logs);
});

app.post("/logs", (req, res) => {
  const { title, author, paragraphs, color } = req.body;

  if (!title || !author || !Array.isArray(paragraphs)) {
    return res.status(400).json({ error: "Invalid log format" });
  }

  logs.push({
    id: Date.now(),
    title,
    author,
    paragraphs,
    color,
    timestamp: new Date().toISOString()
  });

  saveLogs();
  res.json({ success: true });
});

/* =========================
   ADMIN CONTROLS
========================= */

app.post("/admin/clear-forum", (req, res) => {
  if (req.body.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  forumPosts = [];
  saveForum();
  res.json({ success: true });
});

app.post("/admin/clear-inbox", (req, res) => {
  if (req.body.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  inboxMessages = [];
  saveInbox();
  res.json({ success: true });
});

app.post("/admin/clear-logs", (req, res) => {
  if (req.body.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  logs = [];
  saveLogs();
  res.json({ success: true });
});

/* =========================
   START SERVER
========================= */

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MAGITECH BB running on http://localhost:${PORT}`);
});
