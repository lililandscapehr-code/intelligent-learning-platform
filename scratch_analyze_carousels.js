const fs = require('fs');
const path = require('path');

const files = [
  './src/curriculum-packages/0580/carousel-lessons.ts',
  './src/curriculum-packages/drama-201/vocal-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/boyle-charles-carousel.ts',
  './src/curriculum-packages/egypt-secondary1-integrated-science/ecosystem-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-1-velocity-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-2-horizontal-projectile-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-3-angled-projectile-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-4-moment-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-5-equilibrium-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-6-power-efficiency-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-7-momentum-impulse-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-8-conservation-momentum-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-9-momentum-energy-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-10-circular-motion-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-11-circular-horizontal-vertical-carousel.ts',
  './src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-12-kepler-gravitation-carousel.ts'
];

files.forEach(file => {
  console.log('\n========================================');
  console.log('FILE:', file);
  const code = fs.readFileSync(file, 'utf8');

  // Let's inspect export const and slides in this file
  // Find slide objects: id, type, questionRef, questionText, choices
  const slideRegex = /\{\s*id:\s*["']([^"']+)["'][\s\S]*?type:\s*["']([^"']+)["']([\s\S]*?)(?=\n\s*\{|\n\s*\];|\n\s*\])/g;
  let match;
  let count = 0;
  const slideIds = new Map();

  while ((match = slideRegex.exec(code)) !== null) {
    count++;
    const id = match[1];
    const type = match[2];
    const rest = match[3];
    slideIds.set(id, { type, rest });
  }

  console.log('Total slides detected:', count);
  
  for (const [id, info] of slideIds.entries()) {
    const isQ = ['question_mcq', 'question_text', 'question_numeric'].includes(info.type);
    const isEval = info.type === 'evaluation';
    const isNonQ = ['lesson_text', 'lesson_image', 'youtube', 'video', 'image', 'upload_zone'].includes(info.type);
    
    let details = '';
    if (isQ) {
      const correctMatches = (info.rest.match(/isCorrect:\s*true/g) || []).length;
      details = `[QUESTION] correctChoices=${correctMatches}`;
    } else if (isEval) {
      const qRefMatch = info.rest.match(/questionRef:\s*["']([^"']+)["']/);
      const qRef = qRefMatch ? qRefMatch[1] : 'NONE';
      const targetSlide = slideIds.get(qRef);
      const targetType = targetSlide ? targetSlide.type : 'NOT_FOUND';
      details = `[EVALUATION] -> questionRef: ${qRef} (targetType: ${targetType})`;
      if (!targetSlide || !['question_mcq', 'question_text', 'question_numeric'].includes(targetType)) {
        details += '  <--- CONFLICT / INVALID TARGET!';
      }
    } else if (isNonQ) {
      details = `[NON-QUESTION: ${info.type}]`;
    }

    console.log(`  Slide ${id} (${info.type}): ${details}`);
  }
});
