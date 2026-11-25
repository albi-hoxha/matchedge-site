import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.json':'application/json; charset=utf-8'};
const port=Number(process.env.PORT||4173);
http.createServer((req,res)=>{
  const pathname = new URL(req.url, 'http://localhost').pathname;
  let target;
  try {target=path.resolve(root, '.'+decodeURIComponent(pathname));}catch {res.writeHead(400);res.end('Bad Request');return;}
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  try {
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    if(!fs.existsSync(target)){target=path.join(root,'404.html');res.statusCode=404;}
    res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');
    fs.createReadStream(target).pipe(res);
  }catch {res.writeHead(500);res.end('Server error');}
}).listen(port,'127.0.0.1',()=>console.log(`MatchEdge preview: http://localhost:${port}`));
