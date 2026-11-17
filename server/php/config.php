<?php
/**
 * TaskFlow data-layer configuration.
 * Reads connection details from the environment, falling back to local defaults.
 */

declare(strict_types=1);

return [
    'host'     => getenv('DB_HOST') ?: '127.0.0.1',
    'port'     => (int) (getenv('DB_PORT') ?: 3306),
    'database' => getenv('DB_NAME') ?: 'taskflow',
    'username' => getenv('DB_USER') ?: 'taskflow',
    'password' => getenv('DB_PASSWORD') ?: 'taskflow_pass',
    'charset'  => 'utf8mb4',
];
