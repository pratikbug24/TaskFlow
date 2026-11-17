-- TaskFlow seed data — demo account + a list of tasks.
-- Demo login: avery@taskflow.io / password123

SET NAMES utf8mb4;

INSERT INTO users (name, email, password_hash, job_title, company, bio, plan)
VALUES (
  'Avery Sinclair',
  'avery@taskflow.io',
  '$2y$12$tEcaGQ8N6jcOpBF113WESejaE7KYjMSc1TVSTEi/W0.iauEZ51aAq',
  'Product Designer',
  'Northwind Labs',
  'Designing calm software for busy people.',
  'pro'
)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO user_settings (user_id, theme, accent_color, daily_reminder, reminder_time, weekly_summary, sound_effects)
SELECT id, 'system', '#6366f1', 1, '09:00:00', 1, 0 FROM users WHERE email = 'avery@taskflow.io'
ON DUPLICATE KEY UPDATE theme = VALUES(theme);

INSERT INTO todos (user_id, title, notes, priority, due_date, completed, completed_at)
SELECT u.id, t.title, t.notes, t.priority, t.due_date, t.completed,
       CASE WHEN t.completed = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
FROM users u
JOIN (
  SELECT 'Finish the quarterly report' AS title, 'Pull the numbers from the dashboard and add the summary slide.' AS notes, 'high' AS priority, CURDATE() AS due_date, 0 AS completed
  UNION ALL SELECT 'Reply to Sam about the venue', 'Confirm the date and headcount.', 'medium', CURDATE(), 0
  UNION ALL SELECT 'Water the plants', NULL, 'low', CURDATE(), 1
  UNION ALL SELECT 'Book dentist appointment', 'Ask for the morning slot.', 'low', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 0
  UNION ALL SELECT 'Renew the domain name', NULL, 'medium', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 0
  UNION ALL SELECT 'Submit expense report', 'Attach the taxi receipts.', 'high', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 0
  UNION ALL SELECT 'Read the design systems article', 'Take notes for the team.', 'low', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 0
  UNION ALL SELECT 'Send the invoice to Northwind', NULL, 'high', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 0
  UNION ALL SELECT 'Refactor the settings page', 'Split the form into sections.', 'medium', DATE_ADD(CURDATE(), INTERVAL 8 DAY), 0
  UNION ALL SELECT 'Plan the sprint retro', NULL, 'low', NULL, 0
  UNION ALL SELECT 'Back up the laptop', NULL, 'medium', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1
  UNION ALL SELECT 'Cancel the unused subscription', NULL, 'low', DATE_ADD(CURDATE(), INTERVAL 12 DAY), 0
  UNION ALL SELECT 'Write the weekly summary', NULL, 'medium', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 0
) AS t
WHERE u.email = 'avery@taskflow.io'
  AND NOT EXISTS (SELECT 1 FROM todos WHERE user_id = u.id);
