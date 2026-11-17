<?php
/**
 * database.rows — paginated rows for one table, with the total row count.
 * Backs the Data tab of the in-app Database explorer.
 */

declare(strict_types=1);

final class DatabaseRows
{
    private const MAX_LIMIT = 100;

    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $table = SchemaGuard::table($pdo, $payload['table'] ?? '');

        $limit  = min(self::MAX_LIMIT, max(1, (int) ($payload['limit'] ?? 25)));
        $offset = max(0, (int) ($payload['offset'] ?? 0));

        $total = (int) Database::one($pdo, "SELECT COUNT(*) AS c FROM `$table`")['c'];
        $rows  = Database::all($pdo, "SELECT * FROM `$table` LIMIT $limit OFFSET $offset");

        return ['rows' => $rows, 'total' => $total, 'limit' => $limit, 'offset' => $offset];
    }
}
