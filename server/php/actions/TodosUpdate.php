<?php
/**
 * todos.update — patch a todo owned by the signed-in user.
 * Accepts any subset of: title, notes, priority, dueDate, completed.
 */

declare(strict_types=1);

final class TodosUpdate
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $id  = Input::int($payload, 'id');
        $row = Database::one($pdo, 'SELECT * FROM todos WHERE id = ? AND user_id = ?', [$id, $userId]);
        if ($row === null) {
            throw new AppException('Task not found', 404);
        }

        $sets   = [];
        $params = [];

        if (array_key_exists('title', $payload)) {
            $sets[] = 'title = ?';
            $params[] = Input::string($payload, 'title', 255, 'Title');
        }
        if (array_key_exists('notes', $payload)) {
            $sets[] = 'notes = ?';
            $params[] = Input::optionalString($payload, 'notes', 5000);
        }
        if (array_key_exists('priority', $payload)) {
            $sets[] = 'priority = ?';
            $params[] = Input::enum($payload, 'priority', ['low', 'medium', 'high']);
        }
        if (array_key_exists('dueDate', $payload)) {
            $sets[] = 'due_date = ?';
            $params[] = Input::date($payload, 'dueDate');
        }
        if (array_key_exists('completed', $payload)) {
            $completed = (bool) $payload['completed'];
            $sets[] = 'completed = ?';
            $params[] = $completed ? 1 : 0;
            $sets[] = 'completed_at = ?';
            $params[] = $completed ? date('Y-m-d H:i:s') : null;
        }

        if ($sets === []) {
            throw new AppException('Nothing to update', 422);
        }

        $params[] = $id;
        $params[] = $userId;
        Database::exec(
            $pdo,
            'UPDATE todos SET ' . implode(', ', $sets) . ' WHERE id = ? AND user_id = ?',
            $params
        );

        $updated = Database::one($pdo, 'SELECT * FROM todos WHERE id = ?', [$id]);

        return Mappers::todo($updated);
    }
}
