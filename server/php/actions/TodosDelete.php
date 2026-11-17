<?php
/**
 * todos.delete — remove a todo owned by the signed-in user.
 */

declare(strict_types=1);

final class TodosDelete
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $id = Input::int($payload, 'id');
        $affected = Database::exec(
            $pdo,
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [$id, $userId]
        );

        if ($affected === 0) {
            throw new AppException('Task not found', 404);
        }

        return ['deleted' => 1];
    }
}
