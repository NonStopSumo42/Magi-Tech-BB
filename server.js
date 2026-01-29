const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "projects.json");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ forum: [], mail: [], logs: [] }, null, 2));
}

function readData() { return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")); }
function writeData(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }



// ---------------- LOGIN ----------------
const USERS = {
  Pr0j3ctB: {
    password: "E7WQ1tdxSqI?si=Gd3AuRLxgT87CeGa",
    role: "real",
    color: "blue"
  },
  Pr0j3ctA: {
    password: "vAHJcyyaG_g?si=sSs8qSaxpGp9IZf5",
    role: "secret",
    color: "orange"
  },
  Pr0j3ctAdmin: {
    password: "AdminPassword123!",
    role: "admin",
    color: "red"
  }
};

app.post("/api/login", (req, res) => {
    const { user, pass } = req.body;
    if (accounts[user] && accounts[user].pass === pass) {
        res.json({ success: true, role: accounts[user].role });
    } else {
        res.status(401).json({ success: false });
    }
});

// ---------------- FORUM ----------------
app.get("/api/forum", (req, res) => {
    const data = readData();
    res.json(data.forum);
});

app.post("/api/forum", (req, res) => {
    const { name, text, color } = req.body;
    if (!text || !name || !color) return res.status(400).send("Missing fields");
    const post = name === "member_unknown"
        ? { name: "member_unknown", text, color: "#2fa36b" }
        : { name, text, color };
    const data = readData();
    data.forum.push(post);
    writeData(data);
    res.status(200).json({ success: true });
});

// ---------------- MAIL ----------------
app.get("/api/mail/:to", (req, res) => {
    const data = readData();
    const to = req.params.to;
    res.json(data.mail.filter(m => m.to === to));
});

app.post("/api/mail", (req, res) => {
    const { from, to, text, color } = req.body;
    if (!from || !to || !text || !color) return res.status(400).send("Missing fields");
    const data = readData();
    data.mail.push({ from, to, text, color });
    writeData(data);
    res.sendStatus(200);
});

// ---------------- LOGS ----------------
app.get("/api/logs", (req, res) => {
    const data = readData();
    res.json(data.logs);
});

app.post("/api/logs", (req, res) => {
    const { title, author, text, color } = req.body;
    if (!title || !author || !text || !color) return res.status(400).send("Missing fields");
    const data = readData();
    data.logs.push({ title, author, text, color });
    writeData(data);
    res.sendStatus(200);
});

// ---------------- ADMIN DELETE ----------------
app.post("/api/admin/delete", (req, res) => {
    const { target, user } = req.body;
    if (!accounts[user] || accounts[user].role !== "admin") return res.status(403).send("Forbidden");
    const data = readData();
    if (target === "forum") data.forum = [];
    else if (target === "mail") data.mail = [];
    else if (target === "logs") data.logs = [];
    else return res.status(400).send("Invalid target");
    writeData(data);
    res.sendStatus(200);
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => console.log(`MAGITECH BB running on port ${PORT}`));
