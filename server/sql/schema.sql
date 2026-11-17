-- TaskFlow schema — MySQL / MariaDB (InnoDB)
-- Three tables: users, todos, user_settings.
-- Deleting a user cascades to remove its todos and settings.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    VARCHAR(500) DEFAULT NULL,
  job_title     VARCHAR(120) DEFAULT NULL,
  company       VARCHAR(120) DEFAULT NULL,
  bio           TEXT         DEFAULT NULL,
  plan          ENUM('free','pro','team') NOT NULL DEFAULT 'free',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS todos (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED NOT NULL,
  title        VARCHAR(255) NOT NULL,
  notes        TEXT         DEFAULT NULL,
  priority     ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  due_date     DATE         DEFAULT NULL,
  completed    TINYINT(1)   NOT NULL DEFAULT 0,
  completed_at TIMESTAMP    NULL DEFAULT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_todos_user (user_id),
  KEY idx_todos_user_completed (user_id, completed),
  KEY idx_todos_user_due (user_id, due_date),
  CONSTRAINT fk_todos_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_settings (
  user_id        INT UNSIGNED NOT NULL,
  theme          ENUM('light','dark','system') NOT NULL DEFAULT 'system',
  accent_color   VARCHAR(16) NOT NULL DEFAULT '#6366f1',
  daily_reminder TINYINT(1)  NOT NULL DEFAULT 1,
  reminder_time  TIME        NOT NULL DEFAULT '09:00:00',
  weekly_summary TINYINT(1)  NOT NULL DEFAULT 0,
  sound_effects  TINYINT(1)  NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_settings_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
