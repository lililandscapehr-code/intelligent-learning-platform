const fs = require('fs');
const path = require('path');

const dir = './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && !f.includes('question-dna'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('=== FILE:', f);

  // Check each slide definition
  const slideRegex = /\{\s*id:\s*["']([^"']+)["'][\s\S]*?type:\s*["']([^"']+)["']([\s\S]*?)(?=\n\s*\{|\n\s*\];|\n\s*\])/g;
  let match;
  while ((match = slideRegex.exec(content)) !== null) {
    const id = match[1];
    const type = match[2];
    const body = match[3];

    if (type === 'question_mcq') {
      const qTextMatch = body.match(/questionText:\s*["'`]([\s\S]*?)["'`]/);
      const qText = qTextMatch ? qTextMatch[1].slice(0, 60) + '...' : 'NO_QUESTION_TEXT';
      const choices = [...body.matchAll(/id:\s*["']([^"']+)["'][\s\S]*?text:\s*["'`]([\s\S]*?)["'`][\s\S]*?isCorrect:\s*(true|false)/g)];
      console.log(`  [MCQ] ${id}: "${qText}" (choices: ${choices.length})`);
      choices.forEach(c => {
        console.log(`     - [${c[1]}] ${c[3] === 'true' ? 'CORRECT (✓)' : 'wrong (x)'}: ${c[2].slice(0, 50)}...`);
      });
      if (!choices.some(c => c[3] === 'true')) {
        console.log(`     🚨 ERROR: No correct choice found in ${id}!`);
      }
    } else if (type === 'evaluation') {
      const qRefMatch = body.match(/questionRef:\s*["']([^"']+)["']/);
      console.log(`  [EVAL] ${id}: questionRef = ${qRefMatch ? qRefMatch[1] : 'MISSING'}`);
    } else {
      console.log(`  [NON-Q: ${type}] ${id}`);
    }
  }
});
