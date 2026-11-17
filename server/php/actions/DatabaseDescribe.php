<?php
/**
 * database.describe — columns and indexes for one table.
 * The table name cannot be bound as a parameter, so it is validated against
 * the live schema before being interpolated.
 */

declare(strict_types=1);

final class DatabaseDescribe
{
    public static function handle(PDO $pdo, array $payload, ?int $userId): array
    {
        if ($userId === null) {
            throw new AppException('Not authenticated', 401);
        }

        $table = SchemaGuard::table($pdo, $payload['table'] ?? '');

        $columns = [];
        foreach (Database::all($pdo, "SHOW FULL COLUMNS FROM `$table`") as $column) {
            $columns[] = [
                'name'     => $column['Field'],
                'type'     => $column['Type'],
                'nullable' => $column['Null'] === 'YES',
                'key'      => $column['Key'],
                'default'  => $column['Default'],
                'extra'    => $column['Extra'],
            ];
        }

        $indexes = [];
        foreach (Database::all($pdo, "SHOW INDEX FROM `$table`") as $index) {
            $indexes[] = [
                'name'    => $index['Key_name'],
                'column'  => $index['Column_name'],
                'unique'  => ((int) $index['Non_unique']) === 0,
                'primary' => $index['Key_name'] === 'PRIMARY',
            ];
        }

        return ['table' => $table, 'columns' => $columns, 'indexes' => $indexes];
    }
}
