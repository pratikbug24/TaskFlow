<?php
/**
 * auth.login — verify credentials and return the user + settings. The gateway
 * is responsible for minting the JWT once this action confirms the password.
 */

declare(strict_types=1);

final class AuthLogin
{
    public static function handle(PDO $pdo, array $payload): array
    {
        $email    = Input::email($payload);
        $password = $payload['password'] ?? '';

        $row = Database::one($pdo, 'SELECT * FROM users WHERE email = ?', [$email]);
        if ($row === null || !is_string($password) || !password_verify($password, $row['password_hash'])) {
            throw new AppException('Incorrect email or password', 401);
        }

        $settings = Database::one($pdo, 'SELECT * FROM user_settings WHERE user_id = ?', [$row['id']]);

        return [
            'user'     => Mappers::user($row),
            'settings' => Mappers::settings($settings),
        ];
    }
}
