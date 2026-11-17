<?php
/**
 * Maps database rows (snake_case) to the camelCase shapes the React client
 * expects, and back again for writes.
 */

declare(strict_types=1);

final class Mappers
{
    public static function user(array $row): array
    {
        return [
            'id'        => (int) $row['id'],
            'name'      => $row['name'],
            'email'     => $row['email'],
            'avatarUrl' => $row['avatar_url'],
            'jobTitle'  => $row['job_title'],
            'company'   => $row['company'],
            'bio'       => $row['bio'],
            'plan'      => $row['plan'],
            'createdAt' => $row['created_at'],
        ];
    }

    public static function settings(array $row): array
    {
        return [
            'theme'         => $row['theme'],
            'accentColor'   => $row['accent_color'],
            'dailyReminder' => (bool) $row['daily_reminder'],
            'reminderTime'  => substr((string) $row['reminder_time'], 0, 5),
            'weeklySummary' => (bool) $row['weekly_summary'],
            'soundEffects'  => (bool) $row['sound_effects'],
        ];
    }

    public static function todo(array $row): array
    {
        return [
            'id'          => (int) $row['id'],
            'title'       => $row['title'],
            'notes'       => $row['notes'],
            'priority'    => $row['priority'],
            'dueDate'     => $row['due_date'],
            'completed'   => (bool) $row['completed'],
            'completedAt' => $row['completed_at'],
            'createdAt'   => $row['created_at'],
        ];
    }

    /** @param array<int, array> $rows */
    public static function todos(array $rows): array
    {
        return array_map([self::class, 'todo'], $rows);
    }
}
