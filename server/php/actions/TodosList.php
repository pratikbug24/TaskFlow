<?php
/**
 * todos.list — return the signed-in user's todos.
 * Query params: filter (active|all|today|overdue), priority, search.
 */

declare(strict_types=1);

final class TodosList
{
    public static function handle(PDO $pdo, array $query, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $where  = ['user_id = :user_id'];
        $params = ['user_id' => $userId];

        $filter = $query['filter'] ?? 'active';
        switch ($filter) {
            case 'active':
                $where[] = 'completed = 0';
                break;
            case 'completed':
                $where[] = 'completed = 1';
                break;
            case 'today':
                $where[] = 'completed = 0 AND due_date = CURDATE()';
                break;
            case 'overdue':
                $where[] = 'completed = 0 AND due_date IS NOT NULL AND due_date < CURDATE()';
                break;
            case 'all':
            case '':
                break;
            default:
                throw new AppException('filter must be one of: active, all, today, overdue, completed', 422);
        }

        $priority = $query['priority'] ?? '';
        if ($priority !== '') {
            if (!in_array($priority, ['low', 'medium', 'high'], true)) {
                throw new AppException('priority must be one of: low, medium, high', 422);
            }
            $where[] = 'priority = :priority';
            $params['priority'] = $priority;
        }

        $search = trim((string) ($query['search'] ?? ''));
        if ($search !== '') {
            $where[] = '(title LIKE :search OR notes LIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        $sql = 'SELECT * FROM todos WHERE ' . implode(' AND ', $where)
             . ' ORDER BY completed ASC, due_date IS NULL, due_date ASC, created_at DESC';

        return Mappers::todos(Database::all($pdo, $sql, $params));
    }
}
