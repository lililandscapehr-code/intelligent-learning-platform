# Stage 0 Foundation Decision

## Decision

The platform will continue as a modular monolith using Next.js, React, TypeScript, and MySQL. Stage 0 establishes the contracts and verification boundary required by durable learner evidence; it does not implement projections, AI decisions, personalization, or recovery.

## Preserved repository components

- `CurriculumPackage` and the existing curriculum validator
- `EvidenceGenerator`
- Transaction handling through `withTransaction`
- Server-side role checks through `requireRole`
- Diagnostic attempt, response, evidence, and idempotency contracts
- Existing foundation tests and the curriculum packages

## Required boundaries

1. Curriculum and assessment definitions are read by Stage 1 but are not owned by Stage 1.
2. Attempts, responses, and evidence are append-only learner facts.
3. Mastery, gaps, and recommendations are future rebuildable projections.
4. Teacher decisions are separate records and cannot be inferred as facts.
5. Carousel delivery consumes an approved decision and produces new evidence.
6. AI has no authority to publish, approve, mutate evidence, or change permissions.

## Version reference rule

Every learner response and evidence event must resolve and retain the exact curriculum version, assessment revision, question version, scoring version, correlation ID, idempotency key, payload hash, and timestamp used at interaction time.

The existing static question catalog may be used through an explicit compatibility adapter during Stage 1. It must not be treated as the long-term content registry. Stage 2 will own durable content definitions, approvals, publication, and lifecycle.

## Stage 0 verification command

Run:

```powershell
npm run verify:stage0
```

This command verifies TypeScript and the existing foundation tests. Database, browser, security, persistence, concurrency, and restart checks remain blocked until `.env.local` contains a reachable MySQL-compatible database and seeded test identities.

## Deferred by decision

- No microservices
- No event sourcing across all domains
- No mutable learner history summary as a source of truth
- No autonomous AI action
- No full adaptive carousel
- No mastery or gap projection implementation