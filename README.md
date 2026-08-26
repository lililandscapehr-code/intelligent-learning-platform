# Educational Platform

Next.js educational engine with MySQL-compatible curriculum storage. It runs locally with MySQL and can be deployed to Vercel with TiDB Cloud.

## Local setup

Requirements: Node.js 20+, npm, and a local MySQL-compatible database.

```powershell
npm install
Copy-Item .env.example .env.local
```

Edit `.env.local` with local database credentials and a random `JWT_SECRET` of at least 32 characters. Then initialize the schema from a trusted terminal:

```powershell
npm run db:init
npm run dev
```

The database initializer is intentionally not exposed through the web application.

## TiDB Cloud and Vercel

Use the TiDB Cloud connection values as Vercel environment variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL=true`
- `DB_CONNECTION_LIMIT=5`
- `JWT_SECRET`

Run the schema setup once from a trusted machine or CI job with the same TiDB variables:

```powershell
npm install
npm run db:init
```

Do not commit `.env.local` or any credentials. Use separate credentials for local, Preview, and Production environments. Use a TiDB application user rather than `root`.

## Checks

```powershell
npm run check-env
npm run type-check
npm run build
npm audit
```

## Teacher authoring and AI providers

Open the `Teacher Authoring` tab to create a lesson draft without editing TypeScript. A teacher can add explanation, question, and evaluation blocks; edit multiple-choice answers; preview the draft with the same carousel used by students; and export the draft as JSON.

The AI helper is optional and never publishes, approves, scores, or automatically changes a draft. Set `AI_PROVIDER=online` with a server-side `AI_API_KEY` and `AI_MODEL` for online text and camera-image analysis. The configured `AI_BASE_URL` must expose an OpenAI-compatible `/chat/completions` endpoint.

For local text-only analysis, set `AI_PROVIDER=ollama`:

To enable the local helper:

```powershell
ollama pull qwen2.5:3b
$env:OLLAMA_MODEL = "qwen2.5:3b"
```

Start Ollama, then run the application. Ollama text models do not support camera-image analysis in this workflow. Keep AI-generated suggestions private until a teacher reviews and edits them.

## Recovery after Windows loss

The repository is designed to be recreated from GitHub. After installing Node.js LTS, Git, and VS Code or Antigravity:

```powershell
git clone https://github.com/OWNER/REPOSITORY.git E:\educational_platform
Set-Location E:\educational_platform
npm install
Copy-Item .env.example .env.local
npm run check-env
npm run type-check
npm run dev
```

Add the real TiDB and JWT values to `.env.local` before running `check-env`. Never commit `.env.local`, database exports, passwords, or API keys. Keep the TiDB credentials in Vercel Environment Variables and a password manager. Keep a separate encrypted database export on `E:` or other backup storage.

## Curriculum lesson authoring

The lesson catalog is defined in `src/curriculum-packages/0580/lessons/index.ts`. It is generated from the lesson IDs in the five curriculum stages, so every declared lesson appears in the Lesson & Quiz Studio.

Two lessons currently have playable carousel content. The remaining lessons are intentionally shown as `Content pending` until their educational content is authored. To complete a lesson, add an `EduCarouselConfig` with:

- learning objectives and explanatory slides;
- worked examples or media;
- practice questions with answer feedback;
- misconception mappings;
- an evaluation slide and mastery implication.

Register the completed carousel in `carouselByLessonId` using its stage lesson ID. The catalog will then make it available automatically.

## GitHub

Create an empty GitHub repository, then run from this directory:

```powershell
git init
git add .
git commit -m "Prepare application for Vercel and TiDB"
git branch -M main
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

Replace `OWNER/REPOSITORY` with the real repository path. Review `.env.example` before pushing and confirm that `.env.local` is ignored.
