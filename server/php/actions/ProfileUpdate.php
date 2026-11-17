<?php
/**
 * profile.update — patch the signed-in user's profile fields and return the
 * refreshed user.
 */

declare(strict_types=1);

final class ProfileUpdate
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $sets   = [];
        $params = [];

        if (array_key_exists('name', $payload)) {
            $sets[] = 'name = ?';
            $params[] = Input::string($payload, 'name', 120, 'Name');
        }
        foreach (['jobTitle' => 'job_title', 'company' => 'company', 'avatarUrl' => 'avatar_url'] as $key => $column) {
            if (array_key_exists($key, $payload)) {
                $sets[] = "$column = ?";
                $params[] = Input::optionalString($payload, $key, 500);
            }
        }
        if (array_key_exists('bio', $payload)) {
            $sets[] = 'bio = ?';
            $params[] = Input::optionalString($payload, 'bio', 5000);
        }

        if ($sets === []) {
            throw new AppException('Nothing to update', 422);
        }

        $params[] = $userId;
        Database::exec($pdo, 'UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?', $params);

        $user = Database::one($pdo, 'SELECT * FROM users WHERE id = ?', [$userId]);

        return Mappers::user($user);
    }
}
