<?php
/**
 * TaskFlow PHP data layer — CLI entry point.
 *
 * The Express gateway runs this file once per request, passing a JSON document
 * on stdin:
 *
 *   { "action": "todos.list", "payload": { ... }, "userId": 3 }
 *
 * and reading a JSON document from stdout:
 *
 *   { "status": 200, "body": { "ok": true, "data": ... } }
 *
 * The data layer owns every SQL statement in the system; the gateway owns
 * authentication. This file never sees an HTTP request.
 */

declare(strict_types=1);

require __DIR__ . '/lib/AppException.php';
require __DIR__ . '/lib/Database.php';
require __DIR__ . '/lib/Input.php';
require __DIR__ . '/lib/Mappers.php';
require __DIR__ . '/lib/SchemaGuard.php';

$actions = [
    'auth.register'          => 'AuthRegister',
    'auth.login'             => 'AuthLogin',
    'auth.me'                => 'AuthMe',
    'todos.list'             => 'TodosList',
    'todos.create'           => 'TodosCreate',
    'todos.update'           => 'TodosUpdate',
    'todos.delete'           => 'TodosDelete',
    'todos.clear-completed'  => 'TodosClearCompleted',
    'profile.stats'          => 'StatsShow',
    'profile.update'         => 'ProfileUpdate',
    'settings.update'        => 'SettingsUpdate',
    'database.tables'        => 'DatabaseTables',
    'database.describe'      => 'DatabaseDescribe',
    'database.rows'          => 'DatabaseRows',
];

foreach ($actions as $class) {
    require __DIR__ . '/actions/' . $class . '.php';
}

/** Emit a result envelope and stop. */
function respond(int $status, array $body): never
{
    echo json_encode(['status' => $status, 'body' => $body], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit(0);
}

try {
    $raw = stream_get_contents(STDIN);
    $request = json_decode($raw ?: '', true);

    if (!is_array($request)) {
        respond(400, ['ok' => false, 'error' => 'Malformed request payload']);
    }

    $action = (string) ($request['action'] ?? '');
    if (!isset($actions[$action])) {
        respond(404, ['ok' => false, 'error' => "Unknown action: $action"]);
    }

    $payload = is_array($request['payload'] ?? null) ? $request['payload'] : [];
    $userId  = isset($request['userId']) ? (int) $request['userId'] : null;

    $config = require __DIR__ . '/config.php';
    $pdo    = Database::connect($config);

    $class = $actions[$action];
    $data  = $class::handle($pdo, $payload, $userId);

    respond(200, ['ok' => true, 'data' => $data]);
} catch (AppException $error) {
    respond($error->status(), ['ok' => false, 'error' => $error->getMessage()]);
} catch (PDOException $error) {
    respond(500, ['ok' => false, 'error' => 'Database error: ' . $error->getMessage()]);
} catch (Throwable $error) {
    respond(500, ['ok' => false, 'error' => 'Unexpected error: ' . $error->getMessage()]);
}
