<?php
/**
 * database.tables — list the tables in the schema with row counts and sizes.
 * Backs the in-app Database explorer.
 */

declare(strict_types=1);

final class DatabaseTables
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $sql = 'SELECT TABLE_NAME AS name,
                       ENGINE AS engine,
                       TABLE_ROWS AS `rows`,
                       DATA_LENGTH AS dataLength,
                       INDEX_LENGTH AS indexLength
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                ORDER BY TABLE_NAME';

        $tables = [];
        foreach (Database::all($pdo, $sql) as $row) {
            $tables[] = [
                'name'        => $row['name'],
                'engine'      => $row['engine'] ?? 'InnoDB',
                'rows'        => (int) $row['rows'],
                'dataLength'  => (int) $row['dataLength'],
                'indexLength' => (int) $row['indexLength'],
            ];
        }

        return $tables;
    }
}
