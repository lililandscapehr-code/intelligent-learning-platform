import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EDITORS_DIR = join(__dirname, "src/components/carousel/editor/editors");

const files = readdirSync(EDITORS_DIR);

for (const filename of files) {
  if (!filename.endsWith(".tsx")) continue;
  const filepath = join(EDITORS_DIR, filename);
  let src = readFileSync(filepath, "utf-8");
  const original = src;

  // Fix RichTextEditor path
  src = src.replace(/["']\.\.\/\.\.\/RichTextEditor["']/g, '"../RichTextEditor"');

  // Fix CarouselTypes path
  src = src.replace(/["']\.\.\/\.\.\/\.\.\/CarouselTypes["']/g, '"../../CarouselTypes"');

  if (src !== original) {
    writeFileSync(filepath, src, "utf-8");
    console.log(`Fixed imports in ${filename}`);
  }
}
