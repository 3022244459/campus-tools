CREATE TABLE IF NOT EXISTS teacher_document_orders (
  order_code TEXT PRIMARY KEY,
  teacher_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  urgency TEXT NOT NULL,
  pickup_label TEXT NOT NULL,
  destination_label TEXT NOT NULL,
  progress INTEGER NOT NULL,
  eta_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (teacher_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_teacher_document_orders_teacher_created
  ON teacher_document_orders (teacher_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS teacher_leave_applications (
  id TEXT PRIMARY KEY,
  teacher_user_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  leave_type TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  reason TEXT NOT NULL,
  avatar_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (teacher_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_teacher_leave_applications_teacher_created
  ON teacher_leave_applications (teacher_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS teacher_student_affair_applications (
  id TEXT PRIMARY KEY,
  teacher_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  applicant TEXT NOT NULL,
  category TEXT NOT NULL,
  quote TEXT,
  detail TEXT,
  meta_json TEXT NOT NULL,
  icon TEXT NOT NULL CHECK (icon IN ('award', 'megaphone')),
  created_at TEXT NOT NULL,
  FOREIGN KEY (teacher_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_teacher_student_affair_applications_teacher_created
  ON teacher_student_affair_applications (teacher_user_id, created_at DESC);
