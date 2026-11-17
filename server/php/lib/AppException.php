<?php
/**
 * Application-level error carrying an HTTP status. The router turns these into
 * { ok: false, error } responses; the gateway forwards the status to the client.
 */

declare(strict_types=1);

final class AppException extends RuntimeException
{
    private int $status;

    public function __construct(string $message, int $status = 400)
    {
        parent::__construct($message);
        $this->status = $status;
    }

    public function status(): int
    {
        return $this->status;
    }
}
