import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { createRequire } from "node:module";
import net from "node:net";
import * as cheerio from "cheerio";
import mammoth from "mammoth";
import { requireRole } from "../../../../core/services/auth";
import { generateText, generateVision } from "../../../../core/services/ai-provider";
import { recordSourceAnalysis } from "../../../../core/services/source-governance";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_ANALYSIS_CHARACTERS = 60000;
const require = createRequire(import.meta.url);
const parsePdf = require("pdf-parse/lib/pdf-parse.js");

function isPrivateAddress(address: string): boolean {
  if (net.isIPv4(address)) {
    const parts = address.split(".").map(Number);
    return parts[0] === 10 || parts[0] === 127 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || address === "0.0.0.0";
  }
  return net.isIPv6(address) && (address === "::1" || address.startsWith("fc") || address.startsWith("fd") || address.startsWith("fe80:"));
}

async function assertSafePublicUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try { url = new URL(rawUrl); } catch { throw new Error("INVALID_SOURCE_URL"); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("UNSAFE_SOURCE_URL");
  if (url.hostname === "localhost" || url.hostname.endsWith(".local") || isPrivateAddress(url.hostname)) throw new Error("UNSAFE_SOURCE_URL");
  const addresses = await lookup(url.hostname, { all: true });
  if (addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("UNSAFE_SOURCE_URL");
  return url;
}

export async function POST(request: Request) {
  try {
    const actor = await requireRole(["TEACHER", "ADMIN"]);
    const formData = await request.formData();
    const sourceType = typeof formData.get("sourceType") === "string" ? String(formData.get("sourceType")) : "PDF";
    const file = formData.get("document");
    const sourceUrl = typeof formData.get("sourceUrl") === "string" ? String(formData.get("sourceUrl")).trim() : "";
    const pastedText = typeof formData.get("pastedText") === "string" ? String(formData.get("pastedText")).trim() : "";
    const analysisScope = typeof formData.get("analysisScope") === "string" ? String(formData.get("analysisScope")) : "DOCUMENT";
    const pageStart = typeof formData.get("pageStart") === "string" ? String(formData.get("pageStart")) : "";
    const pageEnd = typeof formData.get("pageEnd") === "string" ? String(formData.get("pageEnd")) : "";
    const requestedTitle = typeof formData.get("title") === "string" ? String(formData.get("title")).trim() : "";
    const requestedSection = typeof formData.get("section") === "string" ? String(formData.get("section")).trim() : "";
    const targetKind = typeof formData.get("targetKind") === "string" ? String(formData.get("targetKind")).trim() : "DOCUMENT";
    const targetId = typeof formData.get("targetId") === "string" ? String(formData.get("targetId")).trim() : "";
    const sourceVersion = typeof formData.get("sourceVersion") === "string" ? String(formData.get("sourceVersion")).trim() : "";
    if (!["PDF", "DOCX", "WEBPAGE", "TEXT", "IMAGE"].includes(sourceType)) return NextResponse.json({ error: "Unsupported source type." }, { status: 400 });
    if (file instanceof File && sourceType === "IMAGE" && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Images must be 8 MB or smaller." }, { status: 413 });
    }
    if (file instanceof File && sourceType !== "IMAGE" && file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Documents must be 10 MB or smaller." }, { status: 413 });
    }

    let sourceText = "";
    let sourceName = file instanceof File ? file.name : sourceUrl || "Pasted source";
    let sourceBytes: Buffer | undefined;
    let pageCount: number | null = null;
    if (sourceType === "IMAGE") {
      if (!(file instanceof File) || !file.type.startsWith("image/")) return NextResponse.json({ error: "Upload an image." }, { status: 400 });
      sourceBytes = Buffer.from(await file.arrayBuffer());
      const imageDataUrl = `data:${file.type};base64,${sourceBytes.toString("base64")}`;
      const answer = await generateVision({
        instruction: `Analyze only the requested source scope (${analysisScope}). Extract visible educational content, headings, learning objectives, science domains, and source limitations. Do not invent missing content, do not create assessment questions, and mark interpretations as requiring teacher review.`,
        context: `Source file: ${sourceName}\nRequested pages: ${pageStart || "not specified"}-${pageEnd || pageStart || "not specified"}\nRequested title: ${requestedTitle || "not specified"}\nRequested section: ${requestedSection || "not specified"}`,
        imageDataUrl
      });
      const records = await recordSourceAnalysis({
        sourceType: "IMAGE",
        sourceReference: sourceName,
        title: sourceName,
        sourceBytes,
        extractedText: answer,
        scope: analysisScope,
        sourceVersion,
        locator: { targetKind, targetId, pageStart, pageEnd, title: requestedTitle, section: requestedSection },
        analysis: answer,
        capturedBy: actor.userId
      });
      return NextResponse.json({ answer, source: { sourceType, sourceName, pageCount: null, extractedCharacters: answer.length, status: "UNDER_REVIEW", snapshotId: records.snapshot.snapshotId, analysisId: records.analysis.analysisId } });
    }
    if (sourceType === "WEBPAGE") {
      const url = await assertSafePublicUrl(sourceUrl);
      const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
      if (!response.ok || response.type === "opaqueredirect" || response.status >= 300 && response.status < 400) throw new Error("SOURCE_FETCH_FAILED");
      const html = await response.text();
      const $ = cheerio.load(html);
      $("script, style, noscript, nav, footer").remove();
      sourceText = $("main, article, body").first().text().replace(/\s+/g, " ").trim();
      sourceName = $("title").first().text().trim() || url.hostname;
    } else if (sourceType === "TEXT") {
      if (file instanceof File) {
        if (!file.type.startsWith("text/") && !/\.(txt|md|csv|json)$/i.test(file.name)) return NextResponse.json({ error: "Upload a text file such as TXT, MD, CSV, or JSON." }, { status: 400 });
        sourceText = (await file.text()).trim();
        sourceName = file.name;
      } else {
        sourceText = pastedText;
        sourceName = "Pasted source text";
      }
    } else if (sourceType === "DOCX") {
      if (!(file instanceof File) || !/application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|\.docx$/i.test(`${file.type} ${file.name}`)) return NextResponse.json({ error: "Upload a DOCX document." }, { status: 400 });
      sourceBytes = Buffer.from(await file.arrayBuffer());
      const extracted = await mammoth.extractRawText({ buffer: sourceBytes });
      sourceText = extracted.value.trim();
    } else {
      if (!(file instanceof File) || file.type !== "application/pdf") return NextResponse.json({ error: "Upload a PDF document." }, { status: 400 });
      sourceBytes = Buffer.from(await file.arrayBuffer());
      const extracted = await parsePdf(sourceBytes);
      sourceText = extracted.text.trim();
      pageCount = extracted.numpages;
    }
    if (!sourceText) {
      return NextResponse.json({ error: "No readable source text was found." }, { status: 422 });
    }

    const answer = await generateText({
      instruction: `Analyze only the requested source scope (${analysisScope}${pageStart ? `, pages ${pageStart}-${pageEnd || pageStart}` : ""}${requestedTitle ? `, title: ${requestedTitle}` : ""}${requestedSection ? `, section: ${requestedSection}` : ""}) from the supplied document. Return a source-grounded summary, headings, learning objectives, science domains, and source limitations. Do not invent missing content, do not create assessment questions, and mark all interpretations as requiring teacher review.`,
      context: `Source type: ${sourceType}\nSource: ${sourceName}\nDocument page count: ${pageCount ?? "not applicable"}\nRequested scope: ${analysisScope}\nRequested pages: ${pageStart || "not specified"}-${pageEnd || pageStart || "not specified"}\nRequested title: ${requestedTitle || "not specified"}\nRequested section: ${requestedSection || "not specified"}\nSource excerpt:\n${sourceText.slice(0, MAX_ANALYSIS_CHARACTERS)}`
    });
    const records = await recordSourceAnalysis({
      sourceType: sourceType as "PDF" | "DOCX" | "WEBPAGE" | "TEXT" | "IMAGE",
      sourceReference: sourceType === "WEBPAGE" ? sourceUrl : sourceName,
      title: sourceName,
      sourceBytes,
      extractedText: sourceText,
      scope: analysisScope,
      sourceVersion,
      locator: { targetKind, targetId, pageStart, pageEnd, title: requestedTitle, section: requestedSection },
      analysis: answer,
      capturedBy: actor.userId
    });
    return NextResponse.json({
      answer,
      source: { sourceType, sourceName, pageCount, extractedCharacters: sourceText.length, status: "UNDER_REVIEW", snapshotId: records.snapshot.snapshotId, analysisId: records.analysis.analysisId }
    });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    if (error?.message === "ONLINE_AI_NOT_CONFIGURED") return NextResponse.json({ error: "Online AI is not configured. Add AI_API_KEY and AI_MODEL to the server environment." }, { status: 503 });
    if (["INVALID_SOURCE_URL", "UNSAFE_SOURCE_URL"].includes(error?.message)) return NextResponse.json({ error: "Only safe public HTTP(S) webpages can be analyzed." }, { status: 400 });
    if (error?.message === "SOURCE_FETCH_FAILED") return NextResponse.json({ error: "The public webpage could not be fetched without following a redirect." }, { status: 422 });
    return NextResponse.json({ error: "The source could not be analyzed by the configured AI provider." }, { status: 422 });
  }
}