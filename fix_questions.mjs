import fs from 'fs';

let file = fs.readFileSync('src/data/questions.ts', 'utf8');
let id = 0;
const lines = file.split('\n').map(line => {
    if (line.includes('id:')) {
        const match = line.match(/id:\s*(\d+)/);
        if (match) id = parseInt(match[1]);
    }
    if (line.includes('imageUrl:')) {
        return `    imageUrl: "/images/q${id}.jpg"`;
    }
    return line;
});

fs.writeFileSync('src/data/questions.ts', lines.join('\n'));
console.log('Fixed questions.ts');
