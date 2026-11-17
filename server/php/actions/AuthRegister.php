<?php
/**
 * auth.register — create an account, its default settings row, and return the
 * user. The Express gateway issues the JWT after this succeeds.
 */

declare(strict_types=1);

final class AuthRegister
{
    public static function handle(PDO $pdo, array $payload): array
    {
        $name     = Input::string($payload, 'name', 120, 'Name');
        $email    = Input::email($payload);
        $password = Input::password($payload);

        $existing = Database::one($pdo, 'SELECT id FROM users WHERE email = ?', [$email]);
        if ($existing !== null) {
            throw new AppException('An account with that email already exists', 409);
        }

        Database::exec(
            $pdo,
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [$name, $email, password_hash($password, PASSWORD_BCRYPT)]
        );
        $userId = (int) $pdo->lastInsertId();

        Database::exec($pdo, 'INSERT INTO user_settings (user_id) VALUES (?)', [$userId]);

        $user     = Database::one($pdo, 'SELECT * FROM users WHERE id = ?', [$userId]);
        $settings = Database::one($pdo, 'SELECT * FROM user_settings WHERE user_id = ?', [$userId]);

        return [
            'user'     => Mappers::user($user),
            'settings' => Mappers::settings($settings),
        ];
    }
}
