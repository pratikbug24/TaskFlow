<?php
/**
 * profile.stats — aggregate counts for the signed-in user's dashboard tiles.
 */

declare(strict_types=1);

final class StatsShow
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $row = Database::one(
            $pdo,
            'SELECT
                COUNT(*)                                                        AS total,
                SUM(completed = 0)                                              AS active,
                SUM(completed = 1)                                              AS completed,
                SUM(completed = 0 AND due_date = CURDATE())                     AS dueToday,
                SUM(completed = 0 AND due_date IS NOT NULL AND due_date < CURDATE()) AS overdue
             FROM todos WHERE user_id = ?',
            [$userId]
        );

        $total     = (int) $row['total'];
        $completed = (int) $row['completed'];

        return [
            'total'          => $total,
            'active'         => (int) $row['active'],
            'completed'      => $completed,
            'dueToday'       => (int) $row['dueToday'],
            'overdue'        => (int) $row['overdue'],
            'completionRate' => $total > 0 ? (int) round($completed / $total * 100) : 0,
        ];
    }
}
