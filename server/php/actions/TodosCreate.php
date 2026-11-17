<?php
/**
 * todos.create — insert a todo for the signed-in user and return it.
 */

declare(strict_types=1);

final class TodosCreate
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $title    = Input::string($payload, 'title', 255, 'Title');
        $notes    = Input::optionalString($payload, 'notes', 5000);
        $priority = Input::enum($payload, 'priority', ['low', 'medium', 'high'], 'medium');
        $dueDate  = Input::date($payload, 'dueDate');

        Database::exec(
            $pdo,
            'INSERT INTO todos (user_id, title, notes, priority, due_date) VALUES (?, ?, ?, ?, ?)',
            [$userId, $title, $notes, $priority, $dueDate]
        );

        $row = Database::one($pdo, 'SELECT * FROM todos WHERE id = ?', [$pdo->lastInsertId()]);

        return Mappers::todo($row);
    }
}
