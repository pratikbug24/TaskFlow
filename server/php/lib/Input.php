<?php
/**
 * Small validation helpers used by the action classes. Every helper throws an
 * AppException (HTTP 422) when the value is missing or malformed, so actions
 * can stay free of repetitive checks.
 */

declare(strict_types=1);

final class Input
{
    /** Require a non-empty trimmed string. */
    public static function string(array $payload, string $key, int $max = 255, ?string $label = null): string
    {
        $label = $label ?? $key;
        $value = $payload[$key] ?? null;
        if (!is_string($value) || trim($value) === '') {
            throw new AppException("$label is required", 422);
        }
        $value = trim($value);
        if (mb_strlen($value) > $max) {
            throw new AppException("$label must be $max characters or fewer", 422);
        }

        return $value;
    }

    /** Optional trimmed string, or null when absent/empty. */
    public static function optionalString(array $payload, string $key, int $max = 500): ?string
    {
        $value = $payload[$key] ?? null;
        if ($value === null) {
            return null;
        }
        if (!is_string($value)) {
            throw new AppException("$key must be text", 422);
        }
        $value = trim($value);
        if ($value === '') {
            return null;
        }
        if (mb_strlen($value) > $max) {
            throw new AppException("$key must be $max characters or fewer", 422);
        }

        return $value;
    }

    /** Require a valid email address. */
    public static function email(array $payload, string $key = 'email'): string
    {
        $value = self::string($payload, $key, 190, 'Email');
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new AppException('Please enter a valid email address', 422);
        }

        return strtolower($value);
    }

    /** Require a password of at least $min characters. */
    public static function password(array $payload, string $key = 'password', int $min = 6): string
    {
        $value = $payload[$key] ?? null;
        if (!is_string($value) || strlen($value) < $min) {
            throw new AppException("Password must be at least $min characters", 422);
        }

        return $value;
    }

    /** Require an integer id. */
    public static function int(array $payload, string $key): int
    {
        $value = $payload[$key] ?? null;
        if (!is_int($value) && !(is_string($value) && ctype_digit($value))) {
            throw new AppException("$key must be an integer", 422);
        }

        return (int) $value;
    }

    /** Restrict a value to a set of allowed options. */
    public static function enum(array $payload, string $key, array $allowed, ?string $default = null): ?string
    {
        $value = $payload[$key] ?? $default;
        if ($value === null) {
            return null;
        }
        if (!in_array($value, $allowed, true)) {
            throw new AppException(sprintf('%s must be one of: %s', $key, implode(', ', $allowed)), 422);
        }

        return $value;
    }

    /** Accept a YYYY-MM-DD date, or null. */
    public static function date(array $payload, string $key): ?string
    {
        $value = $payload[$key] ?? null;
        if ($value === null || $value === '') {
            return null;
        }
        if (!is_string($value) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            throw new AppException("$key must be a date (YYYY-MM-DD)", 422);
        }

        return $value;
    }
}
