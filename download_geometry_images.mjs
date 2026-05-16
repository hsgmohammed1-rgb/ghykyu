import fs from 'fs';
import path from 'path';
import https from 'https';

const prompts = [
  "Professional geometry diagram quadrilateral ABCD angle A labeled 95 degrees, colorful educational illustration, clean modern design, sharp lines, 3D style",
  "Beautiful geometry diagram circle two inscribed angles sharing same arc marked equal, educational illustration, clean mathematical drawing, 3D style",
  "Mathematical coordinate system circle centered at origin radius 4 units diameter 8, x y axes visible, educational geometry illustration, 3D style",
  "Thales theorem geometry diagram circle diameter AB inscribed angle C right triangle 90 degrees clearly marked, educational illustration, 3D style",
  "Mathematics graph hyperbola 4x squared minus 4y squared equals 36 labeled NOT a circle equation, educational illustration, 3D style",
  "Geometry diagram circle tangent line touching at point S chord SC tangent-chord angle labeled 40 degrees, educational illustration, 3D style",
  "Geometry diagram isosceles trapezoid inscribed in a circle showing always cyclic opposite angles supplementary, educational illustration, 3D style",
  "Mathematics educational illustration comparing circle equation with other conic sections x squared plus y squared equals r squared, 3D style",
  "Geometry diagram cyclic quadrilateral ABCD exterior angle at D labeled 75 degrees interior opposite angle marked equal, educational, 3D style",
  "Right triangle ABC inscribed in semicircle AB diameter BC equals 8 AC equals 6 right angle at C Thales theorem, educational, 3D style"
];

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 60000 }, (res) => {
      let loc = url;
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        loc = res.headers.location;
        https.get(loc, { timeout: 60000 }, (res2) => {
          const ws = fs.createWriteStream(filepath);
          res2.pipe(ws);
          ws.on('finish', () => { ws.close(); resolve(); });
        }).on('error', reject).on('timeout', () => req.destroy());
      } else if (res.statusCode === 200) {
        const ws = fs.createWriteStream(filepath);
        res.pipe(ws);
        ws.on('finish', () => { ws.close(); resolve(); });
      } else {
        reject(new Error(`Status ${res.statusCode}`));
      }
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  const dir = './public/images';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const results = [];
  for (let i = 0; i < prompts.length; i++) {
    const id = i + 1;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts[i])}?width=800&height=400&nologo=true`;
    const fp = path.join(dir, `q${id}.jpg`);

    let ok = false;
    for (let attempt = 0; attempt < 5 && !ok; attempt++) {
      try {
        process.stdout.write(`Q${id} (attempt ${attempt + 1})... `);
        await download(url, fp);
        const s = fs.statSync(fp);
        if (s.size > 2000) {
          console.log(`OK (${(s.size / 1024).toFixed(1)} KB)`);
          ok = true;
        } else {
          console.log(`too small (${s.size} bytes)`);
        }
      } catch (e) {
        console.log(`fail: ${e.message}`);
      }
    }
    results.push({ id, ok });
    if (i < prompts.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n=== Summary ===');
  for (const r of results) {
    console.log(`Q${r.id}: ${r.ok ? '✓' : '✗'}`);
  }
}

main();
