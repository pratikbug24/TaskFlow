<?php
/**
 * todos.clear-completed — delete every completed todo for the signed-in user.
 */

declare(strict_types=1);

final class TodosClearCompleted
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $deleted = Database::exec(
            $pdo,
            'DELETE FROM todos WHERE user_id = ? AND completed = 1',
            [$userId]
        );

        return ['deleted' => $deleted];
    }
}
