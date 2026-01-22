const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 3000;

const ORACOES = JSON.parse(fs.readFileSync(path.join(__dirname,"data","oracoes.json"),"utf8"));

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimit({ windowMs: 60000, max: 120 }));

app.get("/health", (_req,res)=>res.json({ok:true,count:ORACOES.length}));
app.get("/oracoes", (_req,res)=>res.json(ORACOES));
app.get("/oracoes/:id",(req,res)=>{
  const o=ORACOES.find(x=>x.id===req.params.id);
  if(!o) return res.status(404).json({error:"not_found"});
  res.json(o);
});
app.listen(PORT,()=>console.log("API rodando"));
