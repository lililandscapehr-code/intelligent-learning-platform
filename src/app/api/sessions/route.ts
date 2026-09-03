import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export const runtime = "nodejs";

// In-memory fallback store when database is not configured
interface LiveSessionRecord {
  id: string;
  teacher_email: string;
  title: string;
  class_name: string;
  scheduled_time: string;
  meeting_link: string;
  status: "scheduled" | "live" | "completed";
  created_at: string;
}

const memorySessions: LiveSessionRecord[] = [
  {
    id: "session_demo_1",
    teacher_email: "ahmed.physics@school.edu.eg",
    title: "Vector Resolution & Relative Velocity Workshop",
    class_name: "Grade 11 - Section A (Physics)",
    scheduled_time: new Date(Date.now() + 3600000).toISOString(),
    meeting_link: "https://meet.google.com/xyz-demo-phy",
    status: "scheduled",
    created_at: new Date().toISOString()
  }
];

function isDbConfigured(): boolean {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD);
}

async function getDb(): Promise<mysql.Connection | null> {
  if (!isDbConfigured()) return null;
  try {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "test",
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : { rejectUnauthorized: false }
    });
  } catch (err) {
    console.warn("[Sessions API] DB connection failed, falling back to in-memory store:", err);
    return null;
  }
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

// GET /api/sessions?email=teacher@example.com
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const db = await getDb();

  if (db) {
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
    } catch (err: any) {
      console.warn("[Sessions API] DB query error, using memory:", err.message);
    } finally {
      await db.end();
    }
  }

  // Fallback to memory
  const filtered = email
    ? memorySessions.filter(s => s.teacher_email.toLowerCase() === email.toLowerCase())
    : memorySessions.filter(s => s.status === "live" || s.status === "scheduled");

  return NextResponse.json({ sessions: filtered });
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

  if (db) {
    try {
      await ensureTable(db);
      await db.execute(
        `INSERT INTO live_sessions (id, teacher_email, title, class_name, scheduled_time, meeting_link, status) VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
        [id, teacherEmail, title, className, new Date(scheduledTime), meetingLink]
      );
      return NextResponse.json({ id, status: "scheduled" });
    } catch (err: any) {
      console.warn("[Sessions API] DB insert error, using memory:", err.message);
    } finally {
      await db.end();
    }
  }

  // Memory fallback
  const newSession: LiveSessionRecord = {
    id,
    teacher_email: teacherEmail,
    title,
    class_name: className,
    scheduled_time: new Date(scheduledTime).toISOString(),
    meeting_link: meetingLink,
    status: "scheduled",
    created_at: new Date().toISOString()
  };
  memorySessions.unshift(newSession);

  return NextResponse.json({ id, status: "scheduled" });
}

// PATCH /api/sessions — update status
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

  const db = await getDb();
  if (db) {
    try {
      await ensureTable(db);
      await db.execute("UPDATE live_sessions SET status = ? WHERE id = ?", [status, id]);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.warn("[Sessions API] DB update error, using memory:", err.message);
    } finally {
      await db.end();
    }
  }

  // Memory fallback
  const target = memorySessions.find(s => s.id === id);
  if (target) target.status = status;

  return NextResponse.json({ success: true });
}

// DELETE /api/sessions
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = await getDb();
  if (db) {
    try {
      await ensureTable(db);
      await db.execute("DELETE FROM live_sessions WHERE id = ?", [id]);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.warn("[Sessions API] DB delete error, using memory:", err.message);
    } finally {
      await db.end();
    }
  }

  // Memory fallback
  const idx = memorySessions.findIndex(s => s.id === id);
  if (idx !== -1) memorySessions.splice(idx, 1);

  return NextResponse.json({ success: true });
}
