const fs = require('fs');
const path = require('path');

const dir = 'e:/intelligent-learning-platform/src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1';
const files = fs.readdirSync(dir).filter(f => f.includes('carousel.ts') && f.startsWith('lesson-1-'));

files.forEach(file => {
  if (file === 'lesson-1-1-velocity-carousel.ts') return; // Skip lesson 1, as requested 1-2 to 1-12

  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Process steps replacement
  const processStepsRegex = /processSteps:\s*\[[\s\S]*?\],/g;
  
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const lessonTitle = titleMatch ? titleMatch[1] : 'Physics Lesson';

  const newProcessSteps = `processSteps: [
    {
      id: "step-1",
      title: "Connect",
      subtitle: "Introduction",
      mission: "Connect with " + ${JSON.stringify(lessonTitle)},
      brief: "Brief for connect step",
      studentOutcome: "Student will be introduced to the topic.",
      parentHint: "Help the student focus.",
      preparationStages: ["Review previous knowledge"],
      evaluationStages: ["Assess readiness"],
      successSignal: "Student is engaged.",
      supportDecision: "Proceed to next step."
    },
    {
      id: "step-2",
      title: "Predict Phenomenon",
      subtitle: "Prediction",
      mission: "Predict outcomes related to " + ${JSON.stringify(lessonTitle)},
      brief: "Brief for prediction",
      studentOutcome: "Student will make predictions.",
      parentHint: "Encourage guessing.",
      preparationStages: ["Present scenario"],
      evaluationStages: ["Evaluate prediction logic"],
      successSignal: "Logical prediction made.",
      supportDecision: "Proceed to concept."
    },
    {
      id: "step-3",
      title: "Concept & Derivation",
      subtitle: "Learning",
      mission: "Learn the concepts of " + ${JSON.stringify(lessonTitle)},
      brief: "Brief for concept",
      studentOutcome: "Student will understand the concept.",
      parentHint: "Provide quiet time.",
      preparationStages: ["Read material"],
      evaluationStages: ["Check understanding"],
      successSignal: "Student understands.",
      supportDecision: "Proceed to practice."
    },
    {
      id: "step-4",
      title: "Practice Problem",
      subtitle: "Practice",
      mission: "Solve problems for " + ${JSON.stringify(lessonTitle)},
      brief: "Brief for practice",
      studentOutcome: "Student will apply knowledge.",
      parentHint: "Check their work.",
      preparationStages: ["Provide problems"],
      evaluationStages: ["Grade problems"],
      successSignal: "Problems solved correctly.",
      supportDecision: "Proceed to mastery."
    },
    {
      id: "step-5",
      title: "Mastery Checklist",
      subtitle: "Review",
      mission: "Review " + ${JSON.stringify(lessonTitle)},
      brief: "Brief for mastery",
      studentOutcome: "Student masters the topic.",
      parentHint: "Celebrate success.",
      preparationStages: ["Review checklist"],
      evaluationStages: ["Final evaluation"],
      successSignal: "Checklist complete.",
      supportDecision: "Finish lesson."
    }
  ],`;

  content = content.replace(processStepsRegex, newProcessSteps);

  // 2. Fix slide properties
  content = content.replace(/\bslideId:/g, 'id:');
  content = content.replace(/\bquestion:/g, 'questionText:');
  content = content.replace(/\bmarkdownBody:/g, 'body:');
  content = content.replace(/\bcontent:/g, 'body:');

  // Remove invalid properties
  content = content.replace(/\s*objectives:\s*\[.*?\],?/g, '');
  content = content.replace(/\s*keyTerms:\s*\[.*?\],?/g, '');
  content = content.replace(/\s*image:\s*".*?",?/g, '');
  content = content.replace(/\s*slideTitle:\s*".*?",?/g, '');

  content = content.replace(/type:\s*"evaluation"/g, 'type: "lesson_text"');
  
  // Make sure final slide has type: "lesson_text"
  const slideRegex = /slides:\s*\[([\s\S]*?)\]\s*};/g;
  content = content.replace(slideRegex, (match, slidesContent) => {
    const lastTypeIndex = slidesContent.lastIndexOf('type:');
    if (lastTypeIndex !== -1) {
      const before = slidesContent.substring(0, lastTypeIndex);
      const after = slidesContent.substring(lastTypeIndex).replace(/type:\s*"[^"]+"/, 'type: "lesson_text"');
      return `slides: [${before}${after}]\n};`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', file);
});

console.log('All done!');
