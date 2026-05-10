CREATE TABLE IF NOT EXISTS courier_accounts (
  user_id TEXT PRIMARY KEY,
  station_name TEXT NOT NULL,
  pending_count INTEGER NOT NULL,
  history_count INTEGER NOT NULL,
  note_title TEXT NOT NULL,
  note_message TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courier_packages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  location TEXT NOT NULL,
  tag TEXT NOT NULL,
  tag_tone TEXT NOT NULL,
  icon TEXT NOT NULL,
  eta_days INTEGER NOT NULL,
  sort_order INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_courier_packages_user_sort
  ON courier_packages (user_id, sort_order ASC);

CREATE TABLE IF NOT EXISTS wallet_accounts (
  user_id TEXT PRIMARY KEY,
  total_balance REAL NOT NULL,
  daily_change REAL NOT NULL,
  wallet_balance_label TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  time_label TEXT NOT NULL,
  amount TEXT NOT NULL,
  icon_key TEXT NOT NULL CHECK (icon_key IN ('utensils', 'washing', 'plus', 'shopping')),
  tone TEXT NOT NULL CHECK (tone IN ('orange', 'sky', 'green', 'purple')),
  positive INTEGER CHECK (positive IN (0, 1)),
  sort_order INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_sort
  ON wallet_transactions (user_id, sort_order ASC);

CREATE TABLE IF NOT EXISTS compare_carriers (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  base_price REAL NOT NULL,
  price_per_kg REAL NOT NULL,
  eta_days TEXT NOT NULL,
  tag TEXT NOT NULL,
  tag_tone TEXT NOT NULL,
  logo_tone TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_compare_carriers_sort
  ON compare_carriers (sort_order ASC);
