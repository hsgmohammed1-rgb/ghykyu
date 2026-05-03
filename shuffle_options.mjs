import fs from 'fs';

const fileContent = fs.readFileSync('src/data/questions.ts', 'utf8');

// We'll extract the questions array content using regex or string splitting
const startIndex = fileContent.indexOf('[');
const endIndex = fileContent.lastIndexOf(']') + 1;
const arrayString = fileContent.substring(startIndex, endIndex);

// We can safely eval this since we control the file
const questions = eval(`(${arrayString})`);

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  let copy = [...array];
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
  }
  return copy;
}

const newQuestions = questions.map(q => {
  const correctText = q.options[q.correctAnswerIndex];
  const shuffledOptions = shuffle(q.options);
  const newCorrectIndex = shuffledOptions.indexOf(correctText);
  
  return {
    ...q,
    options: shuffledOptions,
    correctAnswerIndex: newCorrectIndex
  };
});

// Format back to TS string
const formatted = newQuestions.map(q => {
  return `  {
    id: ${q.id},
    text: ${JSON.stringify(q.text)},
    options: ${JSON.stringify(q.options)},
    correctAnswerIndex: ${q.correctAnswerIndex},
    explanation: ${JSON.stringify(q.explanation)},
    difficulty: ${JSON.stringify(q.difficulty)},
    category: ${JSON.stringify(q.category)},
    imageUrl: ${JSON.stringify(q.imageUrl)}
  }`;
}).join(',\n');

const newFileContent = `import { Question } from '../types';

export const questions: Question[] = [
${formatted}
];
`;

fs.writeFileSync('src/data/questions.ts', newFileContent);
console.log('Shuffled options in questions.ts!');
