// Embeds out/readings.json into reading.template.html -> out/reading.html (the artifact page).
const fs=require("fs"),path=require("path");
const data=fs.readFileSync(path.join(__dirname,"out/readings.json"),"utf8");
const tpl=fs.readFileSync(path.join(__dirname,"reading.template.html"),"utf8");
const slim=JSON.stringify(JSON.parse(data)).replace(/<\//g,"<\\/");
fs.writeFileSync(path.join(__dirname,"out/reading.html"),tpl.replace("__DATA__",()=>slim));
console.log("reading.html",(fs.statSync(path.join(__dirname,"out/reading.html")).size/1024).toFixed(0)+"KB");
