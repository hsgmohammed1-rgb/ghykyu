import fs from 'fs';
import path from 'path';
import https from 'https';

const urls = [
  // 1
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20number%201%20wearing%20a%20crown%20and%20holding%20a%20justice%20scale%2C%20vibrant%20colors?width=800&height=400&nologo=true",
  // 2
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20pencil%20case%20bag%20with%20a%20sad%20face%20because%20a%20pencil%20is%20leaving%2C%20Pixar%20style?width=800&height=400&nologo=true",
  // 3
  "https://image.pollinations.ai/prompt/Cartoon%20forest%20of%20floating%20numbers%2C%20number%2010%20is%20wearing%20a%20detective%20magnifying%20glass?width=800&height=400&nologo=true",
  // 4
  "https://image.pollinations.ai/prompt/3D%20cartoon%20key%20wearing%20a%20detective%20suit%20standing%20in%20front%20of%20a%20big%20door?width=800&height=400&nologo=true",
  // 5
  "https://image.pollinations.ai/prompt/3D%20cartoon%20two%20angry%20circles%20walking%20away%20from%20each%20other%20refusing%20to%20touch?width=800&height=400&nologo=true",
  // 6
  "https://image.pollinations.ai/prompt/3D%20cartoon%20giant%20multiplication%20machine%20with%20glowing%20numbers%20coming%20out?width=800&height=400&nologo=true",
  // 7
  "https://image.pollinations.ai/prompt/3D%20cartoon%20wooden%20chalkboard%20in%20a%20chemistry%20lab%20with%20glowing%20math%20potions?width=800&height=400&nologo=true",
  // 8
  "https://image.pollinations.ai/prompt/3D%20cartoon%20two%20characters%20walking%20side%20by%20side%20looking%20at%20their%20phones%20ignoring%20each%20other?width=800&height=400&nologo=true",
  // 9
  "https://image.pollinations.ai/prompt/3D%20cartoon%20exam%20paper%20with%20two%20glowing%20green%20checkmarks?width=800&height=400&nologo=true",
  // 10
  "https://image.pollinations.ai/prompt/3D%20cartoon%20happy%20ball%20pit%20throwing%20a%20green%20ball%20back%20inside%20with%20its%20hands?width=800&height=400&nologo=true",
  // 11
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20phone%20running%20towards%20a%20charger%20at%20the%20end%20of%20the%20road%20with%20a%20shining%20percentage%20sign?width=800&height=400&nologo=true",
  // 12
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20magician%20pulling%20glowing%20balls%20out%20of%20a%20colorful%20magic%20hat?width=800&height=400&nologo=true",
  // 13
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20giant%20soccer%20goal%20with%20two%20cartoon%20goalkeepers%20and%20a%20ball%20flying%20away%20in%20the%20air?width=800&height=400&nologo=true",
  // 14
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20router%20and%20light%20bulb%20wearing%20armor%20shields%20and%20laughing?width=800&height=400&nologo=true",
  // 15
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20small%20monster%20eating%20candy%20and%20searching%20for%20a%20second%20one%20inside%20a%20bag?width=800&height=400&nologo=true",
  // 16
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20giant%20safe%20lock%20with%20colorful%20buttons%20and%20a%20character%20trying%20to%20open%20it?width=800&height=400&nologo=true",
  // 17
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20cloud%20holding%20an%20umbrella%20and%20a%20character%20carrying%20a%20travel%20bag?width=800&height=400&nologo=true",
  // 18
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20production%20line%20of%20cute%20robots%2C%20one%20shining%20and%20the%20other%20wearing%20a%20scarf?width=800&height=400&nologo=true",
  // 19
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20podium%20with%20shining%20gold%20and%20silver%20trophies?width=800&height=400&nologo=true",
  // 20
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20student%20rolling%20a%20dice%20over%20an%20exam%20paper%20with%20eyes%20closed?width=800&height=400&nologo=true",
  // 21
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20character%20entering%20through%20a%20door%20with%20empty%20hands%20behind%20its%20back?width=800&height=400&nologo=true",
  // 22
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20two%20light%20bulbs%20wearing%20sunglasses%20and%20glowing%20brightly?width=800&height=400&nologo=true",
  // 23
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20winking%20coin%20laughing%20mischievously%20falling%20on%20tails?width=800&height=400&nologo=true",
  // 24
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20books%20racing%20to%20sit%20on%20a%20beautiful%20wooden%20shelf?width=800&height=400&nologo=true",
  // 25
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20electronic%20secret%20keypad%20emitting%20blue%20sparkle?width=800&height=400&nologo=true",
  // 26
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20rocket%20wearing%20sneakers%20ready%20to%20launch%20to%20the%20stars?width=800&height=400&nologo=true",
  // 27
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20cat%20and%20mouse%20with%20a%20wall%20between%20them%20unable%20to%20meet?width=800&height=400&nologo=true",
  // 28
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20colorful%20fortune%20wheel%20spinning%20fast%20with%20laughing%20numbers?width=800&height=400&nologo=true",
  // 29
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20character%20holding%20two%20coins%20looking%20at%20them%20with%20joy?width=800&height=400&nologo=true",
  // 30
  "https://image.pollinations.ai/prompt/Cute%203D%20cartoon%20wise%20owl%20wearing%20a%20graduation%20cap%20holding%20a%20golden%20equation?width=800&height=400&nologo=true"
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, { timeout: 15000 }, (res2) => {
          const fileStream = fs.createWriteStream(filepath);
          res2.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
        }).on('error', reject).on('timeout', () => {
            reject(new Error('Timeout'));
        });
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
    });
    request.on('error', reject);
    request.on('timeout', () => {
        request.destroy();
        reject(new Error('Timeout'));
    });
  });
};

async function main() {
  if (!fs.existsSync('./public/images')) {
    fs.mkdirSync('./public/images', { recursive: true });
  }

  for (let i = 0; i < urls.length; i++) {
    const itemUrl = urls[i];
    const id = i + 1;
    const filepath = path.join('./public/images', `q${id}.jpg`);
    
    console.log(`Downloading Question ${id}...`);
    let success = false;
    let retries = 3;
    while (!success && retries > 0) {
        try {
          await downloadImage(itemUrl, filepath);
          console.log(`Saved ${filepath}`);
          success = true;
        } catch (err) {
          console.error(`Failed to download image ${id} (${err.message}), retrying...`);
          retries--;
        }
    }
  }

  // Update questions.ts
  const questionsFile = fs.readFileSync('./src/data/questions.ts', 'utf-8');
  const regex = /imageUrl:\s*"(https?[^"]+)"/g;
  let newContent = questionsFile.replace(regex, (match, p1) => {
    // If it's a web URL, replace it with local
    return match; // We actually want to replace everything with /images/qX.jpg but doing that safely.
  });
  
  // Safe replace:
  // Since we know the array is 1 to 30, we can just replace imageUrl line by line
  let qId = 0;
  const lines = questionsFile.split('\\n');
  for (let i = 0; i < lines.length; i++) {
     if (lines[i].includes('id: ')) {
        const match = lines[i].match(/id:\s*(\d+)/);
        if (match) qId = parseInt(match[1]);
     }
     if (lines[i].includes('imageUrl: "http')) {
        lines[i] = lines[i].replace(/imageUrl:\s*"(https?[^"]+)"/, `imageUrl: "/images/q${qId}.jpg"`);
     }
  }
  fs.writeFileSync('./src/data/questions.ts', lines.join('\\n'));
  console.log('Updated questions.ts to use local images!');
}

main();
