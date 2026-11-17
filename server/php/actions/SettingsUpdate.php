<?php
/**
 * settings.update — patch the signed-in user's preferences and return them.
 */

declare(strict_types=1);

final class SettingsUpdate
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $sets   = [];
        $params = [];

        if (array_key_exists('theme', $payload)) {
            $sets[] = 'theme = ?';
            $params[] = Input::enum($payload, 'theme', ['light', 'dark', 'system']);
        }
        if (array_key_exists('accentColor', $payload)) {
            $color = (string) $payload['accentColor'];
            if (!preg_match('/^#[0-9a-fA-F]{6}$/', $color)) {
                throw new AppException('accentColor must be a hex colour like #6366f1', 422);
            }
            $sets[] = 'accent_color = ?';
            $params[] = $color;
        }
        foreach (['dailyReminder', 'weeklySummary', 'soundEffects'] as $key) {
            if (array_key_exists($key, $payload)) {
                $column = strtolower(preg_replace('/([A-Z])/', '_$1', $key));
                $sets[] = "$column = ?";
                $params[] = $payload[$key] ? 1 : 0;
            }
        }
        if (array_key_exists('reminderTime', $payload)) {
            $time = (string) $payload['reminderTime'];
            if (!preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $time)) {
                throw new AppException('reminderTime must be a time like 09:00', 422);
            }
            $sets[] = 'reminder_time = ?';
            $params[] = strlen($time) === 5 ? $time . ':00' : $time;
        }

        if ($sets === []) {
            throw new AppException('Nothing to update', 422);
        }

        $params[] = $userId;
        Database::exec($pdo, 'UPDATE user_settings SET ' . implode(', ', $sets) . ' WHERE user_id = ?', $params);

        $settings = Database::one($pdo, 'SELECT * FROM user_settings WHERE user_id = ?', [$userId]);

        return Mappers::settings($settings);
    }
}
