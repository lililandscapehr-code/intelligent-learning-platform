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

for (const filename of files) {
  const filepath = join(PART1, filename);
  let src = readFileSync(filepath, "utf-8");
  const original = src;

  // 1. Flatten content: { }
  src = flattenContentProperty(src);

  // 2. Rename slideId: to id:
  src = src.replace(/slideId:/g, "id:");

  // 3. Rename markdownBody: to body:
  src = src.replace(/markdownBody:/g, "body:");

  // 4. Remove any other occurrences of objectives: [...]
  src = src.replace(/^\s*objectives:\s*\[[\s\S]*?\],?\n/gm, "");

  // 5. Fix type: "connect" (etc) inside processSteps where it shouldn't exist
  // We can look for CarouselProcessStep arrays and clean them up
  // Specifically, clean up the processSteps array in lesson-1-6, 1-7, 1-8, 1-9, etc.
  // E.g. { id: "connect", title: "Connect", type: "intro" } -> remove type
  src = src.replace(/(\{\s*id:\s*["'][^"']+["'],\s*title:\s*["'][^"']+["']),\s*type:\s*["'][^"']+["']\s*\}/g, "$1 }");

  if (src !== original) {
    writeFileSync(filepath, src, "utf-8");
    console.log(`Flattened and fixed: ${filename}`);
  }
}
