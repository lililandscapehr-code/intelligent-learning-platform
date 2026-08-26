CREATE DATABASE IF NOT EXISTS educational_platform;
USE educational_platform;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'BUSINESS_OWNER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Curriculums Table
CREATE TABLE IF NOT EXISTS curriculums (
  id VARCHAR(100) PRIMARY KEY, -- e.g. cambridge-igcse-0580
  name VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Curriculum Versions Table
CREATE TABLE IF NOT EXISTS curriculum_versions (
  id VARCHAR(36) PRIMARY KEY,
  curriculum_id VARCHAR(100) NOT NULL,
  package_version VARCHAR(50) NOT NULL,
  status ENUM('DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED') NOT NULL,
  effective_date TIMESTAMP NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  raw_package JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE CASCADE,
  UNIQUE KEY unique_curr_version (curriculum_id, package_version)
);

CREATE TABLE IF NOT EXISTS content_registry_entries (
  id VARCHAR(36) PRIMARY KEY,
  curriculum_id VARCHAR(100) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  status ENUM('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  approval_state ENUM('AI_SUGGESTED', 'TEACHER_DRAFT', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'TEACHER_DRAFT',
  source_kind ENUM('MANUAL', 'IMPORT', 'AI_ASSISTED') NOT NULL DEFAULT 'MANUAL',
  source_reference VARCHAR(255),
  payload JSON NOT NULL,
  checksum CHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS content_registry_versions (
  id VARCHAR(36) PRIMARY KEY,
  content_id VARCHAR(36) NOT NULL,
  version_number INT NOT NULL,
  version_label VARCHAR(50) NOT NULL,
  checksum CHAR(64) NOT NULL,
  status ENUM('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_by VARCHAR(36) NOT NULL,
  published_by VARCHAR(36),
  published_at DATETIME(6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content_registry_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_content_version (content_id, version_number)
);

CREATE TABLE IF NOT EXISTS content_registry_approvals (
  id VARCHAR(36) PRIMARY KEY,
  content_id VARCHAR(36) NOT NULL,
  reviewer_id VARCHAR(36) NOT NULL,
  decision ENUM('APPROVE', 'REJECT', 'REQUEST_CHANGES') NOT NULL,
  decision_note VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content_registry_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Source governance records retain provenance and hashes without copying source text.
CREATE TABLE IF NOT EXISTS source_snapshots (
  id VARCHAR(36) PRIMARY KEY,
  source_type ENUM('PDF', 'DOCX', 'WEBPAGE', 'TEXT', 'IMAGE') NOT NULL,
  source_reference VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  source_version VARCHAR(100),
  captured_at DATETIME(6) NOT NULL,
  content_hash CHAR(64) NOT NULL,
  extracted_text_hash CHAR(64) NOT NULL,
  license_status ENUM('UNVERIFIED', 'REVIEW_REQUIRED', 'CLEARED') NOT NULL DEFAULT 'UNVERIFIED',
  verification_status ENUM('UNVERIFIED', 'SOURCE_MAPPED', 'VERIFIED') NOT NULL DEFAULT 'UNVERIFIED',
  captured_by VARCHAR(36) NOT NULL,
  metadata JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (captured_by) REFERENCES users(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_source_snapshot (source_type, source_reference, content_hash),
  INDEX idx_source_snapshot_reference (source_reference(255))
);

CREATE TABLE IF NOT EXISTS source_analysis_records (
  id VARCHAR(36) PRIMARY KEY,
  source_snapshot_id VARCHAR(36) NOT NULL,
  scope VARCHAR(50) NOT NULL,
  locator JSON NOT NULL,
  analysis TEXT NOT NULL,
  status ENUM('UNDER_REVIEW', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'UNDER_REVIEW',
  created_by VARCHAR(36) NOT NULL,
  created_at DATETIME(6) NOT NULL,
  reviewed_by VARCHAR(36),
  reviewed_at DATETIME(6),
  review_note VARCHAR(1000),
  FOREIGN KEY (source_snapshot_id) REFERENCES source_snapshots(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_source_analysis_snapshot (source_snapshot_id, created_at)
);

-- Governed learner foundation. Historical response and evidence rows are append-only
-- through the application boundary, completed rows are never updated or deleted.
CREATE TABLE IF NOT EXISTS assessment_revisions (
  id VARCHAR(36) PRIMARY KEY,
  assessment_id VARCHAR(100) NOT NULL,
  curriculum_version_id VARCHAR(36) NOT NULL,
  assessment_type ENUM('DIAGNOSTIC') NOT NULL,
  blueprint JSON NOT NULL,
  question_version_ids JSON NOT NULL,
  scoring_policy_version VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curriculum_version_id) REFERENCES curriculum_versions(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_assessment_revision (assessment_id, id),
  INDEX idx_assessment_revision_lookup (assessment_id, curriculum_version_id)
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  assessment_revision_id VARCHAR(36) NOT NULL,
  curriculum_id VARCHAR(100) NOT NULL,
  curriculum_version VARCHAR(50) NOT NULL,
  status ENUM('IN_PROGRESS', 'COMPLETED', 'PAUSED', 'ABANDONED') NOT NULL DEFAULT 'IN_PROGRESS',
  current_question_index INT NOT NULL DEFAULT 0,
  started_at DATETIME(6) NOT NULL,
  finished_at DATETIME(6),
  idempotency_key VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (assessment_revision_id) REFERENCES assessment_revisions(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_attempt_start (student_id, assessment_revision_id, idempotency_key),
  INDEX idx_attempt_student_status (student_id, status, started_at)
);

CREATE TABLE IF NOT EXISTS assessment_responses (
  id VARCHAR(36) PRIMARY KEY,
  attempt_id VARCHAR(36) NOT NULL,
  question_version_id VARCHAR(100) NOT NULL,
  sequence_number INT NOT NULL,
  response JSON NOT NULL,
  evaluation JSON NOT NULL,
  is_correct BOOLEAN NOT NULL,
  score_percentage DECIMAL(5, 2) NOT NULL,
  points_earned DECIMAL(10, 2) NOT NULL,
  max_points DECIMAL(10, 2) NOT NULL,
  response_time_ms INT NOT NULL,
  attempts_count INT NOT NULL DEFAULT 1,
  hints_used_count INT NOT NULL DEFAULT 0,
  submitted_at DATETIME(6) NOT NULL,
  FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_attempt_sequence (attempt_id, sequence_number),
  UNIQUE KEY unique_attempt_question (attempt_id, question_version_id)
);

CREATE TABLE IF NOT EXISTS evidence_events (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  attempt_id VARCHAR(36) NOT NULL,
  response_id VARCHAR(36) NOT NULL,
  curriculum_id VARCHAR(100) NOT NULL,
  curriculum_version VARCHAR(50) NOT NULL,
  assessment_revision_id VARCHAR(36) NOT NULL,
  question_version_id VARCHAR(100) NOT NULL,
  skill_id VARCHAR(100) NOT NULL,
  response JSON NOT NULL,
  evaluation JSON NOT NULL,
  is_correct BOOLEAN NOT NULL,
  score_percentage DECIMAL(5, 2) NOT NULL,
  points_earned DECIMAL(10, 2) NOT NULL,
  response_time_ms INT NOT NULL,
  attempts_count INT NOT NULL,
  hints_used_count INT NOT NULL,
  misconception_ids JSON NOT NULL,
  confidence ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
  scoring_policy_version VARCHAR(100) NOT NULL,
  occurred_at DATETIME(6) NOT NULL,
  correlation_id VARCHAR(36) NOT NULL,
  idempotency_key VARCHAR(255) NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE RESTRICT,
  FOREIGN KEY (response_id) REFERENCES assessment_responses(id) ON DELETE RESTRICT,
  FOREIGN KEY (assessment_revision_id) REFERENCES assessment_revisions(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_evidence_response (response_id),
  UNIQUE KEY unique_evidence_idempotency (student_id, attempt_id, idempotency_key),
  INDEX idx_evidence_student_time (student_id, occurred_at, id),
  INDEX idx_evidence_skill_time (student_id, skill_id, occurred_at)
);

CREATE TABLE IF NOT EXISTS idempotency_receipts (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  operation VARCHAR(100) NOT NULL,
  attempt_id VARCHAR(36),
  idempotency_key VARCHAR(255) NOT NULL,
  request_hash CHAR(64) NOT NULL,
  result_type VARCHAR(100) NOT NULL,
  result_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_idempotency_scope (student_id, operation, idempotency_key)
);

-- Educational Services Table
CREATE TABLE IF NOT EXISTS educational_services (
  id VARCHAR(36) PRIMARY KEY,
  curriculum_version_id VARCHAR(36) NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curriculum_version_id) REFERENCES curriculum_versions(id) ON DELETE CASCADE
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36), -- Nullable for system actions or unauthenticated actions (e.g. registration failure)
  action VARCHAR(100) NOT NULL,
  target_entity VARCHAR(100) NOT NULL,
  target_id VARCHAR(100),
  details JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Teacher, class, student, parent, and assignment relationships
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  curriculum_id VARCHAR(100),
  teacher_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS class_enrollments (
  class_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (class_id, student_id),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parent_student_links (
  parent_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  relationship VARCHAR(50) NOT NULL DEFAULT 'GUARDIAN',
  PRIMARY KEY (parent_id, student_id),
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(36) PRIMARY KEY,
  class_id VARCHAR(36) NOT NULL,
  lesson_id VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  due_at DATETIME,
  status ENUM('DRAFT', 'ACTIVE', 'CLOSED') NOT NULL DEFAULT 'DRAFT',
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Commercial service catalog and student enrollment
CREATE TABLE IF NOT EXISTS service_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36) NOT NULL,
  curriculum_id VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS service_offers (
  id VARCHAR(36) PRIMARY KEY,
  service_id VARCHAR(36) NOT NULL,
  offer_type ENUM('FREE', 'ONE_TIME', 'PACKAGE', 'SUBSCRIPTION', 'PROGRAM') NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  sessions_included INT,
  access_days INT,
  status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_enrollments (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  service_id VARCHAR(36) NOT NULL,
  offer_id VARCHAR(36) NOT NULL,
  teacher_id VARCHAR(36),
  class_id VARCHAR(36),
  status ENUM('PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  started_at DATETIME,
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
  FOREIGN KEY (offer_id) REFERENCES service_offers(id) ON DELETE RESTRICT,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS learning_sessions (
  id VARCHAR(36) PRIMARY KEY,
  enrollment_id VARCHAR(36) NOT NULL,
  type ENUM('DIAGNOSTIC', 'LESSON', 'PRACTICE', 'REMEDIATION', 'PROGRESS_REVIEW', 'MOCK_EXAM', 'FINAL_EXAM', 'PARENT_MEETING', 'TEACHER_CONSULTATION') NOT NULL,
  scheduled_at DATETIME,
  duration_minutes INT NOT NULL DEFAULT 60,
  status ENUM('DRAFT', 'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'MISSED', 'CANCELLED', 'RESCHEDULED') NOT NULL DEFAULT 'DRAFT',
  lesson_id VARCHAR(100),
  assessment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES student_enrollments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_attempt_logs (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  class_id VARCHAR(36),
  carousel_id VARCHAR(100) NOT NULL,
  slide_id VARCHAR(100) NOT NULL,
  alternative_group ENUM('MAIN', 'A', 'B') NOT NULL DEFAULT 'MAIN',
  alternative_level INT NOT NULL DEFAULT 1,
  language_used VARCHAR(10) NOT NULL DEFAULT 'en',
  answer_text TEXT,
  is_correct BOOLEAN NOT NULL,
  diagnostic_target VARCHAR(100),
  time_spent_seconds INT DEFAULT 0,
  attempt_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_attempt_student (student_id),
  INDEX idx_attempt_carousel (carousel_id, slide_id),
  INDEX idx_attempt_created (created_at)
);

