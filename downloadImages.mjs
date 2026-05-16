import fs from 'fs';
import path from 'path';
import https from 'https';

const questionsFile = fs.readFileSync('./src/data/questions.ts', 'utf-8');

const regex = /id:\s*(\d+).*?imageUrl:\s*"([^"]+)"/gs;
let match;
const downloads = [];

while ((match = regex.exec(questionsFile)) !== null) {
  const id = match[1];
  const url = match[2];
  downloads.push({ id, url });
}

console.log(`Found ${downloads.length} images to download.`);

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, (res2) => {
          const fileStream = fs.createWriteStream(filepath);
          res2.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

async function main() {
  if (!fs.existsSync('./public/images')) {
    fs.mkdirSync('./public/images', { recursive: true });
  }

  for (const item of downloads) {
    if (item.url.startsWith('http')) {
      const ext = 'jpg';
      const filepath = path.join('./public/images', `q${item.id}.${ext}`);
      console.log(`Downloading Question ${item.id}...`);
      try {
        await downloadImage(item.url, filepath);
        console.log(`Saved ${filepath}`);
      } catch (err) {
        console.error(`Failed to download image ${item.id}:`, err.message);
      }
    }
  }

  // Update questions.ts
  let newContent = questionsFile;
  for (const item of downloads) {
     if (item.url.startsWith('http')) {
        const replaceRegex = new RegExp(`imageUrl:\\s*"${item.url.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&')}"`, 'g');
        newContent = newContent.replace(replaceRegex, `imageUrl: "/images/q${item.id}.jpg"`);
     }
  }
  fs.writeFileSync('./src/data/questions.ts', newContent);
  console.log('Updated questions.ts with local image paths.');
}

main();
