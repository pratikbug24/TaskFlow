<?php
/**
 * Thin PDO wrapper. The only place in the application that opens a database
 * connection — every query in the data layer goes through it.
 */

declare(strict_types=1);

final class Database
{
    private static ?PDO $pdo = null;

    public static function connect(array $config): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $config['host'],
            $config['port'],
            $config['database'],
            $config['charset']
        );

        self::$pdo = new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_STRINGIFY_FETCHES  => false,
        ]);

        return self::$pdo;
    }

    /** Run a prepared statement and return the statement handle. */
    public static function run(PDO $pdo, string $sql, array $params = []): PDOStatement
    {
        $statement = $pdo->prepare($sql);
        $statement->execute($params);

        return $statement;
    }

    /** Fetch a single row (or null). */
    public static function one(PDO $pdo, string $sql, array $params = []): ?array
    {
        $row = self::run($pdo, $sql, $params)->fetch();

        return $row === false ? null : $row;
    }

    /** Fetch all rows. */
    public static function all(PDO $pdo, string $sql, array $params = []): array
    {
        return self::run($pdo, $sql, $params)->fetchAll();
    }

    /** Execute a write and return the number of affected rows. */
    public static function exec(PDO $pdo, string $sql, array $params = []): int
    {
        return self::run($pdo, $sql, $params)->rowCount();
    }
}
