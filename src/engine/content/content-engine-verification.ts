import { QuestionBank } from "./QuestionBank";
import { QuestionAuthoringService } from "./QuestionAuthoringService";
import { EvidenceGenerator } from "./EvidenceGenerator";
import { sample0580Questions } from "../../curriculum-packages/0580/question-bank";
import { curriculum0580 } from "../../curriculum-packages/0580";

function runContentEngineVerification() {
  console.log("=================================================");
  console.log("🧪 QUESTION & CONTENT ENGINE VERIFICATION TEST");
  console.log("=================================================\n");

  // 1. Initialize Question Bank
  console.log("▶ [1/4] Initializing Question Bank repository...");
  const bank = new QuestionBank(sample0580Questions);
  console.log(`  ✓ Initial questions indexed: ${bank.getAllQuestions().length}`);

  // 2. Querying by Blueprint and Skill
  const fracQuestions = bank.queryQuestions({ skillId: "SK-NUM-FRAC-ADD" });
  console.log(`  ✓ Queried by skill SK-NUM-FRAC-ADD: ${fracQuestions.length} approved questions found.`);
  if (fracQuestions.length === 0) throw new Error("Failed to query questions by skill");

  // 3. AI Drafting & Governance Workflow
  console.log("\n▶ [2/4] Testing AI Drafting & Educator Governance Lifecycle...");
  const authoringService = new QuestionAuthoringService(bank);

  const fracSkill = curriculum0580.skills.find(s => s.id === "SK-NUM-FRAC-ADD")!;
  const fracBlueprint = curriculum0580.assessmentBlueprints[0].questionBlueprints.find(qb => qb.skillId === "SK-NUM-FRAC-ADD")!;

  const aiDraft = authoringService.generateAIDraft(fracBlueprint, fracSkill, {
    curriculumId: "cambridge-igcse-0580",
    curriculumVersion: "2025-2027",
    promptText: "Calculate: 3/8 + 1/4",
    choices: [
      { id: "A", text: "4/12", isCorrect: false, misconceptionId: "GAP-MATH-ADD-DENOM", rationale: "Added numerators and denominators" },
      { id: "B", text: "5/8", isCorrect: true, rationale: "Correct common denominator 8 (3/8 + 2/8 = 5/8)" },
      { id: "C", text: "3/32", isCorrect: false, misconceptionId: "GAP-MATH-MULT-OP", rationale: "Multiplied" },
      { id: "D", text: "7/8", isCorrect: false, rationale: "Arithmetic calculation error" }
    ],
    explanationText: "Convert 1/4 to 2/8. Sum is 3/8 + 2/8 = 5/8."
  });

  console.log(`  ✓ AI Draft Created: ${aiDraft.id} (Status: ${aiDraft.approval.status}, Version: ${aiDraft.approval.version})`);

  // Governance check: unapproved draft MUST NOT be served to students in standard query
  const liveQuestionsBefore = bank.queryQuestions({ skillId: "SK-NUM-FRAC-ADD", status: "APPROVED" });
  const draftFoundInLive = liveQuestionsBefore.some(q => q.id === aiDraft.id);
  console.log(`  ✓ Governance Barrier Check: AI Draft in live student pool = ${draftFoundInLive} (Expected: false)`);
  if (draftFoundInLive) throw new Error("Governance Failure: Unapproved AI draft appeared in live student pool!");

  // Educator reviews and approves
  console.log("  ▶ Educator reviewing AI draft...");
  const approvedQuestion = authoringService.approveQuestion(aiDraft.id, "EDU-SENIOR-MATH", "Passed review against syllabus 1.2.");
  console.log(`  ✓ Educator Approved: ${approvedQuestion.id} (Status: ${approvedQuestion.approval.status}, ReviewedBy: ${approvedQuestion.approval.reviewedBy})`);

  // Verified it is now live
  const liveQuestionsAfter = bank.queryQuestions({ skillId: "SK-NUM-FRAC-ADD", status: "APPROVED" });
  const draftNowInLive = liveQuestionsAfter.some(q => q.id === aiDraft.id);
  console.log(`  ✓ Post-Approval Check: Question in live student pool = ${draftNowInLive} (Expected: true)`);
  if (!draftNowInLive) throw new Error("Approval Failure: Approved question not found in live pool!");


  // 4. Traceable Evidence Generation
  console.log("\n▶ [3/4] Testing Traceable Evidence Event Generation...");
  const evidenceGen = new EvidenceGenerator();
  const testQuestion = sample0580Questions[0]; // 1/4 + 1/6

  // Scenario A: Student chooses correct answer (Option B: 5/12) in 25 seconds
  console.log("  ▶ Scenario A: Student chooses Option B (Correct) in 25s...");
  const evidenceA = evidenceGen.evaluateAndEmitEvidence({
    studentId: "STU-1001",
    assessmentAttemptId: "ATT-0580-001",
    questionInstance: testQuestion,
    blueprint: fracBlueprint,
    response: { type: "CHOICE_ID", choiceId: "B" },
    responseTimeMs: 25000
  });

  console.log(`    • Evidence ID: ${evidenceA.evidenceId}`);
  console.log(`    • IsCorrect: ${evidenceA.isCorrect} (Score: ${evidenceA.scorePercentage}%, Points: ${evidenceA.pointsEarned})`);
  console.log(`    • Timing Classification: ${evidenceA.timingClassification}`);
  console.log(`    • Flagged Misconceptions: [${evidenceA.flaggedMisconceptionIds.join(", ")}]`);

  if (!evidenceA.isCorrect || evidenceA.timingClassification !== "FAST_ACCURATE") {
    throw new Error("Evidence generation failure for Scenario A");
  }

  // Scenario B: Student chooses distractor with misconception (Option A: 2/10) in 15 seconds
  console.log("\n  ▶ Scenario B: Student chooses Option A (Misconception: GAP-MATH-ADD-DENOM) in 15s...");
  const evidenceB = evidenceGen.evaluateAndEmitEvidence({
    studentId: "STU-1002",
    assessmentAttemptId: "ATT-0580-002",
    questionInstance: testQuestion,
    blueprint: fracBlueprint,
    response: { type: "CHOICE_ID", choiceId: "A" },
    responseTimeMs: 15000
  });

  console.log(`    • Evidence ID: ${evidenceB.evidenceId}`);
  console.log(`    • IsCorrect: ${evidenceB.isCorrect}`);
  console.log(`    • Flagged Misconceptions: [${evidenceB.flaggedMisconceptionIds.join(", ")}]`);
  console.log(`    • Traceability: Question ${evidenceB.sourceQuestionId} -> Skill ${evidenceB.skillId} -> Blueprint ${evidenceB.blueprintId}`);

  if (evidenceB.isCorrect || !evidenceB.flaggedMisconceptionIds.includes("GAP-MATH-ADD-DENOM")) {
    throw new Error("Evidence generation failure for Scenario B: Misconception not captured!");
  }

  // Scenario C: Student is correct but slow (110 seconds > 90s threshold)
  console.log("\n  ▶ Scenario C: Student is accurate but slow (110 seconds)...");
  const evidenceC = evidenceGen.evaluateAndEmitEvidence({
    studentId: "STU-1003",
    assessmentAttemptId: "ATT-0580-003",
    questionInstance: testQuestion,
    blueprint: fracBlueprint,
    response: { type: "CHOICE_ID", choiceId: "B" },
    responseTimeMs: 110000
  });

  console.log(`    • Timing Classification: ${evidenceC.timingClassification} (Expected: SLOW_ACCURATE)`);
  if (evidenceC.timingClassification !== "SLOW_ACCURATE") {
    throw new Error("Fluency timing classification failure for Scenario C");
  }

  console.log("\n=================================================");
  console.log("✅ QUESTION & CONTENT ENGINE VERIFIED (0 ERRORS)");
  console.log("   • Decoupled Question Bank ✓");
  console.log("   • AI Drafting & Governance Lifecycle ✓");
  console.log("   • Traceable Evidence Events with Misconceptions ✓");
  console.log("=================================================");
}

runContentEngineVerification();
