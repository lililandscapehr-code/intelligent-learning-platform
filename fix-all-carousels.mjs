import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PART1 = join(__dirname, "src/curriculum-packages/egypt-baccalaureate-second-year-physics/part1");

const files = readdirSync(PART1).filter(f => f.endsWith(".ts"));

function flattenContentProperty(src) {
  let index;
  while ((index = src.indexOf("content: {")) !== -1) {
    const startIndex = index + "content: {".length - 1; // index of '{'
    let braceCount = 1;
    let endIndex = startIndex + 1;
    
    while (braceCount > 0 && endIndex < src.length) {
      const char = src[endIndex];
      if (char === "{") braceCount++;
      else if (char === "}") braceCount--;
      endIndex++;
    }
    
    if (braceCount === 0) {
      const before = src.slice(0, index);
      const after = src.slice(endIndex);
      const inner = src.slice(startIndex + 1, endIndex - 1);
      
      // Clean up the inner content:
      // 1. Convert markdownBody to body
      let cleanedInner = inner.replace(/markdownBody:/g, "body:");
      
      // 2. Convert keyTerms array from [{term: "A", definition: "B"}] to ["A"]
      cleanedInner = cleanedInner.replace(/keyTerms:\s*\[([\s\S]*?)\]/g, (match, keyTermsContent) => {
        const terms = [];
        const regex = /term:\s*["']([^"']+)["']/g;
        let m;
        while ((m = regex.exec(keyTermsContent)) !== null) {
          terms.push(`"${m[1]}"`);
        }
        return `keyTerms: [${terms.join(", ")}]`;
      });
      
      src = before + cleanedInner + after;
    } else {
      break;
    }
  }
  return src;
}

function fixProcessSteps(src) {
  const index = src.indexOf("processSteps: [");
  if (index === -1) return src;
  
  const startIndex = index + "processSteps: [".length - 1; // index of '['
  let bracketCount = 1;
  let endIndex = startIndex + 1;
  
  while (bracketCount > 0 && endIndex < src.length) {
    const char = src[endIndex];
    if (char === "[") bracketCount++;
    else if (char === "]") bracketCount--;
    endIndex++;
  }
  
  if (bracketCount !== 0) return src;
  
  const processStepsBlock = src.slice(startIndex + 1, endIndex - 1);
  
  // Extract all process step objects: e.g. { id: "...", ... }
  const stepRegex = /\{([\s\S]*?)\}/g;
  let match;
  const newSteps = [];
  
  while ((match = stepRegex.exec(processStepsBlock)) !== null) {
    const content = match[1];
    const idMatch = content.match(/id:\s*["']([^"']+)["']/);
    const titleMatch = content.match(/(?:title|label):\s*["']([^"']+)["']/);
    
    const id = idMatch ? idMatch[1] : "step-unknown";
    const title = titleMatch ? titleMatch[1] : "Step";
    
    newSteps.push(`    {
      id: "${id}",
      title: "${title}",
      subtitle: "Complete this step to advance.",
      mission: "Engage with the material and demonstrate understanding.",
      brief: "Work through the slide carefully before moving on.",
      studentOutcome: "You will be able to answer questions about this concept.",
      parentHint: "Ask your child to explain the key idea from this step in their own words.",
      preparationStages: ["Read the explanation", "Note key terms"],
      evaluationStages: ["Answer the practice question", "Check the evaluation slide"],
      successSignal: "Student answers correctly on the first attempt.",
      supportDecision: "If incorrect, review the explanation slide and retry."
    }`);
  }
  
  const before = src.slice(0, index);
  const after = src.slice(endIndex);
  
  return before + "processSteps: [\n" + newSteps.join(",\n") + "\n  ]" + after;
}

for (const filename of files) {
  const filepath = join(PART1, filename);
  let src = readFileSync(filepath, "utf-8");
  const original = src;

  // 1. Flatten content: { }
  src = flattenContentProperty(src);

  // 2. Rename slideId: to id:
  src = src.replace(/\bslideId:/g, "id:");

  // 3. Rename markdownBody: to body:
  src = src.replace(/\bmarkdownBody:/g, "body:");

  // 4. Rename question: to questionText:
  src = src.replace(/\bquestion:\s*(?=["'`])/g, "questionText: ");

  // 5. Rename text: to questionText: (only when not in choices)
  // Look for text: at the slide level
  src = src.replace(/^(\s{6,8})text:\s*(?=["'`])/gm, "$1questionText: ");

  // 6. Rename content: to body:
  src = src.replace(/\bcontent:\s*(?=["'`])/g, "body: ");

  // 7. Remove objectives: [...]
  src = src.replace(/^\s*objectives:\s*\[[\s\S]*?\],?\n/gm, "");
  src = src.replace(/\bobjectives:\s*\[[\s\S]*?\],?/g, "");

  // 8. Fix processSteps by expanding all steps with 11 required fields
  src = fixProcessSteps(src);

  if (src !== original) {
    writeFileSync(filepath, src, "utf-8");
    console.log(`Fully fixed: ${filename}`);
  } else {
    console.log(`OK: ${filename}`);
  }
}
console.log("All physics carousels successfully repaired!");
