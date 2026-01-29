const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "projects.json");

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Initialize projects.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({forum:[], mail:[], logs:[]}, null, 2));
}

// Helper to read/write JSON
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ---------- LOGIN ----------
app.post("/api/login", (req,res)=>{
  const {user, pass} = req.body;
  const accounts={
    "Pr0j3ctB":"E7WQ1tdxSqI?si=Gd3AuRLxgT87CeGa",
    "Pr0j3ctA":"E7WQ1tdxSqI?si=Gd3AuRLxgT87CeGa"
  };
  if(accounts[user] && accounts[user] === pass){
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// ---------- FORUM ----------
app.get("/api/forum", (req,res)=> {
  const data = readData();
  res.json(data.forum);
});

app.post("/api/forum", (req,res)=>{
  const {name, text, color} = req.body;
  if(!text) return res.status(400).send("No text provided");

  // Force anonymous posts to green / member_unknown
  const post = (name === "member_unknown")
    ? {name:"member_unknown", text, color:"#2fa36b"} 
    : {name, text, color};

  const data = readData();
  data.forum.push(post);
  writeData(data);

  res.status(200).json({success:true});
});

// ---------- MAIL ----------
app.get("/api/mail/:to", (req,res)=>{
  const data=readData();
  const to=req.params.to;
  res.json(data.mail.filter(m=>m.to===to));
});

app.post("/api/mail", (req,res)=>{
  const {from,to,text,color} = req.body;
  if(!from || !to || !text || !color) return res.status(400).send("Invalid data");
  const data=readData();
  data.mail.push({from,to,text,color});
  writeData(data);
  res.sendStatus(200);
});

// ---------- LOGS ----------
app.get("/api/logs", (req,res)=>{
  const data=readData();
  res.json(data.logs);
});

app.post("/api/logs", (req,res)=>{
  const {title,author,text,color}=req.body;
  if(!title||!author||!text||!color) return res.status(400).send("Invalid data");
  const data=readData();
  data.logs.push({title,author,text,color});
  writeData(data);
  res.sendStatus(200);
});

app.listen(PORT, ()=> console.log(`MAGITECH BB server running on http://localhost:${PORT}`));
