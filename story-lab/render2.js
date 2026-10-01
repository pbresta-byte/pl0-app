// Merge readings.json + editorial/*.json (and private/editorial/*.json) -> <dir>/product.html
const fs=require("fs"),path=require("path");
const dir=path.resolve(process.argv[2]||path.join(__dirname,"out"));
const R=JSON.parse(fs.readFileSync(path.join(dir,"readings.json"),"utf8"));
const rd=(...p)=>{const f=path.join(__dirname,...p);return fs.existsSync(f)?JSON.parse(fs.readFileSync(f,"utf8")):null};
for(const c of R.charts) c.editorial = rd("editorial",c.id+".json") || rd("private","editorial",c.id+".json");
R.together = rd("private","editorial","together.json");
if (!process.argv.includes("--with-together")) { if (dir===path.join(__dirname,"out")) R.together=null; }
const tpl=fs.readFileSync(path.join(__dirname,"product.template.html"),"utf8");
const slim=JSON.stringify(R).replace(/<\//g,"<\\/");
fs.writeFileSync(path.join(dir,"product.html"),tpl.replace("__DATA__",()=>slim));
console.log(path.join(dir,"product.html"),(fs.statSync(path.join(dir,"product.html")).size/1024).toFixed(0)+"KB");
