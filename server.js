const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public")); // 🔴 THIS FIXES Cannot GET /

/* =====================
   DATA FILES
===================== */

const DATA_DIR = path.join(__dirname, "data");
const FORUM_FILE = path.join(DATA_DIR, "forum.json");
const INBOX_FILE = path.join(DATA_DIR, "inbox.json");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
for (const f of [FORUM_FILE, INBOX_FILE, LOGS_FILE]) {
  if (!fs.existsSync(f)) fs.writeFileSync(f, "[]");
}

let forum = JSON.parse(fs.readFileSync(FORUM_FILE));
let inbox = JSON.parse(fs.readFileSync(INBOX_FILE));
let logs = JSON.parse(fs.readFileSync(LOGS_FILE));

const saveForum = () => fs.writeFileSync(FORUM_FILE, JSON.stringify(forum, null, 2));
const saveInbox = () => fs.writeFileSync(INBOX_FILE, JSON.stringify(inbox, null, 2));
const saveLogs = () => fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));

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
  res.json(user);
});

/* =====================
   FORUM
===================== */

app.get("/forum", (req, res) => res.json(forum));

app.post("/forum/anon", (req, res) => {
  forum.push({
    id: Date.now(),
    author: "member_unknown",
    color: "green",
    text: req.body.text
  });
  saveForum();
  res.json({ ok: true });
});

app.post("/forum/auth", (req, res) => {
  forum.push({
    id: Date.now(),
    author: req.body.author,
    color: req.body.color,
    text: req.body.text
  });
  saveForum();
  res.json({ ok: true });
});

/* =====================
   INBOX
===================== */

app.get("/inbox", (req, res) => res.json(inbox));

app.post("/inbox/send", (req, res) => {
  inbox.push({
    id: Date.now(),
    from: req.body.from,
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,
    color: req.body.color
  });
  saveInbox();
  res.json({ ok: true });
});

/* =====================
   LOGS
===================== */

app.get("/logs", (req, res) => res.json(logs));

app.post("/logs", (req, res) => {
  logs.push({
    id: Date.now(),
    title: req.body.title,
    author: req.body.author,
    paragraphs: req.body.paragraphs,
    color: req.body.color
  });
  saveLogs();
  res.json({ ok: true });
});

/* =====================
   ADMIN
===================== */

app.post("/admin/clear-forum", (req, res) => {
  forum = [];
  saveForum();
  res.json({ ok: true });
});

app.post("/admin/clear-inbox", (req, res) => {
  inbox = [];
  saveInbox();
  res.json({ ok: true });
});

app.post("/admin/clear-logs", (req, res) => {
  logs = [];
  saveLogs();
  res.json({ ok: true });
});

/* =====================
   START
===================== */

app.listen(3000, () => {
  console.log("MAGITECH BB running at http://localhost:3000");
});
