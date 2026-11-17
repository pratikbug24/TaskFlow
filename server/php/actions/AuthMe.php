<?php
/**
 * auth.me — return the authenticated user and their settings.
 */

declare(strict_types=1);

final class AuthMe
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $user = Database::one($pdo, 'SELECT * FROM users WHERE id = ?', [$userId]);
        if ($user === null) {
            throw new AppException('Account not found', 404);
        }

        $settings = Database::one($pdo, 'SELECT * FROM user_settings WHERE user_id = ?', [$userId]);
        if ($settings === null) {
            Database::exec($pdo, 'INSERT INTO user_settings (user_id) VALUES (?)', [$userId]);
            $settings = Database::one($pdo, 'SELECT * FROM user_settings WHERE user_id = ?', [$userId]);
        }

        return [
            'user'     => Mappers::user($user),
            'settings' => Mappers::settings($settings),
        ];
    }
}
