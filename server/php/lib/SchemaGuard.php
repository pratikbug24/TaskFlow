<?php
/**
 * Validates a table name against the live schema so it is safe to interpolate
 * into SHOW / DESCRIBE statements (identifiers cannot be bound as parameters).
 */

declare(strict_types=1);

final class SchemaGuard
{
    public static function table(PDO $pdo, mixed $name): string
    {
        if (!is_string($name) || !preg_match('/^[A-Za-z0-9_]+$/', $name)) {
            throw new AppException('Invalid table name', 422);
        }

        $exists = Database::one(
            $pdo,
            'SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
            [$name]
        );
        if ($exists === null) {
            throw new AppException("Unknown table: $name", 404);
        }

        return $name;
    }
}
