/**
 * fix-carousels.mjs
 * Fixes TypeScript schema errors in the 11 auto-generated physics carousel files.
 *
 * Errors being fixed:
 *   1. processSteps with only { id, label } or { id, title } — need all 11 fields
 *   2. LessonTextSlide with `objectives:` — not in schema, remove it
 *   3. QuestionMCQSlide with `question:` or `text:` — rename to `questionText:`
 *   4. LessonTextSlide with `content:` — rename to `body:`
 *   5. Evaluation slide with type `"evaluation"` at the end — keep as-is (it IS valid)
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PART1 = join(__dirname, "src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1");

const files = [
  "lesson-1-2-horizontal-projectile-carousel.ts",
  "lesson-1-3-angled-projectile-carousel.ts",
  "lesson-1-4-moment-carousel.ts",
  "lesson-1-5-equilibrium-carousel.ts",
  "lesson-1-6-power-efficiency-carousel.ts",
  "lesson-1-7-momentum-impulse-carousel.ts",
  "lesson-1-8-conservation-momentum-carousel.ts",
  "lesson-1-9-momentum-energy-carousel.ts",
  "lesson-1-10-circular-motion-carousel.ts",
  "lesson-1-11-circular-horizontal-vertical-carousel.ts",
  "lesson-1-12-kepler-gravitation-carousel.ts",
];

/**
 * Returns true if the line looks like a processSteps item that's missing required fields.
 * Detects: { id: "...", label: "..." } or { id: "...", title: "..." }
 */
function isMinimalProcessStep(line) {
  return line.match(/\{\s*id:\s*["'][^"']+["'],\s*(label|title):\s*["'][^"']+["']\s*\}/);
}

/**
 * Expands a minimal processStep object into a fully-typed one.
 * Input: { id: "step-1", label: "Connect" }
 * Output: a full CarouselProcessStep
 */
function expandProcessStep(line) {
  const idMatch = line.match(/id:\s*["']([^"']+)["']/);
  const labelMatch = line.match(/(?:label|title):\s*["']([^"']+)["']/);
  const id = idMatch ? idMatch[1] : "step-unknown";
  const label = labelMatch ? labelMatch[1] : "Learning Step";
  
  // Preserve leading whitespace
  const indent = line.match(/^(\s*)/)[1];
  // Keep trailing comma if the original had one
  const hasTrailingComma = line.trimEnd().endsWith(",");
  const closing = hasTrailingComma ? `${indent}},` : `${indent}},`;

  return `${indent}{\n` +
    `${indent}  id: "${id}",\n` +
    `${indent}  title: "${label}",\n` +
    `${indent}  subtitle: "Complete this step to advance.",\n` +
    `${indent}  mission: "Engage with the material and demonstrate understanding.",\n` +
    `${indent}  brief: "Work through the slide carefully before moving on.",\n` +
    `${indent}  studentOutcome: "You will be able to answer questions about this concept.",\n` +
    `${indent}  parentHint: "Ask your child to explain the key idea from this step in their own words.",\n` +
    `${indent}  preparationStages: ["Read the explanation", "Note key terms"],\n` +
    `${indent}  evaluationStages: ["Answer the practice question", "Check the evaluation slide"],\n` +
    `${indent}  successSignal: "Student answers correctly on the first attempt.",\n` +
    `${indent}  supportDecision: "If incorrect, review the explanation slide and retry."\n` +
    `${closing}`;
}

let totalFixed = 0;

for (const filename of files) {
  const filepath = join(PART1, filename);
  let src;
  try {
    src = readFileSync(filepath, "utf-8");
  } catch (e) {
    console.log(`  SKIP (not found): ${filename}`);
    continue;
  }

  const originalSrc = src;

  // ── Fix 1: Remove `objectives:` lines (not in LessonTextSlide schema) ──
  src = src.replace(/^\s*objectives:\s*\[[\s\S]*?\],?\n/gm, "");

  // ── Fix 2: Rename `question:` to `questionText:` in MCQ slides ──
  // Match lines that look like:   question: "...",
  src = src.replace(/^(\s*)question:\s*(?=["'`])/gm, "$1questionText: ");

  // ── Fix 3: Rename `text:` to `questionText:` when it's the MCQ question body ──
  // Only when it appears at the slide level (indented 6 spaces) as a question text field
  // We need to be careful not to rename `text:` inside choices arrays
  // Strategy: only rename if the line contains a long string (>30 chars) — choices have short text
  // Actually, safer: rename `text:` → `questionText:` only when it's NOT inside a choices array
  // Since JS regex can't easily handle nesting, we do a smarter check:
  // The field `text:` on a QuestionMCQSlide at slide level always has a unique indentation vs choice text
  // In the files, slide-level fields are at 6 spaces, choice-level at 10 spaces.
  // But we can't rely on that. Instead, rename only lines that match:  ^      text: " (6 spaces)
  // Actually the pattern in the broken files is `content:` for lesson_text and `text:` for question body
  src = src.replace(/^(\s{6,8})text:\s*(?=["'`])/gm, (match, indent) => {
    return `${indent}questionText: `;
  });

  // ── Fix 4: Rename `content:` to `body:` in lesson_text slides ──
  src = src.replace(/^(\s*)content:\s*(?=["'`])/gm, "$1body: ");

  // ── Fix 5: Expand minimal processStep objects ──
  // Match entire lines that are minimal process step objects: { id: "x", label/title: "y" }
  const lines = src.split("\n");
  const newLines = [];
  for (const line of lines) {
    if (isMinimalProcessStep(line)) {
      newLines.push(expandProcessStep(line));
      totalFixed++;
    } else {
      newLines.push(line);
    }
  }
  src = newLines.join("\n");

  if (src !== originalSrc) {
    writeFileSync(filepath, src, "utf-8");
    console.log(`  FIXED: ${filename}`);
  } else {
    console.log(`  OK (no changes needed): ${filename}`);
  }
}

console.log(`\nDone. Expanded ${totalFixed} process step objects.`);
console.log("Now run: npx tsc --noEmit");
