import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "3inxMqdZA73sP4c.root",
  password: "vQnXeDVuQK4nukNg",
  database: "test",
  ssl: { rejectUnauthorized: false },
};

async function getDb() {
  return await mysql.createConnection(dbConfig);
}

async function ensureTable(db: mysql.Connection) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS live_sessions (
      id VARCHAR(64) PRIMARY KEY,
      teacher_email VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      class_name VARCHAR(255) NOT NULL,
      scheduled_time DATETIME NOT NULL,
      meeting_link TEXT NOT NULL,
      status ENUM('scheduled', 'live', 'completed') DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_teacher (teacher_email)
    )
  `);
}

// GET /api/sessions?email=teacher@example.com (or no email to get all active/scheduled sessions)
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  const db = await getDb();
  try {
    await ensureTable(db);
    let rows;
    if (email) {
      [rows] = await db.execute(
        "SELECT * FROM live_sessions WHERE teacher_email = ? ORDER BY scheduled_time ASC",
        [email]
      );
    } else {
      [rows] = await db.execute(
        "SELECT * FROM live_sessions WHERE status IN ('live', 'scheduled') ORDER BY CASE WHEN status = 'live' THEN 0 ELSE 1 END, scheduled_time ASC LIMIT 20"
      );
    }
    return NextResponse.json({ sessions: rows });
  } finally {
    await db.end();
  }
}

// POST /api/sessions — create
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { teacherEmail, title, className, scheduledTime, meetingLink } = body;
  if (!teacherEmail || !title || !className || !scheduledTime || !meetingLink) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const db = await getDb();
  try {
    await ensureTable(db);
    await db.execute(
      `INSERT INTO live_sessions (id, teacher_email, title, class_name, scheduled_time, meeting_link, status) VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
      [id, teacherEmail, title, className, new Date(scheduledTime), meetingLink]
    );
    return NextResponse.json({ id, status: "scheduled" });
  } finally {
    await db.end();
  }
}

// PATCH /api/sessions — update status
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

  const db = await getDb();
  try {
    await ensureTable(db);
    await db.execute("UPDATE live_sessions SET status = ? WHERE id = ?", [status, id]);
    return NextResponse.json({ success: true });
  } finally {
    await db.end();
  }
}

// DELETE /api/sessions
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = await getDb();
  try {
    await db.execute("DELETE FROM live_sessions WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } finally {
    await db.end();
  }
}
