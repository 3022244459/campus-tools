CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  identity TEXT NOT NULL CHECK (identity IN ('student', 'teacher')),
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  username TEXT NOT NULL,
  salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  campus TEXT NOT NULL,
  organization TEXT NOT NULL,
  grade_label TEXT NOT NULL,
  verified INTEGER NOT NULL CHECK (verified IN (0, 1)),
  avatar_url TEXT NOT NULL,
  stats_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_identity_username
  ON users (identity, username);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
  ON sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
  ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  audience TEXT NOT NULL CHECK (audience IN ('student', 'teacher', 'all')),
  label TEXT NOT NULL,
  message TEXT NOT NULL,
  published_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_announcements_published_at
  ON announcements (published_at DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  actor_id TEXT,
  detail TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS takeout_orders (
  id TEXT PRIMARY KEY,
  identity TEXT NOT NULL CHECK (identity IN ('student', 'teacher')),
  user_id TEXT,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  reward TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  icon TEXT NOT NULL CHECK (icon IN ('beef', 'pizza', 'utensils')),
  status TEXT NOT NULL CHECK (status IN ('open', 'claimed', 'completed')),
  time_label TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_takeout_orders_identity_created
  ON takeout_orders (identity, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_takeout_orders_user_created
  ON takeout_orders (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS repair_requests (
  id TEXT PRIMARY KEY,
  identity TEXT NOT NULL CHECK (identity IN ('student', 'teacher')),
  user_id TEXT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'scheduled', 'done')),
  time_label TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_repair_requests_identity_created
  ON repair_requests (identity, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_repair_requests_user_created
  ON repair_requests (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS lost_found_items (
  id TEXT PRIMARY KEY,
  identity TEXT NOT NULL CHECK (identity IN ('student', 'teacher')),
  user_id TEXT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  time_label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  image TEXT NOT NULL,
  description TEXT,
  featured INTEGER NOT NULL CHECK (featured IN (0, 1)),
  contact_hint TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_lost_found_items_identity_created
  ON lost_found_items (identity, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lost_found_items_user_created
  ON lost_found_items (user_id, created_at DESC);
